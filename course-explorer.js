/* Course Explorer — quick selection + direct study links */
(function(){
  const KEY='eoc-selected-courses';
  const getPlan=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
  const setPlan=p=>localStorage.setItem(KEY,JSON.stringify([...new Set(p)]));
  const allCourses=()=>window.COURSE_LIBRARY||[];
  function sourceFor(c){
    if(c && c.url) return {url:c.url,label:'Study course ↗',direct:true};
    const A=window.CAMPUS_ACADEMIC||{};
    const core=A.core&&A.core[c&&c.courseId];
    if(core&&core.sources&&core.sources[0]){const s=core.sources[0];return {url:s.url,label:s.kind==='FREE-FULL'?'Study course ↗':'Find free course ↗',direct:s.kind==='FREE-FULL'};}
    const civil=(A.civilExpansion||[]).find(x=>x.id===(c&&c.courseId));
    if(civil&&civil.source) return {url:civil.source.url,label:civil.source.kind==='FREE-FULL'?'Study course ↗':'Find free course ↗',direct:civil.source.kind==='FREE-FULL'};
    return null;
  }
  function findCourse(id){
    const lib=allCourses().find(c=>c.id===id||c.courseId===id);
    if(lib) return lib;
    const cards=[...document.querySelectorAll('[data-course]')];
    const el=cards.find(x=>x.dataset.course===id);
    return el?{id,courseId:id,title:el.querySelector('h3')?.textContent||id,track:el.querySelector('.eyebrow')?.textContent||'Course'}:null;
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
    const p=planPanel(),ids=getPlan(),list=p.querySelector('#plan-list');
    p.querySelector('#plan-count').textContent=ids.length+' course'+(ids.length===1?'':'s')+' selected';
    if(!ids.length){list.innerHTML='<div class="empty">Your plan is empty.<br><span class="muted-small">Use <strong>＋ Add to My Plan</strong> on any course card.</span></div>';return;}
    list.innerHTML=ids.map(id=>{const c=findCourse(id);const s=sourceFor(c);return `<article class="plan-item"><div><div class="eyebrow">${esc(c?.track||'Course')}</div><strong>${esc(c?.title||id)}</strong><div class="tiny muted">${esc(c?.provider||c?.platform||'')}</div></div><div class="plan-actions">${s?`<a class="primary small" target="_blank" rel="noopener noreferrer" href="${esc(s.url)}">${esc(s.label)}</a>`:'<span class="tiny muted">Source audit needed</span>'}<button class="ghost small" data-remove-course="${esc(id)}">Remove</button></div></article>`}).join('');
  }
  function esc(v){return String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));}
  function enhance(){
    document.querySelectorAll('.course-card').forEach(card=>{
      const id=card.dataset.course;if(!id)return;
      const c=findCourse(id),selected=getPlan().includes(id),s=sourceFor(c),bottom=card.querySelector('.course-bottom');
      if(!bottom)return;
      let actions=card.querySelector('.explorer-actions');
      if(!actions){actions=document.createElement('span');actions.className='explorer-actions';bottom.appendChild(actions);}
      actions.innerHTML=`<button class="ghost small plan-toggle" data-plan-id="${esc(id)}">${selected?'✓ In My Plan':'＋ Add to My Plan'}</button>${s?`<a class="ghost small study-link" target="_blank" rel="noopener noreferrer" href="${esc(s.url)}">${esc(s.label)}</a>`:'<span class="tiny muted">Source audit needed</span>'}`;
    });
    updateButtons();
  }
  function updateButtons(){
    const p=getPlan();document.querySelectorAll('[data-plan-id]').forEach(b=>{const yes=p.includes(b.dataset.planId);b.textContent=yes?'✓ In My Plan':'＋ Add to My Plan';});
    const n=document.getElementById('plan-badge');if(n)n.textContent=p.length;
  }
  function addPlanLauncher(){
    if(document.getElementById('plan-launcher'))return;
    const b=document.createElement('button');b.id='plan-launcher';b.className='plan-launcher';b.innerHTML='▣ My Plan <span id="plan-badge">'+getPlan().length+'</span>';b.title='Open your selected courses';b.addEventListener('click',()=>{planPanel().classList.add('open');renderPlan();});document.body.appendChild(b);
  }
  function addExplorerHint(){
    if(document.getElementById('explorer-hint'))return;
    const b=document.createElement('button');b.id='explorer-hint';b.className='plan-launcher';b.style.right='145px';b.innerHTML='⌕ Course Explorer';b.title='Browse courses, add them to My Plan, and open study sources';b.addEventListener('click',()=>{const n=document.querySelector('[data-nav="courses"]');if(n)n.click();window.scrollTo({top:0,behavior:'smooth'});});document.body.appendChild(b);
  }
  document.addEventListener('click',e=>{
    const add=e.target.closest('[data-plan-id]');
    if(add){e.preventDefault();e.stopPropagation();const id=add.dataset.planId,p=getPlan();setPlan(p.includes(id)?p.filter(x=>x!==id):[...p,id]);enhance();renderPlan();toast(p.includes(id)?'Removed from My Plan':'Added to My Plan');return;}
    const rem=e.target.closest('[data-remove-course]');
    if(rem){setPlan(getPlan().filter(x=>x!==rem.dataset.removeCourse));renderPlan();enhance();}
  },true);
  const obs=new MutationObserver(()=>{enhance();addPlanLauncher();addExplorerHint();});
  function boot(){addPlanLauncher();addExplorerHint();enhance();obs.observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
