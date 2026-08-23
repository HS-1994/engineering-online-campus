(function(){
  'use strict';
  const ENROLLED_KEY='campus-enrolled-courses';
  const STARTED_KEY='campus-started-courses';
  let tab='plan';
  let query='';
  let track='All';

  function load(key, fallback){ try{ const v=JSON.parse(localStorage.getItem(key)||'null'); return Array.isArray(v)?v:fallback; }catch(e){ return fallback; } }
  function save(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  function setOf(key){ return new Set(load(key,[]).map(String)); }
  function esc(value){ return String(value==null?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function progress(id){ return Math.max(0, Number(localStorage.getItem('progress-'+id)||0), Number(localStorage.getItem('catalog-progress-'+id)||0), Number(localStorage.getItem('academic-progress-'+id)||0)); }
  function completed(id){ return progress(id)>=100; }
  function toast(message){ if(window.toast) window.toast(message); }

  function allCourses(){
    const map=new Map();
    function put(raw, idOverride, category){
      if(!raw) return;
      const id=String(raw.id||raw.courseId||idOverride||raw.title||'');
      if(!id) return;
      const old=map.get(id)||{};
      map.set(id,Object.assign({},old,raw,{id:id,courseId:String(raw.courseId||old.courseId||id),catalogCategory:category||old.catalogCategory||'Other'}));
    }
    (window.COURSE_LIBRARY||[]).forEach(function(c){put(c,null,'Your Library / Courses');});
    (window.ELECTIVE_CATALOG||[]).forEach(function(c){put(c,null,'Elective Catalog');});
    const A=window.CAMPUS_ACADEMIC||{};
    Object.keys(A.core||{}).forEach(function(id){put(A.core[id],id,'University Core');});
    (A.civilExpansion||[]).forEach(function(c){put(c,null,'Civil Expansion');});
    (A.electives||[]).forEach(function(c){put(c,null,'Academic Elective');});
    return Array.from(map.values());
  }
  function course(id){ return allCourses().find(function(c){return String(c.id)===String(id);})||null; }
  function prereqs(c){ return Array.isArray(c&&c.prereq)?c.prereq.map(String):[]; }
  function missing(c){ return prereqs(c).filter(function(id){return !completed(id);}); }
  function title(id){ const c=course(id); return c?c.title:id; }
  function enrolled(id){ return setOf(ENROLLED_KEY).has(String(id)); }
  function started(id){ return setOf(STARTED_KEY).has(String(id)); }

  function enroll(id){
    const c=course(id); if(!c) return false;
    const miss=missing(c);
    if(miss.length){ toast('Locked: complete the prerequisites first.'); return false; }
    const s=setOf(ENROLLED_KEY); s.add(String(id)); save(ENROLLED_KEY,Array.from(s));
    return true;
  }
  function start(id){
    if(!enroll(id)) return false;
    const s=setOf(STARTED_KEY); s.add(String(id)); save(STARTED_KEY,Array.from(s));
    localStorage.setItem('status-'+id,'Started');
    localStorage.setItem('started-at-'+id,new Date().toISOString());
    toast('Course started');
    return true;
  }

  function css(){
    if(document.getElementById('enrollment-center-v2-css')) return;
    const s=document.createElement('style'); s.id='enrollment-center-v2-css';
    s.textContent=''+
      '.enroll-launch{display:flex;align-items:center;gap:8px}'+
      '.enroll-badge{margin-left:auto;font-size:10px;padding:3px 7px;border-radius:999px;background:rgba(99,216,255,.10);color:#91e2ff;border:1px solid rgba(99,216,255,.18)}'+
      '.enroll-overlay{position:fixed;inset:0;z-index:99999;background:rgba(2,7,12,.94);backdrop-filter:blur(15px);overflow:auto;padding:12px}'+
      '.enroll-shell{max-width:1500px;min-height:calc(100vh - 24px);margin:auto;background:linear-gradient(180deg,#102033,#07121e);border:1px solid rgba(196,220,240,.14);border-radius:22px;box-shadow:0 30px 100px rgba(0,0,0,.5);overflow:hidden}'+
      '.enroll-head{padding:24px 28px 18px;border-bottom:1px solid rgba(196,220,240,.10);display:flex;justify-content:space-between;gap:16px;align-items:flex-start}'+
      '.enroll-head h2{margin:5px 0;font-size:clamp(1.8rem,3vw,2.8rem)}'+
      '.enroll-close{border:1px solid rgba(196,220,240,.14);background:rgba(255,255,255,.03);color:#fff;border-radius:50%;width:42px;height:42px;font-size:22px;cursor:pointer}'+
      '.enroll-tabs{display:flex;gap:8px;flex-wrap:wrap;padding:12px 28px;border-bottom:1px solid rgba(196,220,240,.08);position:sticky;top:0;background:rgba(7,18,30,.96);z-index:10}'+
      '.enroll-tab{border:1px solid rgba(196,220,240,.12);background:rgba(255,255,255,.025);color:#c8d4df;padding:10px 13px;border-radius:10px;font-weight:800;cursor:pointer}.enroll-tab.active{background:rgba(99,216,255,.12);border-color:rgba(99,216,255,.3);color:#63d8ff}'+
      '.enroll-body{padding:22px 28px 34px}'+
      '.enroll-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}.enroll-stat{padding:14px;border:1px solid rgba(196,220,240,.10);border-radius:14px;background:rgba(255,255,255,.02)}.enroll-stat .n{font-size:1.55rem;font-weight:900}.enroll-stat .l{font-size:11px;color:#8ea1b4;text-transform:uppercase;letter-spacing:.08em}'+
      '.sem-list{display:grid;gap:14px}.sem-card{border:1px solid rgba(196,220,240,.11);border-radius:16px;overflow:hidden}.sem-head{padding:15px 17px;background:linear-gradient(90deg,rgba(99,216,255,.06),rgba(143,155,255,.02));border-bottom:1px solid rgba(196,220,240,.08)}'+
      '.sem-head h3{margin:3px 0;font-size:1.05rem}.sem-theme{font-size:12px;color:#8ea1b4}.course-row{display:grid;grid-template-columns:minmax(0,2fr) minmax(140px,.8fr) minmax(170px,.9fr);gap:14px;align-items:center;padding:14px 17px;border-bottom:1px solid rgba(196,220,240,.06)}.course-row:last-child{border-bottom:0}.course-row h4{margin:0;font-size:.92rem}.tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}.tag{font-size:10px;color:#9fb1c3;border:1px solid rgba(196,220,240,.1);padding:4px 7px;border-radius:999px}.status{font-size:11px}.ready{color:#b9c7d4}.locked{color:#ead9aa}.enrolled{color:#91e2ff}.started{color:#63d8ff}.done{color:#72e4bc}'+
      '.actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.enroll-btn{border:1px solid rgba(196,220,240,.14);background:rgba(255,255,255,.03);color:#eff5fb;border-radius:10px;padding:9px 11px;font-size:11px;font-weight:850;cursor:pointer}.enroll-btn.primary{background:linear-gradient(135deg,#63d8ff,#8f9bff);border:0;color:#07111b}.enroll-btn.start{background:linear-gradient(135deg,#72e4bc,#63d8ff);border:0;color:#07111b}.enroll-btn.lock{color:#ead9aa;border-color:rgba(225,190,112,.20);cursor:not-allowed}.enroll-btn.done{color:#72e4bc;border-color:rgba(114,228,188,.23);background:rgba(114,228,188,.06)}'+
      '.pre{margin-top:9px;padding:9px 10px;border:1px solid rgba(225,190,112,.18);background:rgba(225,190,112,.055);border-radius:10px;color:#ead9aa;font-size:11px;line-height:1.5}.pre-list{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}.pre-chip{border:1px solid rgba(225,190,112,.22);background:rgba(225,190,112,.08);color:#ead9aa;border-radius:999px;padding:5px 8px;font-size:10px;cursor:pointer}'+
      '.tools{display:grid;grid-template-columns:minmax(0,1fr) 180px 180px;gap:8px;margin-bottom:14px}.tools input,.tools select{width:100%;box-sizing:border-box;background:#06111b;color:#eff5fb;border:1px solid rgba(196,220,240,.13);border-radius:11px;padding:10px 12px}.material-list{display:grid;gap:8px}.material{display:grid;grid-template-columns:minmax(0,2fr) 1fr auto;gap:12px;align-items:center;padding:13px;border:1px solid rgba(196,220,240,.10);border-radius:13px}.material h4{margin:0;font-size:.86rem}.material-meta{font-size:11px;color:#879bae;margin-top:4px}.pill{display:inline-flex;padding:4px 7px;border-radius:999px;border:1px solid rgba(196,220,240,.1);color:#9fb1c3;font-size:10px}.empty{padding:30px;text-align:center;border:1px dashed rgba(196,220,240,.13);border-radius:14px;color:#9fb1c3}'+
      '@media(max-width:1050px){.enroll-stats{grid-template-columns:repeat(2,1fr)}.course-row{grid-template-columns:1fr 1fr}.actions{justify-content:flex-start}}'+
      '@media(max-width:700px){.enroll-overlay{padding:5px}.enroll-shell{border-radius:15px}.enroll-head,.enroll-tabs,.enroll-body{padding-left:15px;padding-right:15px}.enroll-stats{grid-template-columns:1fr 1fr}.course-row{grid-template-columns:1fr}.actions{justify-content:flex-start}.enroll-btn{width:100%}.tools{grid-template-columns:1fr}.material{grid-template-columns:1fr}}';
    document.head.appendChild(s);
  }

  function gateMarkup(c){
    const m=missing(c); if(!m.length) return '';
    return '<div class="pre"><strong>Complete first:</strong><div class="pre-list">'+m.map(function(id){return '<button class="pre-chip" type="button" data-open-course="'+esc(id)+'">'+esc(title(id))+'</button>';}).join('')+'</div></div>';
  }
  function action(c){
    const id=String(c.id); const m=missing(c);
    if(completed(id)) return '<span class="enroll-btn done">✓ Completed</span>';
    if(started(id)) return '<span class="enroll-btn done">✓ Started</span>';
    if(enrolled(id)) return '<button class="enroll-btn start" data-start="'+esc(id)+'">▶ Start Course</button>';
    if(m.length) return '<span class="enroll-btn lock">🔒 Prerequisites</span>';
    return '<button class="enroll-btn primary" data-enroll="'+esc(id)+'">＋ Add Course</button>';
  }
  function status(c){
    const id=String(c.id); if(completed(id))return ['done','✓ Completed'];
    if(started(id))return ['started','▶ Started'];
    if(enrolled(id))return ['enrolled','● Enrolled'];
    if(missing(c).length)return ['locked','🔒 Locked'];
    return ['ready','Ready to enroll'];
  }
  function semPlan(){ return (window.CAMPUS_ACADEMIC&&window.CAMPUS_ACADEMIC.semesterPlan)||[]; }

  function renderPlan(root){
    const all=allCourses(); const map=new Map(all.map(function(c){return [String(c.id),c];})); const plan=semPlan();
    const planned=new Set(); plan.forEach(function(s){(s.required||[]).concat(s.recommended||[]).forEach(function(id){planned.add(String(id));});});
    let html='<div class="enroll-stats"><div class="enroll-stat"><div class="n">'+planned.size+'</div><div class="l">Planned courses</div></div><div class="enroll-stat"><div class="n">'+setOf(ENROLLED_KEY).size+'</div><div class="l">Enrolled</div></div><div class="enroll-stat"><div class="n">'+setOf(STARTED_KEY).size+'</div><div class="l">Started</div></div><div class="enroll-stat"><div class="n">'+all.filter(function(c){return completed(c.id);}).length+'</div><div class="l">Completed</div></div></div>';
    html+='<div class="pre" style="margin-bottom:14px"><strong>Registration rule:</strong> a course with prerequisites is locked until every prerequisite is genuinely at 100%. Locked courses have no completion shortcut.</div>';
    html+='<div class="sem-list">';
    plan.forEach(function(s,i){
      const ids=(s.required||[]).concat(s.recommended||[]).map(String);
      html+='<section class="sem-card"><div class="sem-head"><div class="eyebrow">SEMESTER '+(i+1)+'</div><h3>'+esc(s.name)+'</h3><div class="sem-theme">'+esc(s.theme||'')+'</div></div>';
      ids.forEach(function(id){
        const c=map.get(id)||{id:id,title:id,courseId:id}; const st=status(c);
        html+='<article class="course-row"><div><h4>'+esc(c.title)+'</h4><div class="tags"><span class="tag">'+esc(c.courseId||id)+'</span><span class="tag">'+((s.required||[]).map(String).indexOf(id)>=0?'Required':'Recommended')+'</span>'+ (c.credits?'<span class="tag">'+esc(c.credits)+' credits</span>':'')+'</div>'+(st[0]==='locked'?gateMarkup(c):'')+'</div><div class="status '+st[0]+'">'+st[1]+'</div><div class="actions">'+action(c)+'</div></article>';
      });
      html+='</section>';
    });
    html+='</div>';
    root.innerHTML=html;
  }

  function renderMaterials(root){
    const all=allCourses();
    const tracks=['All']; all.forEach(function(c){if(c.track&&tracks.indexOf(c.track)<0)tracks.push(c.track);});
    const filtered=all.filter(function(c){
      const text=(String(c.title||'')+' '+String(c.courseId||'')+' '+String(c.track||'')+' '+String(c.catalogCategory||'')).toLowerCase();
      return (!query||text.indexOf(query.toLowerCase())>=0) && (track==='All'||String(c.track||'')===track);
    });
    let html='<div class="tools"><input id="enroll-search" placeholder="Search every course and material..." value="'+esc(query)+'"><select id="enroll-track">';
    tracks.forEach(function(t){html+='<option '+(t===track?'selected':'')+'>'+esc(t)+'</option>';});
    html+='</select><div class="pill" style="display:flex;align-items:center;justify-content:center">'+filtered.length+' materials</div></div>';
    html+='<div class="material-list">';
    filtered.forEach(function(c){ const st=status(c); html+='<article class="material"><div><h4>'+esc(c.title)+'</h4><div class="material-meta">'+esc(c.courseId||c.id)+' · '+esc(c.track||'Engineering')+'</div></div><div><span class="pill">'+esc(c.catalogCategory||'Other')+'</span><div class="status '+st[0]+'" style="margin-top:7px">'+st[1]+'</div></div><div class="actions">'+action(c)+'</div></article>'; });
    html+='</div>';
    root.innerHTML=html;
  }

  function renderMine(root){
    const all=allCourses(); const e=setOf(ENROLLED_KEY), s=setOf(STARTED_KEY); const mine=all.filter(function(c){return e.has(String(c.id));});
    if(!mine.length){root.innerHTML='<div class="empty">No enrolled courses yet.<br><br>Go to <strong>All Materials</strong> and add the first course you are eligible to take.</div>';return;}
    let html='<div class="material-list">';
    mine.forEach(function(c){html+='<article class="material"><div><h4>'+esc(c.title)+'</h4><div class="material-meta">'+esc(c.courseId||c.id)+' · '+esc(c.track||'Engineering')+'</div></div><div class="status '+(s.has(String(c.id))?'started':'enrolled')+'">'+(s.has(String(c.id))?'▶ Started':'● Enrolled')+'</div><div class="actions">'+action(c)+'</div></article>';});
    html+='</div>'; root.innerHTML=html;
  }

  function render(){
    const root=document.getElementById('enroll-content-v2'); if(!root)return;
    if(tab==='plan')renderPlan(root); else if(tab==='materials')renderMaterials(root); else renderMine(root);
  }

  function open(){
    css();
    const old=document.getElementById('enroll-overlay-v2'); if(old)old.remove();
    const overlay=document.createElement('div'); overlay.className='enroll-overlay'; overlay.id='enroll-overlay-v2';
    overlay.innerHTML='<div class="enroll-shell"><div class="enroll-head"><div><div class="eyebrow">DEGREE REGISTRATION</div><h2>Course Enrollment Center</h2><div class="muted-small">One place to see the full curriculum, register for eligible courses, and respect real prerequisites.</div></div><button class="enroll-close" id="enroll-close" type="button">×</button></div><div class="enroll-tabs"><button class="enroll-tab active" data-tab="plan">Degree Plan · 8 Semesters</button><button class="enroll-tab" data-tab="materials">All Materials</button><button class="enroll-tab" data-tab="mine">My Enrollment</button></div><div class="enroll-body" id="enroll-content-v2"></div></div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#enroll-close').addEventListener('click',function(){overlay.remove();});
    overlay.querySelectorAll('[data-tab]').forEach(function(btn){btn.addEventListener('click',function(){tab=btn.getAttribute('data-tab');overlay.querySelectorAll('.enroll-tab').forEach(function(b){b.classList.toggle('active',b===btn);});render();});});
    overlay.addEventListener('input',function(ev){
      if(ev.target.id==='enroll-search'){query=ev.target.value;renderMaterials(document.getElementById('enroll-content-v2'));}
    });
    overlay.addEventListener('change',function(ev){ if(ev.target.id==='enroll-track'){track=ev.target.value;renderMaterials(document.getElementById('enroll-content-v2'));} });
    overlay.addEventListener('click',function(ev){
      const a=ev.target.closest('[data-enroll]'); if(a){ if(enroll(a.getAttribute('data-enroll')))render(); return; }
      const b=ev.target.closest('[data-start]'); if(b){ if(start(b.getAttribute('data-start')))render(); return; }
      const p=ev.target.closest('[data-open-course]'); if(p){ const id=p.getAttribute('data-open-course'); toast('Complete '+title(id)+' first.'); return; }
    });
    render();
  }

  function injectTab(){
    const nav=document.querySelector('.sidebar .nav'); if(!nav||nav.querySelector('[data-enrollment-center]'))return;
    const b=document.createElement('button'); b.type='button'; b.className='nav-btn'; b.dataset.enrollmentCenter='1';
    b.innerHTML='<span>▤</span><span class="nav-label">Course Enrollment</span><span class="enroll-badge">REG</span>';
    b.addEventListener('click',open); nav.appendChild(b);
  }

  function boot(){ css(); injectTab(); }
  document.addEventListener('DOMContentLoaded',boot);
  setTimeout(boot,250);
  setTimeout(boot,1000);
})();
