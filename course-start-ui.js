// UI for explicitly starting courses and showing the user's started-course area.
(function(){
  const S=()=>window.CAMPUS_COURSE_STATE;
  const started=()=>new Set(S?S.load():[]);
  const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[c]));
  function currentCourse(){
    const detail=document.querySelector('.catalog-detail-card');
    if(!detail)return null;
    const h=detail.querySelector('h2'); if(!h)return null;
    const title=h.textContent.trim();
    return [...(window.COURSE_LIBRARY||[]),...(window.ELECTIVE_CATALOG||[])].find(c=>String(c.title).trim()===title)||null;
  }
  function addStartButton(){
    const detail=document.querySelector('.catalog-detail-card');
    if(!detail || detail.querySelector('.course-start-panel'))return;
    const c=currentCourse(); if(!c)return;
    const id=String(c.id||c.courseId);
    const isStarted=started().has(id);
    const panel=document.createElement('section'); panel.className='course-start-panel';
    panel.style.cssText='margin:16px 0;padding:16px;border:1px solid rgba(99,216,255,.18);border-radius:14px;background:linear-gradient(135deg,rgba(99,216,255,.06),rgba(143,155,255,.04));display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap';
    panel.innerHTML=`<div><div class="eyebrow">COURSE STATUS</div><strong class="course-start-message">${isStarted?'Course started':'Ready to begin this course'}</strong><div class="tiny muted">${isStarted?'This course is now in your Started Courses area.':'Start it once and the campus will keep it in your personal Started Courses area.'}</div></div><button class="start-course-btn ${isStarted?'started':''}" data-start-id="${esc(id)}">${isStarted?'✓ Course Started':'▶ Start Course'}</button>`;
    const anchor=detail.querySelector('.academic-panel')||detail.querySelector('.catalog-detail-actions')||detail.firstElementChild;
    if(anchor&&anchor.parentNode===detail)detail.insertBefore(panel,anchor.nextSibling); else detail.prepend(panel);
    const btn=panel.querySelector('[data-start-id]');
    if(!isStarted)btn.addEventListener('click',()=>{S().start(id)});
  }
  function refreshStartButton(){
    const panel=document.querySelector('.course-start-panel'); if(!panel)return;
    const c=currentCourse(); if(!c)return;
    const yes=started().has(String(c.id||c.courseId));
    const btn=panel.querySelector('[data-start-id]'); const msg=panel.querySelector('.course-start-message');
    btn.classList.toggle('started',yes); btn.textContent=yes?'✓ Course Started':'▶ Start Course'; msg.textContent=yes?'Course started':'Ready to begin this course';
    btn.disabled=yes;
    if(!yes)btn.addEventListener('click',()=>S().start(String(c.id||c.courseId)),{once:true});
  }
  function addStartedArea(){
    const app=document.getElementById('app'); if(!app)return;
    const home=document.querySelector('.dashboard-grid'); if(!home || home.querySelector('.started-courses-card'))return;
    const ids=[...started()]; if(!ids.length)return;
    const lib=[...(window.COURSE_LIBRARY||[]),...(window.ELECTIVE_CATALOG||[])];
    const cs=ids.map(id=>lib.find(c=>String(c.id||c.courseId)===id)).filter(Boolean);
    const card=document.createElement('section'); card.className='card started-courses-card';
    card.innerHTML=`<div class="section-head"><div><h2>Started Courses</h2><div class="sub">Courses you explicitly started</div></div><span class="pill good">${cs.length} active</span></div><div class="grid grid-2">${cs.map(c=>`<article class="card"><div class="eyebrow">${esc(c.track)}</div><h3>${esc(c.title)}</h3><div class="course-meta-line"><span class="pill">${esc(c.role)}</span><span class="pill">${esc(c.stage)}</span></div><div class="course-bottom" style="margin-top:10px"><span class="tiny muted">Started</span><button class="ghost open-course" data-id="${esc(c.id||c.courseId)}">Continue →</button></div></article>`).join('')}</div>`;
    const target=home.querySelector('.grid.grid-2');
    if(target&&target.parentNode===home)home.insertBefore(card,target); else home.prepend(card);
  }
  function cleanStartedArea(){document.querySelector('.started-courses-card')?.remove();addStartedArea()}
  const style=document.createElement('style');style.textContent='.course-start-panel .start-course-btn:disabled{opacity:1}.started-courses-card{margin-top:16px}.started-courses-card .card{padding:14px}';document.head.appendChild(style);
  const obs=new MutationObserver(()=>{addStartButton();addStartedArea()});
  obs.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('course-started',()=>{refreshStartButton();cleanStartedArea()});
  window.addEventListener('course-stopped',()=>{refreshStartButton();cleanStartedArea()});
  addStartButton(); addStartedArea();
})();
