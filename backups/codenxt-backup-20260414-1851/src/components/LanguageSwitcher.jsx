import React from 'react';
import { setLang } from '../i18n';

export default function LanguageSwitcher({ lang, onChange }) {
  const flags = [
    { code: 'en', src: 'https://flagcdn.com/w40/gb.png', alt: 'English' },
    { code: 'no', src: 'https://flagcdn.com/w40/no.png', alt: 'Norwegian' },
    { code: 'sv', src: 'https://flagcdn.com/w40/se.png', alt: 'Swedish' },
    { code: 'de', src: 'https://flagcdn.com/w40/de.png', alt: 'German' },
    { code: 'th', src: 'https://flagcdn.com/w40/th.png', alt: 'Thai' },
  ];

  const change = (code) => {
    setLang(code);
    onChange(code);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        display: 'flex',
        gap: 8,
        zIndex: 20,
      }}
    >
      {flags.map((flag) => (
        <img
          key={flag.code}
          src={flag.src}
          alt={flag.alt}
          onClick={() => change(flag.code)}
          style={{
            width: 28,
            height: 20,
            cursor: 'pointer',
            opacity: lang === flag.code ? 1 : 0.55,
            borderRadius: 4,
            outline: lang === flag.code ? '2px solid #00f0ff' : 'none',
            boxShadow: lang === flag.code ? '0 0 10px rgba(0,240,255,0.35)' : 'none',
          }}
        />
      ))}
    </div>
  );
}