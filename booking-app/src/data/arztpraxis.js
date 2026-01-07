// Arztpraxis Demo Data
// Terminbuchungssystem für eine Arztpraxis

export const praxisConfig = {
  id: 'arztpraxis-wien-2025',
  name: 'Praxis Dr. Weber & Partner',
  description: 'Allgemeinmedizin & Innere Medizin',
  location: 'Mariahilfer Straße 100, 1060 Wien',
  phone: '+43 1 234 5678',
  email: 'ordination@praxis-weber.at',

  // Ärzte in der Praxis
  doctors: [
    {
      id: 'dr-weber',
      name: 'Dr. Maria Weber',
      title: 'Fachärztin für Allgemeinmedizin',
      specialization: 'Allgemeinmedizin',
      image: null,
      availableDays: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'],
      color: '#f97316' // Orange
    },
    {
      id: 'dr-mueller',
      name: 'Dr. Thomas Müller',
      title: 'Facharzt für Innere Medizin',
      specialization: 'Innere Medizin',
      image: null,
      availableDays: ['Montag', 'Mittwoch', 'Freitag'],
      color: '#3b82f6' // Blue
    },
    {
      id: 'dr-schmidt',
      name: 'Dr. Anna Schmidt',
      title: 'Fachärztin für Allgemeinmedizin',
      specialization: 'Allgemeinmedizin, Kindermedizin',
      image: null,
      availableDays: ['Dienstag', 'Donnerstag', 'Freitag'],
      color: '#10b981' // Green
    }
  ],

  // Terminarten
  appointmentTypes: [
    {
      id: 'ersttermin',
      name: 'Ersttermin',
      description: 'Erstmaliger Besuch in unserer Praxis',
      duration: 30,
      icon: 'user-plus',
      color: '#8b5cf6'
    },
    {
      id: 'folgetermin',
      name: 'Folgetermin',
      description: 'Nachuntersuchung oder Befundbesprechung',
      duration: 15,
      icon: 'refresh',
      color: '#3b82f6'
    },
    {
      id: 'akuttermin',
      name: 'Akuttermin',
      description: 'Dringende medizinische Angelegenheit',
      duration: 20,
      icon: 'alert-circle',
      color: '#ef4444',
      urgent: true
    },
    {
      id: 'vorsorge',
      name: 'Vorsorgeuntersuchung',
      description: 'Jährliche Gesundenuntersuchung',
      duration: 45,
      icon: 'heart',
      color: '#10b981'
    },
    {
      id: 'impfung',
      name: 'Impfung',
      description: 'Schutzimpfung oder Auffrischung',
      duration: 15,
      icon: 'shield',
      color: '#f59e0b'
    },
    {
      id: 'rezept',
      name: 'Rezept / Überweisung',
      description: 'Rezeptausstellung oder Überweisung',
      duration: 10,
      icon: 'file-text',
      color: '#6b7280'
    },
    {
      id: 'beratung',
      name: 'Beratungsgespräch',
      description: 'Ausführliches Gespräch zu Gesundheitsfragen',
      duration: 30,
      icon: 'message-circle',
      color: '#ec4899'
    }
  ],

  // Besuchsgründe / Anliegen
  visitReasons: [
    { id: 'kontrolle', name: 'Kontrolluntersuchung', category: 'routine' },
    { id: 'schmerzen', name: 'Schmerzen', category: 'akut' },
    { id: 'erkaeltung', name: 'Erkältung / Grippe', category: 'akut' },
    { id: 'hautprobleme', name: 'Hautprobleme', category: 'allgemein' },
    { id: 'blutdruck', name: 'Blutdruckkontrolle', category: 'routine' },
    { id: 'blutzucker', name: 'Blutzuckerkontrolle', category: 'routine' },
    { id: 'labor', name: 'Laboruntersuchung / Blutabnahme', category: 'routine' },
    { id: 'krankschreibung', name: 'Krankschreibung', category: 'administrativ' },
    { id: 'attest', name: 'Ärztliches Attest', category: 'administrativ' },
    { id: 'impfberatung', name: 'Impfberatung', category: 'beratung' },
    { id: 'reisemedizin', name: 'Reisemedizinische Beratung', category: 'beratung' },
    { id: 'ernaehrung', name: 'Ernährungsberatung', category: 'beratung' },
    { id: 'psychisch', name: 'Psychische Belastung / Stress', category: 'beratung' },
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

  // Terminart (Vor-Ort oder Video)
  consultationType: [
    {
      id: 'vor-ort',
      name: 'Vor-Ort-Termin',
      description: 'Persönlicher Besuch in der Praxis',
      icon: 'building',
      default: true
    },
    {
      id: 'video',
      name: 'Video-Sprechstunde',
      description: 'Online-Termin per Videokonferenz',
      icon: 'video',
      note: 'Nicht für alle Anliegen verfügbar'
    },
    {
      id: 'telefon',
      name: 'Telefontermin',
      description: 'Telefonische Beratung',
      icon: 'phone',
      note: 'Nur für Befundbesprechungen und Rezepte'
    }
  ],

  // Sprachen der Ärzte
  languages: [
    { id: 'de', name: 'Deutsch', flag: '🇩🇪', doctors: ['dr-weber', 'dr-mueller', 'dr-schmidt'] },
    { id: 'en', name: 'English', flag: '🇬🇧', doctors: ['dr-weber', 'dr-schmidt'] },
    { id: 'tr', name: 'Türkçe', flag: '🇹🇷', doctors: ['dr-mueller'] },
    { id: 'sr', name: 'Srpski', flag: '🇷🇸', doctors: ['dr-schmidt'] },
    { id: 'ar', name: 'العربية', flag: '🇸🇦', doctors: ['dr-weber'] }
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
