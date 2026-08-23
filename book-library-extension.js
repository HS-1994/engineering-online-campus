// Additional title-only references found in the user's private Notion book library.
// No file paths, URLs, or book files are stored here.
(function(){
  const extra={
    MEC201:['Engineering Dynamics — Andrew Pytel, Jaan Kiusalaas','Vector Mechanics for Engineers: Statics and Dynamics — Beer, Johnston, Cornwell'],
    MAT301:['Mechanics of Materials — Pytel, Kiusalaas','Mechanics of Materials — R.C. Hibbeler'],
    THM401:['Engineering Thermodynamics — J.P. Holman','Thermodynamics — Enrico Fermi','Elementary Mechanics and Thermodynamics — J. Norbury','Thermodynamics and Statistical Mechanics — Greiner, Neise, Stoecker','A First Course in Fluid Mechanics for Engineers'],
    MDE501:['Mechanical Engineering Design — J.E. Shigley','Machine Design — J.C. Ugural','Design of Machine Elements — V.B. Bhandari'],
    SIM601:['Finite Element Method — O.C. Zienkiewicz, R.L. Taylor, J.Z. Zhu','Finite Element Analysis — D. Hutton','Computational Fluid Dynamics — John D. Anderson'],
    ELC201:['Engineering Circuit Analysis — Hayt, Kemmerly, Durbin','Electric Circuits — James W. Nilsson, Susan Riedel'],
    CTL402:['Feedback Control of Dynamic Systems — Franklin, Powell, Emami-Naeini','Linear System Theory and Design — Chi-Tsong Chen'],
    ROB601:['Engineering Dynamics — Pytel, Kiusalaas','Robotics: Modelling, Planning and Control — Siciliano et al.'],
    CIV201:['Structural Analysis — Hibbeler','Structural Analysis — Kassimali','Matrix Structural Analysis — Amin Ghali, Adam Neville, Wai-Fah Chen'],
    CIV301:['Reinforced Concrete Design — Wight, MacGregor','Reinforced Concrete: Mechanics and Design — McCormac, Brown'],
    CIV401:['Soil Mechanics — R.F. Craig','Principles of Geotechnical Engineering — Braja M. Das','Fundamentals of Soil Behavior — Mitchell, Soga'],
    CIV402:['Foundation Analysis and Design — Joseph E. Bowles','Principles of Foundation Engineering — Braja M. Das'],
    CIV503:['Applied Hydrology — Chow, Maidment, Mays','Hydrology — K. Subramanya'],
    CIV504:['Open-Channel Hydraulics — Ven Te Chow','Fluid Mechanics — Streeter, Wylie, Bedford'],
    CIV601:['Traffic Engineering — Roess, Prassas, McShane','Transportation Engineering — Khisty, Lall'],
    CIV702:['BIM Handbook — Sacks, Eastman, Lee, Teicholz','The BIM Manager’s Handbook — Dominik Holzer'],
    PRO701:['Engineering Economy — Blank, Tarquin','Project Management for Engineering and Construction — Oberlender','Engineering Ethics: Concepts and Cases — Harris, Pritchard, Rabins']
  };
  window.CAMPUS_BOOKS_EXTRA=extra;
  Object.keys(extra).forEach(id=>{window.CAMPUS_BOOKS=window.CAMPUS_BOOKS||{};const base=window.CAMPUS_BOOKS[id]||[];window.CAMPUS_BOOKS[id]=Array.from(new Set([...base,...extra[id]]));});
})();

// Stable Add Course / Start Course workflow.
// Enrollment and started status are local to this browser/device. No server and no recursive DOM observer.
(function(){
  'use strict';
  const ENROLLED_KEY='campus-enrolled-courses';
  const STARTED_KEY='campus-started-courses';
  const load=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[]}};
  const save=(k,a)=>localStorage.setItem(k,JSON.stringify([...new Set(a.map(String))]));
  const enrolled=()=>new Set(load(ENROLLED_KEY));
  const started=()=>new Set(load(STARTED_KEY));
  const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[c]));
  function allCourses(){
    const out=[]; const add=c=>{if(c&&(c.id||c.courseId||c.title))out.push(c)};
    (window.COURSE_LIBRARY||[]).forEach(add); (window.ELECTIVE_CATALOG||[]).forEach(add);
    const A=window.CAMPUS_ACADEMIC||{};
    Object.entries(A.core||{}).forEach(([id,c])=>add({...c,id,courseId:c.courseId||id}));
    (A.civilExpansion||[]).forEach(add);
    const seen=new Set();
    return out.filter(c=>{const id=String(c.id||c.courseId||c.title);if(seen.has(id))return false;seen.add(id);return true});
  }
  const find=id=>allCourses().find(c=>String(c.id||c.courseId)===String(id))||null;
  const state=id=>({enrolled:enrolled().has(String(id)),started:started().has(String(id))});
  const notify=m=>window.toast?.(m);
  function add(id){const c=find(id);if(!c)return;const a=load(ENROLLED_KEY);if(!a.includes(String(id)))a.push(String(id));save(ENROLLED_KEY,a);notify(`${c.title} added to My Courses`);refresh();}
  function start(id){const c=find(id);if(!c)return;let a=load(ENROLLED_KEY);if(!a.includes(String(id)))a.push(String(id));save(ENROLLED_KEY,a);a=load(STARTED_KEY);if(!a.includes(String(id)))a.push(String(id));save(STARTED_KEY,a);localStorage.setItem(`status-${id}`,'Started');localStorage.setItem(`started-at-${id}`,new Date().toISOString());notify(`${c.title} started`);refresh();}
  function button(id){const s=state(id);if(s.started)return `<button type="button" class="course-action-btn started" disabled>✓ Started</button>`;if(s.enrolled)return `<button type="button" class="course-action-btn start" data-course-action="start" data-course-id="${esc(id)}">▶ Start Course</button>`;return `<button type="button" class="course-action-btn add" data-course-action="add" data-course-id="${esc(id)}">＋ Add Course</button>`;}
  function styles(){if(document.getElementById('course-actions-css'))return;const s=document.createElement('style');s.id='course-actions-css';s.textContent='.course-actions-wrap{display:inline-flex;gap:7px;align-items:center;flex-wrap:wrap}.course-action-btn{border:1px solid rgba(196,220,240,.14);background:rgba(255,255,255,.03);color:#eff5fb;border-radius:10px;padding:8px 11px;font-weight:800;cursor:pointer;font-size:.75rem;white-space:nowrap}.course-action-btn.add{border-color:rgba(99,216,255,.25);color:#8fe7ff}.course-action-btn.start{background:linear-gradient(135deg,#63d8ff,#8f9bff);color:#07111b;border:0}.course-action-btn.started{color:#72e4bc;border-color:rgba(114,228,188,.25);background:rgba(114,228,188,.08);cursor:default}.my-enrolled-card{margin-top:16px}.my-enrolled-card .card{padding:14px}';document.head.appendChild(s)}
  function decorateCourseCards(){document.querySelectorAll('.course-card[data-course]').forEach(card=>{const id=card.dataset.course,foot=card.querySelector('.course-bottom');if(!id||!foot)return;let w=foot.querySelector('.course-actions-wrap');if(!w){w=document.createElement('span');w.className='course-actions-wrap';foot.appendChild(w)}const sig=id+':'+state(id).enrolled+':'+state(id).started;if(w.dataset.sig===sig)return;w.dataset.sig=sig;w.innerHTML=button(id);});}
  function decorateCatalog(){document.querySelectorAll('.catalog-card').forEach(card=>{const id=card.querySelector('[data-detail]')?.dataset.detail;if(!id)return;let w=card.querySelector('.course-actions-wrap');if(!w){w=document.createElement('span');w.className='course-actions-wrap';const actions=card.querySelector('.catalog-actions');if(actions)actions.appendChild(w);else card.appendChild(w)}const sig=id+':'+state(id).enrolled+':'+state(id).started;if(w.dataset.sig===sig)return;w.dataset.sig=sig;w.innerHTML=button(id);});}
  function decorateDetail(){const d=document.querySelector('#catalog-detail .catalog-detail-card');if(!d||d.querySelector('.course-detail-actions'))return;const id=d.querySelector('[data-study]')?.dataset.study||d.querySelector('[data-detail]')?.dataset.detail;if(!id)return;const w=document.createElement('div');w.className='course-detail-actions course-actions-wrap';w.style.cssText='margin-top:16px';w.innerHTML=button(id);d.appendChild(w);}
  function renderMy(){const home=document.querySelector('.dashboard-grid');if(!home)return;home.querySelector('.my-enrolled-card')?.remove();const list=[...enrolled()].map(find).filter(Boolean);if(!list.length)return;const sec=document.createElement('section');sec.className='card my-enrolled-card';sec.innerHTML='<div class="section-head"><div><h2>My Enrolled Courses</h2><div class="sub">Courses you added to your personal degree plan</div></div><span class="pill good">'+list.length+' enrolled</span></div><div class="grid grid-2">'+list.map(c=>{const id=String(c.id||c.courseId);return '<article class="card"><div class="eyebrow">'+esc(c.track||'Engineering')+'</div><h3>'+esc(c.title)+'</h3><div class="course-meta-line"><span class="pill">'+esc(c.role||'Course')+'</span><span class="pill">'+esc(c.stage||'')+'</span></div><div class="course-bottom" style="margin-top:10px"><span class="tiny muted">'+(state(id).started?'Started':'Enrolled')+'</span><span class="course-actions-wrap">'+button(id)+'</span></div></article>'}).join('')+'</div>';const anchor=home.querySelector('.grid.grid-2');if(anchor)home.insertBefore(sec,anchor);else home.prepend(sec)}
  let queued=false;
  function refresh(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;styles();decorateCourseCards();decorateCatalog();decorateDetail();renderMy()});}
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-course-action]');if(!b||b.disabled)return;e.preventDefault();e.stopPropagation();const id=b.dataset.courseId;if(b.dataset.courseAction==='add')add(id);else if(b.dataset.courseAction==='start')start(id)},true);
  const app=document.getElementById('app');
  if(app){const observer=new MutationObserver(()=>{observer.disconnect();requestAnimationFrame(()=>{refresh();observer.observe(app,{childList:true,subtree:true});});});observer.observe(app,{childList:true,subtree:true});}
  styles();refresh();
})();
