import React, { Suspense, lazy, useMemo, useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PrintPoster from './pages/PrintPoster';
import ScreenPlayer from './pages/ScreenPlayer';
import BadgeTestPage from './BadgeTestPage';

const CheckoutPage = lazy(() => import('./CheckoutPage'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const JoinPage = lazy(() => import('./JoinPage'));

function HomePage({ lang, setLang }) {
    useEffect(() => {
    document.title = '⚡ Live Access - codeTone';
  }, []);
  const copy = useMemo(() => {
    return {
      en: {
titleTop: 'Control the moment.',
titleAccent: 'Keep the connection.',
p1: (
  <>
    QR at the end of the show.<br />
    Audience scans.<br />
    They get that night’s digital moment or souvenir.<br /><br />
    After the last note, everyone is still there.<br />
    You decide what happens next.
  </>
),

p2: (
  <>
    Direct access. No app. No feed. No friction.<br />
    Just one shared moment — and a connection that continues after.
  </>
),

p3: (
  <>
    No intermediaries. No noise.<br />
    Just you and your audience.
  </>
),

p4: (
  <>
    After the event, you get a simple report:
    <br /><br />
    – total scans<br />
    – audience participation rate<br />
    – InnerCircle joins<br />
    – timing of the drop<br /><br />
    Download your data as PGV and keep your audience.
  </>
),
cta: 'SEE HOW IT WORKS →'
      },
      sv: {
        titleTop: 'Skaffa ditt eget',
        titleAccent: 'Control Center',
        p1: (
          <>
            codeTone ger artister möjlighet att bygga och äga sin egen <span className="text-white font-medium">InnerCircle</span> —
            en privat, direkt-till-fan-community där de verkliga supportrarna får exklusivt ljud, video, bilder och textmeddelanden.
          </>
        ),
        p2: (
          <>
            För publiken: Gå med i InnerCircle och få direkt, nära tillgång till osläppta låtar, behind-the-scenes-videor,
            personliga uppdateringar och privata meddelanden — allt direkt från artisten.
          </>
        ),
        p3: (
          <>
            Ta fullt ägarskap över din fan-databas. Tala direkt med publiken utan mellanhänder och bygg starkare lojalitet.
          </>
        ),
        cta: 'Beställ ditt Control Center nu →'
      },
      de: {
        titleTop: 'Hol dir dein eigenes',
        titleAccent: 'Control Center',
        p1: (
          <>
            codeTone gibt Künstlern die Möglichkeit, ihren eigenen <span className="text-white font-medium">InnerCircle</span> aufzubauen und zu besitzen —
            eine private Direct-to-Fan-Community, in der echte Supporter exklusive Audio-, Video-, Foto- und Textinhalte erhalten.
          </>
        ),
        p2: (
          <>
            Für dein Publikum: Tritt dem InnerCircle bei und erhalte sofortigen, direkten Zugang zu unveröffentlichten Tracks, Behind-the-Scenes-Videos,
            persönlichen Updates und privaten Nachrichten — alles direkt vom Künstler.
          </>
        ),
        p3: (
          <>
            Übernimm die volle Kontrolle über deine Fan-Datenbank. Sprich direkt mit deinem Publikum ohne Zwischenhändler und baue stärkere Loyalität auf.
          </>
        ),
        cta: 'Bestelle jetzt dein Control Center →'
      },
      th: {
        titleTop: 'สร้าง',
        titleAccent: 'Control Center ของคุณเอง',
        p1: (
          <>
            codeTone ช่วยให้ศิลปินสร้างและเป็นเจ้าของ <span className="text-white font-medium">InnerCircle</span> ของตัวเอง —
            คอมมูนิตี้ส่วนตัวแบบตรงถึงแฟน ที่แฟนตัวจริงจะได้รับเสียง วิดีโอ ภาพ และข้อความสุดเอ็กซ์คลูซีฟ
          </>
        ),
        p2: (
          <>
            สำหรับผู้ชม: เข้าร่วม InnerCircle เพื่อรับสิทธิ์เข้าถึงเพลงที่ยังไม่ปล่อย วิดีโอเบื้องหลัง
            อัปเดตส่วนตัว และข้อความแบบใกล้ชิด — ส่งตรงจากศิลปิน
          </>
        ),
        p3: (
          <>
            เป็นเจ้าของฐานข้อมูลแฟนของคุณเองอย่างเต็มที่ สื่อสารตรงกับผู้ชมโดยไม่ต้องผ่านคนกลาง และสร้างความภักดีให้ลึกขึ้น
          </>
        ),
        cta: 'สั่งซื้อ Control Center ของคุณตอนนี้ →'
      }
    };
  }, []);

  const text = copy[lang];


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden flex flex-col">
      <header className="relative pt-10 pb-6 flex justify-center bg-[#0a0a0a]">
        <div className="absolute right-4 top-5 flex flex-wrap items-center justify-end gap-2 md:right-6 md:top-6">
        </div>

<div className="flex flex-col items-center">
  <img
    src="/codetone-logo.webp"
    alt="codeTone Logo"
    className="h-36 md:h-40 w-auto object-contain drop-shadow-2xl"
  />
  <div className="mt-2 text-xs md:text-sm tracking-[0.18em] text-white/55">
    codeTone powered by codeNXT
  </div>
</div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center -mt-2">
        <h1 className="text-5xl sm:text-6xl md:text-[4.7rem] font-bold leading-[0.92] tracking-tighter mb-6 max-w-4xl">
          {text.titleTop}
          <br />
          <span className="text-[#00f0ff]">{text.titleAccent}</span>
        </h1>

<div className="max-w-2xl mx-auto text-base md:text-[1.15rem] text-gray-300 mb-14 leading-[1.75]">
  <p className="mb-7">{text.p1}</p>
  <p className="mb-7">{text.p2}</p>
  <p className="mb-7">{text.p3}</p>
  {text.p4 && <p className="mb-10">{text.p4}</p>}
</div>

        <Link
          to="/checkout"
          className="inline-flex items-center justify-center bg-[#00f0ff] hover:bg-[#00e0ee] transition-all text-black font-semibold text-lg md:text-xl px-10 md:px-14 py-5 rounded-3xl shadow-2xl shadow-cyan-500/40 active:scale-95"
        >
          {text.cta}
        </Link>
      </div>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState('en');

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<HomePage lang={lang} setLang={setLang} />} />
        <Route path="/checkout" element={<CheckoutPage lang={lang} setLang={setLang} />} />
        <Route path="/dashboard" element={<DashboardPage lang={lang} setLang={setLang} />} />
        <Route path="/join/:eventCode" element={<JoinPage lang={lang} setLang={setLang} />} />
        <Route path="/print/:eventCode" element={<PrintPoster />} />
        <Route path="/screen/:eventCode" element={<ScreenPlayer />} />
        <Route path="/badge-test" element={<BadgeTestPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;