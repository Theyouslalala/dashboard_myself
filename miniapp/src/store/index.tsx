import { createContext, useContext, useReducer, PropsWithChildren } from "react";
import type {
  DashboardMode,
  GitHubData,
  LeetCodeStats,
  SteamData,
  AsyncState,
} from "../types";
import { getGitHubData } from "../services/github";
import { getLeetCodeStats } from "../services/leetcode";
import { getSteamData } from "../services/steam";
import { clearCache } from "../services/request";

// ─── State ───

interface DashboardState {
  mode: DashboardMode;
  github: AsyncState<GitHubData>;
  leetcode: AsyncState<LeetCodeStats>;
  steam: AsyncState<SteamData>;
}

const initialState: DashboardState = {
  mode: "normal",
  github: { data: null, loading: false, error: null },
  leetcode: { data: null, loading: false, error: null },
  steam: { data: null, loading: false, error: null },
};

// ─── Actions ───

type Action =
  | { type: "SET_MODE"; payload: DashboardMode }
  | { type: "FETCH_START"; module: "github" | "leetcode" | "steam" }
  | { type: "FETCH_SUCCESS"; module: "github"; data: GitHubData }
  | { type: "FETCH_SUCCESS"; module: "leetcode"; data: LeetCodeStats }
  | { type: "FETCH_SUCCESS"; module: "steam"; data: SteamData }
  | {
      type: "FETCH_ERROR";
      module: "github" | "leetcode" | "steam";
      error: string;
    }
  | { type: "CLEAR_CACHE" };

function reducer(state: DashboardState, action: Action): DashboardState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "FETCH_START":
      return {
        ...state,
        [action.module]: { ...state[action.module], loading: true, error: null },
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        [action.module]: {
          data: action.data,
          loading: false,
          error: null,
        },
      };
    case "FETCH_ERROR":
      return {
        ...state,
        [action.module]: {
          ...state[action.module],
          loading: false,
          error: action.error,
        },
      };
    case "CLEAR_CACHE":
      clearCache();
      return state;
    default:
      return state;
  }
}

// ─── Context ───

interface DashboardContextValue {
  state: DashboardState;
  fetchGitHub: () => Promise<void>;
  fetchLeetCode: () => Promise<void>;
  fetchSteam: () => Promise<void>;
  fetchAll: () => Promise<void>;
  setMode: (mode: DashboardMode) => void;
  refresh: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchGitHub = async () => {
    dispatch({ type: "FETCH_START", module: "github" });
    const result = await getGitHubData();
    if (result.data) {
      dispatch({ type: "FETCH_SUCCESS", module: "github", data: result.data });
    } else {
      dispatch({
        type: "FETCH_ERROR",
        module: "github",
        error: result.error || "加载失败",
      });
    }
  };

  const fetchLeetCode = async () => {
    dispatch({ type: "FETCH_START", module: "leetcode" });
    const result = await getLeetCodeStats();
    if (result.data) {
      dispatch({
        type: "FETCH_SUCCESS",
        module: "leetcode",
        data: result.data,
      });
    } else {
      dispatch({
        type: "FETCH_ERROR",
        module: "leetcode",
        error: result.error || "加载失败",
      });
    }
  };

  const fetchSteam = async () => {
    dispatch({ type: "FETCH_START", module: "steam" });
    const result = await getSteamData();
    if (result.data) {
      dispatch({ type: "FETCH_SUCCESS", module: "steam", data: result.data });
    } else {
      dispatch({
        type: "FETCH_ERROR",
        module: "steam",
        error: result.error || "加载失败",
      });
    }
  };

  const fetchAll = async () => {
    await Promise.all([fetchGitHub(), fetchLeetCode(), fetchSteam()]);
  };

  const setMode = (mode: DashboardMode) => {
    dispatch({ type: "SET_MODE", payload: mode });
  };

  const refresh = () => {
    dispatch({ type: "CLEAR_CACHE" });
    fetchAll();
  };

  return (
    <DashboardContext.Provider
      value={{
        state,
        fetchGitHub,
        fetchLeetCode,
        fetchSteam,
        fetchAll,
        setMode,
        refresh,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
