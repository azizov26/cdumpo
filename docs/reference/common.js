// Icon sprite, logo, mosque silhouette, sun-arc widget — shared by all mockups
(function(){
const P={
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 chat:'<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z"/><path d="M9 11h6M9 14h4"/>',
 heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
 cal:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
 book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h10"/>',
 arr:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 arrl:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
 down:'<path d="m6 9 6 6 6-6"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
 home:'<path d="M4 10.5 12 4l8 6.5V20H4z"/><path d="M9.5 20v-5.5h5V20"/>',
 mosque:'<path d="M5 20v-7.5a7 7 0 0 1 14 0V20"/><path d="M12 5.5V3M3 20h18M10 20v-3.5a2 2 0 0 1 4 0V20"/>',
 tg:'<path d="M21 4 3 11.2l6 2.3 2.3 6.5 3.4-4.2 4.8 3.7z"/><path d="m9 13.5 8-6"/>',
 dl:'<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
 phone:'<path d="M5 4h4l1.5 4.5-2.3 1.4a11 11 0 0 0 5.9 5.9l1.4-2.3L20 15v4a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z"/>',
 mail:'<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
 play:'<circle cx="12" cy="12" r="9"/><path d="m10 8.5 5.5 3.5-5.5 3.5z"/>',
 users:'<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
 shield:'<path d="M12 3 4.5 6v6c0 4.5 3.2 7.6 7.5 9 4.3-1.4 7.5-4.5 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
 share:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 star:'<path d="M12 2.5 14 7l4.7-1.4L17.3 10.3 21.5 12l-4.2 1.7 1.4 4.7L14 17l-2 4.5L10 17l-4.7 1.4 1.4-4.7L2.5 12l4.2-1.7L5.3 5.6 10 7z"/>',
 lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
 card:'<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h4"/>',
 qr:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM18 14h2M14 18v2"/>',
 doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
 grad:'<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v5c3 2.5 8 2.5 11 0v-5M21.5 9v5"/>',
 ring:'<circle cx="12" cy="14" r="6"/><path d="m9.5 4 2.5 3.5L14.5 4"/>',
 baby:'<circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>',
 leaf:'<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19 13 11"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
 eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
 filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
 sunrise:'<path d="M4 18h16M7 14.5a5 5 0 0 1 10 0M12 4v5M9.5 6.5 12 4l2.5 2.5"/>',
 sunset:'<path d="M4 18h16M7 14.5a5 5 0 0 1 10 0M12 4v5M9.5 6.5 12 9l2.5-2.5"/>'
};
let s='<svg xmlns="http://www.w3.org/2000/svg" style="display:none">';
for(const k in P) s+=`<symbol id="i-${k}" viewBox="0 0 24 24">${P[k]}</symbol>`;
s+='</svg>';
document.body.insertAdjacentHTML('afterbegin',s);
})();

window.I=(n,cls='')=>`<svg class="i ${cls}"><use href="#i-${n}"/></svg>`;

window.LOGO=(gold='#B08D57',bg='#0F3D33')=>`<svg class="logo-mark" viewBox="0 0 44 44"><circle cx="22" cy="22" r="22" fill="${bg}"/>
<g fill="none" stroke="${gold}" stroke-width="1.4"><rect x="12" y="12" width="20" height="20"/><rect x="12" y="12" width="20" height="20" transform="rotate(45 22 22)"/></g>
<path d="M25.6 17.2a5.6 5.6 0 1 0 0 9.6 4.6 4.6 0 1 1 0-9.6z" fill="${gold}"/></svg>`;

window.MOSQUE=()=>`<svg class="mosque" viewBox="0 0 400 210" fill="currentColor">
<rect x="60" y="120" width="280" height="90"/>
<path d="M120 122c0-46 34-70 80-82 46 12 80 36 80 82z"/>
<rect x="196" y="16" width="8" height="26"/><path d="M200 2a9 9 0 1 0 6 15.5A7 7 0 1 1 200 2z"/>
<rect x="24" y="52" width="22" height="158"/><path d="M22 54 35 22 48 54z"/><rect x="20" y="96" width="30" height="5"/>
<rect x="354" y="52" width="22" height="158"/><path d="M352 54 365 22 378 54z"/><rect x="350" y="96" width="30" height="5"/>
<path d="M88 132c0-12 9-20 18-24 9 4 18 12 18 24z"/><path d="M276 132c0-12 9-20 18-24 9 4 18 12 18 24z"/>
<g fill="rgba(0,0,0,.18)"><path d="M184 210v-34a16 16 0 0 1 32 0v34z"/><path d="M110 170v-14a8 8 0 0 1 16 0v14zM150 170v-14a8 8 0 0 1 16 0v14zM234 170v-14a8 8 0 0 1 16 0v14zM274 170v-14a8 8 0 0 1 16 0v14z"/></g>
</svg>`;

// Prayer times Penza, 13 Oct 2026 (from dumpo.ru)
window.PT=[['Фаджр','04:50'],['Восход','06:23'],['Зухр','12:15'],['Аср','14:31'],['Магриб','17:09'],['Иша','18:43']];
const m=t=>{const[a,b]=t.split(':').map(Number);return a*60+b};

// Sun arc: sunrise..maghrib mapped onto a half circle
window.ARC=(o={})=>{
 const W=o.w||360,H=o.h||200,cx=W/2,cy=H-34,R=Math.min(W/2-26,H-60);
 const now=m(o.now||'15:53'),sr=m('06:23'),ss=m('17:09');
 const pos=t=>{const f=(m(t)-sr)/(ss-sr);const a=Math.PI*(1-f);return[cx+R*Math.cos(a),cy-R*Math.sin(a)]};
 const f=Math.max(0,Math.min(1,(now-sr)/(ss-sr)));const a=Math.PI*(1-f);
 const sx=cx+R*Math.cos(a),sy=cy-R*Math.sin(a);
 const line=o.dark?'rgba(247,243,234,.22)':'rgba(15,61,51,.22)';
 const txt=o.dark?'rgba(247,243,234,.7)':'#4A5753';
 const gold=o.dark?'#D6BC8C':'#B08D57';
 let g=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;overflow:visible">
 <defs><radialGradient id="glow${o.id||''}"><stop offset="0" stop-color="${gold}" stop-opacity=".55"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient></defs>
 <line x1="8" y1="${cy}" x2="${W-8}" y2="${cy}" stroke="${line}"/>
 <path d="M${cx-R} ${cy} A${R} ${R} 0 0 1 ${cx+R} ${cy}" fill="none" stroke="${line}" stroke-width="1.5" stroke-dasharray="2 5" stroke-linecap="round"/>
 <path d="M${cx-R} ${cy} A${R} ${R} 0 0 1 ${sx.toFixed(1)} ${sy.toFixed(1)}" fill="none" stroke="${gold}" stroke-width="2.2" stroke-linecap="round"/>`;
 [['Восход','06:23'],['Зухр','12:15'],['Аср','14:31'],['Магриб','17:09']].forEach(([n,t])=>{
   const [x,y]=pos(t);const past=m(t)<=now;
   g+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="${past?gold:(o.dark?'#0B2E26':'#fff')}" stroke="${gold}" stroke-width="1.5"/>`;
   const lx=x<cx-10?x-10:(x>cx+10?x+10:x), anc=x<cx-10?'end':(x>cx+10?'start':'middle'), ly=y-(Math.abs(x-cx)<20?14:6);
   g+=`<text x="${lx.toFixed(1)}" y="${(ly).toFixed(1)}" fill="${txt}" font-size="11.5" font-family="Onest" text-anchor="${anc}">${n}</text>`;
 });
 g+=`<text x="${cx-R}" y="${cy+20}" fill="${txt}" font-size="11.5" font-family="Onest" text-anchor="middle">Фаджр 04:50</text>
 <text x="${cx+R}" y="${cy+20}" fill="${txt}" font-size="11.5" font-family="Onest" text-anchor="middle">Иша 18:43</text>
 <circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="26" fill="url(#glow${o.id||''})"/>
 <circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="8" fill="${gold}"/></svg>`;
 return g;
};

document.querySelectorAll('[data-i]').forEach(e=>e.insertAdjacentHTML('afterbegin',I(e.dataset.i)));
document.querySelectorAll('[data-logo]').forEach(e=>e.insertAdjacentHTML('afterbegin',LOGO(e.dataset.logo==='l'?'#D6BC8C':'#B08D57',e.dataset.logo==='l'?'rgba(247,243,234,.06)':'#0F3D33')));
document.querySelectorAll('[data-mosque]').forEach(e=>e.insertAdjacentHTML('beforeend',MOSQUE()));
document.querySelectorAll('[data-arc]').forEach((e,k)=>e.innerHTML=ARC({dark:e.dataset.arc==='dark',id:k,w:+e.dataset.w||360,h:+e.dataset.h||200,now:e.dataset.now}));
