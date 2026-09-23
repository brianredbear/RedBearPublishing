import { Link } from "react-router-dom";
import { contact, footerNav, social } from "../content/site";
import { Picture } from "./Picture";

function Icon({ name }: { name: "facebook" | "twitter" | "linkedin" }) {
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M19 6h5v-6h-5c-3.86 0-7 3.14-7 7v3h-4v6h4v16h6v-16h5l1-6h-6v-3c0-0.542 0.458-1 1-1z" />
      </svg>
    );
  }
  if (name === "twitter") {
    return (
      <svg viewBox="0 0 512 512" aria-hidden="true">
        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M12 12h5.535v2.837h0.079c0.77-1.381 2.655-2.837 5.464-2.837 5.842 0 6.922 3.637 6.922 8.367v9.633h-5.769v-8.54c0-2.037-0.042-4.657-3.001-4.657-3.005 0-3.463 2.218-3.463 4.509v8.688h-5.767v-18z" />
      <path d="M2 12h6v18h-6v-18z" />
      <path d="M8 7c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-1.657 1.343-3 3-3s3 1.343 3 3z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="footer-logo" to="/" aria-label="Redbear Publishing home">
            <Picture
              src="redbear.-logo-red-loutline.png"
              alt="Redbear Publishing"
              width={374}
              height={219}
              kind="logo"
            />
          </Link>
          <div className="footer-contact">
            <a className="footer-contact-link" href={contact.phoneHref}>
              {contact.phoneDisplay}
            </a>
            <a className="footer-contact-link" href={contact.emailHref}>
              {contact.emailDisplay}
            </a>
          </div>
          <div className="social-icons">
            {social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className={`social-icon social-${item.name}`}
              >
                <span className="visually-hidden">{item.label}</span>
                <Icon name={item.name} />
              </a>
            ))}
          </div>
        </div>
        <div className="footer-nav">
          {footerNav.map((item) =>
            item.external ? (
              <a key={item.label} className="footer-link" href={item.to}>
                {item.label}
              </a>
            ) : (
              <Link key={item.label} className="footer-link" to={item.to}>
                {item.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </footer>
  );
}
