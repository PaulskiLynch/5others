import Image from "next/image";
import Link from "next/link";

import { stopDeveloperSession } from "@/app/dev-sign-in/actions";
import { SignOutAction } from "@/components/auth/SignOutAction";

type CircleFooterNavProps = {
  active: "circle" | "members" | "settings";
  showDevSignOut?: boolean;
};

const tabs = [
  { id: "circle", href: "/my-circle", label: "My Circle" },
  { id: "members", href: "/settings#members", label: "Members" },
  { id: "settings", href: "/settings", label: "Settings" },
] as const;

export function CircleFooterNav({ active, showDevSignOut = false }: CircleFooterNavProps) {
  return (
    <nav className="circle-footer-nav" aria-label="Circle footer navigation">
      {tabs.map((tab) => (
        <Link
          className={`circle-footer-link ${active === tab.id ? "circle-footer-link-active" : ""}`}
          href={tab.href}
          key={tab.id}
        >
          <span className="circle-footer-iconwrap" aria-hidden="true">
            <Image
              alt=""
              className="circle-footer-icon"
              height={22}
              src="/cardiobunny-love-your-heart.png"
              width={22}
            />
          </span>
          <span>{tab.label}</span>
        </Link>
      ))}

      {showDevSignOut ? (
        <form action={stopDeveloperSession}>
          <button className="circle-footer-link button-reset" type="submit">
            <span className="circle-footer-iconwrap" aria-hidden="true">
              <Image
                alt=""
                className="circle-footer-icon"
                height={22}
                src="/cardiobunny-love-your-heart.png"
                width={22}
              />
            </span>
            <span>Log Out</span>
          </button>
        </form>
      ) : (
        <SignOutAction className="circle-footer-link" label="Log Out" />
      )}
    </nav>
  );
}
