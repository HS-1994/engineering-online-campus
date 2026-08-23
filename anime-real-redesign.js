/* Engineering Online Campus — detailed anime/game art override. */
(function(){
  'use strict';

  const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));

  function hairVariant(n){
    const variants=[
      'M92 126L73 70L108 82L119 37L143 67L171 25L183 69L220 52L204 100L222 128L179 104L152 130Z',
      'M91 124L80 66L111 84L130 31L148 68L183 39L191 76L224 65L207 109L224 131L180 105L153 129Z',
      'M89 127L84 73L112 88L124 38L151 70L181 29L188 70L222 61L205 108L220 132L177 106L150 131Z',
      'M92 126L72 72L108 84L123 34L146 67L176 31L189 72L222 58L206 108L224 132L179 106L151 131Z'
    ];
    return variants[n%variants.length];
  }

  function figure(label,accent,n=0){
    const uid='a'+String(n)+label.replace(/[^a-z0-9]/gi,'');
    return `<svg viewBox="0 0 420 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Detailed anime style male ${esc(label)} engineer">
      <defs>
        <linearGradient id="bg${uid}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0b1830"/><stop offset="1" stop-color="#050912"/></linearGradient>
        <linearGradient id="coat${uid}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#203b61"/><stop offset="1" stop-color="#0a1627"/></linearGradient>
        <radialGradient id="glow${uid}"><stop stop-color="${accent}" stop-opacity=".34"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="420" height="520" rx="28" fill="url(#bg${uid})"/>
      <circle cx="328" cy="90" r="108" fill="url(#glow${uid})"/>
      <g opacity=".24" stroke="${accent}" stroke-width="2"><path d="M26 406H394M44 376H376M72 346H348"/><path d="M86 58V447M150 58V447M214 58V447M278 58V447M342 58V447"/></g>
      <g opacity=".55" fill="none" stroke="${accent}" stroke-width="3"><circle cx="324" cy="92" r="38"/><circle cx="324" cy="92" r="54"/><path d="M324 28v128M260 92h128"/></g>
      <path d="M48 520C57 399 118 336 210 336s153 63 162 184Z" fill="#08111f"/>
      <path d="M106 391c26-55 62-80 105-80 48 0 83 28 105 80l-13 129H118Z" fill="url(#coat${uid})"/>
      <path d="M171 327l39 45 40-45-15-33h-48z" fill="#07101d"/>
      <path d="M147 177C147 111 179 75 225 75c56 0 88 41 88 108 0 66-34 107-89 107-47 0-77-42-77-113Z" fill="#d09275"/>
      <path d="M143 180C131 109 167 52 232 51c62 0 103 46 92 111-25-10-47-27-65-57-25 31-58 54-116 75Z" fill="#101827"/>
      <path d="${hairVariant(n)}" fill="#0d1625"/>
      <path d="M168 183c17-12 33-12 47 0M242 183c17-12 33-12 47 0" fill="none" stroke="#263a57" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="197" cy="183" rx="7" ry="4" fill="${accent}"/><ellipse cx="269" cy="183" rx="7" ry="4" fill="${accent}"/>
      <path d="M229 189l-7 26 18 5" fill="none" stroke="#9a6258" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M203 238c17 15 39 15 56 0" fill="none" stroke="#82484a" stroke-width="6" stroke-linecap="round"/>
      <path d="M118 399l-55 67 69 35 48-80M302 399l55 67-69 35-48-80" fill="#19365a"/>
      <path d="M78 420l-53 72 18 9 64-66z" fill="#0a1729"/><path d="M342 420l53 72-18 9-64-66z" fill="#0a1729"/>
      <path d="M81 503h71" stroke="${accent}" stroke-width="9" stroke-linecap="round"/><path d="M268 503h71" stroke="${accent}" stroke-width="9" stroke-linecap="round"/>
      <text x="24" y="40" fill="${accent}" font-family="Arial,sans-serif" font-size="15" font-weight="900" letter-spacing="3">${esc(label.toUpperCase())}</text>
      <text x="24" y="66" fill="#9db2c9" font-family="Arial,sans-serif" font-size="10" font-weight="800" letter-spacing="1.5">ENGINEERING CREW</text>
    </svg>`;
  }

  function hero(){
    return `<svg viewBox="0 0 980 390" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Detailed anime male engineer in a futuristic industrial city">
      <defs>
        <linearGradient id="hbg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#050912"/><stop offset=".46" stop-color="#173a65"/><stop offset="1" stop-color="#090d17"/></linearGradient>
        <linearGradient id="hcoat" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#213e63"/><stop offset="1" stop-color="#08121f"/></linearGradient>
        <linearGradient id="hSky" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#1a2546"/><stop offset=".55" stop-color="#ff8f63"/><stop offset="1" stop-color="#343c79"/></linearGradient>
        <filter id="hGlow"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="980" height="390" fill="url(#hbg)"/>
      <rect x="0" y="70" width="980" height="100" fill="url(#hSky)" opacity=".42"/>
      <g opacity=".23" fill="#7fdcff"><circle cx="94" cy="82" r="2"/><circle cx="166" cy="120" r="2"/><circle cx="260" cy="52" r="2"/><circle cx="762" cy="64" r="2"/><circle cx="876" cy="112" r="2"/></g>
      <g fill="#06101a" opacity=".92"><path d="M0 294L91 228l61 42 77-94 80 60 97-120 111 88 94-72 119 73 89-54v239H0z"/><path d="M82 244h18v86H82zM186 208h21v122h-21zM300 180h17v150h-17zM420 144h22v186h-22zM564 185h20v145h-20zM698 135h23v195h-23zM834 176h18v154h-18z"/></g>
      <g stroke="#62d9ff" stroke-width="2" opacity=".22"><path d="M0 328H980M0 304H980M0 280H980"/><path d="M60 210v124M164 178v156M300 144v190M460 192v142M626 160v174M760 188v146M890 140v194"/></g>
      <g transform="translate(554 4)">
        <path d="M50 386c8-112 72-177 164-177 98 0 165 72 173 177z" fill="#07101b"/>
        <path d="M122 217c22-56 62-86 112-86 62 0 109 39 119 90l-12 165H144z" fill="url(#hcoat)"/>
        <path d="M186 113c0-67 38-102 91-102 63 0 105 47 105 119 0 69-39 110-105 110-55 0-91-46-91-127Z" fill="#d19376"/>
        <path d="M180 120C167 43 208-9 283-9c72 0 118 52 101 133-31-11-56-34-73-69-30 39-68 61-131 78Z" fill="#0e1522"/>
        <path d="M192 121L177 79L215 92L232 43L252 79L288 29L302 71L347 53L331 99L348 125L301 101L276 126Z" fill="#0b1320"/>
        <path d="M224 160c18-13 35-13 52 0M304 160c18-13 35-13 52 0" fill="none" stroke="#263b56" stroke-width="9" stroke-linecap="round"/>
        <ellipse cx="252" cy="160" rx="8" ry="5" fill="#62d9ff"/><ellipse cx="334" cy="160" rx="8" ry="5" fill="#62d9ff"/>
        <path d="M293 168l-8 30 19 5" fill="none" stroke="#9b6158" stroke-width="5" stroke-linecap="round"/>
        <path d="M267 221c20 15 44 15 64 0" fill="none" stroke="#82494b" stroke-width="7" stroke-linecap="round"/>
        <path d="M137 232l-88 109 101 44 79-121M390 232l88 109-101 44-79-121" fill="url(#hcoat)"/>
        <path d="M72 318L20 380" stroke="#62d9ff" stroke-width="11" stroke-linecap="round" opacity=".72" filter="url(#hGlow)"/><path d="M455 318l52 62" stroke="#8b7cff" stroke-width="11" stroke-linecap="round" opacity=".64" filter="url(#hGlow)"/>
        <circle cx="423" cy="72" r="34" fill="none" stroke="#62d9ff" stroke-width="4" opacity=".6"/><path d="M389 72h68M423 38v68" stroke="#62d9ff" stroke-width="2" opacity=".5"/>
      </g>
      <rect x="34" y="28" width="440" height="4" rx="2" fill="#62d9ff" opacity=".7"/>
      <text x="36" y="66" fill="#79e4ff" font-family="Arial,sans-serif" font-size="13" font-weight="900" letter-spacing="4">ENGINEERING ONLINE CAMPUS · PERSONAL ARC</text>
      <text x="36" y="116" fill="#ffffff" font-family="Arial,sans-serif" font-size="42" font-weight="900">WELCOME BACK,</text>
      <text x="36" y="160" fill="#62d9ff" font-family="Arial,sans-serif" font-size="48" font-weight="900" letter-spacing="-1">YAZAN</text>
      <text x="36" y="193" fill="#d4e5f5" font-family="Arial,sans-serif" font-size="16">Build. Learn. Create. Impact.</text>
      <text x="36" y="224" fill="#9fb4c8" font-family="Arial,sans-serif" font-size="12">Japanese game-inspired engineering campus</text>
      <rect x="36" y="252" width="172" height="34" rx="9" fill="#5e75ff"/><text x="53" y="274" fill="#ffffff" font-family="Arial,sans-serif" font-size="12" font-weight="900">RESUME LEARNING →</text>
    </svg>`;
  }

  function inject(){
    const app=document.getElementById('app');
    if(!app || !app.querySelector('.p-shell')) return false;
    const heroEl=app.querySelector('.p-hero-art');
    if(heroEl){heroEl.innerHTML=hero();heroEl.style.opacity='1';}
    const accents=['#62d9ff','#8d83ff','#67e0ae','#f0c66d'];
    const labels=['MECHANICAL','ELECTRICAL','ROBOTICS','CIVIL / BIM'];
    app.querySelectorAll('.p-card-art').forEach((el,i)=>{el.innerHTML=figure(labels[i]||'ENGINEERING',accents[i%4],i);});
    app.querySelectorAll('.p-character').forEach((el,i)=>{const old=el.querySelector('svg');if(old)old.remove();el.insertAdjacentHTML('afterbegin',figure(labels[i]||'ENGINEERING',accents[i%4],i));});
    app.querySelectorAll('.p-row-art').forEach((el,i)=>{el.innerHTML=figure(['KAI','REN','SORA'][i]||'ENGINEER',accents[i%4],i);});
    const side=app.querySelector('.p-sidepanel');
    if(side && !side.querySelector('.anime-story-panel')){
      side.insertAdjacentHTML('beforeend',`<div class="p-mini anime-story-panel"><h3>ENGINEER'S STORY</h3><div class="p-quote"><strong>Chapter 01 · The Foundation</strong><br><br>Every great design starts with a problem worth solving. Build your fundamentals first. The difficult systems come later.</div><button style="margin-top:10px;width:100%;padding:9px;border-radius:9px;border:1px solid rgba(84,213,255,.25);background:#0a1b2f;color:#7fe4ff;font-weight:800">Continue Story →</button></div>`);
    }
    return true;
  }

  const style=document.createElement('style');
  style.textContent=`.p-hero{min-height:390px!important}.p-hero-art{opacity:1!important}.p-card-art{height:190px!important}.p-card-art svg{height:100%!important}.p-character svg{height:310px!important}.p-character-strip{gap:12px!important}.anime-story-panel{position:relative;overflow:hidden}.anime-story-panel:after{content:'⚙';position:absolute;right:16px;bottom:8px;font-size:5rem;color:rgba(98,217,255,.06);transform:rotate(-18deg)}@media(max-width:700px){.p-hero{min-height:420px!important}.p-card-art{height:300px!important}.p-character svg{height:360px!important}}`;
  document.head.appendChild(style);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{setTimeout(inject,250);setTimeout(inject,900);});
  else {setTimeout(inject,250);setTimeout(inject,900);}
})();
