import { Navigate, useSearchParams } from "react-router-dom";
import Home from "./Home";

export function HomeOrArchiveRedirect() {
  const [params] = useSearchParams();
  if (params.get("ct_template") === "actionopolis-archives") {
    return <Navigate to="/category/actionopolis/" replace />;
  }
  return <Home />;
}
