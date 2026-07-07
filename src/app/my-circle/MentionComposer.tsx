"use client";

import { useRef } from "react";

type MentionComposerProps = {
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
  prompt: string;
};
export function MentionComposer({ action, error, prompt }: MentionComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <section className="circle-composer-card circle-composer-sticky">
      {error ? <p className="error-banner">{error}</p> : null}

      <div className="circle-composer-head">
        <h2>{prompt}</h2>
      </div>

      <form action={action} className="composer-form circle-composer-form circle-composer-form-inline">
        <textarea
          className="composer-textarea circle-journal-textarea"
          name="body"
          placeholder="Share something small..."
          ref={textareaRef}
          rows={1}
          required
        />
        <button
          aria-label="Send"
          className="cb-submit button-reset circle-share-button circle-share-button-inline"
          type="submit"
        >
          <span>Send</span>
        </button>
      </form>
    </section>
  );
}
