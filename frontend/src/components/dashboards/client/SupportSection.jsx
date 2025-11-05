export default function SupportSection({ channels = [], faqs = [], resources = [] }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Support Center</h3>
        <p className="text-sm text-gray-500">
          Reach our support team, browse guides, or open a new ticket when you need help.
        </p>
      </div>


      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Contact Options</h4>
          <div className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-semibold text-gray-900">{channel.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{channel.description}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    {channel.availability}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {channel.cta}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Knowledge Base</h4>
          <div className="space-y-3">
            {resources.map((article) => (
              <div key={article.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm font-semibold text-gray-900">{article.title}</p>
                <p className="mt-1 text-xs text-gray-500">Updated {article.updatedAt}</p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  View Guide
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">FAQs</h4>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-900">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
