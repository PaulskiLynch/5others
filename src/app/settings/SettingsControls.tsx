"use client";

import { useEffect, useMemo, useState } from "react";

type SettingsControlsProps = {
  members: Array<{
    id: string;
    name: string;
    isYou: boolean;
  }>;
};

const THEME_KEY = "cb-theme";
const MUTE_KEY = "cb-muted-members";

export function SettingsControls({ members }: SettingsControlsProps) {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return window.localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  });
  const [mutedMemberIds, setMutedMemberIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const storedMuted = window.localStorage.getItem(MUTE_KEY);
    if (!storedMuted) {
      return [];
    }

    try {
      const parsed = JSON.parse(storedMuted);
      return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
    } catch {
      window.localStorage.removeItem(MUTE_KEY);
      return [];
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(MUTE_KEY, JSON.stringify(mutedMemberIds));
  }, [mutedMemberIds]);

  const memberRows = useMemo(
    () =>
      members.map((member) => ({
        ...member,
        muted: mutedMemberIds.includes(member.id),
      })),
    [members, mutedMemberIds]
  );

  function toggleMuted(memberId: string) {
    setMutedMemberIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId]
    );
  }

  return (
    <>
      <section className="settings-card">
        <p className="settings-card-label">Appearance</p>
        <div className="settings-row settings-row-stack">
          <div>
            <strong>Theme</strong>
            <span>Choose the room that feels easiest on your eyes.</span>
          </div>
          <div className="settings-toggle-row">
            <button
              className={`settings-chip button-reset ${theme === "dark" ? "settings-chip-active" : ""}`}
              onClick={() => setTheme("dark")}
              type="button"
            >
              Dark mode
            </button>
            <button
              className={`settings-chip button-reset ${theme === "light" ? "settings-chip-active" : ""}`}
              onClick={() => setTheme("light")}
              type="button"
            >
              Light mode
            </button>
          </div>
        </div>
      </section>

      <section className="settings-card" id="members">
        <p className="settings-card-label">Circle members</p>
        <div className="settings-member-list">
          {memberRows.map((member) => (
            <div className="settings-member-row" key={member.id}>
              <div>
                <strong>{member.name}</strong>
                <span>
                  {member.isYou
                    ? "This is you inside the circle."
                    : member.muted
                      ? "Muted in this browser."
                      : "Visible in your circle right now."}
                </span>
              </div>
              {member.isYou ? (
                <span className="settings-member-badge">You</span>
              ) : (
                <button
                  className={`settings-chip button-reset ${member.muted ? "settings-chip-active" : ""}`}
                  onClick={() => toggleMuted(member.id)}
                  type="button"
                >
                  {member.muted ? "Unmute" : "Mute"}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
