// Arztpraxis Demo Data
// Terminbuchungssystem für eine Arztpraxis

export const praxisConfig = {
  id: 'zahnarztpraxis-edler-2025',
  name: 'Dr. Albrecht Edler',
  description: 'Zahn-, Mund- und Kieferheilkunde',
  location: 'Mariahilfer Straße 100, 1060 Wien',
  phone: '+43 1 234 5678',
  email: 'ordination@dr-edler.at',

  // Arzt der Klinik
  doctors: [
    {
      id: 'dr-edler',
      name: 'Dr. Albrecht Edler',
      title: 'Facharzt für Zahn-, Mund- und Kieferheilkunde',
      specialization: 'Zahn-, Mund- und Kieferheilkunde',
      image: null,
      availableDays: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'],
      color: '#3b82f6' // Blue
    }
  ],

  // Terminarten / Behandlungen
  appointmentTypes: [
    {
      id: 'bleaching',
      name: 'Bleaching',
      description: 'Professionelle Zahnaufhellung',
      duration: 60,
      price: 350,
      icon: 'sparkle',
      color: '#f59e0b'
    },
    {
      id: 'veneers',
      name: 'Veneers',
      description: 'Keramikverblendschalen für perfekte Zähne',
      duration: 60,
      price: 890,
      icon: 'smile',
      color: '#8b5cf6'
    },
    {
      id: 'kieferorthopaedie',
      name: 'Kieferorthopädie',
      description: 'Beratung & Behandlung von Zahnfehlstellungen',
      duration: 45,
      price: 150,
      icon: 'align',
      color: '#3b82f6'
    },
    {
      id: 'durchsichtige-zahnspange',
      name: 'Durchsichtige Zahnspange',
      description: 'Unsichtbare Aligner für diskrete Korrektur',
      duration: 30,
      price: 2500,
      icon: 'invisible',
      color: '#06b6d4'
    },
    {
      id: 'festsitzende-zahnspange',
      name: 'Festsitzende Zahnspange',
      description: 'Klassische Brackets für effektive Korrektur',
      duration: 45,
      price: 1800,
      icon: 'brackets',
      color: '#6366f1'
    },
    {
      id: 'zahnerhaltung',
      name: 'Zahnerhaltung',
      description: 'Füllungen, Wurzelbehandlungen & mehr',
      duration: 45,
      price: 180,
      icon: 'tooth',
      color: '#10b981'
    },
    {
      id: 'mundhygiene',
      name: 'Mundhygiene',
      description: 'Professionelle Zahnreinigung',
      duration: 45,
      price: 120,
      icon: 'clean',
      color: '#14b8a6'
    },
    {
      id: 'inlays-onlays',
      name: 'Inlays und Onlays',
      description: 'Hochwertige Einlagefüllungen',
      duration: 60,
      price: 450,
      icon: 'inlay',
      color: '#f97316'
    },
    {
      id: 'zahnersatz',
      name: 'Zahnersatz',
      description: 'Beratung & Anfertigung von Zahnersatz',
      duration: 45,
      price: 600,
      icon: 'denture',
      color: '#ec4899'
    },
    {
      id: 'zahnimplantate',
      name: 'Zahnimplantate',
      description: 'Dauerhafte Zahnwurzel-Ersatz',
      duration: 60,
      price: 1200,
      icon: 'implant',
      color: '#ef4444'
    },
    {
      id: 'zahnprothesen',
      name: 'Zahnprothesen',
      description: 'Teil- und Vollprothesen',
      duration: 45,
      price: 800,
      icon: 'prothesis',
      color: '#a855f7'
    },
    {
      id: 'kronen-bruecken',
      name: 'Zahnkronen und -brücken',
      description: 'Festsitzender Zahnersatz',
      duration: 60,
      price: 650,
      icon: 'crown',
      color: '#eab308'
    }
  ],

  // Besuchsgründe / Anliegen
  visitReasons: [
    { id: 'kontrolle', name: 'Kontrolluntersuchung', category: 'routine' },
    { id: 'zahnschmerzen', name: 'Zahnschmerzen', category: 'akut' },
    { id: 'karies', name: 'Karies / Loch im Zahn', category: 'akut' },
    { id: 'zahnfleisch', name: 'Zahnfleischprobleme', category: 'akut' },
    { id: 'aesthetik', name: 'Ästhetische Beratung', category: 'beratung' },
    { id: 'zahnspange', name: 'Zahnspangen-Beratung', category: 'beratung' },
    { id: 'implantate', name: 'Implantat-Beratung', category: 'beratung' },
    { id: 'reinigung', name: 'Professionelle Reinigung', category: 'routine' },
    { id: 'bleaching-beratung', name: 'Bleaching-Beratung', category: 'beratung' },
    { id: 'prothese', name: 'Prothesen-Anpassung', category: 'routine' },
    { id: 'notfall', name: 'Zahnärztlicher Notfall', category: 'akut' },
    { id: 'sonstiges', name: 'Sonstiges', category: 'allgemein' }
  ],

  // Versicherungsarten
  insuranceTypes: [
    {
      id: 'gesetzlich',
      name: 'Gesetzlich versichert',
      description: 'ÖGK, SVS, BVAEB, etc.',
      icon: 'shield-check'
    },
    {
      id: 'privat',
      name: 'Privat versichert',
      description: 'Private Krankenversicherung',
      icon: 'star'
    },
    {
      id: 'selbstzahler',
      name: 'Selbstzahler',
      description: 'Ohne Versicherung / Wahlarzt',
      icon: 'wallet'
    }
  ],

  // Patientenstatus
  patientStatus: [
    {
      id: 'neu',
      name: 'Erstbesuch / Neuer Patient',
      description: 'Sie waren noch nie in unserer Praxis',
      extraTime: 15 // Extra Zeit für Anamnese
    },
    {
      id: 'bestand',
      name: 'Bestandspatient',
      description: 'Sie waren bereits bei uns',
      extraTime: 0
    }
  ],

  // Dringlichkeit
  urgencyLevels: [
    {
      id: 'normal',
      name: 'Normal',
      description: 'Kein dringender Bedarf',
      color: '#10b981'
    },
    {
      id: 'bald',
      name: 'Zeitnah',
      description: 'Termin innerhalb einer Woche gewünscht',
      color: '#f59e0b'
    },
    {
      id: 'dringend',
      name: 'Dringend',
      description: 'Akute Beschwerden, baldmöglichst',
      color: '#ef4444'
    }
  ],

  // Bevorzugte Tageszeit
  preferredTime: [
    {
      id: 'egal',
      name: 'Keine Präferenz',
      description: 'Ich bin flexibel',
      icon: 'clock'
    },
    {
      id: 'morgens',
      name: 'Vormittag',
      description: '08:00 - 12:00 Uhr',
      icon: 'sunrise'
    },
    {
      id: 'nachmittags',
      name: 'Nachmittag',
      description: '14:00 - 18:00 Uhr',
      icon: 'sun'
    }
  ],

  // Terminart (nur Vor-Ort für Zahnarzt)
  consultationType: [
    {
      id: 'vor-ort',
      name: 'Vor-Ort-Termin',
      description: 'Persönlicher Besuch in der Praxis',
      icon: 'building',
      default: true
    }
  ],

  // Sprachen des Arztes
  languages: [
    { id: 'de', name: 'Deutsch', flag: '🇩🇪', doctors: ['dr-edler'] },
    { id: 'en', name: 'English', flag: '🇬🇧', doctors: ['dr-edler'] }
  ],

  // Barrierefreiheit
  accessibility: [
    {
      id: 'keine',
      name: 'Keine besonderen Anforderungen',
      icon: 'check'
    },
    {
      id: 'rollstuhl',
      name: 'Rollstuhlgerecht',
      description: 'Barrierefreier Zugang erforderlich',
      icon: 'wheelchair',
      available: true
    },
    {
      id: 'gehbehinderung',
      name: 'Gehbehinderung',
      description: 'Aufzug / ebenerdiger Zugang benötigt',
      icon: 'user',
      available: true
    },
    {
      id: 'sehbehinderung',
      name: 'Sehbehinderung',
      description: 'Unterstützung für Sehbehinderte',
      icon: 'eye-off',
      available: true
    },
    {
      id: 'hoerbehinderung',
      name: 'Hörbehinderung',
      description: 'Gebärdensprachdolmetscher / Schriftliche Kommunikation',
      icon: 'ear-off',
      available: false,
      note: 'Bitte vorher telefonisch ankündigen'
    },
    {
      id: 'begleitperson',
      name: 'Mit Begleitperson',
      description: 'Ich komme mit einer Begleitperson',
      icon: 'users'
    }
  ],

  // Verfügbare Zeitfenster
  timeSlots: {
    morning: [
      '08:00', '08:15', '08:30', '08:45',
      '09:00', '09:15', '09:30', '09:45',
      '10:00', '10:15', '10:30', '10:45',
      '11:00', '11:15', '11:30', '11:45'
    ],
    afternoon: [
      '14:00', '14:15', '14:30', '14:45',
      '15:00', '15:15', '15:30', '15:45',
      '16:00', '16:15', '16:30', '16:45',
      '17:00', '17:15', '17:30'
    ]
  },

  // Öffnungszeiten
  openingHours: {
    Montag: { open: '08:00', close: '18:00', lunch: ['12:00', '14:00'] },
    Dienstag: { open: '08:00', close: '18:00', lunch: ['12:00', '14:00'] },
    Mittwoch: { open: '08:00', close: '14:00', lunch: null },
    Donnerstag: { open: '08:00', close: '18:00', lunch: ['12:00', '14:00'] },
    Freitag: { open: '08:00', close: '14:00', lunch: null },
    Samstag: null,
    Sonntag: null
  },

  // Preise (für Privatpatienten / Selbstzahler)
  pricing: {
    ersttermin: 80,
    folgetermin: 50,
    akuttermin: 60,
    vorsorge: 150,
    impfung: 40, // plus Impfstoffkosten
    rezept: 20,
    beratung: 100
  },

  // Formular-Konfiguration
  formFields: {
    required: ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'insuranceType', 'patientStatus', 'appointmentType'],
    optional: ['insuranceNumber', 'notes', 'symptoms', 'preferredTime', 'consultationType', 'language', 'accessibility'],
    patientFields: ['gender', 'address', 'visitReason', 'urgency']
  },

  // Hinweise
  notices: {
    general: 'Bitte bringen Sie Ihre e-Card und einen Lichtbildausweis mit.',
    firstVisit: 'Als neuer Patient bitten wir Sie, 15 Minuten früher zu erscheinen.',
    cancellation: 'Bitte sagen Sie Ihren Termin mindestens 24 Stunden vorher ab.',
    emergency: 'Bei Notfällen wählen Sie bitte 144 oder begeben Sie sich in die nächste Notaufnahme.'
  }
};

export default praxisConfig;
