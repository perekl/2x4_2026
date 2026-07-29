/**
 * Asset paths under /public/assets.
 * Run `npm run crop-assets` after placing sprite sheets in public/assets/source/.
 */
export const ASSETS = {
  suspects: {
    bob: {
      full: '/assets/suspects/bob-full.png',
      mugshot: '/assets/suspects/bob-mugshot.png',
      judge: '/assets/suspects/bob-judge.png',
      attorney: '/assets/suspects/bob-attorney.png',
      golf: '/assets/suspects/bob-golf.png',
      casual: '/assets/suspects/bob-casual.png',
      maniac: '/assets/suspects/bob-maniac.png',
    },
    perek: {
      full: '/assets/suspects/perek-full.png',
      mugshot: '/assets/suspects/perek-mugshot.png',
      attorney: '/assets/suspects/perek-attorney.png',
      golf: '/assets/suspects/perek-golf.png',
      scribe: '/assets/suspects/perek-scribe.png',
      inmate: '/assets/suspects/perek-inmate.png',
      casual: '/assets/suspects/perek-casual.png',
    },
  },
  posters: {
    bobJudge: '/assets/posters/bob-judge-poster.png',
    bobGolfer: '/assets/posters/bob-golfer-poster.png',
    bobAttorney: '/assets/posters/bob-attorney-poster.png',
    perekObjection: '/assets/posters/perek-objection-poster.png',
    perekInmate: '/assets/posters/perek-inmate-poster.png',
  },
  courtroom: {
    background: '/assets/courtroom/background.jpg',
    judge: '/assets/courtroom/judge.png',
    attorney: '/assets/courtroom/attorney.png',
  },
  evidence: {
    glowBall: '/assets/evidence/glow-ball.png',
    nightVision: '/assets/evidence/night-vision.jpg',
    flashlight: '/assets/evidence/flashlight.jpg',
    tireTracks: '/assets/evidence/tire-tracks.jpg',
    scorecard: '/assets/evidence/scorecard.jpg',
  },
  props: {
    glowBall: '/assets/props/glow-ball.png',
    golfTee: '/assets/props/golf-tee.png',
    ballMarker: '/assets/props/ball-marker.png',
  },
  crimeScene: {
    aerial: '/assets/crime-scene/aerial-map.jpg',
  },
  misc: {
    goose: '/assets/misc/goose.png',
    seal: '/assets/misc/government-seal.svg',
    wantedPoster: '/assets/misc/wanted-poster.png',
  },
} as const
