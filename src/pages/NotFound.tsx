import { Link, useLocation } from "react-router-dom";
import { notFoundSeo } from "../content/seo";
import { Seo } from "../components/Seo";

export default function NotFound() {
  const location = useLocation();

  return (
    <>
      <Seo {...notFoundSeo(location.pathname)} />
      <section className="page-band home-band">
        <div className="section-inner home-inner">
          <div className="home-card not-found-card">
            <h1 className="heading-three">Page not found</h1>
            <p className="home-intro">
              The page you requested could not be found. Pull up a chair, or head back home and start reading.
            </p>
            <Link className="read-more" to="/">
              HOME
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
