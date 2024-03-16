import type {
  API,
  DynamicPlatformPlugin,
  Logger,
  PlatformConfig,
  Service,
  Characteristic,
  PlatformAccessory as GenericPlatformAccessory,
} from "homebridge";
import { PLATFORM_NAME, PLUGIN_NAME } from "./settings";
import { CozyLifeTemperatureSensor } from "./accessory";
import { CozyLifeClient, DeviceStateWithId } from "./client";

type PlatformAccessoryContext = {
  device: DeviceStateWithId;
};
export type PlatformAccessory =
  GenericPlatformAccessory<PlatformAccessoryContext>;

export class CozyLifePlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic =
    this.api.hap.Characteristic;
  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API
  ) {
    this.log.debug("Finished initializing platform:", this.config.name);

    // Start devices discovering
    this.api.on("didFinishLaunching", () => {
      this.discoverDevices();
    });
  }

  /**
   * Restore accessories from the cache
   */
  configureAccessory(accessory: PlatformAccessory) {
    this.log.info("Loading accessory from cache:", accessory.displayName);
    this.accessories.push(accessory);
  }

  /**
   * Creates CozyLife client and devices list
   */
  async discoverDevices() {
    // Creating client
    const client = new CozyLifeClient(this.config.email, this.config.password);
    await client.init();

    // Getting devices
    const devices = client.getDevicesArray();

    // Creating accessories
    for (const device of devices) {
      const uuid = this.api.hap.uuid.generate(device.id);
      const existingAccessory = this.accessories.find(
        (accessory) => accessory.UUID === uuid
      );

      if (existingAccessory) {
        // The accessory already exists
        this.log.info(
          "Restoring existing accessory from cache:",
          existingAccessory.displayName
        );

        new CozyLifeTemperatureSensor(this, existingAccessory, client);
      } else {
        // The accessory does not yet exist, so we need to create it
        this.log.info("Adding new accessory:", device.name);

        // Attaching the device to the accessory
        const accessory =
          new this.api.platformAccessory<PlatformAccessoryContext>(
            device.name,
            uuid
          );
        accessory.context.device = device;

        new CozyLifeTemperatureSensor(this, accessory, client);

        // Linking the accessory
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [
          accessory,
        ]);
      }
    }
  }
}
