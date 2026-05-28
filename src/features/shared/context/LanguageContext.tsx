// src/features/shared/context/LanguageContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export type Language = 'en' | 'pcm' | 'yo' | 'ig' | 'ha';

interface LanguageContextValue {
  language:    Language;
  setLanguage: (lang: Language) => void;
  t:           (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home':       'Home',
    'nav.plan':       'My Plan',
    'nav.progress':   'Progress',
    'nav.rewards':    'Rewards',
    'nav.shop':       'Shop',
    'nav.chat':       'Chat',
    'home.greeting':  'Good morning 👋',
    'home.streak':    "You're on a streak! Keep it up 🔥",
    'home.start':     "Start Today's Session",
    'plan.locked':    'Subscribe to unlock your personalized plan',
    'plan.no_plan':   'No active plan yet. Your PT will assign one shortly.',
    'session.start':  'Start Exercise',
    'session.complete': 'Complete Session',
    'session.great_form': 'Great form! Keep it up 💪',
    'session.good_form':  'Good — try to face the camera more',
    'session.poor_form':  'Move closer to the camera',
    'nav.exercises':  'Exercises',
    'nav.reminders':  'Reminders',
    'nav.profile':    'Profile',
  },
  pcm: {
    'nav.home':       'Home',
    'nav.plan':       'My Plan',
    'nav.progress':   'Progress',
    'nav.rewards':    'Rewards',
    'nav.shop':       'Shop',
    'nav.chat':       'Chat',
    'home.greeting':  'Good morning 👋',
    'home.streak':    'You don dey do am well! Continue 🔥',
    'home.start':     'Start Today Exercise',
    'plan.locked':    'Pay subscribe make you see your plan',
    'plan.no_plan':   'Your PT never give you plan yet. E go come soon.',
    'session.start':  'Start Exercise',
    'session.complete': 'I don finish',
    'session.great_form': 'Your form dey fine! Continue 💪',
    'session.good_form':  'E good — try face camera well',
    'session.poor_form':  'Come near camera small',
    'nav.exercises':  'Exercise',
    'nav.reminders':  'Reminder',
    'nav.profile':    'My Profile',
  },
  yo: {
    'nav.home':       'Ile',
    'nav.plan':       'Eto Mi',
    'nav.progress':   'Ilọsiwaju',
    'nav.rewards':    'Awon Ere',
    'nav.shop':       'Ile itaja',
    'nav.chat':       'Sọrọ',
    'home.greeting':  'Ẹ káàárọ̀ 👋',
    'home.streak':    'O n ṣe daradara! Tẹsiwaju 🔥',
    'home.start':     'Bẹrẹ Adaṣe Oni',
    'plan.locked':    'Sanwo alabapin lati wo eto rẹ',
    'plan.no_plan':   'Ko si eto sibẹsibẹ. PT rẹ yoo fun ọ laipẹ.',
    'session.start':  'Bẹrẹ Adaṣe',
    'session.complete': 'Mo Parí',
    'session.great_form': 'Fọọmu rẹ dara! Tẹsiwaju 💪',
    'session.good_form':  'Dara — gbiyanju lati wo kamẹra',
    'session.poor_form':  'Sunmọ kamẹra diẹ',
    'nav.exercises':  'Adaṣe',
    'nav.reminders':  'Iranti',
    'nav.profile':    'Profaili',
  },
  ig: {
    'nav.home':       'Ụlọ',
    'nav.plan':       'Atụmatụ M',
    'nav.progress':   'Ọganihu',
    'nav.rewards':    'Ugwo',
    'nav.shop':       'Ahịa',
    'nav.chat':       'Ikwu okwu',
    'home.greeting':  'Ụtụtụ ọma 👋',
    'home.streak':    'I na-eme nke ọma! Gaa n\'ihu 🔥',
    'home.start':     'Bido Ọmụmụ Taa',
    'plan.locked':    'Kwuo ụgwọ ịhụ atụmatụ gị',
    'plan.no_plan':   'Enweghị atụmatụ ugbu a. PT gị ga-enyefe ọzọ.',
    'session.start':  'Bido Omume',
    'session.complete': 'Emechara m',
    'session.great_form': 'Ọdịdị gị dị mma! Gaa n\'ihu 💪',
    'session.good_form':  'Ọ dị mma — nwalee ilele igwefoto',
    'session.poor_form':  'Bịa nso igwefoto obere',
    'nav.exercises':  'Omume',
    'nav.reminders':  'Ncheta',
    'nav.profile':    'Profaịlụ',
  },
  ha: {
    'nav.home':       'Gida',
    'nav.plan':       'Tsarin Na',
    'nav.progress':   'Ci Gaba',
    'nav.rewards':    'Lada',
    'nav.shop':       'Shago',
    'nav.chat':       'Magana',
    'home.greeting':  'Ina kwana 👋',
    'home.streak':    'Kana yi kyau! Ci gaba 🔥',
    'home.start':     'Fara Motsa Jiki Yau',
    'plan.locked':    'Biyan kuɗi don ganin tsarinka',
    'plan.no_plan':   'Babu tsari tukuna. PT ɗinka zai ba ka.',
    'session.start':  'Fara Motsa Jiki',
    'session.complete': 'Na gama',
    'session.great_form': 'Sifarka tana da kyau! Ci gaba 💪',
    'session.good_form':  'Yana da kyau — gwada fuskantar kyamara',
    'session.poor_form':  'Zo kusa da kyamara kaɗan',
    'nav.exercises':  'Motsa Jiki',
    'nav.reminders':  'Tunawa',
    'nav.profile':    'Bayanai',
  },
};

const LanguageContext = createContext<LanguageContextValue>({
  language:    'en',
  setLanguage: () => {},
  t:           (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const [language, setLanguageState] = useState<Language>('en');

  // Seed from server preference on login, fall back to localStorage
  useEffect(() => {
    if (user?.role === 'client' && user.language_preference) {
      const pref = user.language_preference as Language;
      setLanguageState(pref);
      localStorage.setItem('rehbox-language', pref);
    } else {
      const saved = localStorage.getItem('rehbox-language') as Language;
      if (saved) setLanguageState(saved);
    }
  }, [user?.id]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rehbox-language', lang);

    // Persist to backend if logged in as client
    if (user?.role === 'client') {
      try {
        await api.patch('/client/profile/language', { language: lang });
      } catch {
        // non-critical — local preference still saved
      }
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] ?? translations['en']?.[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);