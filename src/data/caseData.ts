export const CASE = {
  title: 'OPERATION: MOONLIGHT TEE',
  number: '2026-MT-071',
  status: 'ACTIVE INVESTIGATION',
  defendants: 'The Defendants',
  suspectLabels: ['Suspect #1', 'Suspect #2'] as const,
  teamName: 'Night Boyz',
  teeTime: new Date(2026, 6, 30, 18, 10, 0), // Jul 30, 2026 — 6:10 PM local
  teeTimeLabel: 'Tomorrow, 6:10 PM',
} as const

export const SUSPECTS = [
  {
    id: 'suspect-1',
    label: 'Suspect #1',
    name: 'BOB',
    occupation: 'Golf Enthusiast',
    aliases: ['The Left Rough Boys', 'Fairway Phantom'],
    lastSeen: 'Near Hole 7 after sunset',
    threatLevel: 'Low',
    golfIQ: 'Concerningly High',
    notes: 'Subject exhibits advanced knowledge of course drainage patterns. Refused to comment on sand wedge selection.',
  },
  {
    id: 'suspect-2',
    label: 'Suspect #2',
    name: 'PEREK',
    occupation: 'Alleged Co-Conspirator',
    aliases: ['The Left Rough Boys', 'Night Putter'],
    lastSeen: 'Bunker adjacent to the 14th green',
    threatLevel: 'Low',
    golfIQ: 'Alarmingly Strategic',
    notes: 'Carried unauthorized illuminated equipment. Maintains plausible deniability regarding scorekeeping.',
  },
] as const

export const CHARGES = [
  'Criminal Trespass',
  'Unauthorized Recreational Activity',
  'Possession of Illegal Illuminated Golf Equipment',
  'Disturbing Wildlife',
  'Conspiracy to Improve Ball Visibility',
  'Intent to Play Through the Night',
] as const

export const EXHIBITS = [
  {
    id: 'A',
    title: 'Glow Golf Ball',
    description: 'Recovered from the 14th fairway. Still emitting trace luminescence.',
    assetKey: 'glowBall' as const,
    category: 'evidence' as const,
  },
  {
    id: 'B',
    title: 'Night Vision Image',
    description: 'Two suspicious figures carrying golf clubs. Resolution: classified.',
    assetKey: 'nightVision' as const,
    category: 'evidence' as const,
  },
  {
    id: 'C',
    title: 'Flashlight',
    description: 'Still warm. Fingerprints pending analysis.',
    assetKey: 'flashlight' as const,
    category: 'evidence' as const,
  },
  {
    id: 'D',
    title: 'Golf Cart Tire Tracks',
    description: 'Possibly unrelated. Possibly very related.',
    assetKey: 'tireTracks' as const,
    category: 'evidence' as const,
  },
  {
    id: 'E',
    title: 'Scorecard',
    description: 'Clearly premeditated. Handwriting matches known suspects.',
    assetKey: 'scorecard' as const,
    category: 'evidence' as const,
  },
] as const

export const WITNESSES = [
  {
    id: 'groundskeeper',
    name: 'Groundskeeper',
    role: 'Primary Witness',
    quote: 'Thought they were aliens. The balls were glowing. I called it in.',
    badge: 'CREDIBLE',
  },
  {
    id: 'neighbor',
    name: 'Neighbor',
    role: 'Resident Witness',
    quote: 'Green lights kept flying through the trees. Like fireflies, but angrier.',
    badge: 'CORROBORATED',
  },
  {
    id: 'goose',
    name: 'Goose',
    role: 'Avian Witness',
    quote: 'HONK',
    translation: 'FORE.',
    badge: 'HOSTILE',
  },
] as const

export const CRIME_MARKERS = [
  { id: 1, x: 58, y: 48, label: 'Fairway 14', detail: 'Primary impact zone. Multiple glowing projectiles observed crossing airspace over the back nine.' },
  { id: 2, x: 42, y: 38, label: 'Bunker 7', detail: 'Suspect #2 last known position. Sand disturbed in suspicious arc pattern.' },
  { id: 3, x: 52, y: 14, label: 'W Highland Perimeter', detail: 'Unauthorized approach from residential tree line. Security camera offline (coincidence?).' },
  { id: 4, x: 36, y: 24, label: 'Pond — North', detail: 'Recovered glow ball floating near the hazard. Still glowing. Goose refused to comment.' },
  { id: 5, x: 68, y: 52, label: 'Cart Path', detail: 'Tire tracks consistent with late-night joyride. Speed: reckless.' },
  { id: 6, x: 22, y: 82, label: 'Highland Arena', detail: 'Premeditation confirmed. Scorecard found near the rink. Tomorrow\'s tee time circled.' },
] as const
