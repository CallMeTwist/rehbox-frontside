import { ReactNode } from "react";

/** Small uppercase pill label. `tone` controls dark vs light section styling. */
export const Eyebrow = ({
  children, tone = "dark", live = false,
}: { children: ReactNode; tone?: "dark" | "light"; live?: boolean }) => (
  <span
    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.16em]"
    style={
      tone === "dark"
        ? { background: "rgba(79,141,247,0.12)", border: "1px solid rgba(79,141,247,0.28)", color: "#9fc0ff" }
        : { background: "rgba(46,91,186,0.10)", color: "#2E5BBA" }
    }
  >
    {live && <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" style={{ boxShadow: "0 0 0 4px rgba(52,211,153,0.18)" }} />}
    {children}
  </span>
);

/** One gradient (cyan→magenta) text phrase. Use for a single phrase per heading. */
export const GradientText = ({ children }: { children: ReactNode }) => (
  <span className="pub-gradient-text">{children}</span>
);

/** Centered section header: eyebrow + title + optional subtitle. */
export const SectionHeading = ({
  eyebrow, title, subtitle, tone = "dark",
}: { eyebrow?: string; title: ReactNode; subtitle?: string; tone?: "dark" | "light" }) => (
  <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 reveal">
    {eyebrow && <div className="mb-4"><Eyebrow tone={tone}>{eyebrow}</Eyebrow></div>}
    <h2
      className="font-display font-bold text-3xl md:text-5xl tracking-tight"
      style={{ color: tone === "dark" ? "#fff" : "var(--pub-ink-text)" }}
    >
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 text-lg leading-relaxed" style={{ color: tone === "dark" ? "#9FB2D8" : "var(--pub-ink-mute)" }}>
        {subtitle}
      </p>
    )}
  </div>
);

/** Animated stat. Pass numeric `value` + optional `suffix` (e.g. "+", "%"). */
export const StatCounter = ({
  value, suffix = "", label, tone = "dark",
}: { value: number; suffix?: string; label: string; tone?: "dark" | "light" }) => (
  <div>
    <p
      className="font-display font-bold text-3xl md:text-4xl"
      style={{ color: tone === "dark" ? "#fff" : "var(--pub-blue-ink)" }}
      data-countup={value} data-suffix={suffix}
    >
      0{suffix}
    </p>
    <p className="text-sm mt-1" style={{ color: tone === "dark" ? "#8298c0" : "var(--pub-ink-mute)" }}>{label}</p>
  </div>
);

/** Branded monogram avatar (replaces ui-avatars.com). */
const AVATAR_GRADS = [
  "linear-gradient(135deg, #4F8DF7, #7C5CFF)",
  "linear-gradient(135deg, #E0479B, #C0397F)",
  "linear-gradient(135deg, #26C6DA, #2E5BBA)",
];
export const MonogramAvatar = ({ name, idx = 0, size = 80 }: { name: string; idx?: number; size?: number }) => (
  <div
    className="rounded-full flex items-center justify-center font-display font-bold text-white mx-auto"
    style={{
      width: size, height: size, fontSize: size * 0.34,
      background: AVATAR_GRADS[idx % AVATAR_GRADS.length],
      boxShadow: "0 8px 24px rgba(10,20,48,0.25)",
    }}
  >
    {name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
  </div>
);
