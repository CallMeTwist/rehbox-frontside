// src/features/shared/components/LanguageSwitcher.tsx
import { useLanguage, Language } from '@/features/shared/context/LanguageContext';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en',  label: 'English', flag: '🇬🇧' },
  { code: 'pcm', label: 'Pidgin',  flag: '🇳🇬' },
  { code: 'yo',  label: 'Yorùbá',  flag: '🟢' },
  { code: 'ig',  label: 'Igbo',    flag: '🔴' },
  { code: 'ha',  label: 'Hausa',   flag: '🟡' },
];

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      className="bg-muted border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.flag} {l.label}
        </option>
      ))}
    </select>
  );
};