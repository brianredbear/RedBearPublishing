import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { nav } from "../content/site";
import { Picture } from "./Picture";

function pathKey(path: string) {
  return path.replace(/\/+$/, "") || "/";
}

export function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setSticky(window.innerWidth >= 1121 && window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    document.documentElement.classList.toggle("nav-open", open);
  }, [open]);


  return (
    <header className={`site-header${sticky ? " is-sticky" : ""}`}>
      <div className="header-row">
        <div className="header-container">
          <div className="header-left">
            <NavLink className="logo-link" to="/" aria-label="Redbear Publishing home">
              <Picture
                src="redbear.-logo-whiteloutline.png"
                alt="Redbear Publishing"
                width={374}
                height={219}
                kind="logo"
                className="logo-image"
                priority
              />
            </NavLink>
          </div>
          <div className="header-right">
            <nav className={`site-nav${open ? " is-open" : ""}`} aria-label="Primary">
              <button
                type="button"
                className="menu-toggle"
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((value) => !value)}
              >
                <span className="hamburger" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
              <ul className="nav-list">
                {nav.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={() =>
                        pathKey(location.pathname) === pathKey(item.to) ? "is-active" : undefined
                      }
                      end={item.to === "/"}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
