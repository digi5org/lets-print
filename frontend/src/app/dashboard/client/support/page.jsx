"use client";

import SupportSection from "@/components/dashboards/client/SupportSection";

const supportChannels = [
  { id: "chat", title: "Live chat", description: "Instant help for quick questions and order updates.", availability: "Mon-Fri", cta: "Start chat" },
  { id: "email", title: "Email support", description: "Prefer email? We reply to most requests within a few hours.", availability: "24/7", cta: "Send email" },
  { id: "call", title: "Schedule a call", description: "Book a 15-minute session with a print specialist.", availability: "By appointment", cta: "Book now" },
];

const supportResources = [
  { id: "guide-1", title: "Preparing files for print", updatedAt: "Dec 2024" },
  { id: "guide-2", title: "Understanding order statuses", updatedAt: "Nov 2024" },
  { id: "guide-3", title: "How to manage design approvals", updatedAt: "Nov 2024" },
];


const supportFaqs = [
  { id: "faq-1", question: "How long does production take?", answer: "Standard production time is 3 to 5 business days depending on the product." },
  { id: "faq-2", question: "Can I reorder a previous job?", answer: "Yes. Use the design library or order history to reorder with saved specifications." },
  { id: "faq-3", question: "When will I receive tracking information?", answer: "Tracking details are provided as soon as the order leaves production." },
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support</h1>
          <p className="mt-1 text-sm text-gray-500">Get help, access guides, and connect with our support team</p>
        </div>
      </div>

      <SupportSection 
        channels={supportChannels} 
        resources={supportResources} 
        faqs={supportFaqs} 
      />
    </div>
  );
}
