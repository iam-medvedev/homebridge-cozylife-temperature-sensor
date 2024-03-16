import type { paths } from "./schema";
import createClient from "openapi-fetch";
import {
  DeviceStateId,
  KnownDeviceIds,
  apiBaseUrl,
  apiUserAgent,
  createLoginReq,
} from "./defs";

type DeviceId = string;

export type DeviceState = {
  name: string;
  /** Temperature in ° */
  temperature: number;
  /** Humidity in % */
  humidity: number;
  /** 0-100 */
  battery: number;
  online: boolean;
};

export type DeviceStateWithId = DeviceState & { id: string };

type DevicesState = Record<DeviceId, DeviceState>;

const client = createClient<paths>({
  baseUrl: apiBaseUrl,
  headers: {
    "user-agent": apiUserAgent,
  },
});

/**
 * CozyLife App client
 *
 * Created using reverse engineering
 */
export class CozyLifeClient {
  private email: string;
  private password: string;
  private token = "";
  private devices: DevicesState = {};
  /** Timestamp for caching */
  private timestamp = 0;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  async init() {
    this.token = await this.getToken();

    await this.createDevicesList();
    await this.refreshDevicesStates(true);
  }

  /**
   * Returns token
   */
  private async getToken(): Promise<string> {
    const result = await client.POST("/app/user/login", {
      body: createLoginReq(this.email, this.password),
    });

    if (result.error || result.data.ret !== "1" || !result.data.info?.token) {
      throw new Error("Cannot get auth token");
    }

    return result.data.info.token;
  }

  /**
   * Creates devices list
   */
  private async createDevicesList() {
    const deviceList = await client.GET("/v2/app/device_with_group/list", {
      params: {
        query: {
          token: this.token,
          count: 10000,
          page: 1,
        },
      },
    });

    if (
      deviceList.error ||
      deviceList.data.ret !== "1" ||
      !deviceList.data.info?.device_bind?.list?.length
    ) {
      throw new Error("Cannot obtain devices");
    }

    for (const device of deviceList.data.info.device_bind.list) {
      if (
        device.device_id &&
        device.device_product_id === KnownDeviceIds.TemperatureSensor
      ) {
        this.devices[device.device_id] = this.devices[device.device_id] || {
          name: device.device_name || "Temperature sensor",
          temperature: 0,
          humidity: 0,
          battery: 100,
          online: Boolean(device.is_online) || false,
          timestamp: 0,
        };
      }
    }
  }

  /**
   * Returns start of the minute for caching timestamps
   */
  private getTimestamp(): number {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    return Number(now);
  }

  /**
   * Populating the device list with states
   */
  private async refreshDevicesStates(force = false) {
    // Refreshing results once per minute
    const currentTimestamp = this.getTimestamp();
    if (!force && this.timestamp === currentTimestamp) {
      return;
    }

    const states = await client.GET("/app/v2/device/states", {
      params: {
        query: {
          "device_ids[]": Object.keys(this.devices),
          token: this.token,
        },
      },
    });

    if (states.error || states.data.ret !== "1" || !states.data.info?.length) {
      throw new Error("Cannot obtain states");
    }

    for (const stateData of states.data.info) {
      if (stateData.device_id && stateData.state) {
        this.devices[stateData.device_id].humidity =
          Number(stateData.state[DeviceStateId.Humidity]) || 0;

        this.devices[stateData.device_id].temperature =
          (Number(stateData.state[DeviceStateId.Temperature]) || 0) / 10;

        this.devices[stateData.device_id].battery =
          (Number(stateData.state[DeviceStateId.Battery]) || 0) / 10;

        this.devices[stateData.device_id].online =
          stateData.state.online || false;
      }
    }

    this.timestamp = currentTimestamp;
  }

  /**
   * Returns the state of the specified device ID
   */
  public async getDeviceState(id: string): Promise<DeviceState> {
    await this.refreshDevicesStates();
    return this.devices[id];
  }

  /**
   * Returns devices list as array
   */
  public getDevicesArray(): DeviceStateWithId[] {
    return Object.entries(this.devices).map(([id, device]) => ({
      id,
      ...device,
    }));
  }
}
