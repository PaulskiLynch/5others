import { submitPilotIntake } from "@/app/join/actions";
import { JoinHiddenFields } from "@/app/join/JoinHiddenFields";
import { ageRanges, preferredLanguages, startingPoints } from "@/lib/product";

import { CardioBunnyEntryShell } from "./CardioBunnyEntryShell";

type CardioBunnyJoinScreenProps = {
  error?: string;
};

export function CardioBunnyJoinScreen({ error }: CardioBunnyJoinScreenProps) {
  return (
    <CardioBunnyEntryShell
      cardSubtitle="It takes less than 2 minutes."
      cardTitle="Join this week&apos;s circle"
    >
      {error ? <p className="error-banner cb-error-banner">{error}</p> : null}

      <form action={submitPilotIntake} className="cb-entry-form">
        <JoinHiddenFields />

        <label className="cb-field">
          <span>Full name</span>
          <input name="displayName" placeholder="What should we call you?" type="text" />
        </label>

        <label className="cb-field">
          <span>Email address</span>
          <input name="email" placeholder="Your email" required type="email" />
        </label>

        <label className="cb-field">
          <span>Preferred language</span>
          <select defaultValue="en" name="preferredLanguage" required>
            {preferredLanguages.map((language) => (
              <option key={language} value={language}>
                {language === "en" ? "English" : "Polish"}
              </option>
            ))}
          </select>
        </label>

        <label className="cb-field">
          <span>Age group</span>
          <select defaultValue="30-44" name="ageRange" required>
            {ageRanges.map((ageRange) => (
              <option key={ageRange} value={ageRange}>
                {ageRange}
              </option>
            ))}
          </select>
        </label>

        <label className="cb-field">
          <span>Where are you starting from right now?</span>
          <select name="startingPoint" defaultValue="restarting" required>
            {startingPoints.map((startingPoint) => (
              <option key={startingPoint} value={startingPoint}>
                {startingPoint === "restarting"
                  ? "Restarting after a break"
                  : startingPoint === "building_consistency"
                    ? "Building consistency"
                    : "Already active, staying steady"}
              </option>
            ))}
          </select>
        </label>

        <label className="cb-field">
          <span>What&apos;s one thing you hope to get from this circle?</span>
          <textarea
            name="goal"
            placeholder="Your answer"
            required
            rows={5}
          />
        </label>

        <button className="cb-submit button-reset" type="submit">
          <span aria-hidden="true">[]</span>
          <span>Send me my magic link</span>
        </button>

        <p className="cb-form-note">
          We&apos;ll email you a secure link to join.
          <br />
          No password needed.
        </p>
      </form>
    </CardioBunnyEntryShell>
  );
}
