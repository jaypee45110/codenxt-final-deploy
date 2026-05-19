import React from 'react';
import { LANGUAGES, setLang } from '../i18n';

export default function LanguageSwitcher({ lang, onChange }) {
  const change = (code) => {
    const next = setLang(code);
    onChange(next);
  };

  return (
    <div className="language-switcher" aria-label="Language switcher">
      {LANGUAGES.map((language) => (
        <button
          type="button"
          key={language.code}
          className={`flag-button ${lang === language.code ? 'is-active' : ''}`}
          onMouseDown={(event) => {
            event.preventDefault();
            change(language.code);
          }}
          onClick={() => change(language.code)}
          title={language.label}
          aria-label={language.label}
        >
          {language.flag}
        </button>
      ))}
    </div>
  );
}
