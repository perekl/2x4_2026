export const CASE = {
  title: 'OPERATION: MOONLIGHT TEE',
  number: '2026-MT-071',
  status: 'ACTIVE INVESTIGATION',
  defendants: 'The Defendants',
  suspectLabels: ['Suspect #1', 'Suspect #2'] as const,
  teamNamePlaceholder: '[Your Team Name]',
  teeTime: new Date('2026-07-30T08:00:00'),
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
  { id: 1, x: 22, y: 35, label: 'Fairway 14', detail: 'Primary impact zone. Multiple glowing projectiles observed crossing airspace.' },
  { id: 2, x: 48, y: 28, label: 'Bunker 7', detail: 'Suspect #2 last known position. Sand disturbed in suspicious arc pattern.' },
  { id: 3, x: 65, y: 55, label: 'Clubhouse Perimeter', detail: 'Unauthorized approach vector. Security camera offline (coincidence?).' },
  { id: 4, x: 38, y: 72, label: 'Water Hazard', detail: 'Recovered glow ball. Still floating. Still glowing.' },
  { id: 5, x: 78, y: 42, label: 'Cart Path', detail: 'Tire tracks consistent with late-night joyride. Speed: reckless.' },
  { id: 6, x: 55, y: 18, label: 'Tee Box 1', detail: 'Premeditation confirmed. Scorecard found with tomorrow\'s tee time circled.' },
] as const
