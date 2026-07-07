import { submitAuthenticatedIntake } from "@/app/onboarding/actions";
import { OnboardingHiddenFields } from "@/app/onboarding/OnboardingHiddenFields";
import { ageRanges, preferredLanguages } from "@/lib/product";

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
          <p className="cb-onboarding-kicker">Private matching</p>
          <h1 className="cb-onboarding-title">We&apos;ll help you find your five others.</h1>
          <div className="cb-onboarding-copy">
            <p>
              You don&apos;t need to explain everything. Just share enough for us to place you with
              people who understand what this week feels like.
            </p>
          </div>
          <div className="cb-onboarding-bullets">
            <p>Your real name is never shown inside the circle.</p>
            <p>Your circle is private.</p>
            <p>We only use these answers to match you well.</p>
            <p>Each week is a fresh start.</p>
          </div>
          <p className="cb-onboarding-footnote">No feeds. No followers. Just a small circle where you can be heard.</p>
        </aside>

        <section className="cb-onboarding-card">
          <div className="cb-form-head cb-onboarding-card-head">
            <h2 className="cb-form-title">A few gentle questions to find your people</h2>
            <p className="cb-form-subtitle">
              We don&apos;t need much. Just enough to match you with others who get what you&apos;re
              going through right now.
            </p>
          </div>

          {error ? <p className="error-banner cb-error-banner">{error}</p> : null}

          <form action={submitAuthenticatedIntake} className="cb-entry-form cb-onboarding-form">
            <OnboardingHiddenFields />
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
              <span>Your age group</span>
              <select defaultValue="30-44" name="ageRange" required>
                {ageRanges.map((ageRange) => (
                  <option key={ageRange} value={ageRange}>
                    {ageRange}
                  </option>
                ))}
              </select>
            </label>

            <label className="cb-field">
              <span>What brings you here this week?</span>
              <select defaultValue="just_getting_started" name="startingPoint" required>
                <option value="just_getting_started">Just getting started</option>
                <option value="getting_back_on_track">Getting back on track after a break</option>
                <option value="staying_consistent">Staying consistent</option>
                <option value="pushing_next_level">Pushing to the next level</option>
                <option value="just_exploring">Not sure yet — just exploring</option>
              </select>
            </label>

            <label className="cb-field">
              <span>What would feel most helpful right now?</span>
              <select defaultValue="encouragement" name="supportStyle" required>
                <option value="encouragement">A little encouragement</option>
                <option value="gentle_accountability">Gentle accountability</option>
                <option value="starting_over">A fresh start</option>
                <option value="help_me_show_up">Motivation to keep going</option>
                <option value="not_alone">Just knowing I&apos;m not alone</option>
              </select>
            </label>

            <label className="cb-field">
              <span>Anything else you&apos;d like us to know?</span>
              <textarea
                name="goal"
                placeholder="You can share as much or as little as you like..."
                rows={4}
              />
            </label>

            <button className="cb-submit button-reset" type="submit">
              <span aria-hidden="true">[]</span>
              <span>Find my circle</span>
            </button>

            <p className="cb-form-note">
              We&apos;ll use your answers only to match you with five others on a similar path.
            </p>

            <p className="cb-form-trust">Your real name is never shown inside the circle.</p>
          </form>
        </section>
      </section>
    </main>
  );
}
