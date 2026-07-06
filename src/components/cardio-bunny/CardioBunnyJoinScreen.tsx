import { submitPilotIntake } from "@/app/join/actions";
import { JoinHiddenFields } from "@/app/join/JoinHiddenFields";
import { ageRanges, fitnessGoals, preferredLanguages, startingPoints } from "@/lib/product";

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
          <span>What should we call you in your circle?</span>
          <input name="displayName" placeholder="A name that feels comfortable to you" type="text" />
        </label>

        <label className="cb-field">
          <span>Email address</span>
          <input name="email" placeholder="Your email" required type="email" />
          <small className="cb-field-note">Used only for sign-in and circle access. We never sell your data.</small>
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
          <span>What is your primary fitness goal? Optional.</span>
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
          <span>What&apos;s one thing you hope to get from this circle?</span>
          <textarea
            name="goal"
            placeholder="A little encouragement, consistency, or a fresh start..."
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

        <p className="cb-form-trust">
          Your information is private and will only be used to match you with your circle.
        </p>

        <section className="cb-how-it-works" aria-labelledby="cb-how-it-works-title">
          <p className="cb-how-kicker" id="cb-how-it-works-title">
            How it works
          </p>
          <div className="cb-how-grid">
            <article className="cb-how-card">
              <div aria-hidden="true" className="cb-how-icon">
                01
              </div>
              <h3>Tell us where you are</h3>
              <p>A few details help us place you with women on a similar path and weekly rhythm.</p>
            </article>
            <article className="cb-how-card">
              <div aria-hidden="true" className="cb-how-icon">
                02
              </div>
              <h3>We match your circle</h3>
              <p>Cardio Bunny circles are grouped by language, timing, and season of support.</p>
            </article>
            <article className="cb-how-card">
              <div aria-hidden="true" className="cb-how-icon">
                03
              </div>
              <h3>Check in each week</h3>
              <p>A gentle space for encouragement, accountability, and loving your heart out loud.</p>
            </article>
          </div>
        </section>
      </form>
    </CardioBunnyEntryShell>
  );
}
