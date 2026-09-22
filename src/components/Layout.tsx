import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout() {
  return (
    <>
      <Helmet>
        <link rel="describedby" href="/llms.txt" type="text/markdown" />
        <link rel="ai-catalog" href="/.well-known/ai-catalog.json" type="application/json" />
        <link rel="ard" href="/.well-known/ard.json" type="application/json" />
      </Helmet>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
