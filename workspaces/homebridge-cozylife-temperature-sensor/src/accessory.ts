import {
  Service,
  CharacteristicValue,
  CharacteristicGetHandler,
} from "homebridge";
import type { CozyLifePlatform, PlatformAccessory } from "./platform";
import type { CozyLifeClient, DeviceState } from "./client";

type CreateServiceOpts = {
  service: Parameters<PlatformAccessory["getService"]>[0];
  name: string;
  valueCharacteristic: Parameters<Service["getCharacteristic"]>[0];
  onGetValue: CharacteristicGetHandler;
  onGetOnlineStatus: CharacteristicGetHandler;
  onGetBatteryStatus: CharacteristicGetHandler;
};

/**
 * Temperature sensor instance
 */
export class CozyLifeTemperatureSensor {
  constructor(
    private readonly platform: CozyLifePlatform,
    private readonly accessory: PlatformAccessory,
    private readonly client: CozyLifeClient
  ) {
    // Set accessory information
    this.accessory
      .getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, "CozyLife")
      .setCharacteristic(
        this.platform.Characteristic.Model,
        "CozyLifeTemperatureSensor"
      )
      .setCharacteristic(
        this.platform.Characteristic.SerialNumber,
        accessory.context.device.id
      );

    // Temperature sensor
    this.createService({
      service: this.platform.Service.TemperatureSensor,
      name: "Temperature",
      valueCharacteristic: this.platform.Characteristic.CurrentTemperature,
      onGetValue: this.getTemperature.bind(this),
      onGetOnlineStatus: this.getOnlineStatus.bind(this),
      onGetBatteryStatus: this.getBatteryStatus.bind(this),
    });

    // Humidity sensor
    this.createService({
      service: this.platform.Service.HumiditySensor,
      name: "Humidity",
      valueCharacteristic: this.platform.Characteristic.CurrentRelativeHumidity,
      onGetValue: this.getHumidity.bind(this),
      onGetOnlineStatus: this.getOnlineStatus.bind(this),
      onGetBatteryStatus: this.getBatteryStatus.bind(this),
    });
  }

  /**
   * Creates service
   */
  private createService({
    service,
    name,
    valueCharacteristic,
    onGetValue,
    onGetOnlineStatus,
    onGetBatteryStatus,
  }: CreateServiceOpts) {
    const newService =
      this.accessory.getService(service) ||
      this.accessory.addService(service as unknown as Service); // FIXME: remove typecasting

    newService.setCharacteristic(
      this.platform.Characteristic.Name,
      `${this.accessory.context.device.name} ${name}`
    );

    newService.getCharacteristic(valueCharacteristic)!.onGet(onGetValue);

    newService
      .getCharacteristic(this.platform.Characteristic.StatusActive)
      .onGet(onGetOnlineStatus);

    newService
      .getCharacteristic(this.platform.Characteristic.StatusLowBattery)
      .onGet(onGetBatteryStatus);
  }

  /**
   * Returns temperature value
   */
  private async getTemperature(): Promise<CharacteristicValue> {
    const result = await this.getDeviceState();

    this.platform.log.debug("Get temperature", result.temperature);

    return result.temperature;
  }

  /**
   * Returns humidity value
   */
  private async getHumidity(): Promise<CharacteristicValue> {
    const result = await this.getDeviceState();

    this.platform.log.debug("Get humidity", result.humidity);

    return result.humidity;
  }

  /**
   * Returns online status
   */
  private async getOnlineStatus(): Promise<CharacteristicValue> {
    const result = await this.getDeviceState();

    this.platform.log.debug("Get online status", result.online);

    return result.online;
  }

  /**
   * Returns battery status
   */
  private async getBatteryStatus(): Promise<CharacteristicValue> {
    const result = await this.getDeviceState();

    this.platform.log.debug("Get battery value", result.battery);

    // `StatusLowBattery` is inverted value
    return 1 - result.battery / 100;
  }

  /**
   * Returns device state
   */
  private async getDeviceState(): Promise<DeviceState> {
    const result = await this.client.getDeviceState(
      this.accessory.context.device.id
    );

    return result;
  }
}
