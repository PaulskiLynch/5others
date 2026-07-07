"use client";

import { useRef } from "react";

type MentionComposerProps = {
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
  members: Array<{
    id: string;
    mentionAlias: string;
    name: string;
  }>;
  prompt: string;
};

function insertMentionValue(current: string, mention: string) {
  const trimmed = current.replace(/\s+$/, "");
  if (!trimmed) {
    return `${mention} `;
  }

  return `${trimmed} ${mention} `;
}

export function MentionComposer({ action, error, members, prompt }: MentionComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function handleMentionClick(mentionAlias: string) {
    const field = textareaRef.current;

    if (!field) {
      return;
    }

    field.value = insertMentionValue(field.value, `@${mentionAlias}`);
    field.focus();
    const end = field.value.length;
    field.setSelectionRange(end, end);
  }

  return (
    <section className="circle-composer-card circle-composer-sticky">
      {error ? <p className="error-banner">{error}</p> : null}

      <div className="circle-composer-head">
        <h2>{prompt}</h2>
      </div>

      <div className="circle-mention-strip" aria-label="Mention a circle member">
        {members.map((member) => (
          <button
            className="circle-mention-chip button-reset"
            key={member.id}
            onClick={() => handleMentionClick(member.mentionAlias)}
            type="button"
          >
            @{member.mentionAlias}
          </button>
        ))}
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
