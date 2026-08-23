// Engineering Online Campus — enrollment, registration, prerequisite gates.
// Local-first. No server, no recursive DOM observer, no shortcut completion for locked courses.
(function(){
  'use strict';
  const ENROLLED_KEY='campus-enrolled-courses';
  const STARTED_KEY='campus-started-courses';

  const load=(key, fallback=[])=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return Array.isArray(v)?v:fallback}catch{return fallback}};
  const save=(key,v)=>localStorage.setItem(key,JSON.stringify(v));
  const setOf=key=>new Set(load(key).map(String));
  const esc=v=>String(v??'').replace(/[&<>\\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[c]));
  const progress=id=>Math.max(Number(localStorage.getItem(`progress-${id}`)||0),Number(localStorage.getItem(`catalog-progress-${id}`)||0),Number(localStorage.getItem(`academic-progress-${id}`)||0));
  const complete=id=>progress(id)>=100;

  function courses(){
    const out=[];const seen=new Set();
    const add=(c,id)=>{if(!c)return;const cid=String(c.id||c.courseId||id||'');if(!cid||seen.has(cid))return;seen.add(cid);out.push({...c,id:cid,courseId:String(c.courseId||cid)});};
    (window.COURSE_LIBRARY||[]).forEach(c=>add(c));
    (window.ELECTIVE_CATALOG||[]).forEach(c=>add(c));
    const A=window.CAMPUS_ACADEMIC||{};
    Object.entries(A.core||{}).forEach(([id,c])=>add(c,id));
    (A.civilExpansion||[]).forEach(c=>add(c));
    (A.electives||[]).forEach(c=>add(c));
    return out;
  }
  function find(id){return courses().find(c=>String(c.id||c.courseId)===String(id))||null}
  function prereqs(c){return Array.isArray(c?.prereq)?c.prereq.map(String):[]}
  function missing(c){return prereqs(c).filter(id=>!complete(id))}
  function title(id){return find(id)?.title||id}

  function toast(msg){window.toast?.(msg)}
  function enroll(id){
    const c=find(id);if(!c)return {ok:false,missing:[]};
    const m=missing(c);if(m.length){toast('Enrollment locked: complete the prerequisites first.');return {ok:false,missing:m};}
    const a=setOf(ENROLLED_KEY);a.add(String(id));save(ENROLLED_KEY,[...a]);window.dispatchEvent(new CustomEvent('enrollment-changed',{detail:{id:String(id)}}));return {ok:true};
  }
  function start(id){
    const r=enroll(id);if(!r.ok)return r;
    const a=setOf(STARTED_KEY);a.add(String(id));save(STARTED_KEY,[...a]);localStorage.setItem(`status-${id}`,'Started');localStorage.setItem(`started-at-${id}`,new Date().toISOString());window.dispatchEvent(new CustomEvent('course-started',{detail:{id:String(id)}}));toast('Course started');return {ok:true};
  }
  function isEnrolled(id){return setOf(ENROLLED_KEY).has(String(id))}
  function isStarted(id){return setOf(STARTED_KEY).has(String(id))}

  function css(){
    if(document.getElementById('enrollment-css'))return;
    const s=document.createElement('style');s.id='enrollment-css';s.textContent=`
      .enrollment-tab-badge{margin-left:auto;font-size:.62rem;padding:4px 7px;border-radius:999px;background:rgba(99,216,255,.1);color:#91e2ff;border:1px solid rgba(99,216,255,.18)}
      .enrollment-modal{position:fixed;inset:0;z-index:300;background:rgba(2,7,12,.92);backdrop-filter:blur(16px);padding:18px;overflow:auto}.enrollment-panel{max-width:1400px;margin:0 auto;background:linear-gradient(180deg,#122235,#08131f);border:1px solid rgba(196,220,240,.15);border-radius:24px;padding:28px;min-height:calc(100vh - 36px)}
      .enrollment-head{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;border-bottom:1px solid rgba(196,220,240,.10);padding-bottom:18px}.enrollment-close{width:42px;height:42px;border-radius:50%;border:1px solid rgba(196,220,240,.15);background:rgba(255,255,255,.03);color:#eff5fb;font-size:1.4rem;cursor:pointer}
      .enrollment-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:18px 0}.enrollment-metric{padding:14px;border:1px solid rgba(196,220,240,.10);border-radius:14px;background:rgba(255,255,255,.025)}.enrollment-metric .n{font-size:1.5rem;font-weight:900}.enrollment-metric .l{font-size:.7rem;color:#8ea1b4;text-transform:uppercase;letter-spacing:.08em}
      .semester-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.semester-card{border:1px solid rgba(196,220,240,.12);border-radius:16px;background:rgba(255,255,255,.025);overflow:hidden}.semester-head{padding:14px;border-bottom:1px solid rgba(196,220,240,.08)}.semester-course{padding:13px 14px;border-bottom:1px solid rgba(196,220,240,.06)}.semester-course:last-child{border-bottom:0}.semester-course h4{margin:0 0 5px;font-size:.94rem}.course-tags{display:flex;gap:6px;flex-wrap:wrap}.course-tags span{font-size:.62rem;color:#9fb1c3;border:1px solid rgba(196,220,240,.1);padding:4px 7px;border-radius:999px}.course-status{margin-top:8px;font-size:.7rem}.status-complete{color:#72e4bc}.status-started{color:#63d8ff}.status-enrolled{color:#91e2ff}.status-ready{color:#b6c5d2}.status-locked{color:#ead9aa}
      .prereq-box{margin-top:8px;padding:9px 10px;border-radius:10px;border:1px solid rgba(225,190,112,.18);background:rgba(225,190,112,.06);color:#ead9aa;font-size:.7rem;line-height:1.5}.prereq-list{display:flex;gap:5px;flex-wrap:wrap;margin-top:6px}.prereq-chip{border:1px solid rgba(225,190,112,.2);background:rgba(225,190,112,.06);color:#ead9aa;border-radius:999px;padding:4px 7px;font-size:.62rem;cursor:pointer}.enroll-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.enroll-btn{border:1px solid rgba(196,220,240,.14);background:rgba(255,255,255,.03);color:#eff5fb;border-radius:10px;padding:8px 10px;font-size:.72rem;font-weight:800;cursor:pointer}.enroll-btn.primary{background:linear-gradient(135deg,#63d8ff,#8f9bff);border:0;color:#07111b}.enroll-btn.start{background:linear-gradient(135deg,#72e4bc,#63d8ff);border:0;color:#07111b}.enroll-btn.done{color:#72e4bc;border-color:rgba(114,228,188,.25);background:rgba(114,228,188,.07);cursor:default}.enroll-btn.locked{opacity:.7;cursor:not-allowed}
      .course-enrollment-panel{margin:16px 0;padding:16px;border:1px solid rgba(99,216,255,.18);border-radius:14px;background:linear-gradient(135deg,rgba(99,216,255,.06),rgba(143,155,255,.04));display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap}.course-enrollment-panel .sub{color:#91a4b7;font-size:.76rem;margin-top:4px}.course-lock{margin-top:8px}.course-lock strong{color:#ead9aa}
      .inline-enroll{margin-left:6px}.inline-enroll.locked{color:#ead9aa;border-color:rgba(225,190,112,.18)}
      @media(max-width:1100px){.semester-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.enrollment-summary{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:700px){.semester-grid,.enrollment-summary{grid-template-columns:1fr}.enrollment-panel{padding:18px}.enrollment-modal{padding:8px}.course-enrollment-panel{align-items:flex-start;flex-direction:column}.enroll-btn{width:100%}}
    `;document.head.appendChild(s);
  }

  function semesterIndexFor(id){
    const plan=(window.CAMPUS_ACADEMIC||{}).semesterPlan||[];const i=plan.findIndex(s=>(s.required||[]).map(String).includes(String(id))||(s.recommended||[]).map(String).includes(String(id)));return i<0?null:i+1;
  }

  function openEnrollment(){
    css();document.getElementById('enrollment-modal')?.remove();
    const A=window.CAMPUS_ACADEMIC||{};const plan=A.semesterPlan||[];const all=courses();const map=new Map(all.map(c=>[String(c.id),c]));
    const e=setOf(ENROLLED_KEY),s=setOf(STARTED_KEY);
    const requiredCount=plan.reduce((n,x)=>n+(x.required||[]).length,0),completedCount=[...e].filter(id=>complete(id)).length;
    const modal=document.createElement('div');modal.className='enrollment-modal';modal.id='enrollment-modal';
    modal.innerHTML=`<div class="enrollment-panel"><div class="enrollment-head"><div><div class="eyebrow">DEGREE REGISTRATION · STRUCTURED PREREQUISITES</div><h2 style="margin:.25rem 0 .45rem;font-size:2.3rem">Course Enrollment</h2><div class="muted-small">This is your registration gate. A course stays locked until every prerequisite is genuinely completed. There is no shortcut <em>Mark as completed</em> option for a locked course.</div></div><button class="enrollment-close" id="enrollment-close">×</button></div><div class="enrollment-summary"><div class="enrollment-metric"><div class="n">${requiredCount}</div><div class="l">Core / planned courses</div></div><div class="enrollment-metric"><div class="n">${e.size}</div><div class="l">Enrolled</div></div><div class="enrollment-metric"><div class="n">${s.size}</div><div class="l">Started</div></div><div class="enrollment-metric"><div class="n">${[...e].filter(id=>complete(id)).length}</div><div class="l">Completed</div></div></div><div class="semester-grid">${plan.map((sem,idx)=>renderSemester(sem,idx,map,e,s)).join('')}</div><div class="prereq-box" style="margin-top:16px"><strong>How the gate works:</strong> foundation courses unlock later courses. For example, a course requiring <strong>MTH101 + PHY101</strong> cannot be enrolled until both show <strong>100% complete</strong> in your academic record. You must actually study the prerequisite; the enrollment page will never tell you to fake completion.</div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('#enrollment-close').addEventListener('click',()=>modal.remove());
    modal.addEventListener('click',ev=>{const b=ev.target.closest('[data-enroll-id]');if(b){const r=enroll(b.dataset.enrollId);if(r.ok){toast('Course enrolled');openEnrollment();}return;}const st=ev.target.closest('[data-start-id]');if(st){const r=start(st.dataset.startId);if(r.ok){openEnrollment();}return;}const p=ev.target.closest('[data-prereq-id]');if(p){modal.remove();openCourse(p.dataset.prereqId);}});
  }

  function renderSemester(sem,idx,map,e,s){
    const ids=[...(sem.required||[]),...(sem.recommended||[])].map(String);
    return `<section class="semester-card"><div class="semester-head"><div class="eyebrow">SEMESTER ${idx+1}</div><strong>${esc(sem.name)}</strong><div class="muted-small" style="margin-top:5px">${esc(sem.theme||'')}</div></div>${ids.map(id=>{
      const c=map.get(id)||{id,courseId:id,title:id,role:(sem.required||[]).map(String).includes(id)?'Required':'Recommended'};const m=missing(c);const done=complete(id);const en=e.has(id);const st=s.has(id);
      let status=done?'<span class="status-complete">✓ Completed</span>':st?'<span class="status-started">▶ Started</span>':en?'<span class="status-enrolled">● Enrolled</span>':m.length?'<span class="status-locked">🔒 Locked by prerequisites</span>':'<span class="status-ready">Ready to enroll</span>';
      const prereq=m.length?`<div class="prereq-box"><strong>Complete first:</strong><div class="prereq-list">${m.map(pid=>`<button type="button" class="prereq-chip" data-prereq-id="${esc(pid)}">${esc(title(pid))}</button>`).join('')}</div></div>`:'';
      let actions='';
      if(done)actions='<span class="enroll-btn done">✓ Completed</span>';
      else if(st)actions='<span class="enroll-btn done">✓ Started</span>';
      else if(en)actions=`<button type="button" class="enroll-btn start" data-start-id="${esc(id)}">▶ Start Course</button>`;
      else if(!m.length)actions=`<button type="button" class="enroll-btn primary" data-enroll-id="${esc(id)}">＋ Add Course</button>`;
      else actions='<span class="enroll-btn locked">Prerequisites required</span>';
      return `<article class="semester-course"><h4>${esc(c.title)}</h4><div class="course-tags"><span>${esc(c.id||id)}</span><span>${(sem.required||[]).map(String).includes(id)?'Required':'Recommended'}</span>${c.credits?`<span>${esc(c.credits)} credits</span>`:''}</div><div class="course-status">${status}</div>${prereq}<div class="enroll-actions">${actions}</div></article>`;
    }).join('')}</section>`;
  }

  function openCourse(id){
    // Reuse the existing Full Catalog detail view when available, without recursively rendering the campus.
    document.getElementById('enrollment-modal')?.remove();
    const nav=document.querySelector('[data-full-catalog]');
    if(nav){nav.click();setTimeout(()=>{const b=document.querySelector(`[data-detail="${CSS.escape(String(id))}"]`);if(b)b.click();},60);}else toast('Open Full Catalog to view this prerequisite.');
  }

  function injectTab(){
    const nav=document.querySelector('.sidebar .nav');if(!nav||nav.querySelector('[data-course-enrollment]'))return;
    const b=document.createElement('button');b.type='button';b.className='nav-btn';b.dataset.courseEnrollment='1';b.innerHTML='<span>▤</span><span class="nav-label">Course Enrollment</span><span class="enrollment-tab-badge">REG</span>';b.addEventListener('click',openEnrollment);nav.appendChild(b);
  }

  function cardActions(){
    document.querySelectorAll('.course-card[data-course]').forEach(card=>{
      if(card.querySelector('.inline-enroll'))return;const id=String(card.dataset.course);const c=find(id);if(!c)return;const footer=card.querySelector('.course-bottom');if(!footer)return;
      const m=missing(c),en=isEnrolled(id),st=isStarted(id);const b=document.createElement('button');b.type='button';b.className='ghost inline-enroll'+(m.length?' locked':'');b.textContent=m.length?'🔒 Prerequisites':st?'✓ Started':en?'▶ Start':'＋ Enroll';
      b.addEventListener('click',ev=>{ev.stopPropagation();if(m.length){openEnrollment();return;}const r=en?start(id):enroll(id);if(r.ok){toast(en?'Course started':'Course enrolled');cardActions();}});footer.insertBefore(b,footer.firstChild);
    });
  }

  function detailGate(){
    const detail=document.querySelector('.catalog-detail-card');if(!detail)return;const h=detail.querySelector('h2');if(!h)return;const c=courses().find(x=>String(x.title||'').trim()===h.textContent.trim());if(!c)return;
    const id=String(c.id||c.courseId);const m=missing(c);let panel=detail.querySelector('.course-enrollment-panel');
    if(!panel){panel=document.createElement('section');panel.className='course-enrollment-panel';detail.insertBefore(panel,detail.querySelector('.catalog-progress')||detail.firstElementChild?.nextSibling||null);}
    const en=isEnrolled(id),st=isStarted(id);
    panel.innerHTML=`<div><div class="eyebrow">REGISTRATION STATUS</div><strong>${st?'Started':en?'Enrolled':m.length?'Locked':'Ready to enroll'}</strong><div class="sub">${m.length?`Prerequisites required before enrollment. ${m.map(title).join(' · ')}`:'Use Add Course to put it in your personal registration list.'}</div>${m.length?`<div class="course-lock prereq-list">${m.map(pid=>`<button type="button" class="prereq-chip" data-detail-prereq="${esc(pid)}">${esc(title(pid))}</button>`).join('')}</div>`:''}</div><div class="enroll-actions">${m.length?'<span class="enroll-btn locked">🔒 Locked</span>':!en?`<button type="button" class="enroll-btn primary" data-detail-enroll="${esc(id)}">＋ Add Course</button>`:`<span class="enroll-btn done">✓ Added</span>`}${!m.length&&!st?`<button type="button" class="enroll-btn start" data-detail-start="${esc(id)}">▶ Start Course</button>`:st?'<span class="enroll-btn done">✓ Started</span>':''}</div>`;
    // Never expose a completion shortcut for a course whose prerequisites are not complete.
    if(m.length)document.getElementById('catalog-complete')?.remove();
    panel.querySelector('[data-detail-enroll]')?.addEventListener('click',()=>{const r=enroll(id);if(r.ok){toast('Course enrolled');detailGate();}});
    panel.querySelector('[data-detail-start]')?.addEventListener('click',()=>{const r=start(id);if(r.ok){toast('Course started');detailGate();}});
    panel.querySelectorAll('[data-detail-prereq]').forEach(x=>x.addEventListener('click',()=>openCourse(x.dataset.detailPrereq)));
  }

  function refresh(){injectTab();cardActions();detailGate();}
  css();
  const app=document.getElementById('app');
  if(app){let scheduled=false;const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;refresh();});});observer.observe(app,{childList:true,subtree:true});}
  window.addEventListener('enrollment-changed',refresh);window.addEventListener('course-started',refresh);window.addEventListener('course-stopped',refresh);refresh();
  window.CAMPUS_ENROLLMENT={courses,enrolled:()=>setOf(ENROLLED_KEY),started:()=>setOf(STARTED_KEY),find,prereqs,missing,complete,enroll,start,openEnrollment};
})();
