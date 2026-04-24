import React, { Suspense, lazy, useMemo, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const CheckoutPage = lazy(() => import('./CheckoutPage'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const JoinPage = lazy(() => import('./JoinPage'));
function HomePage({ lang, setLang }) {
  const copy = useMemo(() => {
    return {
      en: {
        titleTop: 'Get your own',
        titleAccent: 'Control Center',
        p1: (
          <>
            codeTone empowers artists to build and own their <span className="text-white font-medium">InnerCircle</span> —
            a private, direct-to-fan community where true supporters receive exclusive audio, video, photos, and text messages.
          </>
        ),
        p2: (
          <>
            For your audience: Join the InnerCircle to get instant, intimate access to unreleased tracks, behind-the-scenes videos,
            personal updates, and private conversations — all delivered straight from the artist.
          </>
        ),
        p3: (
          <>
            Take full ownership of your fan database. Speak directly to your audience without intermediaries and build deeper loyalty.
          </>
        ),
        cta: 'Order your Control Center now →'
      },
      no: {
        titleTop: 'Få ditt eget',
        titleAccent: 'Control Center',
        p1: (
          <>
            codeTone gir artister mulighet til å bygge og eie sin egen <span className="text-white font-medium">InnerCircle</span> —
            et privat, direkte fan-univers der ekte supporters får eksklusiv lyd, video, bilder og tekstmeldinger.
          </>
        ),
        p2: (
          <>
            For publikum: Bli med i InnerCircle og få umiddelbar, nær tilgang til uutgitte låter, behind-the-scenes-videoer,
            personlige oppdateringer og private meldinger — levert direkte fra artisten.
          </>
        ),
        p3: (
          <>
            Ta fullt eierskap til din egen fan-database. Snakk direkte til publikum uten mellomledd og bygg sterkere lojalitet.
          </>
        ),
        cta: 'Bestill ditt Control Center nå →'
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

        <img
          src="/codetone-logo.webp"
          alt="codeTone Logo"
          className="h-28 md:h-32 w-auto object-contain drop-shadow-2xl"
        />
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
          <p className="mb-10">{text.p3}</p>
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
      </Routes>
    </Suspense>
  );
}

export default App;