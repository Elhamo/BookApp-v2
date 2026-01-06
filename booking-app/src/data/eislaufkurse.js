// Eislaufkurse Demo Data
// This file can be easily duplicated and modified for different courses

export const courseConfig = {
  id: 'eislaufkurse-winter-2025',
  name: 'Eislaufkurse Winter 2025',
  description: 'Eislaufkurse für Anfänger und Fortgeschrittene',
  location: 'Eishalle',

  // Course sessions
  sessions: [
    {
      id: 'fri-1515',
      day: 'Freitag',
      time: '15:15-16:00',
      duration: 45,
      title: 'Eislaufkurs',
      description: 'Eislaufkurs für Personen ab 5 Jahren',
      minAge: 5,
      type: 'regular',
      maxParticipants: 15,
      spotsLeft: 8
    },
    {
      id: 'fri-1615',
      day: 'Freitag',
      time: '16:15-17:00',
      duration: 45,
      title: 'Eislaufkurs',
      description: 'Eislaufkurs für Personen ab 5 Jahren',
      minAge: 5,
      type: 'regular',
      maxParticipants: 15,
      spotsLeft: 12
    },
    {
      id: 'sat-0910',
      day: 'Samstag',
      time: '09:10-10:00',
      duration: 50,
      title: 'Eltern-Kind-Eislaufen',
      description: 'Eltern-Kind-Eislaufen mit Trainerunterstützung (ab 3 Jahren)',
      note: 'In dieser Einheit können Eltern ihren Kindern eigenmächtig das Eislaufen beibringen. Für allfällige Fragen oder Hilfestellungen steht eine Eislauf-Trainerin zur Seite. Anmeldung nur von 1 Elternteil erforderlich.',
      minAge: 3,
      maxAge: 10,
      type: 'parent-child',
      maxParticipants: 20,
      spotsLeft: 15
    },
    {
      id: 'sat-1015',
      day: 'Samstag',
      time: '10:15-11:00',
      duration: 45,
      title: 'Eislaufkurs',
      description: 'Eislaufkurs für Personen ab 5 Jahren',
      minAge: 5,
      type: 'regular',
      maxParticipants: 15,
      spotsLeft: 5
    },
    {
      id: 'sat-1115',
      day: 'Samstag',
      time: '11:15-12:00',
      duration: 45,
      title: 'Eislaufkurs',
      description: 'Eislaufkurs für Personen ab 5 Jahren',
      minAge: 5,
      type: 'regular',
      maxParticipants: 15,
      spotsLeft: 10
    }
  ],

  // Course dates
  dates: {
    friday: ['9.1.2025', '16.1.2025', '23.1.2025', '13.2.2025', '20.2.2025', '27.2.2025', '6.3.2025', '13.3.2025'],
    saturday: ['10.1.2025', '17.1.2025', '24.1.2025', '14.2.2025', '21.2.2025', '28.2.2025', '7.3.2025', '14.3.2025']
  },

  // Number of sessions included
  totalSessions: 8,

  // Pricing
  pricing: {
    regular: {
      price: 180,
      label: 'Eislaufkurs',
      description: '8 Einheiten á 45 Minuten',
      includes: ['Eintritt inklusive']
    },
    parentChild: [
      {
        id: 'pc-1-1',
        parents: 1,
        children: 1,
        price: 140,
        label: '1 Elternteil + 1 Kind (3-10 Jahre)'
      },
      {
        id: 'pc-1-2',
        parents: 1,
        children: 2,
        price: 180,
        label: '1 Elternteil + 2 Kinder (3-10 Jahre)'
      },
      {
        id: 'pc-2-1',
        parents: 2,
        children: 1,
        price: 240,
        label: '2 Elternteile + 1 Kind (3-10 Jahre)'
      },
      {
        id: 'pc-2-2',
        parents: 2,
        children: 2,
        price: 280,
        label: '2 Elternteile + 2 Kinder (3-10 Jahre)'
      }
    ]
  },

  // Form configuration
  formFields: {
    required: ['firstName', 'lastName', 'email', 'phone'],
    optional: ['notes'],
    participantFields: ['participantName', 'participantAge']
  }
};

export default courseConfig;
