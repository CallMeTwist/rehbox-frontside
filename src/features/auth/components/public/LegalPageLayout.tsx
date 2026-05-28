import { useEffect, useRef, useState, ReactNode, ComponentType } from "react";
import { ChevronDown } from "lucide-react";
import { Eyebrow, GradientText } from "./primitives";
import { revealOnScroll } from "./useReveal";

export interface LegalContentItem { sub: string; text: string; }
export interface LegalSection {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  content: LegalContentItem[];
}

interface Props {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  intro: string;
  meta: string[];
  sections: LegalSection[];
  children?: ReactNode;
}

const AccordionItem = ({ section, defaultOpen }: { section: LegalSection; defaultOpen: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      id={section.id}
      className="legal-section scroll-mt-24 rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
    >
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-4 px-6 py-5 text-left">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--pub-grad-accent)" }}>
          <section.icon size={18} className="text-white" />
        </div>
        <span className="flex-1 font-display font-semibold text-white text-base">{section.title}</span>
        <ChevronDown
          size={18}
          className="text-white/40 flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-4">
          {section.content.map((item, i) => (
            <div key={i}>
              <p className="text-white/80 font-semibold text-sm mb-1">{item.sub}</p>
              <p className="text-white/50 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LegalPageLayout = ({ eyebrow, titleLead, titleAccent, intro, meta, sections, children }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    if (containerRef.current) revealOnScroll(containerRef.current, ".legal-section", { stagger: 0.04 });
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <div ref={containerRef}>
      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 text-center overflow-hidden bg-pub-hero">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mb-6"><Eyebrow tone="dark" live>{eyebrow}</Eyebrow></div>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-white mb-5 leading-tight">
            {titleLead} <GradientText>{titleAccent}</GradientText>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6">{intro}</p>
          <div
            className="inline-flex flex-wrap justify-center items-center gap-3 px-5 py-2.5 rounded-full text-sm text-white/60"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            {meta.map((m, i) => (
              <span key={m} className="flex items-center gap-3">{i > 0 && <span className="w-1 h-1 rounded-full bg-white/30" />}{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* TOC + sections */}
      <section className="px-6 md:px-12 py-12 max-w-6xl mx-auto grid md:grid-cols-[220px_1fr] gap-10">
        <aside className="hidden md:block">
          <div className="sticky top-24 space-y-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-sm py-1.5 px-3 rounded-lg transition-colors"
                style={{
                  color: active === s.id ? "#fff" : "rgba(255,255,255,0.45)",
                  background: active === s.id ? "rgba(79,141,247,0.14)" : "transparent",
                }}
              >
                {s.title}
              </a>
            ))}
          </div>
        </aside>
        <div className="space-y-3">
          {children}
          {sections.map((s, i) => <AccordionItem key={s.id} section={s} defaultOpen={i < 2} />)}
        </div>
      </section>
    </div>
  );
};

export default LegalPageLayout;
