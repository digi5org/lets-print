export default function MyAccountSection({ profile }) {
  if (!profile) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-sm text-gray-500">
        Account details are not available right now.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
        <p className="text-sm text-gray-500">Update personal details, billing preferences, and security options.</p>
      </div>


      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Profile</h4>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <p><span className="text-gray-500">Name:</span> {profile.name}</p>
            <p><span className="text-gray-500">Email:</span> {profile.email}</p>
            <p><span className="text-gray-500">Company:</span> {profile.company}</p>
            <p><span className="text-gray-500">Tenant:</span> {profile.tenant}</p>
          </div>
          <button
            type="button"
            className="mt-5 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
          >
            Edit Profile
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Billing & Preferences</h4>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <p><span className="text-gray-500">Default payment method:</span> {profile.billing.defaultMethod}</p>
            <p><span className="text-gray-500">Billing emails:</span> {profile.billing.recipient}</p>
            <p><span className="text-gray-500">Invoice frequency:</span> {profile.billing.frequency}</p>
            <p><span className="text-gray-500">Order approvals:</span> {profile.preferences.requireApproval ? "Required" : "Not required"}</p>
          </div>
          <button
            type="button"
            className="mt-5 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
          >
            Update Billing
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Security</h4>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <p><span className="text-gray-500">Last sign-in:</span> {profile.security.lastLogin}</p>
            <p><span className="text-gray-500">Two-factor authentication:</span> {profile.security.mfaEnabled ? "Enabled" : "Disabled"}</p>
            <p><span className="text-gray-500">Allowed IPs:</span> {profile.security.allowedIps.join(", ")}</p>
            <p><span className="text-gray-500">Session length:</span> {profile.security.sessionDuration}</p>
          </div>
          <div className="mt-5 space-y-2">
            <button
              type="button"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
            >
              Manage Security
            </button>
            <button
              type="button"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
