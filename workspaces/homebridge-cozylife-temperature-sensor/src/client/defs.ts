import type { RequestBodyJSON } from "openapi-typescript-helpers";
import type { paths } from "./schema";

type LoginRequest = RequestBodyJSON<paths["/app/user/login"]["post"]>;

export const apiBaseUrl = "https://api-us.doiting.com/api";
export const apiUserAgent = "DoHomeX/1.20.4 (iPhone; iOS 17.3.1; Scale/3.00)";

export enum DeviceStateId {
  Humidity = "4",
  Temperature = "8",
  Battery = "9",
}

/**
 * Known devices list
 * @see https://api-us.doiting.com/api/device_product/model?lang=en
 */
export enum KnownDeviceIds {
  TemperatureSensor = "s1AxFq",
}

/**
 * Populates login request with fake data
 */
export function createLoginReq(mail: string, passwd: string): LoginRequest {
  return {
    mail,
    passwd,
    lang: "en",
    platform: "ios",
    imei: "354627900145865", // Random iPhone IMEI
    lat: "40.0",
    lng: "-3.0",
    country_number_code: "724",
    package_name: "am.doit.cozylife",
    user_term_version: "1.0.1",
    user_privacy_version: "1.0.0",
    package_version: "1.20.4",
  };
}
