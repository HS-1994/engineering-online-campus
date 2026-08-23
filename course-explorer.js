/* Course Explorer — quick selection + direct study links */
(function(){
  const KEY='eoc-selected-courses';
  const getPlan=()=>JSON.parse(localStorage.getItem(KEY)||'[]');
  const setPlan=p=>localStorage.setItem(KEY,JSON.stringify([...new Set(p)]));
  const allCourses=()=>window.COURSE_LIBRARY||[];
  function sourceFor(c){
    if(c && c.url) return {url:c.url,label:'Open course'};
    const A=window.CAMPUS_ACADEMIC||{};
    const core=A.core&&A.core[c&&c.courseId];
    if(core&&core.sources&&core.sources[0]) return {url:core.sources[0].url,label:'Open source'};
    const civil=(A.civilExpansion||[]).find(x=>x.id===(c&&c.courseId));
    if(civil&&civil.source) return {url:civil.source.url,label:'Open source'};
    return null;
  }
  function findCourse(id){
    const lib=allCourses().find(c=>c.id===id||c.courseId===id);
    if(lib) return lib;
    const cards=[...document.querySelectorAll('[data-course]')];
    const el=cards.find(x=>x.dataset.course===id);
    return el?{id,courseId:id,title:el.querySelector('h3')?.textContent||id}:null;
  }
  function planPanel(){
    let p=document.getElementById('course-plan-panel');
    if(p) return p;
    p=document.createElement('div');p.id='course-plan-panel';p.className='course-plan-panel';
    p.innerHTML='<div class="plan-backdrop" data-plan-close></div><aside class="plan-drawer"><div class="plan-head"><div><div class="eyebrow">MY STUDY PLAN</div><h2>Selected courses</h2><div class="sub" id="plan-count"></div></div><button class="ghost" data-plan-close>×</button></div><div id="plan-list" class="plan-list"></div><div class="plan-foot"><button class="primary" id="plan-clear">Clear plan</button><button class="ghost" data-plan-close>Back to catalog</button></div></aside>';
    document.body.appendChild(p);
    p.addEventListener('click',e=>{if(e.target.matches('[data-plan-close]'))p.classList.remove('open');if(e.target.id==='plan-clear'){setPlan([]);renderPlan();enhance();}});
    return p;
  }
  function renderPlan(){
    const p=planPanel(), ids=getPlan(), list=p.querySelector('#plan-list');
    p.querySelector('#plan-count').textContent=ids.length+' course'+(ids.length===1?'':'s')+' selected';
    if(!ids.length){list.innerHTML='<div class="empty">Your plan is empty.<br><span class="muted-small">Use <strong>Add to plan</strong> on any course card.</span></div>';return;}
    list.innerHTML=ids.map(id=>{const c=findCourse(id);const s=sourceFor(c);return `<article class="plan-item"><div><div class="eyebrow">${esc(c?.track||'Course')}</div><strong>${esc(c?.title||id)}</strong><div class="tiny muted">${esc(c?.provider||c?.platform||'')}</div></div><div class="plan-actions">${s?`<a class="primary small" target="_blank" rel="noopener" href="${esc(s.url)}">Study ↗</a>`:''}<button class="ghost small" data-remove-course="${esc(id)}">Remove</button></div></article>`}).join('');
  }
  function esc(v){return String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));}
  function enhance(){
    document.querySelectorAll('.course-card').forEach(card=>{
      if(card.dataset.explorerReady) return;
      card.dataset.explorerReady='1';
      const id=card.dataset.course;const c=findCourse(id);const selected=getPlan().includes(id);const s=sourceFor(c);
      const bottom=card.querySelector('.course-bottom');
      if(!bottom) return;
      const actions=document.createElement('span');actions.className='explorer-actions';
      actions.innerHTML=`<button class="ghost small plan-toggle" data-plan-id="${esc(id)}">${selected?'✓ In plan':'+ Add to plan'}</button>${s?`<a class="ghost small study-link" target="_blank" rel="noopener" href="${esc(s.url)}">${esc(s.label)} ↗</a>`:`<span class="tiny muted">Source audit needed</span>`}`;
      bottom.appendChild(actions);
    });
    updateButtons();
  }
  function updateButtons(){
    const p=getPlan();document.querySelectorAll('[data-plan-id]').forEach(b=>{const yes=p.includes(b.dataset.planId);b.textContent=yes?'✓ In plan':'+ Add to plan';b.classList.toggle('good',yes);});
    const n=document.getElementById('plan-badge');if(n)n.textContent=p.length;
  }
  function addPlanLauncher(){
    if(document.getElementById('plan-launcher'))return;
    const b=document.createElement('button');b.id='plan-launcher';b.className='plan-launcher';b.innerHTML='▣ My Plan <span id="plan-badge">'+getPlan().length+'</span>';b.addEventListener('click',()=>{planPanel().classList.add('open');renderPlan();});document.body.appendChild(b);
  }
  document.addEventListener('click',e=>{
    const add=e.target.closest('[data-plan-id]');
    if(add){e.preventDefault();e.stopPropagation();const id=add.dataset.planId;const p=getPlan();setPlan(p.includes(id)?p.filter(x=>x!==id):[...p,id]);renderPlan();updateButtons();toast(p.includes(id)?'Removed from study plan':'Added to study plan');return;}
    const rem=e.target.closest('[data-remove-course]');
    if(rem){setPlan(getPlan().filter(x=>x!==rem.dataset.removeCourse));renderPlan();enhance();}
  },true);
  const obs=new MutationObserver(()=>{enhance();addPlanLauncher();});
  function boot(){addPlanLauncher();enhance();obs.observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
