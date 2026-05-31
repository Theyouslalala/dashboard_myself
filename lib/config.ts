import type { DashboardMode } from "./types";
export type { DashboardMode };

export interface ModuleConfig {
  visible: "always" | "hidden" | "conditional";
  showInModes: DashboardMode[];
}

export interface AppConfig {
  steam: {
    apiKey: string;
    userId: string;
  };
  github: {
    username: string;
    token?: string;
  };
  leetcode: {
    username: string;
  };
  modules: {
    github: ModuleConfig;
    leetcode: ModuleConfig;
    steam: ModuleConfig;
  };
  dashboardMode: DashboardMode;
}

function getEnv(key: string, fallback = ""): string {
  return process.env[key] || fallback;
}

const VALID_MODES: DashboardMode[] = ["normal", "professional", "gaming"];

export function getConfig(): AppConfig {
  const rawMode = getEnv("NEXT_PUBLIC_DASHBOARD_MODE", "normal");
  const mode = VALID_MODES.includes(rawMode as DashboardMode)
    ? (rawMode as DashboardMode)
    : "normal";

  return {
    steam: {
      apiKey: getEnv("STEAM_API_KEY"),
      userId: getEnv("STEAM_USER_ID"),
    },
    github: {
      username: getEnv("GITHUB_USERNAME"),
      token: getEnv("GITHUB_TOKEN") || undefined,
    },
    leetcode: {
      username: getEnv("LEETCODE_USERNAME"),
    },
    modules: {
      github: { visible: "always", showInModes: [] },
      leetcode: { visible: "always", showInModes: [] },
      steam: {
        visible: "conditional",
        showInModes: ["normal", "gaming"],
      },
    },
    dashboardMode: mode,
  };
}

export function isModuleVisible(
  config: AppConfig,
  moduleName: "github" | "leetcode" | "steam"
): boolean {
  const mod = config.modules[moduleName];
  if (mod.visible === "always") return true;
  if (mod.visible === "hidden") return false;
  return mod.showInModes.includes(config.dashboardMode);
}
