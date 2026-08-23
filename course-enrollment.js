// Engineering Online Campus — Enrollment Center
// Full material catalog + 8-semester structure + prerequisite gates.
// Local-first. No completion shortcuts and no DOM mutation observer.
(function(){
  'use strict';
  const ENROLLED='campus-enrolled-courses';
  const STARTED='campus-started-courses';
  let activeTab='plan';
  let query='';
  let track='All';
  let kind='All';

  const load=(k,d=[])=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return Array.isArray(v)?v:d}catch{return d}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const set=k=>new Set(load(k).map(String));
  const esc=v=>String(v??'').replace(/[&<>\\\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','\"':'&quot;'}[c]));
  const progress=id=>Math.max(0,Number(localStorage.getItem(`progress-${id}`)||0),Number(localStorage.getItem(`catalog-progress-${id}`)||0),Number(localStorage.getItem(`academic-progress-${id}`)||0));
  const complete=id=>progress(id)>=100;

  function allCourses(){
    const map=new Map();
    const put=(raw,idOverride,category)=>{
      if(!raw)return;
      const id=String(raw.id||raw.courseId||idOverride||raw.title||'');
      if(!id)return;
      const prev=map.get(id)||{};
      map.set(id,{...prev,...raw,id,courseId:String(raw.courseId||prev.courseId||id),catalogCategory:category||prev.catalogCategory||'Elective'});
    };
    (window.COURSE_LIBRARY||[]).forEach(c=>put(c,null,'My Library / Courses'));
    (window.ELECTIVE_CATALOG||[]).forEach(c=>put(c,null,'Elective Catalog'));
    const A=window.CAMPUS_ACADEMIC||{};
    Object.entries(A.core||{}).forEach(([id,c])=>put(c,id,'University Core'));
    (A.civilExpansion||[]).forEach(c=>put(c,null,'Civil Expansion'));
    (A.electives||[]).forEach(c=>put(c,null,'Academic Electives'));
    return [...map.values()];
  }
  function byId(id){return allCourses().find(c=>String(c.id)===String(id))||null;}
  function prereqs(c){return Array.isArray(c?.prereq)?c.prereq.map(String):[];}
  function missing(c){return prereqs(c).filter(id=>!complete(id));}
  function title(id){return byId(id)?.title||id;}
  function enrolled(id){return set(ENROLLED).has(String(id));}
  function started(id){return set(STARTED).has(String(id));}
  function notify(msg){window.toast?.(msg);}

  function enroll(id){
    const c=byId(id); if(!c)return {ok:false,missing:[]};
    const m=missing(c);
    if(m.length){notify('Enrollment locked — complete the listed prerequisites first.');return {ok:false,missing:m};}
    const s=set(ENROLLED); s.add(String(id)); save(ENROLLED,[...s]);
    window.dispatchEvent(new CustomEvent('enrollment-changed',{detail:{id:String(id)}}));
    return {ok:true};
  }
  function start(id){
    const r=enroll(id); if(!r.ok)return r;
    const s=set(STARTED); s.add(String(id)); save(STARTED,[...s]);
    localStorage.setItem(`status-${id}`,'Started');
    localStorage.setItem(`started-at-${id}`,new Date().toISOString());
    window.dispatchEvent(new CustomEvent('course-started',{detail:{id:String(id)}}));
    notify('Course started');
    return {ok:true};
  }

  function css(){
    if(document.getElementById('enrollment-center-css'))return;
    const s=document.createElement('style'); s.id='enrollment-center-css';
    s.textContent=`
      .enrollment-tab-badge{margin-left:auto;font-size:.6rem;padding:3px 7px;border-radius:999px;background:rgba(99,216,255,.1);color:#91e2ff;border:1px solid rgba(99,216,255,.18)}
      .enrollment-modal{position:fixed;inset:0;z-index:500;background:rgba(2,7,12,.94);backdrop-filter:blur(18px);padding:14px;overflow:auto}
      .enrollment-panel{width:min(1500px,100%);min-height:calc(100vh - 28px);margin:0 auto;border:1px solid rgba(196,220,240,.14);border-radius:22px;background:linear-gradient(180deg,#102033,#07121e);box-shadow:0 35px 120px rgba(0,0,0,.55);overflow:hidden}
      .enrollment-header{padding:26px 28px 20px;border-bottom:1px solid rgba(196,220,240,.1);display:flex;justify-content:space-between;gap:20px;align-items:flex-start}
      .enrollment-header h2{font-size:clamp(1.8rem,3vw,2.8rem);margin:5px 0 6px;letter-spacing:-.03em}
      .enrollment-close{width:42px;height:42px;border-radius:50%;border:1px solid rgba(196,220,240,.14);background:rgba(255,255,255,.03);color:#fff;font-size:1.35rem;cursor:pointer;flex:0 0 auto}
      .enrollment-tabs{display:flex;gap:6px;flex-wrap:wrap;padding:12px 28px;border-bottom:1px solid rgba(196,220,240,.08);background:rgba(255,255,255,.015);position:sticky;top:0;z-index:5}
      .enrollment-tab{border:1px solid rgba(196,220,240,.12);background:rgba(255,255,255,.025);color:#c8d4df;padding:9px 12px;border-radius:10px;cursor:pointer;font-weight:800;font-size:.78rem}.enrollment-tab.active{background:rgba(99,216,255,.12);border-color:rgba(99,216,255,.3);color:#63d8ff}
      .enrollment-content{padding:22px 28px 34px}
      .enrollment-summary{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:18px}.enrollment-metric{border:1px solid rgba(196,220,240,.1);background:rgba(255,255,255,.02);border-radius:14px;padding:13px}.enrollment-metric .n{font-size:1.45rem;font-weight:900}.enrollment-metric .l{margin-top:3px;font-size:.63rem;text-transform:uppercase;letter-spacing:.08em;color:#8ea1b4}
      .semester-list{display:grid;gap:14px}.semester-block{border:1px solid rgba(196,220,240,.11);border-radius:16px;overflow:hidden;background:rgba(255,255,255,.018)}
      .semester-head{padding:15px 17px;border-bottom:1px solid rgba(196,220,240,.08);display:flex;justify-content:space-between;gap:15px;align-items:flex-start;background:linear-gradient(90deg,rgba(99,216,255,.05),rgba(143,155,255,.025))}.semester-head h3{margin:0;font-size:1rem}.semester-head .theme{color:#8ea1b4;font-size:.73rem;margin-top:4px}
      .course-row{padding:14px 17px;border-bottom:1px solid rgba(196,220,240,.06);display:grid;grid-template-columns:minmax(0,2fr) minmax(150px,.8fr) minmax(190px,1fr);gap:14px;align-items:center}.course-row:last-child{border-bottom:0}.course-row h4{margin:0;font-size:.91rem}.course-row .meta{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}.course-row .tag{padding:4px 7px;border:1px solid rgba(196,220,240,.1);border-radius:999px;color:#9fb1c3;font-size:.62rem}.course-row .status{font-size:.7rem}.ready{color:#b9c7d4}.locked{color:#ead9aa}.enrolled-state{color:#91e2ff}.started-state{color:#63d8ff}.completed-state{color:#72e4bc}
      .course-actions{display:flex;gap:7px;justify-content:flex-end;flex-wrap:wrap}.enroll-btn{padding:9px 11px;border-radius:10px;border:1px solid rgba(196,220,240,.14);background:rgba(255,255,255,.025);color:#eff5fb;font-size:.7rem;font-weight:850;cursor:pointer}.enroll-btn.primary{background:linear-gradient(135deg,#63d8ff,#8f9bff);border:0;color:#07111b}.enroll-btn.start{background:linear-gradient(135deg,#72e4bc,#63d8ff);border:0;color:#07111b}.enroll-btn.done{color:#72e4bc;background:rgba(114,228,188,.07);border-color:rgba(114,228,188,.24);cursor:default}.enroll-btn.locked{color:#ead9aa;border-color:rgba(225,190,112,.22);background:rgba(225,190,112,.05);cursor:not-allowed}
      .prereq-box{margin-top:9px;padding:9px 10px;border-radius:10px;border:1px solid rgba(225,190,112,.18);background:rgba(225,190,112,.055);color:#ead9aa;font-size:.69rem;line-height:1.5}.prereq-list{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}.prereq-chip{border:1px solid rgba(225,190,112,.22);background:rgba(225,190,112,.08);color:#ead9aa;border-radius:999px;padding:5px 8px;font-size:.62rem;cursor:pointer}
      .library-tools{display:grid;grid-template-columns:1.5fr .7fr .7fr;gap:9px;margin-bottom:14px}.library-tools input,.library-tools select{width:100%;background:#06111b;color:#eff5fb;border:1px solid rgba(196,220,240,.13);border-radius:11px;padding:10px 12px}.material-list{display:grid;gap:8px}.material-item{display:grid;grid-template-columns:minmax(0,2fr) 1fr auto;gap:12px;align-items:center;border:1px solid rgba(196,220,240,.1);border-radius:13px;background:rgba(255,255,255,.018);padding:12px 14px}.material-item h4{margin:0;font-size:.84rem}.material-meta{color:#879bae;font-size:.66rem;margin-top:4px}.material-actions{display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap}.material-pill{display:inline-flex;padding:4px 7px;border-radius:999px;border:1px solid rgba(196,220,240,.1);color:#9fb1c3;font-size:.6rem}
      .my-enrolled{display:grid;gap:8px}.empty-enrollment{padding:30px;border:1px dashed rgba(196,220,240,.13);border-radius:14px;color:#9fb1c3;text-align:center}
      .gate-note{padding:12px 14px;border-radius:12px;border:1px solid rgba(99,216,255,.14);background:rgba(99,216,255,.04);color:#b8c8d6;font-size:.72rem;line-height:1.55;margin-bottom:14px}.gate-note strong{color:#63d8ff}
      @media(max-width:1050px){.enrollment-summary{grid-template-columns:repeat(3,minmax(0,1fr))}.course-row{grid-template-columns:1fr 1fr}.course-actions{justify-content:flex-start}.material-item{grid-template-columns:1fr auto}}
      @media(max-width:700px){.enrollment-modal{padding:6px}.enrollment-panel{border-radius:16px}.enrollment-header,.enrollment-content{padding-left:16px;padding-right:16px}.enrollment-tabs{padding-left:16px;padding-right:16px}.enrollment-summary{grid-template-columns:1fr 1fr}.course-row{grid-template-columns:1fr}.library-tools{grid-template-columns:1fr}.material-item{grid-template-columns:1fr}.material-actions{justify-content:flex-start}.enroll-btn{width:100%}}
    `;
    document.head.appendChild(s);
  }

  function statusFor(c,e,s){
    const id=String(c.id); if(complete(id))return ['completed-state','✓ Completed'];
    if(s.has(id))return ['started-state','▶ Started'];
    if(e.has(id))return ['enrolled-state','● Enrolled'];
    const m=missing(c); if(m.length)return ['locked','🔒 Locked by prerequisites'];
    return ['ready','Ready to enroll'];
  }
  function prereqMarkup(c){
    const m=missing(c); if(!m.length)return '';
    return `<div class="prereq-box"><strong>Complete first:</strong><div class="prereq-list">${m.map(id=>`<button type="button" class="prereq-chip" data-open-prereq="${esc(id)}">${esc(title(id))}</button>`).join('')}</div></div>`;
  }
  function actionMarkup(c,e,s){
    const id=String(c.id),m=missing(c);
    if(complete(id))return '<span class="enroll-btn done">✓ Completed</span>';
    if(s.has(id))return '<span class="enroll-btn done">✓ Started</span>';
    if(e.has(id))return `<button type="button" class="enroll-btn start" data-start="${esc(id)}">▶ Start Course</button>`;
    if(m.length)return '<span class="enroll-btn locked">Prerequisites required</span>';
    return `<button type="button" class="enroll-btn primary" data-enroll="${esc(id)}">＋ Add Course</button>`;
  }

  function semesterBlock(sem,i,map,e,s){
    const ids=[...(sem.required||[]),...(sem.recommended||[])].map(String);
    return `<section class="semester-block"><div class="semester-head"><div><div class="eyebrow">SEMESTER ${i+1}</div><h3>${esc(sem.name)}</h3><div class="theme">${esc(sem.theme||'')}</div></div><span class="material-pill">${ids.length} planned</span></div>${ids.map(id=>{const c=map.get(id)||{id,title:id,courseId:id};const [cls,label]=statusFor(c,e,s);return `<article class="course-row"><div><h4>${esc(c.title||id)}</h4><div class="meta"><span class="tag">${esc(c.courseId||id)}</span><span class="tag">${(sem.required||[]).map(String).includes(id)?'Required':'Recommended'}</span>${c.credits?`<span class="tag">${esc(c.credits)} credits</span>`:''}</div>${cls==='locked'?prereqMarkup(c):''}</div><div class="status ${cls}">${label}</div><div class="course-actions">${actionMarkup(c,e,s)}</div></article>`}).join('')}</section>`;
  }

  function renderPlan(root){
    const A=window.CAMPUS_ACADEMIC||{};const plan=A.semesterPlan||[];const all=allCourses();const map=new Map(all.map(c=>[String(c.id),c]));const e=set(ENROLLED),s=set(STARTED);
    const planned=new Set(plan.flatMap(x=>[...(x.required||[]),...(x.recommended||[])].map(String)));
    const locked=[...planned].filter(id=>{const c=map.get(id);return c&&missing(c).length}).length;
    root.innerHTML=`<div class="gate-note"><strong>Structured degree registration:</strong> the eight-semester plan is the spine. You can only enroll in a course when every defined prerequisite is genuinely at 100%. Locked courses never expose a "Mark as completed" shortcut.</div><div class="enrollment-summary"><div class="enrollment-metric"><div class="n">${planned.size}</div><div class="l">Planned in degree map</div></div><div class="enrollment-metric"><div class="n">${e.size}</div><div class="l">Enrolled</div></div><div class="enrollment-metric"><div class="n">${s.size}</div><div class="l">Started</div></div><div class="enrollment-metric"><div class="n">${all.filter(c=>complete(c.id)).length}</div><div class="l">Completed</div></div><div class="enrollment-metric"><div class="n">${locked}</div><div class="l">Locked now</div></div></div><div class="semester-list">${plan.map((sem,i)=>semesterBlock(sem,i,map,e,s)).join('')}</div>`;
  }

  function renderMaterials(root){
    const all=allCourses(); const e=set(ENROLLED),s=set(STARTED);
    const tracks=['All',...new Set(all.map(c=>c.track).filter(Boolean))].sort((a,b)=>a==='All'?-1:b==='All'?1:a.localeCompare(b));
    const kinds=['All','My Library / Courses','University Core','Elective Catalog','Civil Expansion','Academic Electives'];
    const q=query.toLowerCase();
    const list=all.filter(c=>(track==='All'||c.track===track)&&(kind==='All'||c.catalogCategory===kind)&&(`${c.courseId} ${c.title} ${c.track} ${c.provider} ${c.catalogCategory}`.toLowerCase().includes(q)));
    root.innerHTML=`<div class="gate-note"><strong>Full material catalog:</strong> this view includes your library/course collection, the university core, civil expansion, and the complete elective subject bank. Prerequisite gates apply wherever prerequisites are defined in the academic map.</div><div class="library-tools"><input id="enroll-search" value="${esc(query)}" placeholder="Search every course / material…"><select id="enroll-track">${tracks.map(x=>`<option ${x===track?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="enroll-kind">${kinds.map(x=>`<option ${x===kind?'selected':''}>${esc(x)}</option>`).join('')}</select></div><div class="material-list">${list.length?list.map(c=>{const [cls,label]=statusFor(c,e,s);return `<article class="material-item"><div><div class="material-meta">${esc(c.catalogCategory)} · ${esc(c.track||'Engineering')} · ${esc(c.courseId)}</div><h4>${esc(c.title)}</h4>${cls==='locked'?prereqMarkup(c):''}</div><div class="status ${cls}">${label}</div><div class="material-actions">${actionMarkup(c,e,s)} </div></article>`}).join(''):'<div class="empty-enrollment">No materials match this filter.</div>'}</div>`;
    root.querySelector('#enroll-search')?.addEventListener('input',ev=>{query=ev.target.value;renderMaterials(root)});
    root.querySelector('#enroll-track')?.addEventListener('change',ev=>{track=ev.target.value;renderMaterials(root)});
    root.querySelector('#enroll-kind')?.addEventListener('change',ev=>{kind=ev.target.value;renderMaterials(root)});
  }

  function renderMy(root){
    const all=allCourses(),e=set(ENROLLED),s=set(STARTED);const list=[...e].map(id=>all.find(c=>String(c.id)===id)).filter(Boolean);
    root.innerHTML=`<div class="gate-note"><strong>My Enrollment:</strong> this is your personal registration list. Starting a course does not bypass prerequisites; a started course must already have passed the same enrollment gate.</div><div class="enrollment-summary"><div class="enrollment-metric"><div class="n">${list.length}</div><div class="l">Enrolled</div></div><div class="enrollment-metric"><div class="n">${list.filter(c=>s.has(String(c.id))).length}</div><div class="l">Started</div></div><div class="enrollment-metric"><div class="n">${list.filter(c=>complete(c.id)).length}</div><div class="l">Completed</div></div><div class="enrollment-metric"><div class="n">${list.filter(c=>missing(c).length).length}</div><div class="l">Now locked</div></div><div class="enrollment-metric"><div class="n">${list.reduce((n,c)=>n+(Number(c.credits)||0),0)}</div><div class="l">Credits enrolled</div></div></div><div class="my-enrolled">${list.length?list.map(c=>{const [cls,label]=statusFor(c,e,s);return `<article class="material-item"><div><div class="material-meta">${esc(c.catalogCategory)} · ${esc(c.courseId)}</div><h4>${esc(c.title)}</h4></div><div class="status ${cls}">${label}</div><div class="material-actions">${actionMarkup(c,e,s)}</div></article>`}).join(''):'<div class="empty-enrollment">You have not enrolled in any course yet. Start from Degree Plan or All Materials.</div>'}</div>`;
  }

  function render(){
    const content=document.querySelector('#enrollment-center-content'); if(!content)return;
    const e=set(ENROLLED),s=set(STARTED),all=allCourses();
    if(activeTab==='plan')renderPlan(content); else if(activeTab==='materials')renderMaterials(content); else renderMy(content);
    document.querySelectorAll('#enrollment-modal [data-enroll]').forEach(b=>b.onclick=()=>{const r=enroll(b.dataset.enroll);if(r.ok)render()});
    document.querySelectorAll('#enrollment-modal [data-start]').forEach(b=>b.onclick=()=>{const r=start(b.dataset.start);if(r.ok)render()});
    document.querySelectorAll('#enrollment-modal [data-open-prereq]').forEach(b=>b.onclick=()=>{openPrereq(b.dataset.openPrereq)});
  }
  function openPrereq(id){
    activeTab='materials';query='';track='All';kind='All';render();
    setTimeout(()=>{const target=document.querySelector(`#enrollment-modal [data-enroll="${CSS.escape(String(id))}"]`)||document.querySelector(`#enrollment-modal [data-start="${CSS.escape(String(id))}"]`);target?.scrollIntoView({behavior:'smooth',block:'center'});},50);
  }

  function open(){
    css();document.getElementById('enrollment-modal')?.remove();
    const modal=document.createElement('div');modal.className='enrollment-modal';modal.id='enrollment-modal';
    modal.innerHTML=`<div class="enrollment-panel"><header class="enrollment-header"><div><div class="eyebrow">PERSONAL UNIVERSITY · REGISTRATION CENTER</div><h2>Course Enrollment</h2><div class="muted-small">Register only when the academic structure says you are ready. The full material catalog is available separately so nothing is hidden or lost.</div></div><button type="button" class="enrollment-close" id="enrollment-close">×</button></header><nav class="enrollment-tabs"><button type="button" class="enrollment-tab ${activeTab==='plan'?'active':''}" data-etab="plan">Degree Plan</button><button type="button" class="enrollment-tab ${activeTab==='materials'?'active':''}" data-etab="materials">All Materials</button><button type="button" class="enrollment-tab ${activeTab==='mine'?'active':''}" data-etab="mine">My Enrollment <span class="enrollment-tab-badge">${set(ENROLLED).size}</span></button></nav><main class="enrollment-content" id="enrollment-center-content"></main></div>`;
    document.body.appendChild(modal);
    modal.querySelector('#enrollment-close').onclick=()=>modal.remove();
    modal.querySelectorAll('[data-etab]').forEach(b=>b.onclick=()=>{activeTab=b.dataset.etab;open()});
    render();
  }

  function injectNav(){
    const nav=document.querySelector('.sidebar .nav'); if(!nav||nav.querySelector('[data-course-enrollment]'))return;
    const b=document.createElement('button');b.type='button';b.className='nav-btn';b.dataset.courseEnrollment='1';b.innerHTML='<span>▤</span><span class="nav-label">Course Enrollment</span><span class="enrollment-tab-badge">REG</span>';b.onclick=open;nav.appendChild(b);
  }
  function injectCourseShortcuts(){
    document.querySelectorAll('.course-card[data-course]').forEach(card=>{
      if(card.querySelector('.enrollment-shortcut'))return;
      const id=String(card.dataset.course),c=byId(id);if(!c)return;
      const footer=card.querySelector('.course-bottom');if(!footer)return;
      const b=document.createElement('button');b.type='button';b.className='ghost enrollment-shortcut';
      b.textContent=missing(c).length?'🔒 Prerequisites':started(id)?'✓ Started':enrolled(id)?'▶ Start':'＋ Enroll';
      b.onclick=e=>{e.stopPropagation();open()};footer.insertBefore(b,footer.firstChild);
    });
  }
  injectNav();injectCourseShortcuts();
  setInterval(()=>{injectNav();injectCourseShortcuts();},900);
  window.addEventListener('enrollment-changed',()=>{injectNav();injectCourseShortcuts()});
  window.addEventListener('course-started',()=>{injectNav();injectCourseShortcuts()});
})();
