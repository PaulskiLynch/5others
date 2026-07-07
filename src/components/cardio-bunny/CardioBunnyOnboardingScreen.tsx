import Image from "next/image";

import { submitAuthenticatedIntake } from "@/app/onboarding/actions";
import { JoinHiddenFields } from "@/app/join/JoinHiddenFields";
import { ageRanges, fitnessGoals, preferredLanguages, startingPoints } from "@/lib/product";

type CardioBunnyOnboardingScreenProps = {
  error?: string;
  next: string;
};

export function CardioBunnyOnboardingScreen({
  error,
  next,
}: CardioBunnyOnboardingScreenProps) {
  return (
    <main className="cb-onboarding-page">
      <section className="cb-onboarding-shell">
        <aside className="cb-onboarding-explainer">
          <div className="cb-onboarding-lockup">
            <Image
              alt="Cardio Bunny Love Your Heart"
              className="cb-onboarding-logo"
              height={120}
              priority
              src="/cardiobunny-love-your-heart.png"
              width={360}
            />
          </div>

          <p className="cb-onboarding-kicker">How circles work</p>
          <h1 className="cb-onboarding-title">A quiet matching step before this week&apos;s circle.</h1>
          <div className="cb-onboarding-copy">
            <p>Every week, we place CardioBunnies into small circles of six.</p>
            <p>
              You answer a few quiet questions. We use them only to match you with five others on a
              similar path.
            </p>
            <p>No feeds. No public profiles. No pressure.</p>
          </div>
          <p className="cb-onboarding-footnote">
            Your real name is never shown inside the circle.
          </p>
        </aside>

        <section className="cb-onboarding-card">
          <div className="cb-form-head cb-onboarding-card-head">
            <h2 className="cb-form-title">Help us place you well</h2>
            <p className="cb-form-subtitle">
              A few quiet details help us match you with the right CardioBunny circle.
            </p>
          </div>

          {error ? <p className="error-banner cb-error-banner">{error}</p> : null}

          <form action={submitAuthenticatedIntake} className="cb-entry-form cb-onboarding-form">
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
                rows={4}
              />
            </label>

            <button className="cb-submit button-reset" type="submit">
              <span aria-hidden="true">[]</span>
              <span>Place me in this week&apos;s circle</span>
            </button>

            <p className="cb-form-note">We only ask for what helps us match you well.</p>

            <p className="cb-form-trust">
              Your information stays private and is only used to place you with five others on a
              similar path.
            </p>
          </form>
        </section>
      </section>
    </main>
  );
}
