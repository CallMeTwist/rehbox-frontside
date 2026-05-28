import { FileText, UserCheck, CreditCard, AlertTriangle, Scale, Stethoscope, Shield, Ban } from "lucide-react";
import LegalPageLayout, { LegalSection } from "@/features/auth/components/public/LegalPageLayout";

const sections: LegalSection[] = [
  {
    id: "acceptance",
    icon: FileText,
    title: "1. Acceptance of Terms",
    content: [
      {
        sub: "Agreement",
        text: "By accessing or using the ReHboX platform at rehbox.health (the “Service”), you agree to be bound by these Terms of Service. If you do not agree, you must not use the Service.",
      },
      {
        sub: "Capacity",
        text: "You must be at least 18 years old to create an account. By registering, you represent that you have full legal capacity to enter into these Terms.",
      },
      {
        sub: "Updates to Terms",
        text: "We may update these Terms periodically. Material changes will be communicated by email and in-app notification at least 14 days before they take effect. Continued use after the effective date constitutes acceptance.",
      },
    ],
  },
  {
    id: "description",
    icon: Stethoscope,
    title: "2. Service Description",
    content: [
      {
        sub: "What ReHboX is",
        text: "ReHboX is a digital platform that connects physiotherapists with their patients to deliver remote rehabilitation programmes, video-guided exercise sessions, real-time progress tracking, and secure clinical communication.",
      },
      {
        sub: "Not a substitute for medical advice",
        text: "IMPORTANT: ReHboX is a tool to support, not replace, professional physiotherapy care. Nothing on the platform constitutes medical diagnosis, treatment, or advice beyond what your registered physiotherapist provides. Always consult a qualified healthcare professional before starting any exercise programme.",
      },
      {
        sub: "Platform roles",
        text: "The Service supports two primary user types: Physiotherapists (PTs) who create and manage rehabilitation programmes, and Clients (patients) who follow prescribed exercise plans. PTs are responsible for the clinical appropriateness of all exercises they prescribe.",
      },
      {
        sub: "Exercise content",
        text: "Exercise videos and instructions are provided for educational and rehabilitation purposes under the guidance of a qualified PT. The library is curated but individual exercise suitability depends on your specific clinical condition.",
      },
    ],
  },
  {
    id: "accounts",
    icon: UserCheck,
    title: "3. Accounts and Registration",
    content: [
      {
        sub: "Physiotherapist vetting",
        text: "PT accounts require professional credential verification (MRTB/NMPTB registration number). Creating a PT account with false credentials is a breach of these Terms and may be referred to regulatory authorities.",
      },
      {
        sub: "Account security",
        text: "You are responsible for maintaining the confidentiality of your login credentials. Do not share account access with others. Report suspected unauthorised access to security@rehbox.health immediately.",
      },
      {
        sub: "Accurate information",
        text: "You agree to provide accurate, current information during registration and to update it as necessary. False information — particularly health information provided by clients — may affect the quality of care received.",
      },
      {
        sub: "One account per person",
        text: "Each individual may maintain one account. PT accounts may not be transferred to another individual.",
      },
    ],
  },
  {
    id: "subscriptions",
    icon: CreditCard,
    title: "4. Subscriptions and Payments",
    content: [
      {
        sub: "Free tier",
        text: "Clients on the free plan have access to a limited exercise library with basic tracking features. Free accounts are provided as-is with no uptime guarantee for premium features.",
      },
      {
        sub: "Standard subscription",
        text: "The Standard plan provides full access to personalised exercise plans, all video content, progress analytics, and real-time messaging with your physiotherapist. Pricing is published at rehbox.health and may change with 30 days' notice.",
      },
      {
        sub: "PT subscriptions",
        text: "Physiotherapists subscribe to manage their client roster. Plan limits (e.g., number of active clients) are displayed at sign-up. Exceeding plan limits requires upgrading.",
      },
      {
        sub: "Billing and renewals",
        text: "Subscriptions are billed monthly or annually in advance. Subscriptions renew automatically unless cancelled at least 24 hours before the renewal date via your account settings.",
      },
      {
        sub: "Refunds",
        text: "Annual subscriptions are eligible for a pro-rated refund within the first 14 days of a new subscription period. Monthly subscriptions are non-refundable once a billing period has started. Contact support@rehbox.health for billing disputes.",
      },
      {
        sub: "Payment processing",
        text: "Payments are processed by Paystack in Nigerian Naira (NGN). Prices displayed include VAT at the applicable Nigerian rate.",
      },
    ],
  },
  {
    id: "conduct",
    icon: Ban,
    title: "5. Acceptable Use",
    content: [
      {
        sub: "You agree not to:",
        text: "Upload content that is false, misleading, or intended to harm; impersonate a healthcare professional; attempt to gain unauthorised access to other users' data; use the Service to distribute malware or conduct phishing attacks; scrape, copy, or republish exercise content without written permission; or use the Service for any purpose that violates Nigerian law.",
      },
      {
        sub: "Clinical conduct (PTs)",
        text: "Physiotherapists agree to prescribe exercises only within their professional scope of practice, to maintain appropriate clinical records as required by MRTB/NMPTB standards, and to refer clients to in-person care when clinically necessary.",
      },
      {
        sub: "Exercise safety (Clients)",
        text: "Clients agree to inform their physiotherapist of any pain, injury, or condition change before continuing their exercise programme. Stop any exercise that causes pain and contact your physiotherapist.",
      },
      {
        sub: "Consequences of misuse",
        text: "Violations may result in immediate account suspension, permanent ban, reporting to relevant professional bodies, and legal action where appropriate.",
      },
    ],
  },
  {
    id: "ip",
    icon: Shield,
    title: "6. Intellectual Property",
    content: [
      {
        sub: "ReHboX content",
        text: "The ReHboX platform, exercise library, videos, brand assets, and underlying software are the intellectual property of ReHboX Health Technologies Ltd. and are protected by Nigerian and international copyright law.",
      },
      {
        sub: "Your content",
        text: "You retain ownership of content you create (clinical notes, custom exercise descriptions). By submitting content, you grant ReHboX a non-exclusive, royalty-free licence to process and store it solely to provide the Service.",
      },
      {
        sub: "Feedback",
        text: "Any suggestions or feedback you provide may be used by ReHboX to improve the platform without obligation to you.",
      },
      {
        sub: "Restrictions",
        text: "You may not copy, redistribute, sell, or create derivative works from any ReHboX content without prior written consent.",
      },
    ],
  },
  {
    id: "liability",
    icon: AlertTriangle,
    title: "7. Disclaimers and Limitation of Liability",
    content: [
      {
        sub: "Service availability",
        text: "ReHboX aims for high availability but does not guarantee uninterrupted access. The Service is provided 'as is' and 'as available'. We are not liable for losses arising from downtime.",
      },
      {
        sub: "Health disclaimer",
        text: "ReHboX is not a licensed healthcare provider. Exercise prescriptions are the clinical responsibility of the registered physiotherapist using the platform. ReHboX is not liable for clinical decisions made by PTs or for adverse events arising from exercise.",
      },
      {
        sub: "Limitation of liability",
        text: "To the maximum extent permitted by Nigerian law, ReHboX's total liability to you for any claim arising from use of the Service is limited to the amount you paid to ReHboX in the 12 months preceding the claim. We are not liable for indirect, consequential, or punitive damages.",
      },
      {
        sub: "Indemnification",
        text: "You agree to indemnify ReHboX against claims, damages, and costs arising from your violation of these Terms or your use of the Service in a way that causes harm to others.",
      },
    ],
  },
  {
    id: "termination",
    icon: Ban,
    title: "8. Termination",
    content: [
      {
        sub: "Your right to terminate",
        text: "You may delete your account at any time through account settings or by contacting support@rehbox.health. Termination does not entitle you to a refund for the current billing period.",
      },
      {
        sub: "Our right to terminate",
        text: "We may suspend or terminate your account immediately for material breach of these Terms, fraudulent activity, or where required by law. We will provide advance notice where reasonably practicable.",
      },
      {
        sub: "Effect of termination",
        text: "On termination, your right to access the Service ends immediately. Data is retained per our Privacy Policy (typically 7 years for health records). You may request an export of your data before or within 30 days of account closure.",
      },
    ],
  },
  {
    id: "law",
    icon: Scale,
    title: "9. Governing Law and Disputes",
    content: [
      {
        sub: "Governing law",
        text: "These Terms are governed by the laws of the Federal Republic of Nigeria. The Nigeria Data Protection Act 2023, the Consumer Protection Council Act, and applicable health regulations apply.",
      },
      {
        sub: "Dispute resolution",
        text: "We encourage you to contact us first at legal@rehbox.health to resolve disputes informally. If unresolved within 30 days, disputes shall be referred to arbitration under the Arbitration and Conciliation Act (Nigeria), with the seat of arbitration in Lagos.",
      },
      {
        sub: "Class action waiver",
        text: "You agree that any claims must be brought individually. You waive the right to participate in any class action or representative proceeding against ReHboX.",
      },
    ],
  },
  {
    id: "contact",
    icon: FileText,
    title: "10. Contact Us",
    content: [
      { sub: "General enquiries", text: "hello@rehbox.health" },
      { sub: "Legal", text: "legal@rehbox.health" },
      { sub: "Address", text: "ReHboX Health Technologies Ltd., Lagos, Nigeria." },
    ],
  },
];

const Terms = () => (
  <LegalPageLayout
    eyebrow="Legal agreement"
    titleLead="Terms of"
    titleAccent="Service"
    intro="These terms govern your use of the ReHboX platform. We've written them in plain language so you can understand your rights and responsibilities."
    meta={["Effective: 1 January 2026", "Last updated: May 2026", "Version 1.2"]}
    sections={sections}
  >
    <div
      className="legal-section rounded-3xl p-8"
      style={{
        background: "linear-gradient(135deg, rgba(46,91,186,0.28) 0%, rgba(79,141,247,0.16) 100%)",
        border: "1px solid rgba(79,141,247,0.3)",
      }}
    >
      <p className="text-white font-display font-semibold mb-3">Summary (not a substitute for the full terms)</p>
      <ul className="space-y-2 text-sm text-white/60">
        <li className="flex items-start gap-2"><span className="text-[#34D399] mt-0.5">✓</span> ReHboX supports physiotherapy care — it is not a replacement for clinical advice.</li>
        <li className="flex items-start gap-2"><span className="text-[#34D399] mt-0.5">✓</span> Your health data belongs to you. We process it only to deliver the Service.</li>
        <li className="flex items-start gap-2"><span className="text-[#34D399] mt-0.5">✓</span> Physiotherapists are clinically responsible for exercises they prescribe.</li>
        <li className="flex items-start gap-2"><span className="text-[#34D399] mt-0.5">✓</span> Subscriptions renew automatically — cancel any time in settings.</li>
        <li className="flex items-start gap-2"><span className="text-[#34D399] mt-0.5">✓</span> These Terms are governed by Nigerian law.</li>
      </ul>
    </div>
  </LegalPageLayout>
);

export default Terms;
