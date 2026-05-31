export type DashboardMode = "normal" | "professional" | "gaming";

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

export function getConfig(): AppConfig {
  const mode = (getEnv(
    "NEXT_PUBLIC_DASHBOARD_MODE",
    "normal"
  ) as DashboardMode) || "normal";

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
      github: {
        visible: "always",
        showInModes: ["normal", "professional", "gaming"],
      },
      leetcode: {
        visible: "always",
        showInModes: ["normal", "professional", "gaming"],
      },
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
