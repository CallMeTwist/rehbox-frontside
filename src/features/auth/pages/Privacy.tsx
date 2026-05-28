import { Database, Eye, UserCheck, Lock, Shield, Globe, Bell } from "lucide-react";
import LegalPageLayout, { LegalSection } from "@/features/auth/components/public/LegalPageLayout";

const sections: LegalSection[] = [
  {
    id: "information",
    icon: Database,
    title: "1. Information We Collect",
    content: [
      {
        sub: "Account information",
        text: "When you register, we collect your full name, email address, phone number, and professional credentials (for physiotherapists). For clients, we may also collect date of birth and emergency contact details.",
      },
      {
        sub: "Health and exercise data",
        text: "ReHboX is a clinical platform. We collect exercise session data including completed sets, reps, duration, pain/discomfort ratings, adherence scores, and session timestamps. This data is used solely to power your rehabilitation programme and is never used for advertising.",
      },
      {
        sub: "Motion and progress data",
        text: "Where you use exercise tracking features, we may collect progress metrics such as range-of-motion improvements, exercise streaks, and milestone achievements. This data informs your physiotherapist's clinical decisions.",
      },
      {
        sub: "Device and usage data",
        text: "We collect browser type, device model, operating system, IP address, and session logs to ensure service stability and detect fraud. We do not use third-party advertising trackers.",
      },
      {
        sub: "Payment data",
        text: "Subscription payments are processed by Paystack (a PCI-DSS certified Nigerian processor). ReHboX receives only a transaction reference and the last four digits of your card — we never store full card details.",
      },
    ],
  },
  {
    id: "how-we-use",
    icon: Eye,
    title: "2. How We Use Your Information",
    content: [
      {
        sub: "Clinical service delivery",
        text: "Your physiotherapist uses your health and exercise data to create personalised plans, adjust difficulty, monitor adherence, and provide remote care. This is the core purpose of ReHboX.",
      },
      {
        sub: "Platform improvement",
        text: "Aggregated and anonymised usage patterns help us improve exercise content, interface design, and clinical workflows. No individual is identifiable in this analysis.",
      },
      {
        sub: "Communications",
        text: "We send transactional emails (appointment reminders, session completions, billing receipts). You may opt out of non-essential notifications in your account settings at any time.",
      },
      {
        sub: "Safety and fraud prevention",
        text: "We use usage data to detect account misuse, unauthorised access attempts, and to comply with security obligations under Nigerian law.",
      },
    ],
  },
  {
    id: "sharing",
    icon: UserCheck,
    title: "3. Sharing Your Information",
    content: [
      {
        sub: "Your physiotherapist",
        text: "If you are a client, your assigned physiotherapist can see your health and exercise data as part of the care relationship. You can request to remove access at any time by contacting support.",
      },
      {
        sub: "Service providers",
        text: "We share data with carefully selected processors: Paystack (payments), Laravel Reverb / Pusher (real-time messaging), and cloud infrastructure providers. All processors are contractually bound to process data only as instructed.",
      },
      {
        sub: "Legal obligations",
        text: "We may disclose data to law enforcement or regulatory bodies where required by Nigerian law, court order, or to protect the vital interests of a user.",
      },
      {
        sub: "We never sell your data",
        text: "ReHboX does not sell, rent, or trade personal data to advertisers, data brokers, or any third party for commercial purposes — ever.",
      },
    ],
  },
  {
    id: "security",
    icon: Lock,
    title: "4. Data Security",
    content: [
      {
        sub: "Encryption",
        text: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Database backups are encrypted with separate key management.",
      },
      {
        sub: "Access controls",
        text: "Role-based access controls ensure physiotherapists can only see their own clients' data. Admin access requires multi-factor authentication and is logged comprehensively.",
      },
      {
        sub: "Data residency",
        text: "Health data is stored on servers located in Nigeria or within data centres with appropriate safeguards under the NDPA 2023. We do not routinely transfer health data outside Nigeria.",
      },
      {
        sub: "Breach notification",
        text: "In the event of a data breach affecting your personal information, we will notify you and the Nigeria Data Protection Commission (NDPC) within 72 hours as required by the NDPA 2023.",
      },
    ],
  },
  {
    id: "rights",
    icon: Shield,
    title: "5. Your Rights Under NDPA 2023",
    content: [
      {
        sub: "Right to access",
        text: "You may request a copy of all personal data ReHboX holds about you. We will respond within 30 days.",
      },
      {
        sub: "Right to correction",
        text: "If your data is inaccurate or incomplete, you may request corrections through your account settings or by contacting us.",
      },
      {
        sub: "Right to deletion",
        text: "You may request that we delete your personal data. We will comply unless retention is required for legal, safety, or contractual reasons. Health records may be retained for the statutory clinical record retention period.",
      },
      {
        sub: "Right to data portability",
        text: "You may request a machine-readable export of your exercise and health data at any time.",
      },
      {
        sub: "Right to object",
        text: "You may object to processing based on legitimate interests. We will cease processing unless we have compelling lawful grounds that override your interests.",
      },
      {
        sub: "How to exercise your rights",
        text: "Email privacy@rehbox.health or write to ReHboX Health Technologies Ltd., Lagos, Nigeria. We will acknowledge your request within 5 business days.",
      },
    ],
  },
  {
    id: "cookies",
    icon: Globe,
    title: "6. Cookies and Tracking",
    content: [
      {
        sub: "Session management",
        text: "We use session storage (not persistent cookies) for authentication tokens. Closing your browser tab ends your session automatically.",
      },
      {
        sub: "Essential cookies only",
        text: "ReHboX uses only technically necessary cookies for CSRF protection and session management. We do not use advertising, analytics, or social tracking cookies.",
      },
      {
        sub: "Google Fonts",
        text: "Our pages load fonts from Google Fonts CDN, which may set a cookie to optimise font delivery. You can self-host fonts by contacting us if this is a concern.",
      },
    ],
  },
  {
    id: "retention",
    icon: Database,
    title: "7. Data Retention",
    content: [
      {
        sub: "Active accounts",
        text: "We retain your data for as long as your account is active and for a period of 7 years after account closure to meet Nigerian financial and healthcare record requirements.",
      },
      {
        sub: "Inactive accounts",
        text: "Accounts inactive for more than 3 years will receive an email notification offering reactivation or deletion before any data is removed.",
      },
      {
        sub: "Deletion requests",
        text: "Upon a verified deletion request, personal identifiers are removed within 30 days. Anonymised, aggregate analytics data may be retained indefinitely.",
      },
    ],
  },
  {
    id: "notifications",
    icon: Bell,
    title: "8. Push Notifications and Communications",
    content: [
      {
        sub: "In-app notifications",
        text: "ReHboX sends real-time notifications for new exercise plans, session reminders, and messages from your physiotherapist. You can manage notification preferences in your profile settings.",
      },
      {
        sub: "Email communications",
        text: "Transactional emails (session completions, receipts) cannot be disabled as they form part of the clinical record. Marketing emails are opt-in only.",
      },
      {
        sub: "SMS and WhatsApp",
        text: "If you provide a phone number, we may send critical health reminders via SMS or WhatsApp with your explicit consent. You can withdraw consent at any time.",
      },
    ],
  },
  {
    id: "changes",
    icon: Bell,
    title: "9. Changes to This Policy",
    content: [
      {
        sub: "Policy updates",
        text: "We may update this Privacy Policy to reflect changes in law or our practices. Material changes will be communicated by email and an in-app notification at least 14 days before they take effect. Your continued use of ReHboX after the effective date constitutes acceptance of the updated policy.",
      },
      {
        sub: "Current version",
        text: "The current version of this policy is always available at rehbox.health/privacy. Historical versions are available on request.",
      },
    ],
  },
  {
    id: "contact",
    icon: UserCheck,
    title: "10. Contact Our Privacy Team",
    content: [
      {
        sub: "Email",
        text: "privacy@rehbox.health — we acknowledge privacy requests within 5 business days.",
      },
      {
        sub: "Postal address",
        text: "ReHboX Health Technologies Ltd., Lagos, Nigeria.",
      },
      {
        sub: "Right to complain",
        text: "You also have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC) at ndpc.gov.ng if you believe your rights have been violated.",
      },
    ],
  },
];

const Privacy = () => (
  <LegalPageLayout
    eyebrow="Your privacy matters"
    titleLead="Privacy"
    titleAccent="Policy"
    intro="ReHboX handles sensitive health data. Here is a plain-English explanation of exactly what we collect, why, and how we protect it — compliant with the Nigeria Data Protection Act 2023 (NDPA)."
    meta={["Effective: 1 January 2026", "Last updated: May 2026", "Version 1.2"]}
    sections={sections}
  >
    <div
      className="legal-section rounded-3xl p-8"
      style={{
        background: "linear-gradient(135deg, rgba(224,71,155,0.10) 0%, rgba(46,91,186,0.18) 100%)",
        border: "1px solid rgba(224,71,155,0.2)",
      }}
    >
      <p className="text-white/80 text-sm leading-relaxed mb-3">
        <strong className="text-white">Who we are:</strong> ReHboX Health Technologies Ltd. ("ReHboX", "we", "us") operates the ReHboX digital physiotherapy platform at rehbox.health. We are a data controller registered in Nigeria and subject to the Nigeria Data Protection Act 2023.
      </p>
      <p className="text-white/80 text-sm leading-relaxed mb-3">
        <strong className="text-white">What this policy covers:</strong> This policy applies to all users of the ReHboX platform — physiotherapists (PTs), clients (patients), and visitors to our website. It covers all personal and health data processed through our web application, APIs, and related services.
      </p>
      <p className="text-white/60 text-sm">
        Questions? Email <a href="mailto:privacy@rehbox.health" style={{ color: "#E0479B" }} className="hover:underline">privacy@rehbox.health</a>
      </p>
    </div>
  </LegalPageLayout>
);

export default Privacy;
