// Stable course-start UI layer. Uses event-driven refresh only; no MutationObserver recursion.
(function(){
  'use strict';
  const key='campus-started-courses';
  const load=()=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return[]}};
  const save=v=>localStorage.setItem(key,JSON.stringify(v));
  const started=()=>new Set(load());
  const esc=v=>String(v??'').replace(/[&<>\\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[c]));

  function items(){
    const out=[...(window.COURSE_LIBRARY||[]),...(window.ELECTIVE_CATALOG||[])];
    const A=window.CAMPUS_ACADEMIC||{};
    if(A.core)Object.entries(A.core).forEach(([id,c])=>out.push({...c,id:c.id||id,courseId:c.courseId||id}));
    if(Array.isArray(A.civilExpansion))out.push(...A.civilExpansion);
    if(Array.isArray(A.electives))out.push(...A.electives);
    const seen=new Set();
    return out.filter(c=>{const id=String(c?.id||c?.courseId||'');if(!id||seen.has(id))return false;seen.add(id);return true;});
  }

  function resolve(id,title){
    const sid=id?String(id):'';
    const all=items();
    return all.find(c=>sid&&String(c.id||c.courseId)===sid)||all.find(c=>title&&String(c.title||'').trim()===String(title).trim())||(sid?{id:sid,courseId:sid,title:title||sid,track:'Engineering',role:'Course',stage:''}:null);
  }

  function startCourse(id){
    const sid=String(id); const a=load();
    if(!a.includes(sid))a.push(sid);
    save(a);
    localStorage.setItem(`status-${sid}`,'Started');
    localStorage.setItem(`started-at-${sid}`,new Date().toISOString());
    window.dispatchEvent(new CustomEvent('course-started',{detail:{id:sid}}));
    refreshSoon();
  }

  function addCardButtons(){
    document.querySelectorAll('.course-card[data-course]').forEach(card=>{
      if(card.querySelector('.card-start-course'))return;
      const id=String(card.dataset.course); const footer=card.querySelector('.course-bottom'); if(!footer)return;
      const b=document.createElement('button');
      b.type='button'; b.className='ghost card-start-course'; b.dataset.startCourse=id;
      const yes=started().has(id); b.textContent=yes?'✓ Started':'▶ Start Course'; if(yes)b.classList.add('started');
      b.addEventListener('click',e=>{e.stopPropagation();if(!started().has(id))startCourse(id);else refreshSoon();});
      footer.insertBefore(b,footer.firstChild);
    });
  }

  function addDetailButton(){
    const detail=document.querySelector('.catalog-detail-card');
    if(!detail||detail.querySelector('.course-start-panel'))return;
    const h=detail.querySelector('h2');
    const title=h?.textContent?.trim()||'';
    const data=detail.querySelector('[data-course]');
    const id=data?.dataset?.course||'';
    const c=resolve(id,title); if(!c)return;
    const cid=String(c.id||c.courseId||id||title); const yes=started().has(cid);
    const panel=document.createElement('section'); panel.className='course-start-panel';
    panel.innerHTML=`<div><div class="eyebrow">COURSE STATUS</div><strong class="course-start-message">${yes?'Course started':'Ready to begin this course'}</strong><div class="tiny muted">${yes?'This course is in your Started Courses area.':'Start it once to add it to your Started Courses area.'}</div></div><button type="button" class="start-course-btn ${yes?'started':''}" data-start-id="${esc(cid)}" ${yes?'disabled':''}>${yes?'✓ Course Started':'▶ Start Course'}</button>`;
    detail.prepend(panel);
    if(!yes)panel.querySelector('[data-start-id]').addEventListener('click',()=>startCourse(cid),{once:true});
  }

  function addStarted(){
    const home=document.querySelector('.dashboard-grid');
    if(!home)return;
    home.querySelector('.started-courses-card')?.remove();
    const ids=[...started()]; if(!ids.length)return;
    const cs=ids.map(id=>resolve(id)).filter(Boolean); if(!cs.length)return;
    const card=document.createElement('section'); card.className='card started-courses-card';
    card.innerHTML=`<div class="section-head"><div><h2>Started Courses</h2><div class="sub">Your actively started courses</div></div><span class="pill good">${cs.length} active</span></div><div class="grid grid-2">${cs.map(c=>{const id=String(c.id||c.courseId);return `<article class="card"><div class="eyebrow">${esc(c.track||'Engineering')}</div><h3>${esc(c.title||id)}</h3><div class="course-meta-line"><span class="pill">${esc(c.role||'Course')}</span><span class="pill">${esc(c.stage||'')}</span></div><div class="course-bottom" style="margin-top:10px"><span class="tiny muted">Started</span><button type="button" class="ghost open-course" data-id="${esc(id)}">Continue →</button></div></article>`}).join('')}</div>`;
    const target=home.querySelector('.grid.grid-2');
    if(target?.parentNode===home)home.insertBefore(card,target);else home.prepend(card);
  }

  function refresh(){
    addCardButtons();
    addDetailButton();
    addStarted();
  }
  let timer=null;
  function refreshSoon(){clearTimeout(timer);timer=setTimeout(refresh,80)}

  const style=document.createElement('style');
  style.textContent='.card-start-course.started{color:#72e4bc;border-color:rgba(114,228,188,.25);background:rgba(114,228,188,.07)}.course-start-panel{margin:16px 0;padding:16px;border:1px solid rgba(99,216,255,.18);border-radius:14px;background:linear-gradient(135deg,rgba(99,216,255,.06),rgba(143,155,255,.04));display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap}.course-start-panel .start-course-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 15px;border:0;border-radius:11px;background:linear-gradient(135deg,#63d8ff,#8f9bff);color:#07111b;font-weight:900;cursor:pointer}.course-start-panel .start-course-btn.started{background:rgba(114,228,188,.14);color:#72e4bc;border:1px solid rgba(114,228,188,.25);cursor:default}.started-courses-card{margin-top:16px}.started-courses-card .card{padding:14px}';
  document.head.appendChild(style);

  window.CAMPUS_COURSE_STATE=window.CAMPUS_COURSE_STATE||{
    load,has:id=>started().has(String(id)),start:startCourse,
    stop:id=>{const sid=String(id);save(load().filter(x=>x!==sid));localStorage.setItem(`status-${sid}`,'Not started');window.dispatchEvent(new CustomEvent('course-stopped',{detail:{id:sid}}));refreshSoon();}
  };

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-nav],.open-course,.school-card,.course-card'))refreshSoon();
  });
  window.addEventListener('course-started',refreshSoon);
  window.addEventListener('course-stopped',refreshSoon);
  window.addEventListener('popstate',refreshSoon);
  setTimeout(refresh,0);
})();
