import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';
import { t } from './i18n';

const API_BASE = 'https://codenxt-backend-production.up.railway.app';

const emptyForm = {
  stackName: '',
  companyName: '',
  releaseTitle: '',
  releaseDate: '',
  releaseTime: '06:00',
  platform: '',
  customers: '',
  contactName: '',
  email: '',
  phone: '',
  comments: '',
  goldRedemptionLocation: '',
  goldRedemptionDeadline: '',
  goldRedemptionDeadlineTime: '23:59',
  silverRedemptionLocation: '',
  silverRedemptionDeadline: '',
  silverRedemptionDeadlineTime: '23:59',
  standardRedemptionLocation: '',
  standardRedemptionDeadline: '',
  standardRedemptionDeadlineTime: '23:59',
  logoFileName: '',
  stackLogo: '',
  bonusWindow: '24h',
  rewardCompany: '',
  rewardResponsible: '',
  rewardAddress1: '',
  rewardAddress2: '',
  rewardPostalCode: '',
  rewardCountry: '',
  rewardPhone: '',
  rewardEmail: '',
  goldTotal: '100',
  silverTotal: '500',
  campaignEndDate: '',
  campaignEndTime: '23:00',
  claimWindowHours: '24',
};

function generateReleaseCode() {
  return `PK-${Math.floor(10000 + Math.random() * 90000)}`;
}

export default function CheckoutPage({ lang, setLang }) {
  const navigate = useNavigate();
  const text = t(lang);
  const c = text.checkout;
  const pageTextByLang = {
    no: {
      title: 'Sett opp kampanje-informasjon',
      subtitle: 'Koble kampanje, bonus og innløsing direkte til kunden.',
      fields: {
        stackName: 'Kampanjenavn',
        logo: 'Illustrasjon',
        companyName: 'Bedrift',
        releaseTitle: 'Kampanjetype',
        platform: 'Kampanjemedium',
        releaseDate: 'Startdato',
        releaseTime: 'Kampanjens starttidspunkt',
        bonusActive: 'Kampanjen slutter',
        bonusActive24h: 'Velg sluttdato for kampanjen',
        customers: 'Forventet antall deltakere',
        contactName: 'Kontaktperson',
        email: 'E-post',
        phone: 'Telefon',
        comments: 'Hentested for innløsing av bonus',
      },
      placeholders: {
        stackName: 'Sommerbonus, VIP-kveld, åpningstilbud ...',
        companyName: 'Bedriftens navn',
        releaseTitle: 'VIP, bonus, kupong, invitasjon, lansering ...',
        platform: 'SoMe, internavis, TV, nettside, butikk, klubb, kampanje ...',
        customers: '2500',
        contactName: 'Fullt navn',
        email: 'navn@bedrift.no',
        phone: '+47 ...',
        comments: 'Beskriv fordelen, tilbudet eller belønningen kunden får.',
      },
      chooseFile: 'Velg PNG eller JPG',
      noFile: 'Ingen fil valgt',
      selectedFile: 'Valgt fil',
      termsText: 'codePerks brukes til QR- og lenkebasert tilgang, digitale fordeler, kunderespons og direkte oppfølging via codeNXT.',
      accept: 'Jeg godtar vilkårene for codePerks.',
      continue: 'OPPRETT BONUSKAMPANJE',
      creating: 'Oppretter bonuskampanje...',
      submitError: 'Kunne ikke opprette bonuskampanjen. Prøv igjen.',
      validationIncomplete: 'Kampanjeoppsettet er ikke fullført.',
      phoneFormat: 'Bruk internasjonalt format, f.eks. +4794433450',
    },
    en: {
      title: 'Set up campaign information',
      subtitle: 'Connect a customer moment, bonus and company directly to the customer.',
      fields: {
        stackName: 'Bonus / offer',
        logo: 'Illustration',
        companyName: 'Company',
        releaseTitle: 'Campaign type',
        platform: 'Campaign medium',
        releaseDate: 'Start date',
        releaseTime: 'Campaign start time',
        bonusActive: 'Campaign ends',
        bonusActive24h: 'Choose campaign end date',
        customers: 'Expected participants',
        contactName: 'Contact person',
        email: 'Email',
        phone: 'Phone',
        comments: 'Hentested for innløsing av bonus',
      },
      placeholders: {
        stackName: 'VIP bonus, reward, opening offer ...',
        companyName: 'Company name',
        releaseTitle: 'VIP, reward, coupon, invitation, launch ...',
        platform: 'Social media, internal newsletter, TV, website, store, club, campaign ...',
        customers: '2500',
        contactName: 'Full name',
        email: 'name@company.com',
        phone: '+44 ...',
        comments: 'Describe the bonus, offer or reward the customer receives.',
      },
      chooseFile: 'Choose PNG or JPG',
      noFile: 'No file chosen',
      selectedFile: 'Selected file',
      termsText: 'codePerks is used for QR and link-based access, digital bonuss, customer response and direct follow-up via codeNXT.',
      accept: 'I accept the codePerks terms.',
      continue: 'CREATE A PERK',
      creating: 'Creating bonus...',
      submitError: 'Could not create the bonus. Please try again.',
    },
    de: {
      title: 'Kundenvorteil einrichten',
      subtitle: 'Verbinden Sie einen Kundenmoment, einen Kundenvorteil und ein Unternehmen direkt mit dem Kunden.',
      fields: {
        stackName: 'Kundenvorteil',
        logo: 'Illustration',
        companyName: 'Unternehmen',
        releaseTitle: 'Art des Kundenvorteils',
        platform: 'Kampagnenmedium',
        releaseDate: 'Startdatum',
        releaseTime: 'Startzeit der Kampagne',
        bonusActive: 'Kampagne endet',
        bonusActive24h: 'Enddatum der Kampagne wählen',
        customers: 'Erwartete Teilnehmerzahl',
        contactName: 'Kontaktperson',
        email: 'E-Mail',
        phone: 'Telefon',
        comments: 'Kundenvorteil / Notizen',
      },
      placeholders: {
        stackName: 'VIP-Vorteil, Kundenclub, Eröffnungsangebot ...',
        companyName: 'Name des Unternehmens',
        releaseTitle: 'VIP, Loyalität, Gutschein, Einladung, Einführung ...',
        platform: 'Social Media, internes Magazin, TV, Website, Geschäft, Club, Kampagne ...',
        customers: '2500',
        contactName: 'Vollständiger Name',
        email: 'name@unternehmen.de',
        phone: '+49 ...',
        comments: 'Beschreiben Sie den Vorteil, das Angebot oder die Belohnung für den Kunden.',
      },
      chooseFile: 'PNG oder JPG wählen',
      noFile: 'Keine Datei gewählt',
      selectedFile: 'Gewählte Datei',
      termsText: 'codePerks wird für QR- und Link-Zugang, digitale Kundenvorteile, Kundenreaktionen und direkte Nachverfolgung über codeNXT genutzt.',
      accept: 'Ich akzeptiere die Bedingungen für codePerks.',
      continue: 'KUNDENVORTEIL ERSTELLEN',
      creating: 'Kundenvorteil wird erstellt...',
      submitError: 'Der Kundenvorteil konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
    },
    fr: {
      title: 'Configurer un avantage client',
      subtitle: 'Connectez un moment client, un avantage et une entreprise directement au client.',
      fields: {
        stackName: 'Avantage client',
        logo: 'Illustration',
        companyName: 'Entreprise',
        releaseTitle: 'Type d’avantage client',
        platform: 'Support de campagne',
        releaseDate: 'Date de début',
        releaseTime: 'Heure de début de campagne',
        bonusActive: 'Fin de campagne',
        bonusActive24h: 'Choisir la date de fin de campagne',
        customers: 'Nombre de participants attendu',
        contactName: 'Contact',
        email: 'E-mail',
        phone: 'Téléphone',
        comments: 'Hentested for innløsing av bonus',
      },
      placeholders: {
        stackName: 'Avantage VIP, club client, offre d’ouverture ...',
        companyName: 'Nom de l’entreprise',
        releaseTitle: 'VIP, fidélité, coupon, invitation, lancement ...',
        platform: 'Réseaux sociaux, journal interne, TV, site web, boutique, club, campagne ...',
        customers: '2500',
        contactName: 'Nom complet',
        email: 'nom@entreprise.fr',
        phone: '+33 ...',
        comments: 'Décrivez l’avantage, l’offre ou la récompense que le client recevra.',
      },
      chooseFile: 'Choisir PNG ou JPG',
      noFile: 'Aucun fichier choisi',
      selectedFile: 'Fichier choisi',
      termsText: 'codePerks sert à gérer l’accès par QR et lien, les avantages numériques, la réponse client et le suivi direct via codeNXT.',
      accept: 'J’accepte les conditions de codePerks.',
      continue: 'CRÉER UN AVANTAGE',
      creating: 'Création de l’avantage...',
      submitError: 'Impossible de créer l’avantage. Veuillez réessayer.',
    },
    es: {
      title: 'Configurar un beneficio para clientes',
      subtitle: 'Conecta un momento del cliente, un beneficio y una empresa directamente con el cliente.',
      fields: {
        stackName: 'Beneficio para clientes',
        logo: 'Ilustración',
        companyName: 'Empresa',
        releaseTitle: 'Tipo de beneficio',
        platform: 'Medio de campaña',
        releaseDate: 'Fecha de inicio',
        releaseTime: 'Hora de inicio de campaña',
        bonusActive: 'Beneficio activo',
        bonusActive24h: 'Elegir fecha de fin de campaña',
        customers: 'Participantes esperados',
        contactName: 'Persona de contacto',
        email: 'E-mail',
        phone: 'Teléfono',
        comments: 'Hentested for innløsing av bonus',
      },
      placeholders: {
        stackName: 'Beneficio VIP, club de clientes, oferta de apertura ...',
        companyName: 'Nombre de la empresa',
        releaseTitle: 'VIP, fidelización, cupón, invitación, lanzamiento ...',
        platform: 'Redes sociales, boletín interno, TV, web, tienda, club, campaña ...',
        customers: '2500',
        contactName: 'Nombre completo',
        email: 'nombre@empresa.es',
        phone: '+34 ...',
        comments: 'Describe el beneficio, la oferta o la recompensa que recibirá el cliente.',
      },
      chooseFile: 'Elegir PNG o JPG',
      noFile: 'Ningún archivo elegido',
      selectedFile: 'Archivo elegido',
      termsText: 'codePerks se usa para acceso por QR y enlace, beneficios digitales, respuesta de clientes y seguimiento directo vía codeNXT.',
      accept: 'Acepto las condiciones de codePerks.',
      continue: 'CREAR BENEFICIO',
      creating: 'Creando beneficio...',
      submitError: 'No se pudo crear el beneficio. Inténtalo de nuevo.',
    },
  };

  const pageText = pageTextByLang[lang] || pageTextByLang.en;

  const benefitInventoryText = {
    no: {
      title: 'Fordelsbeholdning',
      help: 'Definer begrenset antall premiumfordeler. Standardfordeler er ubegrenset.',
      gold: 'Gullfordeler',
      silver: 'Sølvfordeler',
      standard: 'Standardfordeler',
      unlimited: 'Ubegrenset',
      campaignEnds: 'Kampanjen slutter',
      distributionNote: 'Gullfordeler tildeles først. Når alle gullfordeler er brukt opp fortsetter systemet med sølv. Standardfordeler er alltid tilgjengelige.',
    },
    en: {
      title: 'Benefit Inventory',
      help: 'Define the limited premium benefit pool. Standard benefits remain unlimited.',
      gold: 'Gold Benefits',
      silver: 'Silver Benefits',
      standard: 'Standard Benefits',
      unlimited: 'Unlimited',
      distributionNote: 'Gold benefits are assigned first. When all Gold benefits have been allocated, Silver benefits are assigned. Standard benefits remain available at all times.',
    },
    de: {
      title: 'Vorteilsbestand',
      help: 'Definieren Sie die begrenzten Premiumvorteile. Standardvorteile bleiben unbegrenzt.',
      gold: 'Gold-Vorteile',
      silver: 'Silber-Vorteile',
      standard: 'Standard-Vorteile',
      unlimited: 'Unbegrenzt',
      campaignEnds: 'Kampagne endet',
      distributionNote: 'Goldvorteile werden zuerst vergeben. Danach werden Silbervorteile zugewiesen. Standardvorteile bleiben jederzeit verfügbar.',
    },
    fr: {
      title: 'Inventaire des avantages',
      help: 'Définissez le nombre limité d’avantages premium. Les avantages standard restent illimités.',
      gold: 'Avantages Or',
      silver: 'Avantages Argent',
      standard: 'Avantages Standard',
      unlimited: 'Illimité',
      campaignEnds: 'Fin de campagne',
      distributionNote: 'Les avantages Or sont attribués en premier. Ensuite les avantages Argent sont attribués. Les avantages Standard restent toujours disponibles.',
    },
    es: {
      title: 'Inventario de beneficios',
      help: 'Define el número limitado de beneficios premium. Los beneficios estándar siguen siendo ilimitados.',
      gold: 'Beneficios Oro',
      silver: 'Beneficios Plata',
      standard: 'Beneficios Estándar',
      unlimited: 'Ilimitado',
      campaignEnds: 'La campaña termina',
      distributionNote: 'Los beneficios Oro se asignan primero. Después se asignan los beneficios Plata. Los beneficios Estándar permanecen siempre disponibles.',
    },
  }[lang] || {
    title: 'Benefit Inventory',
    help: 'Define the limited premium benefit pool. Standard benefits remain unlimited.',
    gold: 'Gold Benefits',
    silver: 'Silver Benefits',
    standard: 'Standard Benefits',
    unlimited: 'Unlimited',
    distributionNote: 'Gold benefits are assigned first. When all Gold benefits have been allocated, Silver benefits are assigned. Standard benefits remain available at all times.',
  };

  const rewardDeliveryText = {
    no: {
      title: 'Informasjon for levering av fordeler',
      help: 'Denne informasjonen brukes kun til levering av fordeler, verifisering av vinnere og sertifikatregistrering.',
      company: 'Bedrift',
      responsible: 'Delivery-ansvarlig navn',
      address1: 'Adresselinje 1',
      address2: 'Adresselinje 2',
      postalCode: 'Postnummer',
      country: 'Land',
      phone: 'Telefon',
      email: 'E-post',
    },
    en: {
      title: 'Reward Delivery Information',
      help: 'This information is used solely for reward fulfillment, winner verification and certificate registration.',
      company: 'Company',
      responsible: 'Delivery Contact Name',
      address1: 'Address Line 1',
      address2: 'Address Line 2',
      postalCode: 'ZIP / Postal Code',
      country: 'Country',
      phone: 'Phone',
      email: 'Email',
    },
    de: {
      title: 'Informationen zur Vorteilszustellung',
      help: 'Diese Informationen werden nur für die Zustellung von Vorteilen, Gewinnerprüfung und Zertifikatsregistrierung verwendet.',
      company: 'Unternehmen',
      responsible: 'Verantwortliche Person',
      address1: 'Adresszeile 1',
      address2: 'Adresszeile 2',
      postalCode: 'Postleitzahl',
      country: 'Land',
      phone: 'Telefon',
      email: 'E-Mail',
    },
    fr: {
      title: 'Informations de livraison des avantages',
      help: 'Ces informations sont utilisées uniquement pour la livraison des avantages, la vérification des gagnants et l’enregistrement du certificat.',
      company: 'Entreprise',
      responsible: 'Responsable',
      address1: 'Adresse ligne 1',
      address2: 'Adresse ligne 2',
      postalCode: 'Code postal',
      country: 'Pays',
      phone: 'Téléphone',
      email: 'E-mail',
    },
    es: {
      title: 'Información de entrega de beneficios',
      help: 'Esta información se utiliza únicamente para la entrega de beneficios, verificación de ganadores y registro del certificado.',
      company: 'Empresa',
      responsible: 'Persona responsable',
      address1: 'Dirección línea 1',
      address2: 'Dirección línea 2',
      postalCode: 'Código postal',
      country: 'País',
      phone: 'Teléfono',
      email: 'Email',
    },
  }[lang] || {
    title: 'Reward Delivery Information',
    help: 'This information is used solely for reward fulfillment, winner verification and certificate registration.',
    company: 'Company',
    responsible: 'Delivery Contact Name',
    address1: 'Address Line 1',
    address2: 'Address Line 2',
    postalCode: 'ZIP / Postal Code',
    country: 'Country',
    phone: 'Phone',
    email: 'Email',
  };
  const [formData, setFormData] = useState(emptyForm);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [logoError, setLogoError] = useState('');
  const logoUrlRef = useRef('');

  useEffect(() => {
    document.title = 'Checkout - codePerks';
  }, []);

  const parseEuropeanDate = (value) => {
    const raw = String(value || '').trim();
    const match = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (!match) return null;

    const [, dd, mm, yyyy] = match;
    const day = Number(dd);
    const month = Number(mm);
    const year = Number(yyyy);

    if (year < 2026 || year > 2035) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;

    const utcDate = new Date(Date.UTC(year, month - 1, day));
    if (utcDate.getUTCFullYear() !== year) return null;
    if (utcDate.getUTCMonth() !== month - 1) return null;
    if (utcDate.getUTCDate() !== day) return null;

    return `${yyyy}-${mm}-${dd}`;
  };

  const isValidDateValue = (value) => Boolean(parseEuropeanDate(value));

  const isValidTimeValue = (value) => /^\d{2}:\d{2}$/.test(String(value || ''));

  const isValidEmailValue = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

  const isValidPhoneValue = (value) => {
    const cleaned = String(value || '').replace(/[\s()-]/g, '').trim();
    return /^\+[1-9]\d{5,14}$/.test(cleaned);
  };

  const validateCheckout = (data, acceptedTerms) => {
    const errors = {};
    const parsedDates = {};

    const requiredFields = [
      'stackName',
      'companyName',
      'releaseTitle',
      'platform',
      'releaseDate',
      'releaseTime',
      'campaignEndDate',
      'contactName',
      'email',
      'phone',
      'goldRedemptionLocation',
      'goldRedemptionDeadline',
      'goldRedemptionDeadlineTime',
      'silverRedemptionLocation',
      'silverRedemptionDeadline',
      'silverRedemptionDeadlineTime',
      'standardRedemptionLocation',
      'standardRedemptionDeadline',
      'standardRedemptionDeadlineTime',
      'goldTotal',
      'silverTotal',
      'rewardResponsible',
      'rewardEmail',
    ];

    requiredFields.forEach((field) => {
      if (!String(data[field] || '').trim()) {
        errors[field] = 'required';
      }
    });

    if (!data.stackLogo && !logoUrlRef.current) errors.stackLogo = 'required';

    const dateFields = [
      'releaseDate',
      'campaignEndDate',
      'goldRedemptionDeadline',
      'silverRedemptionDeadline',
      'standardRedemptionDeadline',
    ];

    dateFields.forEach((field) => {
      if (String(data[field] || '').trim()) {
        const parsed = parseEuropeanDate(data[field]);
        if (!parsed) {
          errors[field] = 'date';
        } else {
          parsedDates[field] = parsed;
        }
      }
    });

    const timeFields = [
      'releaseTime',
      'goldRedemptionDeadlineTime',
      'silverRedemptionDeadlineTime',
      'standardRedemptionDeadlineTime',
    ];

    timeFields.forEach((field) => {
      if (String(data[field] || '').trim() && !isValidTimeValue(data[field])) {
        errors[field] = 'time';
      }
    });

    if (String(data.email || '').trim() && !isValidEmailValue(data.email)) {
      errors.email = 'email';
    }

    if (String(data.rewardEmail || '').trim() && !isValidEmailValue(data.rewardEmail)) {
      errors.rewardEmail = 'email';
    }

    if (String(data.phone || '').trim() && !isValidPhoneValue(data.phone)) {
      errors.phone = 'phone';
    }

    if (String(data.goldTotal || '').trim() && Number(data.goldTotal) < 0) {
      errors.goldTotal = 'required';
    }

    if (String(data.silverTotal || '').trim() && Number(data.silverTotal) < 0) {
      errors.silverTotal = 'required';
    }

    if (!acceptedTerms) {
      errors.termsAccepted = 'required';
    }

    const fieldOrder = [
      ...requiredFields,
      'stackLogo',
      'termsAccepted',
    ];

    const firstInvalidField = fieldOrder.find((field) => errors[field]) || '';

    return {
      errors,
      parsedDates,
      firstInvalidField,
      isValid: Object.keys(errors).length === 0,
    };
  };

  const validationResult = useMemo(
    () => validateCheckout(formData, termsAccepted),
    [formData, termsAccepted]
  );

  const missingRequired = !validationResult.isValid;

  const canContinue = !missingRequired && termsAccepted && !submitting;

  const dateFields = new Set([
    'releaseDate',
    'campaignEndDate',
    'goldRedemptionDeadline',
    'silverRedemptionDeadline',
    'standardRedemptionDeadline',
  ]);

  const sanitizeDateInput = (value) => {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 8);

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = dateFields.has(name) ? sanitizeDateInput(value) : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    setLogoError('');

    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setLogoError('Bruk PNG eller JPG.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Logoen er for stor. Bruk helst under 2 MB.');
      return;
    }

    try {
      const tempCode = generateReleaseCode();
      const form = new FormData();
      form.append('eventCode', tempCode);
      form.append('file', file);

      const response = await fetch(`${API_BASE}/upload-reward-file`, {
        method: 'POST',
        body: form,
      });

      const data = await response.json();

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || 'Upload failed');
      }

      logoUrlRef.current = data.url;

      setFormData((prev) => ({
        ...prev,
        stackLogo: data.url,
        logoFileName: file.name,
      }));
    } catch (error) {
      console.error('LOGO UPLOAD FAILED:', error);
      setLogoError('Kunne ikke laste opp logoen.');
    }
  };

  const fieldError = (field) => triedSubmit && !String(formData[field] || '').trim();

  const invalidField = (field) => {
    if (!triedSubmit) return false;

    const value = String(formData[field] || '').trim();
    if (!value) return true;

    if (field.toLowerCase().includes('email')) return !isValidEmailValue(value);
    if (field === 'phone') return !isValidPhoneValue(value);

    if (
      field === 'releaseDate' ||
      field === 'campaignEndDate' ||
      field === 'goldRedemptionDeadline' ||
      field === 'silverRedemptionDeadline' ||
      field === 'standardRedemptionDeadline'
    ) {
      return !isValidDateValue(value);
    }

    if (
      field === 'releaseTime' ||
      field === 'goldRedemptionDeadlineTime' ||
      field === 'silverRedemptionDeadlineTime' ||
      field === 'standardRedemptionDeadlineTime'
    ) {
      return !isValidTimeValue(value);
    }

    return false;
  };

  const formatMessages = {
    no: {
      date: 'Bruk formatet DD/MM/ÅÅÅÅ, f.eks. 01/06/2026.',
      time: 'Bruk formatet TT:MM, f.eks. 18:30.',
      email: 'Skriv en gyldig e-postadresse med @.',
      phone: 'Telefonnummer må starte med landskode, f.eks. +47.',
    },
    en: {
      date: 'Use DD/MM/YYYY, for example 01/06/2026.',
      time: 'Use HH:MM, for example 18:30.',
      email: 'Enter a valid email address with @.',
      phone: 'Phone number must start with a country code, for example +47.',
    },
    de: {
      date: 'Bitte das Format TT/MM/JJJJ verwenden, z.B. 01/06/2026.',
      time: 'Bitte das Format HH:MM verwenden, z.B. 18:30.',
      email: 'Bitte eine gültige E-Mail-Adresse mit @ eingeben.',
      phone: 'Telefonnummer muss mit Landesvorwahl beginnen, z.B. +49.',
    },
    fr: {
      date: 'Utilisez le format JJ/MM/AAAA, par exemple 01/06/2026.',
      time: 'Utilisez le format HH:MM, par exemple 18:30.',
      email: 'Saisissez une adresse e-mail valide avec @.',
      phone: 'Le numéro doit commencer par un indicatif pays, par exemple +33.',
    },
    es: {
      date: 'Use el formato DD/MM/AAAA, por ejemplo 01/06/2026.',
      time: 'Use el formato HH:MM, por ejemplo 18:30.',
      email: 'Introduzca un e-mail válido con @.',
      phone: 'El teléfono debe empezar con código de país, por ejemplo +34.',
    },
  };

  const getFormatMessage = (type) => (formatMessages[lang] || formatMessages.en)[type];


  const formatError = (field, type) => {
    const value = String(formData[field] || '').trim();
    if (!value) return '';
    if (type === 'date' && !isValidDateValue(value)) return getFormatMessage('date');
    if (type === 'time' && !isValidTimeValue(value)) return getFormatMessage('time');
    if (type === 'email' && !isValidEmailValue(value)) return getFormatMessage('email');
    if (type === 'phone' && !isValidPhoneValue(value)) return getFormatMessage('phone');
    return '';
  };

  const keepFocusIfInvalid = (field, type) => (event) => {
    const value = String(event.target.value || '').trim();
    if (!value) return;

    let invalid = false;
    let message = '';

    if (type === 'date' && !isValidDateValue(value)) {
      invalid = true;
      message = getFormatMessage('date');
    }
    if (type === 'time' && !isValidTimeValue(value)) {
      invalid = true;
      message = getFormatMessage('time');
    }
    if (type === 'email' && !isValidEmailValue(value)) {
      invalid = true;
      message = getFormatMessage('email');
    }
    if (type === 'phone' && !isValidPhoneValue(value)) {
      invalid = true;
      message = getFormatMessage('phone');
    }

    if (invalid) {
      setTriedSubmit(true);
      event.target.setCustomValidity(message);
      event.target.reportValidity();
      setTimeout(() => {
        event.target.focus();
        event.target.setCustomValidity('');
      }, 50);
    } else {
      event.target.setCustomValidity('');
    }
  };

  const handleContinue = async () => {
    setTriedSubmit(true);

    const currentValidation = validateCheckout(formData, termsAccepted);

    if (!currentValidation.isValid) {
      const firstField = currentValidation.firstInvalidField;
      const errorType = currentValidation.errors[firstField];

      if (errorType === 'date') {
        setError(getFormatMessage('date'));
      } else if (errorType === 'time') {
        setError(getFormatMessage('time'));
      } else if (errorType === 'email') {
        setError(getFormatMessage('email'));
      } else if (errorType === 'phone') {
        setError(getFormatMessage('phone'));
      } else {
        setError(pageText.validationIncomplete || 'Campaign setup incomplete.');
      }

      setTimeout(() => {
        const el = document.querySelector(`[name="${firstField}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
          if (errorType && errorType !== 'required') {
            const message = getFormatMessage(errorType);
            el.setCustomValidity?.(message);
            el.reportValidity?.();
            setTimeout(() => el.setCustomValidity?.(''), 700);
          }
        }
      }, 50);

      return;
    }

    setError('');

    setSubmitting(true);
    let releaseCode = generateReleaseCode();

    try {
      const artistLogo = (formData.stackLogo || logoUrlRef.current || '').trim();
      const releaseDate = currentValidation.parsedDates.releaseDate;
      const releaseTime = formData.releaseTime || '06:00';
      const campaignEndDate = currentValidation.parsedDates.campaignEndDate;
      const campaignEndTime = formData.campaignEndTime || '23:00';
      const goldRedemptionDeadline = currentValidation.parsedDates.goldRedemptionDeadline;
      const silverRedemptionDeadline = currentValidation.parsedDates.silverRedemptionDeadline;
      const standardRedemptionDeadline = currentValidation.parsedDates.standardRedemptionDeadline;
      const claimWindowHours = Math.max(0, Number(formData.claimWindowHours || 24));

      const unlockAt = new Date(`${releaseDate}T${releaseTime}:00`);
      const endAt = new Date(`${campaignEndDate}T${campaignEndTime}:00`);

      const rewardDelivery = {
        responsiblePerson: formData.rewardResponsible.trim(),
        email: formData.rewardEmail.trim(),
      };

      const bonusDetails = {
        gold: {
          reward: '',
          redemptionLocation: formData.goldRedemptionLocation.trim(),
          redemptionDeadline: goldRedemptionDeadline,
          redemptionDeadlineTime: formData.goldRedemptionDeadlineTime,
        },
        silver: {
          reward: '',
          redemptionLocation: formData.silverRedemptionLocation.trim(),
          redemptionDeadline: silverRedemptionDeadline,
          redemptionDeadlineTime: formData.silverRedemptionDeadlineTime,
        },
        standard: {
          reward: '',
          redemptionLocation: formData.standardRedemptionLocation.trim(),
          redemptionDeadline: standardRedemptionDeadline,
          redemptionDeadlineTime: formData.standardRedemptionDeadlineTime,
        },
      };


      const benefitInventory = {
        mode: 'progressive_scarcity',
        goldTotal: Number(formData.goldTotal || 0),
        silverTotal: Number(formData.silverTotal || 0),
        standardUnlimited: true,
        campaignStart: `${releaseDate}T${releaseTime}:00`,
        campaignEnd: `${campaignEndDate}T${campaignEndTime}:00`,
        claimWindowHours,
      };

      const payload = {
        vertical: 'codeperks',
        productName: 'codePerks',
        engine: 'codeNXT',
        eventCode: releaseCode,
        code: releaseCode,
        customerName: formData.contactName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        artistName: formData.stackName.trim(),
        stackName: formData.stackName.trim(),
        companyName: formData.companyName.trim(),
        releaseTitle: formData.releaseTitle.trim(),
        venue: formData.platform.trim() || 'Customer channel',
        platform: formData.platform.trim(),
        eventDate: releaseDate,
        releaseDate,
        releaseTime,
        city: '',
        comment: formData.comments.trim(),
        redemptionLocation: formData.comments.trim(),
        bonusDetails,
        rewardDelivery,
        benefitInventory,
        logoFileName: formData.logoFileName,
        stackLogo: artistLogo,
        artistLogo,
        logoTooLarge: false,
        selectedTypes: ['codePerks release'],
        termsAccepted,
        shortLink: `${window.location.origin}/join/${releaseCode}`,
        bonusWindow: '24h',
        defaultLang: lang || 'en',
        lang: lang || 'en',
        language: lang || 'en',
        createdAt: new Date().toISOString(),
      };

      console.log('CODEPERKS_EVENT_PAYLOAD', {
        vertical: 'codeperks',
        code: releaseCode,
        benefitInventory: payload.benefitInventory,
      });

      const eventRes = await fetch(`${API_BASE}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical: 'codeperks',
          code: releaseCode,
          name: payload.stackName,
          stackName: payload.stackName,
          companyName: payload.companyName,
          releaseTitle: payload.releaseTitle,
          artistLogo: payload.artistLogo || '',
          venue: payload.platform || 'Customer channel',
          platform: payload.platform,
          city: '',
          badgeConfig: { template: 'codeperks' },
          startAt: unlockAt.toISOString(),
          releaseDate,
          releaseTime,
          unlockAt: unlockAt.toISOString(),
          endAt: endAt.toISOString(),
          maxClaims: 999999,
          benefitInventory: payload.benefitInventory,
          rewardDelivery: payload.rewardDelivery,
          redemptionLocation: payload.redemptionLocation,
          bonusDetails: payload.bonusDetails,
          defaultLang: payload.defaultLang || lang || 'en',
          lang: payload.defaultLang || lang || 'en',
          language: payload.defaultLang || lang || 'en',
          status: 'active',
        }),
      });

      const rawEventResponse = await eventRes.text();
      if (!eventRes.ok) throw new Error(rawEventResponse || `Create release failed: ${eventRes.status}`);

      const eventData = rawEventResponse ? JSON.parse(rawEventResponse) : {};
      const finalEventCode = eventData?.event?.code || eventData?.code || releaseCode;
      const dashboardAccessKey = eventData?.dashboardAccessKey || eventData?.event?.dashboardAccessKey || '';
      payload.eventCode = finalEventCode;
      payload.code = finalEventCode;
      payload.dashboardAccessKey = dashboardAccessKey;
      payload.shortLink = `${window.location.origin}/join/${finalEventCode}`;
      if (dashboardAccessKey) {
        sessionStorage.setItem('codeperks_admin_key', dashboardAccessKey);
      }

      localStorage.setItem('codenxt_event', JSON.stringify(payload));
      localStorage.setItem('codenxt_active_event_code', finalEventCode);
      localStorage.setItem('codeperks_latest_event', JSON.stringify(payload));

      navigate('/campaign-created', {
        state: { ...payload, lang },
        replace: true,
      });
    } catch (err) {
      console.error('OPPRETT EN PERK RELEASE FAILED:', err);
      setError(pageText.submitError);
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell checkout-page">
      <header className="landing-header">
        <img src="/codePerks-logo.png?v=3" alt="codePerks logo" className="landing-logo" />
        <div className="landing-powered">{text.common.powered}</div>
        <LanguageSwitcher lang={lang} onChange={setLang} />
      </header>

      <section className="page-intro checkout-intro">
        <h1>{pageText.title}</h1>
        <p>{pageText.subtitle}</p>
      </section>

      <section className="panel checkout-card">
        <div className="input-grid checkout-grid">
          <label>
            <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>1</span>{pageText.fields.stackName} *</span>
            <input name="stackName" value={formData.stackName} onChange={handleChange} placeholder={pageText.placeholders.stackName} />
            {fieldError('stackName') && <small>{text.common.required}</small>}
          </label>

          <label>
            <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>2</span>Logo (PNG/JPG) *</span>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleLogoUpload}
            />
            {formData.logoFileName && <small>{formData.logoFileName}</small>}
            {logoError && <small>{logoError}</small>}
            {triedSubmit && !formData.stackLogo && <small>{text.common.required}</small>}
          </label>
          <label>
            <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>3</span>{pageText.fields.companyName} *</span>
            <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder={pageText.placeholders.companyName} />
            {fieldError('companyName') && <small>{text.common.required}</small>}
          </label>
          <label>
            <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>4</span>{pageText.fields.releaseTitle} *</span>
            <input name="releaseTitle" value={formData.releaseTitle} onChange={handleChange} placeholder={pageText.placeholders.releaseTitle} />
            {fieldError('releaseTitle') && <small>{text.common.required}</small>}
          </label>
          <label>
            <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>5</span>{pageText.fields.platform} *</span>
            <input name="platform" value={formData.platform} onChange={handleChange} placeholder={pageText.placeholders.platform} />
            {fieldError('platform') && <small>{text.common.required}</small>}
          </label>
          <label>
            <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>6</span>{pageText.fields.releaseDate} *</span>
            <input type="text" inputMode="numeric" placeholder="01/06/2026" name="releaseDate" value={formData.releaseDate} onChange={handleChange} />
            {fieldError('releaseDate') && <small>{text.common.required}</small>}
          </label>

          <label>
            <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>7</span>{pageText.fields.releaseTime} *</span>
            <input type="time" name="releaseTime" value={formData.releaseTime} onChange={handleChange} onBlur={keepFocusIfInvalid('releaseTime', 'time')} />
            {formatError('releaseTime', 'time') && <small>{formatError('releaseTime', 'time')}</small>}
            {fieldError('releaseTime') && <small>{text.common.required}</small>}
          </label>

          <label>
            <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>8</span>{pageText.fields.bonusActive} *</span>
            <input
              type="text" inputMode="numeric" placeholder="01/06/2026"
              name="campaignEndDate"
              value={formData.campaignEndDate}
              onChange={handleChange}
            />
            {fieldError('campaignEndDate') && <small>{text.common.required}</small>}
          </label>
          
          <label>
            <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>9</span>{pageText.fields.contactName} *</span>
            <input name="contactName" value={formData.contactName} onChange={handleChange} placeholder={pageText.placeholders.contactName} />
            {fieldError('contactName') && <small>{text.common.required}</small>}
          </label>
          <label>
            <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>10</span>{pageText.fields.email} *</span>
            <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={keepFocusIfInvalid('email', 'email')} placeholder={pageText.placeholders.email} />
            {formatError('email', 'email') && <small>{formatError('email', 'email')}</small>}
            {fieldError('email') && <small>{text.common.required}</small>}
          </label>
          <label>
            <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>11</span>{pageText.fields.phone} *</span>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={keepFocusIfInvalid('phone', 'phone')} placeholder={pageText.placeholders.phone} />
            {formatError('phone', 'phone') && <small>{formatError('phone', 'phone')}</small>}
            {fieldError('phone') && <small>{text.common.required}</small>}
          </label>
          <label className="wide">
            <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>12</span>Ekstra notat</span>
            <textarea name="comments" value={formData.comments} onChange={handleChange} placeholder={pageText.placeholders.comments} />
            
          </label>
        </div>

          <div className="terms-box bonus-details-box" style={{ marginTop: "28px" }}>
            <h3 style={{marginBottom:'8px'}}>Hentested per kategori</h3>
            <p style={{marginBottom:'18px',opacity:.8}}>
              Oppgi hvor hver kategori innløses. Bonusinnholdet legges inn senere i Dashboard. Instruksjon settes automatisk: Vis tilsendt QR-kode.
            </p>

            <div className="input-grid checkout-grid">
              <label>
                <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>13</span>{{ no: 'GULL-hentested', en: 'GOLD pickup location', de: 'GOLD Abholort', fr: 'Lieu de retrait OR', es: 'Lugar de recogida ORO' }[lang] || 'GOLD pickup location'} *</span>
                <input name="goldRedemptionLocation" value={formData.goldRedemptionLocation} onChange={handleChange} placeholder="Backstage-inngang" />
                {fieldError('goldRedemptionLocation') && <small>{text.common.required}</small>}
                <span className="field-label" style={{ marginTop: "12px" }}>Gyldig til *</span>
                <input type="text" inputMode="numeric" placeholder="01/06/2026" name="goldRedemptionDeadline" value={formData.goldRedemptionDeadline} onChange={handleChange} />
                {formatError('goldRedemptionDeadline', 'date') && <small>{formatError('goldRedemptionDeadline', 'date')}</small>}
                {fieldError('goldRedemptionDeadline') && <small>{text.common.required}</small>}
                <span className="field-label" style={{ marginTop: "12px" }}>Innen kl. *</span>
                <input type="time" name="goldRedemptionDeadlineTime" value={formData.goldRedemptionDeadlineTime} onChange={handleChange} onBlur={keepFocusIfInvalid('goldRedemptionDeadlineTime', 'time')} />
                {formatError('goldRedemptionDeadlineTime', 'time') && <small>{formatError('goldRedemptionDeadlineTime', 'time')}</small>}
                {fieldError('goldRedemptionDeadlineTime') && <small>{text.common.required}</small>}
              </label>

              <label>
                <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>14</span>{{ no: 'SØLV-hentested', en: 'SILVER pickup location', de: 'SILBER Abholort', fr: 'Lieu de retrait ARGENT', es: 'Lugar de recogida PLATA' }[lang] || 'SILVER pickup location'} *</span>
                <input name="silverRedemptionLocation" value={formData.silverRedemptionLocation} onChange={handleChange} placeholder="Spa-avdelingen" />
                {fieldError('silverRedemptionLocation') && <small>{text.common.required}</small>}
                <span className="field-label" style={{ marginTop: "12px" }}>Gyldig til *</span>
                <input type="text" inputMode="numeric" placeholder="01/06/2026" name="silverRedemptionDeadline" value={formData.silverRedemptionDeadline} onChange={handleChange} />
                {formatError('silverRedemptionDeadline', 'date') && <small>{formatError('silverRedemptionDeadline', 'date')}</small>}
                {fieldError('silverRedemptionDeadline') && <small>{text.common.required}</small>}
                <span className="field-label" style={{ marginTop: "12px" }}>Innen kl. *</span>
                <input type="time" name="silverRedemptionDeadlineTime" value={formData.silverRedemptionDeadlineTime} onChange={handleChange} onBlur={keepFocusIfInvalid('silverRedemptionDeadlineTime', 'time')} />
                {formatError('silverRedemptionDeadlineTime', 'time') && <small>{formatError('silverRedemptionDeadlineTime', 'time')}</small>}
                {fieldError('silverRedemptionDeadlineTime') && <small>{text.common.required}</small>}
              </label>

              <label>
                <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>15</span>{{ no: 'GENERELL-hentested', en: 'GENERAL pickup location', de: 'STANDARD Abholort', fr: 'Lieu de retrait GÉNÉRAL', es: 'Lugar de recogida GENERAL' }[lang] || 'GENERAL pickup location'} *</span>
                <input name="standardRedemptionLocation" value={formData.standardRedemptionLocation} onChange={handleChange} placeholder="Merchandise-stand" />
                {fieldError('standardRedemptionLocation') && <small>{text.common.required}</small>}
                <span className="field-label" style={{ marginTop: "12px" }}>Gyldig til *</span>
                <input type="text" inputMode="numeric" placeholder="01/06/2026" name="standardRedemptionDeadline" value={formData.standardRedemptionDeadline} onChange={handleChange} />
                {formatError('standardRedemptionDeadline', 'date') && <small>{formatError('standardRedemptionDeadline', 'date')}</small>}
                {fieldError('standardRedemptionDeadline') && <small>{text.common.required}</small>}
                <span className="field-label" style={{ marginTop: "12px" }}>Innen kl. *</span>
                <input type="time" name="standardRedemptionDeadlineTime" value={formData.standardRedemptionDeadlineTime} onChange={handleChange} onBlur={keepFocusIfInvalid('standardRedemptionDeadlineTime', 'time')} />
                {formatError('standardRedemptionDeadlineTime', 'time') && <small>{formatError('standardRedemptionDeadlineTime', 'time')}</small>}
                {fieldError('standardRedemptionDeadlineTime') && <small>{text.common.required}</small>}
              </label>
            </div>
          </div>

          <div className="terms-box benefit-inventory-box" style={{ marginTop: "28px" }}>
            <h3 style={{marginBottom:'8px'}}>{benefitInventoryText.title}</h3>
            <p style={{marginBottom:'18px',opacity:.8}}>
              {benefitInventoryText.help}
            </p>

            <div className="input-grid checkout-grid">
              <label>
                <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>16</span>{benefitInventoryText.gold} *</span>
                <input
                  name="goldTotal"
                  value={formData.goldTotal}
                  onChange={handleChange}
                  placeholder="100"
                  inputMode="numeric"
                />
                {fieldError('goldTotal') && <small>{text.common.required}</small>}
              </label>

              <label>
                <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>17</span>{benefitInventoryText.silver} *</span>
                <input
                  name="silverTotal"
                  value={formData.silverTotal}
                  onChange={handleChange}
                  placeholder="500"
                  inputMode="numeric"
                />
                {fieldError('silverTotal') && <small>{text.common.required}</small>}
              </label>

              <label>
                <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>18</span>{benefitInventoryText.standard}</span>
                <input value={benefitInventoryText.unlimited} readOnly />
              </label>

              <p
                style={{
                  gridColumn: '1 / -1',
                  margin: '8px 0 0',
                  fontSize: '12px',
                  lineHeight: '1.45',
                  opacity: 0.75
                }}
              >
                {benefitInventoryText.distributionNote}
              </p>
            </div>
          </div>

          <div className="terms-box reward-delivery-box" style={{ marginTop: "28px" }}>
            <h3 style={{marginBottom:'8px'}}>{rewardDeliveryText.title}</h3>
            <p style={{marginBottom:'18px',opacity:.8}}>
              {rewardDeliveryText.help}
            </p>

            <div className="input-grid checkout-grid">

              <label>
                <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>19</span>{rewardDeliveryText.responsible} *</span>
                <input name="rewardResponsible" value={formData.rewardResponsible} onChange={handleChange} placeholder={rewardDeliveryText.responsible} />
                {fieldError('rewardResponsible') && <small>{text.common.required}</small>}
              </label>

              <label>
                <span className="field-label"><span className="field-badge" style={{ color: "#000", WebkitTextFillColor: "#000", background: "#d9d9d9" }}>20</span>{rewardDeliveryText.email} *</span>
                <input type="email" name="rewardEmail" value={formData.rewardEmail} onChange={handleChange} placeholder={rewardDeliveryText.email} />
                {fieldError('rewardEmail') && <small>{text.common.required}</small>}
              </label>

            </div>
          </div>


        <div className="terms-box checkout-terms">
          <p style={{ marginBottom: "14px", lineHeight: 1.55, opacity: 0.92 }}>
            {{
              no: 'Kontroller at all informasjon er korrekt før du oppretter kampanjen. Opplysninger om dato, klokkeslett, kontaktinformasjon, innløsning og hentesteder styrer sertifikat, QR-koder, e-post og behandling av kampanjedeltakere.',
              en: 'Please verify that all information is correct before creating the campaign. Dates, times, contact information, redemption details and pickup locations control certificates, QR codes, email delivery and participant handling.',
              de: 'Bitte überprüfen Sie alle Angaben sorgfältig, bevor Sie die Kampagne erstellen. Datum, Uhrzeit, Kontaktinformationen und Einlösedetails steuern Zertifikate, QR-Codes, E-Mail-Zustellung und die Behandlung der Teilnehmer.',
              fr: 'Veuillez vérifier attentivement toutes les informations avant de créer la campagne. Les dates, horaires, coordonnées et informations de retrait contrôlent les certificats, QR codes, e-mails et le traitement des participants.',
              es: 'Verifique cuidadosamente toda la información antes de crear la campaña. Las fechas, horarios, datos de contacto y detalles de entrega controlan certificados, códigos QR, correos electrónicos y la gestión de participantes.'
            }[lang] || 'Please verify that all information is correct before creating the campaign.'}
          </p>

          <p>{pageText.termsText}</p>
          <label className="check-row">
            <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} />
            <span>
              {{
                no: 'Jeg godtar ',
                en: 'I accept the ',
                de: 'Ich akzeptiere die ',
                fr: "J’accepte les ",
                es: 'Acepto las ',
              }[lang] || 'I accept the '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#f5d27a',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 600,
                }}
              >
                {{
                  no: 'vilkårene for codePerks',
                  en: 'codePerks terms',
                  de: 'Bedingungen für codePerks',
                  fr: 'conditions de codePerks',
                  es: 'condiciones de codePerks',
                }[lang] || 'codePerks terms'}
              </button>
            </span>
          </label>
          {triedSubmit && !termsAccepted && <small>{text.common.required}</small>}
        </div>

        {(error || triedSubmit && missingRequired) && (
          <div className="error-box">
            {error || pageText.validationIncomplete}
          </div>
        )}

        <p className="checkout-required-note">
          {{
            no: 'Alle felt må fylles ut før du kan fortsette.',
            en: 'All fields must be completed before you can continue.',
            de: 'Alle Felder müssen ausgefüllt werden, bevor du fortfahren kannst.',
            fr: 'Tous les champs doivent être remplis avant de continuer.',
            es: 'Todos los campos deben completarse antes de continuar.',
          }[lang] || 'All fields must be completed before you can continue.'}
        </p>

        <button type="button" className="primary-cta checkout-submit" disabled={submitting} onClick={handleContinue}>
          {submitting ? pageText.creating : pageText.continue}
        </button>
      </section>

      {showTermsModal && (
        <div
          onClick={() => setShowTermsModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '720px',
              maxHeight: '80vh',
              overflowY: 'auto',
              background: '#111',
              border: '1px solid rgba(245,210,122,.3)',
              borderRadius: '22px',
              padding: '28px',
              color: '#f5f5f5',
              lineHeight: 1.65,
              boxShadow: '0 30px 90px rgba(0,0,0,.45)',
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {{
                no: 'Vilkår for codePerks',
                en: 'codePerks Terms',
                de: 'codePerks Bedingungen',
                fr: 'Conditions codePerks',
                es: 'Condiciones de codePerks',
              }[lang] || 'codePerks Terms'}
            </h2>

            <p>
              {{
                no: 'codePerks brukes til QR- og lenkebasert tilgang, digitale fordeler, sertifikater, e-postutsendelser og innløsning av kampanjefordeler.',
                en: 'codePerks is used for QR and link-based access, digital rewards, certificates, email delivery and redemption handling.',
                de: 'codePerks wird für QR- und Link-Zugang, digitale Vorteile, Zertifikate, E-Mail-Zustellung und Einlösung verwendet.',
                fr: 'codePerks est utilisé pour les accès QR et lien, les avantages numériques, les certificats, les e-mails et la validation.',
                es: 'codePerks se utiliza para acceso mediante QR y enlaces, beneficios digitales, certificados, correos electrónicos y validación.',
              }[lang]}
            </p>

            <p>
              {{
                no: 'Arrangør eller kampanjeansvarlig er ansvarlig for at all informasjon som registreres er korrekt, inkludert datoer, hentesteder, kontaktinformasjon og innløsningsregler.',
                en: 'The organizer or campaign operator is responsible for ensuring all registered information is correct, including dates, pickup locations, contact details and redemption rules.',
                de: 'Der Veranstalter oder Kampagnenverantwortliche ist für die Richtigkeit aller Angaben verantwortlich.',
                fr: 'L’organisateur ou responsable de campagne est responsable de l’exactitude des informations enregistrées.',
                es: 'El organizador o responsable de campaña es responsable de que toda la información registrada sea correcta.',
              }[lang]}
            </p>

            <div style={{ marginTop: '26px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="primary-cta"
                onClick={() => setShowTermsModal(false)}
              >
                {{
                  no: 'Lukk',
                  en: 'Close',
                  de: 'Schließen',
                  fr: 'Fermer',
                  es: 'Cerrar',
                }[lang] || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

          <style>{`

        .field-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          line-height: 1.2;
          color: inherit;
        }

        .checkout-card .field-label .field-badge,
        .checkout-card .field-label .field-badge,
        .field-badge {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 22px !important;
          height: 22px !important;
          min-width: 22px !important;
          border-radius: 999px !important;
          background: #d9d9d9 !important;
          color: #000000 !important;
          fill: #000000 !important;
          font-size: 12px !important;
          font-weight: 900 !important;
          line-height: 1 !important;
          letter-spacing: 0 !important;
          text-shadow: none !important;
          -webkit-text-fill-color: #000000 !important;
          box-shadow: 0 1px 2px rgba(0,0,0,.35) !important;
        }

        .checkout-required-note {
          margin: 18px 0 10px;
          color: rgba(255,255,255,0.68);
          font-size: 13px;
          line-height: 1.45;
          text-align: center;
        }
      `}</style>
    </main>
  );
}
