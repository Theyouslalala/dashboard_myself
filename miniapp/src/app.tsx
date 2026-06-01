import { PropsWithChildren } from "react";
import { DashboardProvider } from "./store";
import "./app.scss";

function App({ children }: PropsWithChildren) {
  return <DashboardProvider>{children}</DashboardProvider>;
}

export default App;
