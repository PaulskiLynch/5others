import { submitAuthenticatedIntake } from "@/app/onboarding/actions";
import { JoinHiddenFields } from "@/app/join/JoinHiddenFields";
import { ageRanges, fitnessGoals, preferredLanguages, startingPoints } from "@/lib/product";

import { CardioBunnyEntryShell } from "./CardioBunnyEntryShell";

type CardioBunnyOnboardingScreenProps = {
  error?: string;
  next: string;
};

export function CardioBunnyOnboardingScreen({
  error,
  next,
}: CardioBunnyOnboardingScreenProps) {
  return (
    <CardioBunnyEntryShell
      cardSubtitle="A few quiet details help us match you with the right Cardio Bunny circle."
      cardTitle="Help us place you well"
    >
      {error ? <p className="error-banner cb-error-banner">{error}</p> : null}

      <form action={submitAuthenticatedIntake} className="cb-entry-form">
        <JoinHiddenFields />
        <input name="next" type="hidden" value={next} />

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
          <span>Where are you on your heart-health or fitness path right now?</span>
          <select defaultValue="restarting" name="startingPoint" required>
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
          <span>What is your main focus right now? Optional.</span>
          <select defaultValue="" name="fitnessGoal">
            <option value="">Choose one if it helps us match you</option>
            {fitnessGoals.map((fitnessGoal) => (
              <option key={fitnessGoal} value={fitnessGoal}>
                {fitnessGoal === "weight_loss"
                  ? "Weight loss"
                  : fitnessGoal === "endurance"
                    ? "Endurance"
                    : fitnessGoal === "general_health"
                      ? "General health"
                      : fitnessGoal === "heart_health"
                        ? "Heart health"
                        : "Consistency"}
              </option>
            ))}
          </select>
        </label>

        <label className="cb-field">
          <span>What would feel most helpful from this circle this week?</span>
          <textarea
            name="goal"
            placeholder="A little encouragement, gentle accountability, a reset, or simply not doing this alone..."
            required
            rows={5}
          />
        </label>

        <button className="cb-submit button-reset" type="submit">
          <span aria-hidden="true">[]</span>
          <span>Place me in my circle</span>
        </button>

        <p className="cb-form-note">
          We only ask for what helps us match you well.
          <br />
          Your real name is never shown inside the circle.
        </p>

        <p className="cb-form-trust">
          Your information stays private and is only used to place you with 5 others on a similar path.
        </p>
      </form>
    </CardioBunnyEntryShell>
  );
}
