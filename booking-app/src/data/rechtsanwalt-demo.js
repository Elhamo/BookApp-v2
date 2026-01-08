// Rechtsanwalt Buchungssystem
// Mag. Dr. Sebastian Siudak

export const rechtsanwaltConfig = {
  id: 'rechtsanwalt-siudak-2025',
  name: 'Mag. Dr. Sebastian Siudak',
  description: 'Rechtsanwalt',
  professionalTitle: 'Anwalt',
  professionalTitleLong: 'Ihr Anwalt',
  phone: '+43 1 234 5678',
  email: 'kanzlei@ra-siudak.at',

  // Standorte
  locations: [
    {
      id: 'wien',
      name: 'Wien',
      address: 'Musterstraße 1, 1010 Wien',
      phone: '+43 1 234 5678'
    },
    {
      id: 'linz',
      name: 'Linz',
      address: 'Hauptplatz 10, 4020 Linz',
      phone: '+43 732 123 456'
    }
  ],

  // Anwalt
  doctors: [
    {
      id: 'ra-siudak',
      name: 'Mag. Dr. Sebastian Siudak',
      title: 'Rechtsanwalt',
      specialization: 'Allgemeines Zivilrecht, Vertragsrecht, Unternehmensrecht',
      image: null,
      availableDays: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'],
      color: '#1e40af'
    }
  ],

  // Beratungsarten / Leistungen
  appointmentTypes: [
    {
      id: 'erstberatung-online',
      name: 'Erstberatung Online',
      description: 'Erste rechtliche Einschätzung per Videocall',
      duration: 30,
      price: 120,
      icon: 'video',
      color: '#c5c3c0',
      isOnline: true
    },
    {
      id: 'erstberatung-persoenlich',
      name: 'Erstberatung Persönlich',
      description: 'Erste rechtliche Einschätzung vor Ort',
      duration: 45,
      price: 150,
      icon: 'building',
      color: '#9a9895',
      isOnline: false
    },
    {
      id: 'vertragsrecht',
      name: 'Vertragsrecht',
      description: 'Vertragsprüfung und -erstellung',
      duration: 60,
      price: 250,
      icon: 'file-text',
      color: '#8a8885'
    },
    {
      id: 'arbeitsrecht',
      name: 'Arbeitsrecht',
      description: 'Beratung zu arbeitsrechtlichen Fragen',
      duration: 60,
      price: 220,
      icon: 'briefcase',
      color: '#6b6966'
    },
    {
      id: 'familienrecht',
      name: 'Familienrecht',
      description: 'Scheidung, Unterhalt, Sorgerecht',
      duration: 60,
      price: 200,
      icon: 'users',
      color: '#b5b3b0'
    },
    {
      id: 'mietrecht',
      name: 'Mietrecht',
      description: 'Mietverträge, Kündigungen, Streitigkeiten',
      duration: 45,
      price: 180,
      icon: 'home',
      color: '#a5a3a0'
    },
    {
      id: 'unternehmensrecht',
      name: 'Unternehmensrecht',
      description: 'Gründung, Gesellschaftsrecht, Compliance',
      duration: 60,
      price: 280,
      icon: 'building-2',
      color: '#7a7875'
    },
    {
      id: 'erbrecht',
      name: 'Erbrecht',
      description: 'Testament, Erbschaft, Pflichtteil',
      duration: 60,
      price: 200,
      icon: 'scroll',
      color: '#95938f'
    },
    {
      id: 'strafrecht',
      name: 'Strafrecht',
      description: 'Verteidigung und Beratung in Strafsachen',
      duration: 60,
      price: 300,
      icon: 'shield',
      color: '#5a5855'
    },
    {
      id: 'verkehrsrecht',
      name: 'Verkehrsrecht',
      description: 'Unfälle, Führerschein, Bußgelder',
      duration: 45,
      price: 180,
      icon: 'car',
      color: '#858380'
    }
  ],

  // Anliegen / Grund des Besuchs
  visitReasons: [
    { id: 'erstberatung', name: 'Erstberatung / Neue Angelegenheit', category: 'neu' },
    { id: 'laufend', name: 'Laufendes Mandat', category: 'bestand' },
    { id: 'dokument', name: 'Dokumentenprüfung', category: 'service' },
    { id: 'vertrag', name: 'Vertragserstellung', category: 'service' },
    { id: 'klage', name: 'Klage / Rechtsstreit', category: 'dringend' },
    { id: 'frist', name: 'Fristwahrung', category: 'dringend' },
    { id: 'sonstiges', name: 'Sonstiges', category: 'allgemein' }
  ],

  // Terminart (Online oder Vor-Ort)
  consultationType: [
    {
      id: 'online',
      name: 'Online-Termin',
      description: 'Videokonferenz (Zoom/Teams)',
      icon: 'video',
      default: false
    },
    {
      id: 'wien',
      name: 'Kanzlei Wien',
      description: 'Persönlicher Termin in Wien',
      icon: 'building',
      default: true
    },
    {
      id: 'linz',
      name: 'Kanzlei Linz',
      description: 'Persönlicher Termin in Linz',
      icon: 'building',
      default: false
    }
  ],

  // Mandantenstatus
  patientStatus: [
    {
      id: 'neu',
      name: 'Neuer Mandant',
      description: 'Erstes Mandat bei uns',
      extraTime: 15
    },
    {
      id: 'bestand',
      name: 'Bestandsmandant',
      description: 'Sie waren bereits Mandant bei uns',
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
      description: 'Fristgebunden oder eilig',
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
      description: '09:00 - 12:00 Uhr',
      icon: 'sunrise'
    },
    {
      id: 'nachmittags',
      name: 'Nachmittag',
      description: '14:00 - 18:00 Uhr',
      icon: 'sun'
    }
  ],

  // Sprachen
  languages: [
    { id: 'de', name: 'Deutsch', flag: '', doctors: ['ra-siudak'] },
    { id: 'en', name: 'English', flag: '', doctors: ['ra-siudak'] }
  ],

  // Abrechnungsarten (anstatt Versicherung)
  insuranceTypes: [
    {
      id: 'privat',
      name: 'Privatrechnung',
      description: 'Rechnung nach Leistung',
      icon: 'file-text'
    },
    {
      id: 'rechtsschutz',
      name: 'Rechtsschutzversicherung',
      description: 'Abrechnung über Ihre Versicherung',
      icon: 'shield-check'
    }
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
    }
  ],

  // Verfügbare Zeitfenster
  timeSlots: {
    morning: [
      '09:00', '09:30',
      '10:00', '10:30',
      '11:00', '11:30'
    ],
    afternoon: [
      '14:00', '14:30',
      '15:00', '15:30',
      '16:00', '16:30',
      '17:00', '17:30'
    ]
  },

  // Öffnungszeiten
  openingHours: {
    Montag: { open: '09:00', close: '18:00', lunch: ['12:00', '14:00'] },
    Dienstag: { open: '09:00', close: '18:00', lunch: ['12:00', '14:00'] },
    Mittwoch: { open: '09:00', close: '18:00', lunch: ['12:00', '14:00'] },
    Donnerstag: { open: '09:00', close: '18:00', lunch: ['12:00', '14:00'] },
    Freitag: { open: '09:00', close: '14:00', lunch: null },
    Samstag: null,
    Sonntag: null
  },

  // Formular-Konfiguration
  formFields: {
    required: ['firstName', 'lastName', 'email', 'phone', 'appointmentType', 'consultationType'],
    optional: ['notes', 'preferredTime', 'language'],
    patientFields: ['visitReason', 'urgency']
  },

  // Hinweise
  notices: {
    general: 'Bitte bringen Sie alle relevanten Unterlagen zum Termin mit.',
    firstVisit: 'Als neuer Mandant bitten wir Sie, 10 Minuten früher zu erscheinen.',
    cancellation: 'Bitte sagen Sie Ihren Termin mindestens 24 Stunden vorher ab.',
    emergency: 'Bei dringenden Rechtsfragen außerhalb der Bürozeiten kontaktieren Sie uns per E-Mail.',
    payment: 'Die Erstberatung ist vorab zu bezahlen. Bei Mandatserteilung wird sie auf das Honorar angerechnet.'
  }
};

export default rechtsanwaltConfig;
