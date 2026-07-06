import Link from "next/link";

type CircleBottomNavProps = {
  active: "circle" | "week-close" | "settings";
};

const tabs = [
  { id: "circle", href: "/my-circle", label: "My Circle", icon: "OO" },
  { id: "week-close", href: "/week-close", label: "Week Close", icon: "--" },
  { id: "settings", href: "/settings", label: "Settings", icon: "[]" },
] as const;

export function CircleBottomNav({ active }: CircleBottomNavProps) {
  return (
    <nav className="circle-bottom-nav" aria-label="Circle navigation">
      {tabs.map((tab) => (
        <Link
          className={`circle-nav-link ${active === tab.id ? "circle-nav-link-active" : ""}`}
          href={tab.href}
          key={tab.id}
        >
          <span aria-hidden="true" className="circle-nav-icon">
            {tab.icon}
          </span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
