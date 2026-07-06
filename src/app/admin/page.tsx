import { triggerCircleReadyNotifications } from "@/app/admin/actions";
import { requireAdminUserEmail } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/admin-dashboard";

type AdminPageProps = {
  searchParams: Promise<{
    notice?: string;
  }>;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00Z`));
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const adminEmail = await requireAdminUserEmail();
  const [{ notice }, dashboard] = await Promise.all([searchParams, getAdminDashboardData()]);

  return (
    <main className="admin-page-shell">
      <section className="admin-hero">
        <div>
          <p className="admin-kicker">Private admin</p>
          <h1>5others control room</h1>
          <p className="admin-copy">
            A small operational dashboard for Cardio Bunny intake, notification runs, and active
            circles.
          </p>
        </div>
        <div className="admin-hero-note">
          <span>Signed in as</span>
          <strong>{adminEmail}</strong>
        </div>
      </section>

      {notice ? <p className="success-banner admin-banner">{notice}</p> : null}

      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <p className="admin-section-label">Overview</p>
            <h2>Current system pulse</h2>
          </div>
        </div>

        <div className="admin-metric-grid">
          <article className="admin-metric-card">
            <span>Total intakes</span>
            <strong>{dashboard.summary.intakeCount}</strong>
          </article>
          <article className="admin-metric-card">
            <span>Waiting members</span>
            <strong>{dashboard.summary.waitingCount}</strong>
          </article>
          <article className="admin-metric-card">
            <span>Active circles</span>
            <strong>{dashboard.summary.liveCircleCount}</strong>
          </article>
          <article className="admin-metric-card">
            <span>Active memberships</span>
            <strong>{dashboard.summary.activeMembershipCount}</strong>
          </article>
          <article className="admin-metric-card">
            <span>Emails sent</span>
            <strong>{dashboard.summary.notificationSentCount}</strong>
          </article>
          <article className="admin-metric-card">
            <span>Email previews</span>
            <strong>{dashboard.summary.notificationPreviewCount}</strong>
          </article>
          <article className="admin-metric-card">
            <span>Email failures</span>
            <strong>{dashboard.summary.notificationFailedCount}</strong>
          </article>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <p className="admin-section-label">Notifications</p>
            <h2>Run circle-ready emails now</h2>
          </div>
          <p className="admin-copy admin-copy-tight">
            Use this while we&apos;re still testing launches and don&apos;t want to wait on the
            cron schedule.
          </p>
        </div>

        <form action={triggerCircleReadyNotifications} className="admin-run-form">
          <label className="admin-field">
            <span>Run date</span>
            <input defaultValue={new Date().toISOString().slice(0, 10)} name="runDate" type="date" />
          </label>
          <button className="admin-primary button-reset" type="submit">
            Run circle-ready notifications
          </button>
        </form>
      </section>

      <section className="admin-grid">
        <section className="admin-card">
          <div className="admin-card-head">
            <div>
              <p className="admin-section-label">Intake</p>
              <h2>Recent join requests</h2>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Week</th>
                  <th>Language</th>
                  <th>Age</th>
                  <th>Start</th>
                  <th>Goal</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentIntakes.map((intake) => (
                  <tr key={intake.id}>
                    <td>{intake.email}</td>
                    <td>{formatDate(intake.week_start)}</td>
                    <td>{intake.preferred_language}</td>
                    <td>{intake.age_range}</td>
                    <td>{intake.starting_point.replaceAll("_", " ")}</td>
                    <td>{intake.fitness_goal?.replaceAll("_", " ") ?? "—"}</td>
                    <td>{formatDateTime(intake.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-head">
            <div>
              <p className="admin-section-label">Delivery</p>
              <h2>Recent notification attempts</h2>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Week</th>
                  <th>Status</th>
                  <th>Provider</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentNotifications.map((notification) => (
                  <tr key={notification.id}>
                    <td>{notification.email}</td>
                    <td>{notification.notification_type.replaceAll("_", " ")}</td>
                    <td>{formatDate(notification.week_start)}</td>
                    <td>{notification.status}</td>
                    <td>{notification.provider}</td>
                    <td>{formatDateTime(notification.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <p className="admin-section-label">Circles</p>
            <h2>Active rooms</h2>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Week</th>
                <th>Category</th>
                <th>Language</th>
                <th>Members</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.activeCircles.map((circle) => (
                <tr key={circle.id}>
                  <td>{circle.weeks?.[0]?.start_at ? formatDateTime(circle.weeks[0].start_at) : "—"}</td>
                  <td>{circle.category.replaceAll("_", " ")}</td>
                  <td>{circle.language}</td>
                  <td>{circle.member_count}</td>
                  <td>{circle.status}</td>
                  <td>{formatDateTime(circle.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
