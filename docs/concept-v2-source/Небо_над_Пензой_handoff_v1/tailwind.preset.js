// Небо над Пензой — Tailwind preset. Подключение: presets: [require('./tailwind.preset.js')]
// Шрифты через next/font: переменные --font-display / --font-ui / --font-ar.
module.exports = {
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: '#0B1636', 2: '#0E1430', 3: '#141C44', ink: '#0C1128' },
        dusk: '#3D2D5E', sunset: '#D9805A', zarya: '#F2B57C',
        gold: { soft: '#F6CF96', pale: '#FBEBD2', text: '#8A5A1E' },
        light: '#FFF8EC', paper: '#F6F2EA', panel: '#EAE2D3',
        ink: { DEFAULT: '#161A2E', muted: '#5C5F6B' },
        line: { DEFAULT: '#DDD5C6', 2: '#EEE8DC' },
        silhouette: { dark: '#0C1128', day: '#26304F' },
        window: '#F6C77E', star: { DEFAULT: '#FFF6E4', lit: '#FFE7B8' },
        sun: '#FFF3D6', moon: '#F4EEDC', ongold: '#1C1020', water: '#9CC3E6',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        ui: ['var(--font-ui)', 'Manrope', 'system-ui', 'sans-serif'],
        ar: ['var(--font-ar)', 'Amiri', 'serif'],
      },
      fontSize: {
        'count-m': ['62px', { lineHeight: '1', fontWeight: '200' }],
        'count-d': ['148px', { lineHeight: '1', fontWeight: '200', letterSpacing: '-0.01em' }],
        'until-m': ['27px', { lineHeight: '1.15', fontWeight: '500' }],
        'until-d': ['40px', { lineHeight: '1.15', fontWeight: '500' }],
        'date-m': ['10.5px', { lineHeight: '1.7', letterSpacing: '0.16em', fontWeight: '500' }],
        'date-d': ['14px', { lineHeight: '1.7', letterSpacing: '0.14em', fontWeight: '500' }],
        'ar-m': ['24px', { lineHeight: '1.5' }], 'ar-d': ['30px', { lineHeight: '1.5' }],
        h1: ['56px', { lineHeight: '1.02', fontWeight: '500' }],
        h2: ['52px', { lineHeight: '1.02', fontWeight: '500' }],
        'h3-m': ['32px', { lineHeight: '1', fontWeight: '500' }],
        body: ['17px', { lineHeight: '1.55' }], 'body-s': ['14.5px', { lineHeight: '1.55' }],
        small: ['12.5px', { lineHeight: '1.45' }], sub: ['13.5px', { lineHeight: '1.45' }],
        label: ['10.5px', { lineHeight: '1.3', letterSpacing: '0.16em', fontWeight: '700' }],
        chip: ['11px', { lineHeight: '1', fontWeight: '600' }], tab: ['10.5px', { lineHeight: '1.2', fontWeight: '600' }],
        btn: ['14.5px', { lineHeight: '1', fontWeight: '700' }],
        'prayer-n': ['9.5px', { lineHeight: '1.2', letterSpacing: '0.06em', fontWeight: '600' }],
        'prayer-v': ['15.5px', { lineHeight: '1.2', fontWeight: '600' }],
      },
      borderRadius: { xs: '6px', s: '11px', m: '14px', cell: '15px', card: '20px', l: '22px', xl2: '28px' },
      boxShadow: {
        card: '0 1px 0 rgba(22,26,46,.04),0 12px 30px -18px rgba(22,26,46,.25)',
        float: '0 30px 60px -24px rgba(20,20,40,.45)',
        gold: '0 10px 24px -10px rgba(242,181,124,.6)',
      },
      spacing: { 'gutter-m': '20px', 'gutter-d': '48px', hit: '44px', 'tabbar': '84px' },
      maxWidth: { container: '1200px' },
      transitionTimingFunction: { out: 'cubic-bezier(.22,1,.36,1)', in: 'cubic-bezier(.64,0,.78,0)' },
      transitionDuration: { sky: '3000ms' },
    },
  },
};
