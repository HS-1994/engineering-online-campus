/* Course Explorer helpers: direct source links + personal study plan. */
(function(){
  const KEY='engineering-campus-my-plan-v1';
  const getPlan=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
  const savePlan=p=>localStorage.setItem(KEY,JSON.stringify([...new Set(p)]));
  const esc=s=>String(s??'').replace(/[&<>\"]/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[x]));
  const library=()=>window.COURSE_LIBRARY||[];
  function sourceFor(card){
    const id=card?.dataset?.course;
    const title=(card?.querySelector('h3')?.textContent||'').trim();
    const byId=library().find(c=>String(c.id)===id||String(c.courseId)===id);
    const byTitle=library().find(c=>String(c.title).trim()===title);
    return byId||byTitle||null;
  }
  function decorate(){
    document.querySelectorAll('.course-card').forEach(card=>{
      if(card.dataset.actionsReady)return;
      card.dataset.actionsReady='1';
      const id=card.dataset.course;
      const src=sourceFor(card);
      const row=card.querySelector('.course-bottom');
      if(!row)return;
      const plan=getPlan();
      const added=plan.includes(id);
      const actions=document.createElement('span');
      actions.className='course-actions';
      actions.innerHTML=`<button class="ghost plan-course" data-plan-id="${esc(id)}">${added?'✓ In My Plan':'＋ Add to My Plan'}</button>${src?.url?`<a class="ghost source-link" href="${esc(src.url)}" target="_blank" rel="noopener noreferrer">Open course ↗</a>`:`<span class="tiny muted source-pending">Source details inside course</span>`}`;
      row.appendChild(actions);
    });
    renderPlanBadge();
  }
  function renderPlanBadge(){
    let b=document.getElementById('my-plan-badge');
    if(!b){
      b=document.createElement('button');b.id='my-plan-badge';b.className='my-plan-badge';
      b.addEventListener('click',showPlan);document.body.appendChild(b);
    }
    b.textContent=`My Plan · ${getPlan().length}`;
  }
  function showPlan(){
    let old=document.getElementById('plan-modal'); if(old)old.remove();
    const ids=getPlan();
    const cards=[...document.querySelectorAll('.course-card')].filter(c=>ids.includes(c.dataset.course));
    const items=cards.map(c=>{const s=sourceFor(c);return `<div class="plan-item"><div><strong>${esc(c.querySelector('h3')?.textContent||'Course')}</strong><div class="tiny muted">${esc(c.querySelector('.eyebrow')?.textContent||'')}</div></div>${s?.url?`<a class="primary mini-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">Open course ↗</a>`:`<span class="tiny muted">Open course for source</span>`}<button class="ghost remove-plan" data-plan-id="${esc(c.dataset.course)}">Remove</button></div>`}).join('');
    const m=document.createElement('div');m.id='plan-modal';m.className='overlay-modal';
    m.innerHTML=`<div class="overlay-panel"><div class="section-head"><div><div class="eyebrow">PERSONAL STUDY SELECTION</div><h2>My Plan</h2><div class="sub">Courses you want to consider or study. Saved locally on this device.</div></div><button class="ghost close-plan">×</button></div><div class="plan-list">${items||'<div class="empty">No courses added yet. Use <strong>＋ Add to My Plan</strong> on any course card.</div>'}</div></div>`;
    document.body.appendChild(m);
    m.querySelector('.close-plan').onclick=()=>m.remove();
    m.addEventListener('click',e=>{const btn=e.target.closest('.remove-plan');if(!btn)return;savePlan(getPlan().filter(x=>x!==btn.dataset.planId));m.remove();decorate();showPlan()});
  }
  document.addEventListener('click',e=>{
    const btn=e.target.closest('.plan-course');
    if(!btn)return;
    const id=btn.dataset.planId; const p=getPlan();
    if(p.includes(id))savePlan(p.filter(x=>x!==id));else savePlan([...p,id]);
    decorate();
  });
  new MutationObserver(()=>decorate()).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',decorate);
})();
