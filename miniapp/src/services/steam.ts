import { request } from "./request";
import type { SteamData } from "../types";

export async function getSteamData() {
  return request<SteamData>("/api/steam");
}
