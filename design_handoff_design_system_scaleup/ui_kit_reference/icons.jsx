// Inline lucide-style icons — 1.5px stroke, outline, matches lucide-react
const { createElement: h } = React;

const svg = (children, props = {}) => h('svg', {
  width: props.size || 20, height: props.size || 20,
  viewBox: '0 0 24 24', fill: 'none',
  stroke: props.color || 'currentColor', strokeWidth: 1.75,
  strokeLinecap: 'round', strokeLinejoin: 'round',
  style: props.style,
}, children);

const MapPin = (p) => svg([
  h('path', { key: 1, d: 'M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 1 1 16 0z' }),
  h('circle', { key: 2, cx: 12, cy: 10, r: 3 })
], p);

const Mail = (p) => svg([
  h('rect', { key: 1, width: 20, height: 16, x: 2, y: 4, rx: 2 }),
  h('path', { key: 2, d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' })
], p);

const Phone = (p) => svg([
  h('path', { key: 1, d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' })
], p);

const Clock = (p) => svg([
  h('circle', { key: 1, cx: 12, cy: 12, r: 10 }),
  h('polyline', { key: 2, points: '12 6 12 12 16 14' })
], p);

const Users = (p) => svg([
  h('path', { key: 1, d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
  h('circle', { key: 2, cx: 9, cy: 7, r: 4 }),
  h('path', { key: 3, d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
  h('path', { key: 4, d: 'M16 3.13a4 4 0 0 1 0 7.75' })
], p);

const UserCheck = (p) => svg([
  h('path', { key: 1, d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
  h('circle', { key: 2, cx: 9, cy: 7, r: 4 }),
  h('polyline', { key: 3, points: '16 11 18 13 22 9' })
], p);

const ShieldCheck = (p) => svg([
  h('path', { key: 1, d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' }),
  h('path', { key: 2, d: 'm9 12 2 2 4-4' })
], p);

const Star = (p) => h('svg', {
  width: p.size || 16, height: p.size || 16, viewBox: '0 0 24 24',
  fill: p.fill || 'currentColor', stroke: 'none', style: p.style
}, h('polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' }));

const ChevronDown = (p) => svg([h('polyline', { key: 1, points: '6 9 12 15 18 9' })], p);
const ArrowRight = (p) => svg([
  h('line', { key: 1, x1: 5, y1: 12, x2: 19, y2: 12 }),
  h('polyline', { key: 2, points: '12 5 19 12 12 19' })
], p);
const ArrowUpRight = (p) => svg([
  h('line', { key: 1, x1: 7, y1: 17, x2: 17, y2: 7 }),
  h('polyline', { key: 2, points: '7 7 17 7 17 17' })
], p);
const Sparkles = (p) => svg([
  h('path', { key: 1, d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' }),
  h('path', { key: 2, d: 'M20 3v4' }),
  h('path', { key: 3, d: 'M22 5h-4' })
], p);
const CheckCircle = (p) => svg([
  h('path', { key: 1, d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
  h('polyline', { key: 2, points: '22 4 12 14.01 9 11.01' })
], p);
const MessageCircle = (p) => svg([
  h('path', { key: 1, d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22z' })
], p);
const X = (p) => svg([
  h('path', { key: 1, d: 'M18 6 6 18' }),
  h('path', { key: 2, d: 'm6 6 12 12' })
], p);

window.Icons = { MapPin, Mail, Phone, Clock, Users, UserCheck, ShieldCheck, Star, ChevronDown, ArrowRight, ArrowUpRight, Sparkles, CheckCircle, MessageCircle, X };
