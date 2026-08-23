// Enrollment + prerequisite gate layer for the personal engineering campus.
(function(){
  'use strict';
  const ENROLL_KEY='campus-enrolled-courses';
  const STARTED_KEY='campus-started-courses';
  const load=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const ids=v=>new Set((Array.isArray(v)?v:[]).map(String));
  const esc=v=>String(v??'').replace(/[&<>\\\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[c]));
  const getProgress=(id)=>Math.max(
    Number(localStorage.getItem(`progress-${id}`)||0),
    Number(localStorage.getItem(`catalog-progress-${id}`)||0),
    Number(localStorage.getItem(`academic-progress-${id}`)||0)
  );
  const enrolled=()=>ids(load(ENROLL_KEY));
  const started=()=>ids(load(STARTED_KEY));

  function allCourses(){
    const out=[]; const seen=new Set(); const add=(c,id)=>{
      if(!c)return;
      const cid=String(c.id||c.courseId||id||''); if(!cid||seen.has(cid))return;
      seen.add(cid); out.push({...c,id:cid,courseId:String(c.courseId||cid)});
    };
    (window.COURSE_LIBRARY||[]).forEach(c=>add(c));
    (window.ELECTIVE_CATALOG||[]).forEach(c=>add(c));
    const A=window.CAMPUS_ACADEMIC||{};
    Object.entries(A.core||{}).forEach(([id,c])=>add(c,id));
    (A.civilExpansion||[]).forEach(c=>add(c));
    (A.electives||[]).forEach(c=>add(c));
    return out;
  }
  function find(id){return allCourses().find(c=>String(c.id||c.courseId)===String(id))||null}
  function prereqs(c){return Array.isArray(c?.prereq)?c.prereq.map(String):[]}
  function unmet(c){return prereqs(c).filter(id=>getProgress(id)<100)}
  function isComplete(c){return !!c && getProgress(c.id||c.courseId)>=100}

  function enroll(id){
    const c=find(id); if(!c)return {ok:false,reason:'Course not found'};
    const missing=unmet(c);
    if(missing.length)return {ok:false,reason:'Prerequisites incomplete',missing};
    const a=enrolled(); if(!a.has(String(c.id))){a.add(String(c.id));save(ENROLL_KEY,[...a]);}
    window.dispatchEvent(new CustomEvent('enrollment-changed',{detail:{id:String(c.id)}}));
    return {ok:true};
  }
  function start(id){
    const r=enroll(id); if(!r.ok)return r;
    const a=started();a.add(String(id));save(STARTED_KEY,[...a]);
    localStorage.setItem(`status-${id}`,'Started');
    window.dispatchEvent(new CustomEvent('course-started',{detail:{id:String(id)}}));
    return {ok:true};
  }
  function openCourse(id){
    document.querySelectorAll('.catalog-backdrop,.catalog-detail,.final-modal').forEach(x=>x.remove());
    const b=document.querySelector(`[data-detail="${CSS.escape(String(id))}"]`);
    if(b)b.click(); else window.toast?.('Open this course from Full Catalog.');
  }

  function ensureStyles(){
    if(document.getElementById('enrollment-css'))return;
    const s=document.createElement('style');s.id='enrollment-css';s.textContent=`
      .enroll-lock{padding:12px 14px;border:1px solid rgba(225,190,112,.22);background:rgba(225,190,112,.06);border-radius:12px;color:#ead9aa;font-size:.8rem;line-height:1.55;margin-top:10px}
      .enroll-prereqs{display:flex;flex-wrap:wrap;gap:7px;margin-top:9px}.enroll-prereq-chip{border:1px solid rgba(196,220,240,.12);background:rgba(255,255,255,.03);color:#c8d5e1;border-radius:999px;padding:5px 8px;font-size:.68rem}
      .enroll-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.enroll-btn{border:1px solid rgba(196,220,240,.14);background:rgba(255,255,255,.025);color:#eff5fb;border-radius:10px;padding:8px 11px;font-size:.78rem;cursor:pointer}.enroll-btn.primary{background:linear-gradient(135deg,#63d8ff,#8f9bff);border:0;color:#07111b;font-weight:850}.enroll-btn.locked{opacity:.65;cursor:not-allowed}.enroll-btn.success{color:#72e4bc;border-color:rgba(114,228,188,.25);background:rgba(114,228,188,.07)}
      .enrollment-modal{position:fixed;inset:0;z-index:280;background:rgba(2,7,12,.9);backdrop-filter:blur(16px);padding:18px;overflow:auto}.enrollment-panel{max-width:1320px;margin:0 auto;background:linear-gradient(180deg,#122235,#08131f);border:1px solid rgba(196,220,240,.15);border-radius:24px;padding:28px;min-height:calc(100vh - 36px)}
      .enrollment-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;border-bottom:1px solid rgba(196,220,240,.10);padding-bottom:18px}.enrollment-close{width:42px;height:42px;border-radius:50%;border:1px solid rgba(196,220,240,.15);background:rgba(255,255,255,.03);color:#eff5fb;font-size:1.4rem;cursor:pointer}.enrollment-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:18px}.semester-card{border:1px solid rgba(196,220,240,.12);border-radius:16px;background:rgba(255,255,255,.025);overflow:hidden}.semester-head{padding:14px;border-bottom:1px solid rgba(196,220,240,.08)}.course-row{padding:12px 14px;border-bottom:1px solid rgba(196,220,240,.06)}.course-row:last-child{border-bottom:0}.course-title{font-weight:800}.course-meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}.course-meta span{font-size:.65rem;color:#9fb1c3;border:1px solid rgba(196,220,240,.10);padding:4px 7px;border-radius:999px}.course-status{font-size:.7rem;margin-top:8px}.status-complete{color:#72e4bc}.status-enrolled{color:#63d8ff}.status-locked{color:#ead9aa}.status-ready{color:#b6c5d2}
      @media(max-width:1100px){.enrollment-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:700px){.enrollment-grid{grid-template-columns:1fr}.enrollment-panel{padding:18px}.enrollment-modal{padding:8px}}
    `;document.head.appendChild(s);
  }

  function semesterFor(id){
    const A=window.CAMPUS_ACADEMIC||{}; const plan=A.semesterPlan||[];
    const hit=plan.findIndex(s=>(s.required||[]).includes(id)||(s.recommended||[]).includes(id));
    return hit>=0?hit+1:null;
  }
  function renderEnrollment(){
    ensureStyles();
    const A=window.CAMPUS_ACADEMIC||{}; const plan=A.semesterPlan||[]; const all=allCourses();
    const enrolledSet=enrolled(); const startedSet=started();
    const byId=new Map(all.map(c=>[String(c.id),c]));
    const modal=document.createElement('div');modal.className='enrollment-modal';modal.id='enrollment-modal';
    modal.innerHTML=`<div class="enrollment-panel"><div class="enrollment-head"><div><div class="eyebrow">DEGREE REGISTRATION · PREREQUISITE GATE</div><h2 style="margin:.25rem 0 .45rem;font-size:2.25rem">Course Enrollment</h2><div class="muted-small">Register only for courses whose prerequisites are actually completed. Locked courses cannot be enrolled or completed by shortcut.</div></div><button class="enrollment-close" id="enrollment-close">×</button></div><div class="enrollment-grid">${plan.map((sem,idx)=>{
      const required=sem.required||[]; const recommended=sem.recommended||[]; const idsFor=[...required,...recommended];
      return `<section class="semester-card"><div class="semester-head"><div class="eyebrow">SEMESTER ${idx+1}</div><strong>${esc(sem.name)}</strong><div class="muted-small" style="margin-top:5px">${esc(sem.theme||'')}</div></div>${idsFor.map(id=>{
        const c=byId.get(String(id))||{id,title:id,role:required.includes(id)?'Required':'Recommended'}; const missing=unmet(c); const comp=isComplete(c); const enr=enrolledSet.has(String(c.id)); const st=startedSet.has(String(c.id));
        const status=comp?'<span class="status-complete">✓ Completed</span>':st?'<span class="status-enrolled">▶ Started</span>':enr?'<span class="status-enrolled">● Enrolled</span>':missing.length?'<span class="status-locked">🔒 Prerequisites required</span>':'<span class="status-ready">Ready to enroll</span>';
        return `<div class="course-row"><div class="course-title">${esc(c.title||id)}</div><div class="course-meta"><span>${esc(c.id||id)}</span><span>${required.includes(id)?'Required':'Recommended'}</span><span>Stage ${esc(String(c.stage||semesterFor(id)||''))}</span></div><div class="course-status">${status}</div>${missing.length?`<div class="enroll-lock">Locked. Complete these first: <div class="enroll-prereqs">${missing.map(pid=>{const pc=find(pid);return `<button type="button" class="enroll-prereq-chip" data-open-prereq="${esc(pid)}">${esc(pc?.title||pid)}</button>`}).join('')}</div></div>`:''}<div class="enroll-actions">${!comp&&!missing.length&&!enr?`<button type="button" class="enroll-btn primary" data-enroll="${esc(c.id||id)}">＋ Add / Enroll</button>`:''}${enr&&!st&&!comp?`<button type="button" class="enroll-btn primary" data-start="${esc(c.id||id)}">▶ Start Course</button>`:''}${st&&!comp?`<span class="enroll-btn success">✓ Started</span>`:''}${comp?`<span class="enroll-btn success">✓ Completed</span>`:''}</div></div>`;
      }).join('')}</section>`;
    }).join('')}</div><div class="enroll-lock" style="margin-top:18px">Rule: the enrollment screen never offers a <strong>Mark as completed</strong> action for a locked course. To unlock it, actually complete the prerequisite course(s) and return here.</div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('#enrollment-close').addEventListener('click',()=>modal.remove());
    modal.querySelectorAll('[data-enroll]').forEach(b=>b.addEventListener('click',()=>{const r=enroll(b.dataset.enroll); if(!r.ok){window.toast?.('Prerequisites are incomplete.');return;} renderEnrollment();window.toast?.('Course enrolled');}));
    modal.querySelectorAll('[data-start]').forEach(b=>b.addEventListener('click',()=>{const r=start(b.dataset.start); if(!r.ok){window.toast?.('Prerequisites are incomplete.');return;} renderEnrollment();window.toast?.('Course started');}));
    modal.querySelectorAll('[data-open-prereq]').forEach(b=>b.addEventListener('click',()=>{modal.remove(); openCourse(b.dataset.openPrereq);}));
  }

  function injectNav(){
    const nav=document.querySelector('.sidebar .nav'); if(!nav||nav.querySelector('[data-enrollment-tab]'))return;
    const b=document.createElement('button');b.className='nav-btn';b.dataset.enrollmentTab='1';b.innerHTML='<span>▤</span><span class="nav-label">Course Enrollment</span>';b.addEventListener('click',renderEnrollment);nav.appendChild(b);
  }

  function cardButtons(){
    document.querySelectorAll('.course-card[data-course]').forEach(card=>{
      if(card.querySelector('.enroll-inline'))return;
      const id=String(card.dataset.course); const c=find(id); if(!c)return; const footer=card.querySelector('.course-bottom'); if(!footer)return;
      const b=document.createElement('button');b.type='button';b.className='ghost enroll-inline'; const missing=unmet(c); const enr=enrolled().has(id); const st=started().has(id);
      if(missing.length)b.textContent='🔒 Prerequisites'; else if(st)b.textContent='✓ Started'; else if(enr)b.textContent='▶ Start'; else b.textContent='＋ Enroll';
      b.addEventListener('click',e=>{e.stopPropagation();if(missing.length){renderEnrollment();return;} if(!enr){const r=enroll(id);if(r.ok)window.toast?.('Course enrolled — ready to start');} else if(!st){const r=start(id);if(r.ok)window.toast?.('Course started');} renderEnrollment();});
      footer.insertBefore(b,footer.firstChild);
    });
  }

  function gateMarkComplete(){
    // Remove generic completion shortcuts from catalog detail when prerequisites are incomplete.
    const detail=document.querySelector('.catalog-detail-card'); if(!detail)return;
    const h=detail.querySelector('h2'); if(!h)return; const c=allCourses().find(x=>String(x.title||'').trim()===h.textContent.trim()); if(!c)return;
    const missing=unmet(c); const completeBtn=document.getElementById('catalog-complete');
    if(completeBtn && missing.length){completeBtn.remove();}
  }

  function refresh(){injectNav();cardButtons();gateMarkComplete();}
  const app=document.getElementById('app'); if(app){const obs=new MutationObserver(()=>requestAnimationFrame(refresh));obs.observe(app,{childList:true,subtree:true});}
  window.addEventListener('enrollment-changed',refresh);window.addEventListener('course-started',refresh);
  ensureStyles();refresh();
  window.CAMPUS_ENROLLMENT={allCourses,enrolled,started,find,prereqs,unmet,isComplete,enroll,start,renderEnrollment};
})();
