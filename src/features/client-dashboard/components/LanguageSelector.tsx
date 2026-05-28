import { useLanguage, Language } from "@/features/shared/context/LanguageContext";
import { LANGUAGES } from "@/mock/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
      <SelectTrigger className="w-auto h-8 border-border text-xs gap-1 px-2"><SelectValue /></SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-1.5"><span>{lang.flag}</span><span>{lang.label}</span></span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
