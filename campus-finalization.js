// Finalization layer: specialization planner, weekly planner, assessments, capstone and source audit.
(function(){
  const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[c]));
  const A=window.CAMPUS_ACADEMIC||{};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};

  const TRACKS={
    'Mechanical Engineering':['MEC201','MAT301','THM401','MDE501','MFG501','SIM601'],
    'Electrical Engineering':['ELC201','ELC301','PWR401','CTL402','INS403','EMB501'],
    'Mechatronics & Robotics':['MEC201','ELC301','CTL402','INS403','MCH501','EMB501','ROB601'],
    'Civil Engineering & BIM':['MEC201','MAT301','CIV101','CIV201','CIV301','CIV401','CIV402','CIV503','CIV504','CIV601','CIV701','CIV702'],
    'Systems & Manufacturing':['MDE501','MFG501','SIM601','SYS601','PRO701'],
    'Engineering Computing':['MTH101','PRG101','CTL402','SIM601','EMB501','ROB601']
  };
  const CAPSTONE=[
    ['1','Problem statement + stakeholder needs',5],
    ['2','Literature review + requirements baseline',10],
    ['3','Concept generation + trade study',10],
    ['4','Preliminary design review (PDR)',10],
    ['5','Detailed design / simulation / implementation',20],
    ['6','Prototype or computational artifact',15],
    ['7','Verification + validation',15],
    ['8','Final technical report + defense',15]
  ];

  const sourceDirect={
    'MATH-E03':'https://www.nptel.ac.in/courses/111108144',
    'MATH-E05':'https://www.nptel.ac.in/courses/111105090',
    'MATH-E09':'https://www.nptel.ac.in/courses/111105035',
    'ME-E08':'https://www.nptel.ac.in/courses/112105125',
    'ME-E13':'https://archive.nptel.ac.in/courses/112/104/112104116/',
    'ME-E16':'https://www.nptel.ac.in/courses/112104193',
    'ME-E06':'https://www.nptel.ac.in/courses/101102090',
    'EE-E12':'https://archive.nptel.ac.in/content/syllabus_pdf/108105017.pdf',
    'ROB-E01':'https://www.nptel.ac.in/courses/112107290',
    'CIV-E01':'https://www.nptel.ac.in/courses/105106201'
  };
  window.CAMPUS_SOURCE_DIRECT={...(window.CAMPUS_SOURCE_DIRECT||{}),...sourceDirect};

  function sourceStatus(c){
    if(c?.url) return {label:'YOUR LIBRARY / COURSES',verified:true,url:c.url};
    const url=sourceDirect[c?.courseId];
    if(url) return {label:'VERIFIED FREE COURSE',verified:true,url};
    return {label:'SOURCE AUDIT',verified:false,url:null};
  }

  function degreeProgress(){
    const ids=Object.keys(A.core||{});
    if(!ids.length)return 0;
    const values=ids.map(id=>Number(localStorage.getItem(`academic-progress-${id}`)||0));
    return Math.round(values.reduce((a,b)=>a+b,0)/values.length);
  }

  function addNavButton(){
    const nav=document.querySelector('.sidebar .nav'); if(!nav)return;
    if(nav.querySelector('[data-final-tools]'))return;
    const b=document.createElement('button');b.className='nav-btn';b.dataset.finalTools='1';b.innerHTML='<span>◆</span><span class="nav-label">Study Command</span>';b.addEventListener('click',openTools);nav.appendChild(b);
  }

  function styles(){
    if(document.getElementById('finalization-css'))return;
    const s=document.createElement('style');s.id='finalization-css';s.textContent=`
    .final-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}.final-card{border:1px solid rgba(196,220,240,.12);background:linear-gradient(160deg,#122235,#08131f);border-radius:16px;padding:16px}.final-card h3{margin:0 0 6px}.final-muted{color:#879bae;font-size:.78rem;line-height:1.55}.final-small{font-size:.7rem;color:#8ea1b4}.final-btn{border:1px solid rgba(196,220,240,.14);background:rgba(255,255,255,.025);color:#eff5fb;padding:9px 11px;border-radius:10px}.final-btn.primary{background:linear-gradient(135deg,#63d8ff,#8f9bff);border:0;color:#07111b;font-weight:800}.final-row{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap}.final-progress{height:7px;background:#06101a;border-radius:99px;overflow:hidden}.final-progress span{display:block;height:100%;background:linear-gradient(90deg,#63d8ff,#8f9bff)}.final-table{width:100%;border-collapse:collapse;margin-top:10px}.final-table th,.final-table td{padding:8px;border-bottom:1px solid rgba(196,220,240,.08);text-align:left;font-size:.78rem}.final-pct{font-variant-numeric:tabular-nums;font-weight:850}.final-source-good{color:#72e4bc}.final-source-warn{color:#f0d99c}.final-check{display:flex;gap:8px;align-items:center;margin:7px 0;color:#b6c5d2;font-size:.8rem}.final-modal textarea,.final-modal input,.final-modal select{width:100%;background:#06111c;color:#eff5fb;border:1px solid rgba(196,220,240,.14);padding:10px;border-radius:10px}.final-modal label{font-size:.72rem;color:#8ea1b4;text-transform:uppercase;letter-spacing:.08em}.final-modal .block{margin-top:13px}.final-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}.final-three{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.final-chip{display:inline-flex;padding:5px 8px;border:1px solid rgba(196,220,240,.12);border-radius:999px;font-size:.68rem;color:#c5d3df}.final-list{margin:8px 0;padding-left:20px;color:#b4c3d1;line-height:1.65}.final-modal{position:fixed;inset:0;z-index:260;background:rgba(2,7,12,.9);backdrop-filter:blur(16px);padding:18px;overflow:auto}.final-panel{max-width:1220px;margin:0 auto;background:linear-gradient(180deg,#122235,#08131f);border:1px solid rgba(196,220,240,.15);border-radius:24px;padding:28px;min-height:calc(100vh - 36px)}.final-panel h2{margin:.2rem 0 .4rem;font-size:2.2rem}.final-tabbar{display:flex;gap:7px;flex-wrap:wrap;margin:18px 0}.final-tab{border:1px solid rgba(196,220,240,.12);background:rgba(255,255,255,.025);color:#c8d5e1;padding:8px 11px;border-radius:10px}.final-tab.active{background:rgba(99,216,255,.12);border-color:rgba(99,216,255,.25);color:#63d8ff}.final-hero{padding:16px;border:1px solid rgba(99,216,255,.12);border-radius:16px;background:linear-gradient(135deg,rgba(99,216,255,.05),rgba(143,155,255,.04))}.final-radio{display:flex;gap:8px;flex-wrap:wrap}.final-radio button{flex:1;min-width:150px}.final-note{padding:11px 13px;border-radius:12px;border:1px solid rgba(225,190,112,.18);background:rgba(225,190,112,.06);color:#ead9aa;font-size:.78rem;line-height:1.55}
    @media(max-width:980px){.final-grid{grid-template-columns:1fr 1fr}.final-three{grid-template-columns:1fr 1fr}}
    @media(max-width:650px){.final-grid,.final-two,.final-three{grid-template-columns:1fr}.final-panel{padding:18px}.final-modal{padding:8px}}
    `;document.head.appendChild(s);
  }

  function openTools(){
    styles();
    const modal=document.createElement('div');modal.className='final-modal';modal.id='final-modal';
    modal.innerHTML=`<div class="final-panel"><div class="final-row"><div><div class="eyebrow">PERSONAL ENGINEERING UNIVERSITY</div><h2>Study Command</h2><div class="final-muted">Your degree, specialization, planner, assessments, capstone and source audit in one place.</div></div><button class="final-btn" id="final-close">×</button></div><div class="final-tabbar"><button class="final-tab active" data-tab="specializations">Specializations</button><button class="final-tab" data-tab="planner">Weekly Planner</button><button class="final-tab" data-tab="assessments">Assessments</button><button class="final-tab" data-tab="capstone">Capstone</button><button class="final-tab" data-tab="sources">Source Audit</button></div><div id="final-content"></div></div>`;
    document.body.appendChild(modal);
    const setTab=t=>{modal.querySelectorAll('.final-tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===t));renderTab(t)};
    modal.querySelectorAll('.final-tab').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
    modal.querySelector('#final-close').addEventListener('click',()=>modal.remove());
    renderTab('specializations');
  }

  function renderTab(tab){
    const root=document.querySelector('#final-modal #final-content');if(!root)return;
    if(tab==='specializations'){
      const selected=load('campus-specialization','Mechatronics & Robotics');
      root.innerHTML=`<div class="final-hero"><div class="eyebrow">Choose your depth path</div><h3>${esc(selected)}</h3><div class="final-muted">This does not replace the multidisciplinary core. It selects recommended electives for depth.</div></div><div class="final-grid">${Object.entries(TRACKS).map(([name,ids])=>`<article class="final-card"><div class="final-row"><h3>${esc(name)}</h3><span class="final-chip">${ids.length} anchors</span></div><div class="final-muted">${ids.map(id=>A.core?.[id]?.title||id).slice(0,5).map(esc).join(' · ')}</div><button class="final-btn primary" data-track="${esc(name)}" style="margin-top:12px">Set specialization</button></article>`).join('')}</div><div class="final-note" style="margin-top:14px">Recommended load: keep the multidisciplinary core intact and choose 3–5 depth electives per specialization. Extra electives remain available in the Master Catalog.</div>`;
      root.querySelectorAll('[data-track]').forEach(b=>b.addEventListener('click',()=>{save('campus-specialization',b.dataset.track);renderTab('specializations');window.toast?.(`Specialization set: ${b.dataset.track}`)}));
      return;
    }
    if(tab==='planner'){
      const week=load('campus-week-plan',{Mon:45,Tue:45,Wed:45,Thu:45,Fri:45,Sat:90,Sun:30});
      root.innerHTML=`<div class="final-two"><div class="final-card"><h3>Weekly study budget</h3><div class="final-muted">Set realistic minutes. The planner stores only your personal plan on this device.</div>${Object.entries(week).map(([d,v])=>`<div class="block"><label>${d}</label><input data-day="${d}" type="number" min="0" step="15" value="${v}"></div>`).join('')}<button class="final-btn primary" id="save-week" style="margin-top:12px">Save weekly budget</button></div><div class="final-card"><h3>Recommended rhythm</h3><ul class="final-list"><li>Core lecture / reading</li><li>Problem solving</li><li>Lab or coding artifact</li><li>One weekly review block</li><li>One tangible engineering output</li></ul><div class="final-note">Your current campus philosophy is depth before breadth: one main academic course, one supporting resource, and one practical artifact.</div></div></div>`;
      root.querySelector('#save-week').addEventListener('click',()=>{const n={};root.querySelectorAll('[data-day]').forEach(x=>n[x.dataset.day]=Math.max(0,Number(x.value)||0));save('campus-week-plan',n);window.toast?.('Weekly study budget saved')});
      return;
    }
    if(tab==='assessments'){
      const rec=load('campus-assessments',[]);
      root.innerHTML=`<div class="final-two"><div class="final-card"><h3>Record an assessment</h3><div class="block"><label>Course ID</label><input id="a-course" placeholder="MTH101"></div><div class="block"><label>Assessment</label><input id="a-name" placeholder="Problem set 01"></div><div class="final-three block"><div><label>Score</label><input id="a-score" type="number" min="0" max="100"></div><div><label>Weight %</label><input id="a-weight" type="number" min="0" max="100" value="10"></div><div><label>Date</label><input id="a-date" type="date"></div></div><button class="final-btn primary" id="a-save" style="margin-top:12px">Save assessment</button></div><div class="final-card"><h3>Assessment record</h3>${rec.length?`<table class="final-table"><thead><tr><th>Course</th><th>Assessment</th><th>Score</th><th>Weight</th></tr></thead><tbody>${rec.map(x=>`<tr><td>${esc(x.course)}</td><td>${esc(x.name)}</td><td>${x.score}%</td><td>${x.weight}%</td></tr>`).join('')}</tbody></table>`:'<div class="final-muted">No assessments recorded yet.</div>'}</div></div>`;
      root.querySelector('#a-save').addEventListener('click',()=>{const x={course:root.querySelector('#a-course').value.trim(),name:root.querySelector('#a-name').value.trim(),score:Number(root.querySelector('#a-score').value),weight:Number(root.querySelector('#a-weight').value),date:root.querySelector('#a-date').value};if(!x.course||!x.name)return window.toast?.('Enter course and assessment');const arr=load('campus-assessments',[]);arr.push(x);save('campus-assessments',arr);renderTab('assessments');window.toast?.('Assessment recorded')});
      return;
    }
    if(tab==='capstone'){
      const done=load('capstone-done',{});const pct=CAPSTONE.reduce((s,[, ,w])=>s+(done[arguments]?.x||0),0);
      const total=CAPSTONE.reduce((s,[,,w])=>s+w,0);const cur=Math.round(CAPSTONE.reduce((s,[id,,w])=>s+(done[id]?w:0),0)/total*100);
      root.innerHTML=`<div class="final-hero"><div class="final-row"><div><div class="eyebrow">CAPSTONE / THESIS</div><h3>Design → Build → Verify → Defend</h3></div><span class="final-chip">${cur}% complete</span></div><div class="final-progress" style="margin-top:12px"><span style="width:${cur}%"></span></div></div><div class="final-grid">${CAPSTONE.map(([id,title,w])=>`<label class="final-card" style="display:block"><div class="final-row"><strong>${id}. ${esc(title)}</strong><span>${w}%</span></div><div class="final-check"><input type="checkbox" data-cap="${id}" ${done[id]?'checked':''}> Completed</div></label>`).join('')}</div><div class="final-card" style="margin-top:12px"><h3>Defense checklist</h3><ul class="final-list"><li>Requirements and scope are traceable.</li><li>Design decisions have evidence.</li><li>Simulation/prototype results are reproducible.</li><li>Verification is separated from validation.</li><li>Final report documents assumptions, limits and next work.</li></ul></div>`;
      root.querySelectorAll('[data-cap]').forEach(x=>x.addEventListener('change',()=>{const d=load('capstone-done',{});d[x.dataset.cap]=x.checked;save('capstone-done',d);renderTab('capstone')}));
      return;
    }
    if(tab==='sources'){
      const courses=[...(window.COURSE_LIBRARY||[])];const verified=courses.filter(c=>sourceStatus(c).verified).length;const audit=courses.filter(c=>!sourceStatus(c).verified);
      root.innerHTML=`<div class="final-two"><div class="final-card"><h3>Source health</h3><div class="final-three"><div><div class="final-small">Total</div><strong>${courses.length}</strong></div><div><div class="final-small">Verified</div><strong class="final-source-good">${verified}</strong></div><div><div class="final-small">Audit</div><strong class="final-source-warn">${audit.length}</strong></div></div><div class="final-muted" style="margin-top:12px">Your Library/Coursera/Udemy records are considered directly accessible; free-course items are only marked verified when a title-specific source is stored.</div></div><div class="final-card"><h3>Rule</h3><div class="final-note">No course is promoted to “verified free” merely because a generic NPTEL catalog exists. The campus distinguishes direct source verification from discovery routes.</div></div></div><div class="final-card" style="margin-top:12px"><h3>Items still needing title-level source audit</h3><div class="final-grid" style="margin-top:10px">${audit.slice(0,60).map(c=>`<div class="final-card"><strong>${esc(c.courseId)}</strong><div class="final-muted">${esc(c.title)}</div><span class="final-source-warn">SOURCE AUDIT</span></div>`).join('')}</div></div>`;
      return;
    }
  }
  styles();
  const obs=new MutationObserver(addNavButton);obs.observe(document.body,{childList:true,subtree:true});addNavButton();
})();
