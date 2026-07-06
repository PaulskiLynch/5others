import { Resend } from "resend";

type CircleReadyEmailInput = {
  email: string;
  cohort: string;
  weekStart: string;
};

export type CircleReadyEmailResult =
  | {
      mode: "preview";
      provider: "preview";
      subject: string;
      html: string;
      to: string;
    }
  | {
      mode: "sent";
      provider: "resend";
      messageId: string | null;
    };

function formatWeekDate(date: string) {
  const parsed = new Date(`${date}T12:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

function buildCircleReadyEmail(input: CircleReadyEmailInput) {
  const openDate = formatWeekDate(input.weekStart);
  const signInUrl = "https://cardiobunny.5others.com/sign-in?next=/my-circle";
  const subject = "Your Cardio Bunny circle is ready";
  const html = `
    <div style="background:#0f0d11;padding:32px 20px;font-family:Georgia,'Times New Roman',serif;color:#f7f1ea;">
      <div style="max-width:560px;margin:0 auto;background:#1b181d;border:1px solid rgba(255,255,255,0.08);border-radius:28px;padding:36px 32px;">
        <p style="margin:0 0 14px;color:#e4b246;font-family:'Trebuchet MS',Helvetica,sans-serif;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">
          Cardio Bunny
        </p>
        <h1 style="margin:0;color:#fbf5ee;font-size:38px;line-height:1.05;">
          Your circle is ready.
        </h1>
        <p style="margin:18px 0 0;color:rgba(247,241,234,0.78);font-size:18px;line-height:1.6;">
          Your new Cardio Bunny support circle opens ${openDate}. Come back when you&apos;re ready and we&apos;ll bring you into your private space.
        </p>
        <p style="margin:14px 0 0;color:#e4b246;font-size:17px;line-height:1.5;">
          One week. One circle. Real, heart-centered support.
        </p>
        <div style="margin-top:28px;">
          <a href="${signInUrl}" style="display:inline-block;background:linear-gradient(180deg,#efc55a 0%,#d8a83b 100%);color:#1e1608;text-decoration:none;padding:14px 22px;border-radius:16px;font-weight:700;">
            Open my circle
          </a>
        </div>
        <p style="margin:24px 0 0;color:rgba(247,241,234,0.6);font-family:'Trebuchet MS',Helvetica,sans-serif;font-size:13px;line-height:1.6;">
          We never sell your data. This email is only for access to your Cardio Bunny circle.
        </p>
      </div>
    </div>
  `.trim();

  return { subject, html, signInUrl };
}

export async function sendCircleReadyEmail(input: CircleReadyEmailInput): Promise<CircleReadyEmailResult> {
  const { subject, html } = buildCircleReadyEmail(input);
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!resendKey || !from) {
    return {
      mode: "preview",
      provider: "preview",
      subject,
      html,
      to: input.email,
    };
  }

  const resend = new Resend(resendKey);
  const { data, error } = await resend.emails.send({
    from,
    to: [input.email],
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    mode: "sent",
    provider: "resend",
    messageId: data?.id ?? null,
  };
}
