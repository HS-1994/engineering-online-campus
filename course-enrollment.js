// Stable local course enrollment + start controls.
// No MutationObserver and no global re-render hooks: actions are event-driven only.
(function(){
  'use strict';

  const ENROLLED_KEY='campus-enrolled-courses';
  const STARTED_KEY='campus-started-courses';

  const load=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return[]}};
  const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const ids=(key)=>new Set(load(key).map(String));
  const esc=v=>String(v??'').replace(/[&<>\\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[c]));

  function catalogItems(){
    const out=[];
    const add=c=>{if(c && (c.id||c.courseId||c.title)) out.push(c);};
    (window.COURSE_LIBRARY||[]).forEach(add);
    (window.ELECTIVE_CATALOG||[]).forEach(add);
    const A=window.CAMPUS_ACADEMIC||{};
    Object.entries(A.core||{}).forEach(([id,c])=>add({...c,id,courseId:c.courseId||id}));
    (A.civilExpansion||[]).forEach(add);
    const seen=new Set();
    return out.filter(c=>{const id=String(c.id||c.courseId||c.title);if(seen.has(id))return false;seen.add(id);return true;});
  }

  function findCourse(id,title){
    const all=catalogItems();
    if(id){const hit=all.find(c=>String(c.id||c.courseId)===String(id));if(hit)return hit;}
    if(title){const hit=all.find(c=>String(c.title||'').trim()===String(title).trim());if(hit)return hit;}
    return {id:id||title,courseId:id||title,title:title||id||'Course',track:'Engineering',role:'Course',stage:''};
  }

  function currentDetailCourse(){
    const detail=document.querySelector('.catalog-detail-card');
    if(!detail)return null;
    return findCourse('',detail.querySelector('h2')?.textContent?.trim());
  }

  function toast(message){window.toast?.(message);}

  function enroll(course){
    const id=String(course.id||course.courseId);
    const list=load(ENROLLED_KEY).map(String);
    if(!list.includes(id)){list.push(id);save(ENROLLED_KEY,list);toast('Course added to My Courses');}
    return id;
  }

  function start(course){
    const id=enroll(course);
    const list=load(STARTED_KEY).map(String);
    if(!list.includes(id)){list.push(id);save(STARTED_KEY,list);}
    localStorage.setItem(`status-${id}`,'Started');
    localStorage.setItem(`started-at-${id}`,new Date().toISOString());
    toast('Course started');
    renderDetailActions();
    renderHomeEnrollment();
  }

  function button(label,action,cls){
    const b=document.createElement('button');
    b.type='button'; b.className=cls||'enroll-btn'; b.textContent=label;
    b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();action();});
    return b;
  }

  function renderDetailActions(){
    const detail=document.querySelector('.catalog-detail-card');
    if(!detail)return;
    let panel=detail.querySelector('.course-enrollment-panel');
    const course=currentDetailCourse(); if(!course)return;
    const id=String(course.id||course.courseId);
    const isEnrolled=ids(ENROLLED_KEY).has(id);
    const isStarted=ids(STARTED_KEY).has(id);

    if(!panel){
      panel=document.createElement('section');
      panel.className='course-enrollment-panel';
      detail.insertBefore(panel,detail.querySelector('.catalog-progress')||detail.firstElementChild?.nextSibling||null);
    }
    panel.replaceChildren();
    const copy=document.createElement('div');
    copy.innerHTML=`<div class="eyebrow">MY COURSE</div><strong>${isStarted?'Started':'Available to add'}</strong><div class="enroll-sub">${isStarted?'This course is in Started Courses.':'Add it to your personal course list, then start it when you are ready.'}</div>`;
    const actions=document.createElement('div'); actions.className='enroll-actions';
    if(!isEnrolled){
      actions.appendChild(button('＋ Add Course',()=>{enroll(course);renderDetailActions();renderHomeEnrollment();},'enroll-btn primary'));
    }else{
      const enrolled=button('✓ Added to My Courses',()=>{},'enroll-btn added'); enrolled.disabled=true; actions.appendChild(enrolled);
    }
    if(!isStarted){
      actions.appendChild(button('▶ Start Course',()=>start(course),'enroll-btn start'));
    }else{
      const started=button('✓ Course Started',()=>{},'enroll-btn started'); started.disabled=true; actions.appendChild(started);
    }
    panel.append(copy,actions);
  }

  function renderCardActions(){
    document.querySelectorAll('.catalog-card').forEach(card=>{
      if(card.querySelector('.enroll-card-actions'))return;
      const detailBtn=card.querySelector('[data-detail]'); if(!detailBtn)return;
      const id=detailBtn.dataset.detail;
      const course=findCourse(id,'');
      const enrolled=ids(ENROLLED_KEY).has(String(course.id||course.courseId));
      const started=ids(STARTED_KEY).has(String(course.id||course.courseId));
      const box=document.createElement('div');box.className='enroll-card-actions';
      box.appendChild(button(enrolled?'✓ Added':'＋ Add Course',()=>{enroll(course);renderCardActions();renderHomeEnrollment();},enrolled?'enroll-card-btn added':'enroll-card-btn'));
      box.appendChild(button(started?'✓ Started':'▶ Start Course',()=>start(course),started?'enroll-card-btn started':'enroll-card-btn start'));
      const actions=card.querySelector('.catalog-actions');
      if(actions) actions.appendChild(box); else card.appendChild(box);
    });
  }

  function renderHomeEnrollment(){
    const home=document.querySelector('.dashboard-grid'); if(!home)return;
    home.querySelector('.local-enrolled-card')?.remove();
    const all=catalogItems();
    const enrolled=load(ENROLLED_KEY).map(String).map(id=>all.find(c=>String(c.id||c.courseId)===id)).filter(Boolean);
    if(!enrolled.length)return;
    const started=ids(STARTED_KEY);
    const section=document.createElement('section');section.className='card local-enrolled-card';
    const rows=enrolled.map(c=>{
      const id=String(c.id||c.courseId); const s=started.has(id);
      return `<article class="enrolled-course-row"><div><div class="eyebrow">${esc(c.track||'Engineering')}</div><h3>${esc(c.title)}</h3><div class="tiny muted">${s?'Started':'Added to My Courses'}</div></div></article>`;
    }).join('');
    section.innerHTML=`<div class="section-head"><div><h2>My Enrolled Courses</h2><div class="sub">Your personal course queue</div></div><span class="pill good">${enrolled.length}</span></div><div class="enrolled-list">${rows}</div>`;
    const target=home.querySelector('.grid.grid-2');
    if(target?.parentNode===home)home.insertBefore(section,target);else home.prepend(section);
  }

  function injectStyles(){
    if(document.getElementById('enrollment-css'))return;
    const s=document.createElement('style');s.id='enrollment-css';s.textContent=`
      .course-enrollment-panel{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin:18px 0;padding:16px;border:1px solid rgba(99,216,255,.2);border-radius:14px;background:linear-gradient(135deg,rgba(99,216,255,.07),rgba(143,155,255,.04))}.course-enrollment-panel strong{font-size:1.05rem}.enroll-sub{margin-top:4px;color:#91a4b7;font-size:.78rem}.enroll-actions{display:flex;gap:8px;flex-wrap:wrap}.enroll-btn,.enroll-card-btn{border:1px solid rgba(196,220,240,.16);background:rgba(255,255,255,.035);color:#eff5fb;border-radius:10px;padding:10px 12px;font-weight:800;cursor:pointer}.enroll-btn.primary,.enroll-card-btn{background:linear-gradient(135deg,#63d8ff,#8f9bff);color:#07111b;border:0}.enroll-btn.start,.enroll-card-btn.start{background:linear-gradient(135deg,#72e4bc,#63d8ff);color:#07111b;border:0}.enroll-btn.added,.enroll-card-btn.added,.enroll-btn.started,.enroll-card-btn.started{background:rgba(114,228,188,.09);color:#72e4bc;border:1px solid rgba(114,228,188,.25);cursor:default}.enroll-card-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.local-enrolled-card{margin-top:16px}.enrolled-list{display:grid;gap:8px}.enrolled-course-row{padding:12px 0;border-bottom:1px solid rgba(196,220,240,.08)}.enrolled-course-row:last-child{border-bottom:0}.enrolled-course-row h3{margin:3px 0}.enrolled-course-row .tiny{margin-top:4px}
      @media(max-width:680px){.course-enrollment-panel{align-items:flex-start;flex-direction:column}.enroll-actions,.enroll-btn{width:100%}.enroll-card-actions{display:grid;grid-template-columns:1fr 1fr}.enroll-card-btn{width:100%}}
    `;document.head.appendChild(s);
  }

  function afterCatalogOpen(){setTimeout(()=>{renderCardActions();renderDetailActions();},30);}

  document.addEventListener('click',e=>{
    const full=e.target.closest('[data-full-catalog]');
    if(full){afterCatalogOpen();return;}
    const detail=e.target.closest('[data-detail]');
    if(detail){setTimeout(renderDetailActions,30);return;}
    const study=e.target.closest('[data-study]');
    if(study){setTimeout(renderDetailActions,30);return;}
    if(e.target.closest('[data-nav="dashboard"]'))setTimeout(renderHomeEnrollment,30);
  });

  injectStyles();
  setTimeout(renderHomeEnrollment,50);
})();
