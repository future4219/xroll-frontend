import { useLanguage } from "@/utils/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-12 w-full bg-gray-100 py-6 px-4 text-sm text-gray-600">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Xroll. All rights reserved.</p>
        <div>
          <a href="/policy" className="hover:underline">
            {t('privacyPolicy')}
          </a>
          <div>{t('contact')}</div>
        </div>
      </div>
    </footer>
  );
}
