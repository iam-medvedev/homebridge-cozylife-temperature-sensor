import type { API } from "homebridge";
import { PLATFORM_NAME } from "./settings";
import { CozyLifePlatform } from "./platform";

export default function register(api: API) {
  api.registerPlatform(PLATFORM_NAME, CozyLifePlatform);
}
