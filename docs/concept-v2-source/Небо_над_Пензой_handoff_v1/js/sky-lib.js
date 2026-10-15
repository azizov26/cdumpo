/* Небо над Пензой — эталонный генератор графики (handoff v1).
   Все размеры в px исходного кадра: телефон 390×844, компьютер 1440×900. */
const NS='http://www.w3.org/2000/svg';
function el(t,a,p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function rng(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return (s-1)/2147483646}}
const r1=v=>Math.round(v*10)/10;
function starPts(R,cx=0,cy=0,rot=0){const r=R*Math.cos(Math.PI/4)/Math.cos(Math.PI/8);let p=[];for(let i=0;i<16;i++){const a=rot+i*Math.PI/8-Math.PI/2;const rr=i%2?r:R;p.push(r1(cx+rr*Math.cos(a))+','+r1(cy+rr*Math.sin(a)))}return p.join(' ')}
let UID=0;
function crescent(parent,defs,x,y,r,fill){UID++;const id='cm'+UID;const mk=el('mask',{id},defs);el('rect',{x:r1(x-r-2),y:r1(y-r-2),width:r1(2*r+4),height:r1(2*r+4),fill:'#fff'},mk);el('circle',{cx:r1(x+r*.45),cy:r1(y-r*.35),r:r1(r*.85),fill:'#000'},mk);return el('circle',{cx:r1(x),cy:r1(y),r:r1(r),fill,mask:`url(#${id})`},parent)}

/* ---------- 5 состояний неба ---------- */
const SKY={
 dawn:   {stops:[[0,'#1E2450'],[30,'#4E427A'],[55,'#B9819E'],[75,'#F0BE9E'],[100,'#F8E3C6']],stars:40, starLim:.5, body:'sun', sunA:172,theme:'dark', silhouette:'#0C1128',windows:.75},
 day:    {stops:[[0,'#6FA3CF'],[40,'#A9CBE3'],[75,'#E4ECEA'],[100,'#F6F2EA']],               stars:0,  starLim:.5, body:'sun', sunA:80, theme:'light',silhouette:'#26304F',windows:0},
 asr:    {stops:[[0,'#5F8DBC'],[35,'#B7C4C9'],[62,'#EBC98E'],[80,'#F2B57C'],[100,'#F6E3C0']],stars:0,  starLim:.5, body:'sun', sunA:40, theme:'light',silhouette:'#26304F',windows:0},
 evening:{stops:[[0,'#0B1636'],[20,'#1A2350'],[38,'#3D2D5E'],[52,'#8A4A62'],[64,'#D9805A'],[72,'#F2B57C'],[80,'#F6CF96']],stars:110,starLim:.5,body:'sun',sunA:20,theme:'dark',silhouette:'#0C1128',windows:.75},
 night:  {stops:[[0,'#03071A'],[35,'#081131'],[60,'#101B48'],[74,'#1B2658'],[82,'#0C1128']],stars:230,starLim:.75,body:'moon',sunA:null,theme:'dark',silhouette:'#0C1128',windows:.95}
};
/* Геометрия первого экрана */
const FRAME={
 phone:  {W:390, H:844, arc:{cx:195,cy:640,rx:184,ry:452}, sunR:15,glowR:90, moon:{x:330,y:190,r:16}, base:612, k:1,
          buildings:[['T',.16,1],['H',.38,1],['D',.69,1],['H',.93,1],['H',.04,.8]], starsMul:1, arcW:1.1, dotR:3.5},
 desktop:{W:1440,H:900, arc:{cx:720,cy:770,rx:640,ry:600}, sunR:24,glowR:150,moon:{x:1180,y:170,r:26},base:760, k:1.6,
          buildings:[['T',.13,1.1],['H',.3,1],['T',.4,.9],['D',.7,1.05],['H',.83,1],['T',.95,1]], starsMul:1.7, arcW:1.6, dotR:5}
};
const ARC_DOTS=[180,90,42,0]; /* восход, зухр, аср, магриб — углы на дуге */

function drawStars(g,W,H,count,lim,seed){const R=rng(seed);for(let i=0;i<count;i++){const x=R()*W,y=R()*R()*H*lim;const op=Math.max(0,1-y/(H*lim))*(.35+R()*.65);el('circle',{cx:r1(x),cy:r1(y),r:R()<.08?1.4:.8,fill:'#FFF6E4',opacity:op.toFixed(2)},g)}}

function drawSkyline(g,W,H,base,k,list,state,seed,opts={}){const R=rng(seed);const s=SKY[state];
 const sil=el('g',{fill:opts.currentColor?'currentColor':s.silhouette,class:'silhouette'},g);
 el('path',{d:`M0,${base} C${r1(W*.2)},${base-8} ${r1(W*.4)},${base-2} ${r1(W*.6)},${base-8} C${r1(W*.8)},${base-12} ${r1(W*.9)},${base-4} ${W},${base-8} L${W},${H} L0,${H}Z`},sil);
 for(let i=0;i<W/15;i++){const x=R()*W,rr=(6+R()*14)*k;el('circle',{cx:r1(x),cy:r1(base-rr*.3+R()*6),r:r1(rr)},sil)}
 const wins=el('g',{fill:'#F6C77E',class:'windows',opacity:opts.currentColor?1:s.windows},g);
 list.forEach(([t,xf,sc])=>{const x=W*xf,kk=k*sc,gg=el('g',{transform:`translate(${r1(x)} ${r1(base+10*kk)}) scale(${r1(kk*100)/100})`},sil);
  if(t==='T'){el('rect',{x:-36,y:-36,width:72,height:36},gg);el('path',{d:'M-40,-36 L0,-56 L40,-36Z'},gg);let y=-50;[[11,24],[9,20],[7,14]].forEach(([tw,th])=>{el('rect',{x:-tw/2,y:y-th,width:tw,height:th},gg);el('rect',{x:-tw/2-2,y:y-th-2,width:tw+4,height:2},gg);y-=th+2});el('path',{d:`M-4.5,${y} L0,${y-20} L4.5,${y}Z`},gg);y-=20;el('rect',{x:-.6,y:y-7,width:1.2,height:7},gg);}
  else if(t==='D'){el('rect',{x:-48,y:-42,width:96,height:42},gg);el('path',{d:'M-27,-42 C-27,-92 27,-92 27,-42Z'},gg);el('rect',{x:-.8,y:-99,width:1.6,height:10},gg);[-57,57].forEach(mx=>{el('rect',{x:mx-4.5,y:-104,width:9,height:104},gg);el('rect',{x:mx-7,y:-80,width:14,height:3},gg);el('path',{d:`M${mx-5},-104 L${mx},-130 L${mx+5},-104Z`},gg)});}
  else {el('rect',{x:-17,y:-18,width:34,height:18},gg);el('path',{d:'M-20,-18 L0,-32 L20,-18Z'},gg);}
  const wg=el('g',{transform:`translate(${r1(x)} ${r1(base+10*kk)}) scale(${r1(kk*100)/100})`},wins);[[-14,-24],[6,-24]].forEach(([wx,wy])=>el('rect',{x:wx,y:wy,width:4,height:6},wg));
 });}

function drawSky(svg,state,frameName,o={}){const f=Object.assign({},FRAME[frameName],o.frame||{});const s=SKY[state];const W=f.W,H=f.H;
 const defs=el('defs',{},svg);UID++;const gid='sky'+UID;
 const lg=el('linearGradient',{id:gid,x1:0,y1:0,x2:0,y2:1},defs);s.stops.forEach(([p,c])=>el('stop',{offset:p+'%','stop-color':c},lg));
 el('rect',{width:W,height:H,fill:`url(#${gid})`},svg);
 if(s.stars)drawStars(el('g',{class:'stars'},svg),W,H,Math.round(s.stars*f.starsMul),s.starLim,101);
 if(o.arc!==false){const {cx,cy,rx,ry}=f.arc;const lite=s.theme==='light';const g=el('g',{class:'arc'},svg);
  el('path',{d:`M${cx-rx},${cy} A${rx},${ry} 0 0,1 ${cx+rx},${cy}`,fill:'none',stroke:lite?'rgba(22,26,46,.3)':state==='night'?'rgba(220,228,255,.22)':'rgba(255,240,215,.38)','stroke-width':f.arcW,'stroke-dasharray':'2 6'},g);
  ARC_DOTS.forEach(d=>{const a=d*Math.PI/180;el('circle',{cx:r1(cx+rx*Math.cos(a)),cy:r1(cy-ry*Math.sin(a)),r:f.dotR,fill:lite?'#161A2E':'#F7F1E6',opacity:state==='night'?.4:.7},g)});
  if(s.body==='sun'){const a=s.sunA*Math.PI/180,x=cx+rx*Math.cos(a),y=cy-ry*Math.sin(a);
   el('path',{d:`M${cx-rx},${cy} A${rx},${ry} 0 0,1 ${r1(x)},${r1(y)}`,fill:'none',stroke:lite?'rgba(138,90,30,.6)':'rgba(255,224,180,.6)','stroke-width':f.arcW*1.3},g);
   const rg=el('radialGradient',{id:'glow'+UID},defs);el('stop',{offset:'0%','stop-color':'#FFE9BE','stop-opacity':.95},rg);el('stop',{offset:'30%','stop-color':'#F6B87A','stop-opacity':.45},rg);el('stop',{offset:'100%','stop-color':'#F2A06A','stop-opacity':0},rg);
   el('circle',{cx:r1(x),cy:r1(y),r:f.glowR,fill:`url(#glow${UID})`,class:'sky-sun-glow'},svg);el('circle',{cx:r1(x),cy:r1(y),r:f.sunR,fill:'#FFF3D6',class:'sky-sun'},svg);}}
 if(s.body==='moon'){const m=f.moon;const mg=el('radialGradient',{id:'mh'+UID},defs);el('stop',{offset:'0%','stop-color':'#DCE4FF','stop-opacity':.3},mg);el('stop',{offset:'100%','stop-color':'#DCE4FF','stop-opacity':0},mg);
  el('circle',{cx:m.x,cy:m.y,r:m.r*4,fill:`url(#mh${UID})`,class:'sky-moon-halo'},svg);crescent(svg,defs,m.x,m.y,m.r,'#F4EEDC').setAttribute('class','sky-moon');}
 if(o.skyline!==false)drawSkyline(el('g',{class:'skyline'},svg),W,H,f.base,f.k,f.buildings,state,frameName==='phone'?201:301);
}

/* ---------- Созвездие Соборной мечети: ровно 120 звёзд ---------- */
function mosquePaths(){const P=[];
 P.push([[.03,1],[.97,1]]);
 const minL=[[.11,1],[.11,.3],[.135,.1],[.16,.3],[.16,1]];P.push(minL);P.push(minL.map(([x,y])=>[1-x,y]).reverse());
 P.push([[.095,.44],[.175,.44]]);P.push([[.825,.44],[.905,.44]]);
 P.push([[.24,1],[.24,.6],[.76,.6],[.76,1]]);
 const d=[];for(let i=0;i<=24;i++){const a=Math.PI-i*Math.PI/24;d.push([.5+.21*Math.cos(a),.6-.34*Math.sin(a)])}P.push(d);
 P.push([[.5,.26],[.5,.12]]);
 const door=[[.45,1],[.45,.84]];for(let i=0;i<=8;i++){const a=Math.PI-i*Math.PI/8;door.push([.5+.05*Math.cos(a),.84-.06*Math.sin(a)])}door.push([.55,1]);P.push(door);
 P.push([[.31,.92],[.31,.74]]);P.push([[.69,.92],[.69,.74]]);return P}
function samplePts(W,H,sp){const R=rng(7);const P=mosquePaths();const pts=[];const M=24,IW=W-2*M,IH=H-2*M; /* поле 24px со всех сторон */
 P.forEach((path,pi)=>{for(let i=0;i<path.length-1;i++){const [x1,y1]=path[i],[x2,y2]=path[i+1];const L=Math.hypot((x2-x1)*IW,(y2-y1)*IH)/W;let t=0;while(t<L){const f=t/L;pts.push({x:M+(x1+(x2-x1)*f)*IW,y:M+(y1+(y2-y1)*f)*IH,pi});t+=sp}}const l=path[path.length-1];pts.push({x:M+l[0]*IW,y:M+l[1]*IH,pi})});
 const S=[];pts.forEach(p=>{if(!S.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<W*sp*.6))S.push(p)});
 S.forEach(p=>{p.x=r1(p.x+(R()-.5)*W*.008);p.y=r1(p.y+(R()-.5)*W*.008);p.size=r1(.75+R()*.6)});return S}
function constellationData(W=600,H=440,N=120){let lo=.02,hi=.12,S=null,sp;
 for(let i=0;i<60;i++){sp=(lo+hi)/2;S=samplePts(W,H,sp);if(S.length===N)break;if(S.length>N)lo=sp;else hi=sp}
 if(S.length!==N){for(let d=-200;d<=200;d++){const t=sp+d*.00002;const T=samplePts(W,H,t);if(T.length===N){S=T;sp=t;break}}}
 S.forEach((p,i)=>p.id=i);
 const order=[...S].sort((a,b)=>b.y-a.y||a.x-b.x);order.forEach((p,i)=>p.order=i+1);
 const lines=[];for(let i=1;i<S.length;i++){const a=S[i-1],b=S[i];if(a.pi===b.pi&&Math.hypot(a.x-b.x,a.y-b.y)<W*sp*1.8)lines.push([a.id,b.id])}
 return {viewBox:[0,0,W,H],spacing:sp,stars:S.map(p=>({id:p.id,x:p.x,y:p.y,order:p.order,path:p.pi,size:p.size})),lines,crescent:{cx:W*.5,cy:r1(24+(H-48)*.07),r:r1((H-48)*.035)}}}
function drawConstellation(svg,data,lit,o={}){const [,,W,H]=data.viewBox;const S=data.stars;const byId={};S.forEach(s=>byId[s.id]=s);
 const isLit=s=>s.order<=lit;const r=o.r||3.4;const defs=el('defs',{},svg);
 const gl=el('g',{class:'lines'},svg);
 data.lines.forEach(([a,b])=>{const A=byId[a],B=byId[b],L=isLit(A)&&isLit(B);el('line',{x1:A.x,y1:A.y,x2:B.x,y2:B.y,stroke:L?'#F6CF96':'rgba(255,240,215,.5)','stroke-width':L?1:.6,'stroke-dasharray':L?'none':'2 4',opacity:L?.55:.5,'data-from':a,'data-to':b},gl)});
 const gs=el('g',{class:'stars'},svg);
 S.forEach(s=>{const rr=r1(r*s.size);const g=el('g',{'data-id':s.id,'data-order':s.order,class:isLit(s)?'star lit':'star'},gs);
  if(isLit(s)){el('circle',{cx:s.x,cy:s.y,r:r1(rr*3.2),fill:'#F6CF96',opacity:.14,class:'halo'},g);el('circle',{cx:s.x,cy:s.y,r:rr,fill:'#FFE7B8',class:'core'},g)}
  else el('circle',{cx:s.x,cy:s.y,r:r1(rr*.7),fill:'none',stroke:'rgba(255,240,215,.45)','stroke-width':.8,class:'core'},g)});
 const c=data.crescent;crescent(svg,defs,c.cx,c.cy,c.r,lit>=S.length?'#FFE7B8':'rgba(255,240,215,.35)').setAttribute('class','crescent');
 if(o.newest&&lit>0){const n=S.find(s=>s.order===lit);const g=el('g',{class:'newest'},svg);[[4.5,1.2,1],[8,.8,.5]].forEach(([m,w,op])=>el('circle',{cx:n.x,cy:n.y,r:r1(r*m),fill:'none',stroke:'#F6CF96','stroke-width':w,opacity:op},g));el('circle',{cx:n.x,cy:n.y,r:r1(r*1.7),fill:'#FFF6E0'},g)}}

/* ---------- Компас киблы ---------- */
function drawCompass(svg,deg=189){const g=el('g',{},svg);
 el('circle',{r:150,fill:'rgba(10,18,48,.6)',stroke:'rgba(246,207,150,.5)','stroke-width':1.2},g);el('circle',{r:118,fill:'none',stroke:'rgba(246,207,150,.25)'},g);
 for(let i=0;i<72;i++){const a=i*5*Math.PI/180,l=i%18===0?14:i%2?5:8;el('line',{x1:r1(150*Math.sin(a)),y1:r1(-150*Math.cos(a)),x2:r1((150-l)*Math.sin(a)),y2:r1(-(150-l)*Math.cos(a)),stroke:'rgba(255,248,236,.5)','stroke-width':i%18===0?1.6:.8},g)}
 [['С',0],['В',90],['Ю',180],['З',270]].forEach(([t,d])=>{const a=d*Math.PI/180;const e=el('text',{x:r1(96*Math.sin(a)),y:r1(-96*Math.cos(a)+6),fill:d===0?'#F6CF96':'rgba(255,248,236,.7)','font-size':16,'font-family':'Manrope, sans-serif','font-weight':700,'text-anchor':'middle'},g);e.textContent=t});
 el('polygon',{points:starPts(46),fill:'none',stroke:'rgba(246,207,150,.35)','stroke-width':1},g);
 const ng=el('g',{class:'needle',transform:`rotate(${deg})`},g);
 el('line',{x1:0,y1:0,x2:0,y2:-132,stroke:'#F2B57C','stroke-width':3,'stroke-linecap':'round'},ng);
 el('rect',{x:-11,y:-176,width:22,height:22,rx:3,fill:'#14151A',stroke:'#F2B57C','stroke-width':1.5},ng);el('line',{x1:-11,y1:-169,x2:11,y2:-169,stroke:'#F2B57C','stroke-width':1.2},ng);
 el('circle',{r:7,fill:'#F2B57C'},g);}

/* ---------- Знак ---------- */
function drawLogo(svg,c='currentColor'){el('circle',{r:20,fill:'none',stroke:c,'stroke-width':1.3},svg);el('polygon',{points:starPts(15),fill:'none',stroke:c,'stroke-width':1.7,'stroke-linejoin':'miter'},svg);el('circle',{r:4.5,fill:c},svg)}
