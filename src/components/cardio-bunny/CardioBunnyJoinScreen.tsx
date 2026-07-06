import { submitPilotIntake } from "@/app/join/actions";
import { JoinHiddenFields } from "@/app/join/JoinHiddenFields";

import { CardioBunnyEntryShell } from "./CardioBunnyEntryShell";

type CardioBunnyJoinScreenProps = {
  error?: string;
};

const startingPointOptions = [
  { value: "restarting", label: "Restarting after a break" },
  { value: "building_consistency", label: "Building consistency" },
  { value: "already_active", label: "Already active, staying steady" },
] as const;

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
          <span>Your biggest goal right now</span>
          <select name="startingPoint" defaultValue="restarting" required>
            {startingPointOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
