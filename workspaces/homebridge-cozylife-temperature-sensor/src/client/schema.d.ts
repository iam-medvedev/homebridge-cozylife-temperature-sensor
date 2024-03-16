/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/app/user/login": {
    /** User Login */
    post: {
      requestBody: {
        content: {
          "application/json": {
            platform: string;
            package_name: string;
            user_term_version: string;
            package_version: string;
            user_privacy_version: string;
            lang: string;
            country_number_code: string;
            lat: string;
            lng: string;
            imei: string;
            passwd: string;
            mail: string;
          };
        };
      };
      responses: {
        /** @description User logged in successfully */
        200: {
          content: {
            "application/json": components["schemas"]["UserData"];
          };
        };
      };
    };
  };
  "/v2/app/device_with_group/list": {
    /** Get Device List with Group */
    get: {
      parameters: {
        query: {
          /** @description Number of devices to retrieve */
          count: number;
          /** @description Page number */
          page: number;
          /** @description User token for authentication */
          token: string;
        };
      };
      responses: {
        /** @description Device list retrieved successfully */
        200: {
          content: {
            "application/json": components["schemas"]["DeviceList"];
          };
        };
      };
    };
  };
  "/app/device/info": {
    /** Get Device Info by ID */
    get: {
      parameters: {
        query: {
          /** @description ID of the device */
          device_id: string;
          /** @description User token for authentication */
          token: string;
        };
      };
      responses: {
        /** @description Device info retrieved successfully */
        200: {
          content: {
            "application/json": components["schemas"]["DeviceInfo"];
          };
        };
      };
    };
  };
  "/app/v2/device/states": {
    /** Get States for Devices */
    get: {
      parameters: {
        query: {
          /** @description IDs of the devices */
          "device_ids[]": string[];
          /** @description User token for authentication */
          token: string;
        };
      };
      responses: {
        /** @description Device states retrieved successfully */
        200: {
          content: {
            "application/json": components["schemas"]["DeviceStatesResponse"];
          };
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    UserData: {
      ret?: string;
      desc?: string;
      info?: {
        uid?: number;
        token?: string;
        tcp_host?: string;
        tcp_port?: number;
        nickname?: string;
        avatar?: string;
        email?: string;
        is_update?: number;
        is_third_party?: number;
        third_party?: number[];
        phone?: string;
        country_number_code?: string;
      };
    };
    DeviceList: {
      ret?: string;
      desc?: string;
      info?: {
        device_bind?: {
          count?: number;
          list?: components["schemas"]["Device"][];
        };
      };
    };
    Device: {
      device_product_id?: string;
      mpaas_url?: string;
      device_model_icon?: string;
      device_name?: string;
      device_id?: string;
      room_id?: number;
      is_online?: number;
      is_online_update_time?: number;
      additional_detail?: string;
      tcp_server_id?: number;
      ip?: string;
      port?: number;
      ws_port?: number;
      room_name?: string;
      network?: string;
      firmware_chip?: string;
      device_key?: string;
      device_model_name?: string;
      mpass_url?: string;
      firmware_version?: string;
      bind_timestamp?: number;
    };
    DeviceInfo: {
      ret?: string;
      desc?: string;
      info?: {
        device_id?: string;
        device_key?: string;
        is_online?: number;
        device_name?: string;
        firmware_version?: string;
        bind_timestamp?: number;
        mpass_url?: string;
        device_product_id?: string;
        device_model_icon?: string;
        network?: string;
        dpid?: number[];
        mpass?: {
            mpass_name?: string;
            mpass_url?: string;
            icon?: string;
          }[];
        device_model_name?: string;
      };
    };
    DeviceState: {
      /** @description Humidity (%) */
      4?: string;
      /** @description Temperature (°) */
      8?: string;
      /** @description Battery */
      9?: string;
      12?: string;
      13?: string;
      /** @description Humidity alarm (min) */
      14?: string;
      /** @description Temperature upper level (°) */
      20?: string;
      /** @description Temperature lower level (°) */
      21?: string;
      /** @description Humidity upper level (%) */
      22?: string;
      /** @description Humidity lower level (%) */
      23?: string;
      /** @description Humidity sensitivity (°) */
      24?: string;
      /** @description Temperature sensitivity (°) */
      25?: string;
      /** @description Temperature scale */
      26?: components["schemas"]["TemperatureScale"];
      id?: string;
      key?: string;
      pid?: string;
      type?: string;
      hp?: string;
      d_m_id?: string;
      c?: string;
      online?: boolean;
    };
    DeviceStatesResponse: {
      ret?: string;
      desc?: string;
      info?: {
          device_id?: string;
          state?: components["schemas"]["DeviceState"];
        }[];
    };
    /**
     * Format: int32
     * @enum {integer}
     */
    TemperatureScale: 0 | 1;
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = Record<string, never>;