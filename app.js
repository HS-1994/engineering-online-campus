const app = document.getElementById('app');

const curriculum = [
  {id:'MTH101',school:'Foundation',title:'Engineering Mathematics',stage:'Foundation',role:'Core',hours:36,progress:82,desc:'Calculus, vector calculus, linear algebra, differential equations, probability and numerical thinking for engineering.'},
  {id:'MEC201',school:'Mechanical',title:'Mechanics & Dynamics',stage:'Mechanical Core',role:'Core',hours:42,progress:58,desc:'Statics, particle and rigid-body dynamics, modeling and engineering applications.'},
  {id:'MAT301',school:'Mechanical',title:'Materials & Mechanics of Materials',stage:'Mechanical Core',role:'Core',hours:44,progress:46,desc:'Material behavior, stress-strain, failure, beam bending, selection and processing.'},
  {id:'THM401',school:'Mechanical',title:'Thermal & Fluid Sciences',stage:'Mechanical Core',role:'Core',hours:54,progress:20,desc:'Thermodynamics, heat transfer, fluid mechanics, turbomachinery and thermal systems.'},
  {id:'MDE501',school:'Mechanical',title:'Advanced Mechanical Design',stage:'Design Intensive',role:'Intensive',hours:52,progress:12,desc:'Machine design, transmission systems, DFM/DFA, product development, FEA/CFD and verification.'},
  {id:'ELC201',school:'Electrical',title:'Circuit Analysis',stage:'Electrical Core',role:'Core',hours:40,progress:35,desc:'DC/AC analysis, network methods, transient response and engineering simulation.'},
  {id:'ELC301',school:'Electrical',title:'Electronics & Digital Systems',stage:'Electrical Core',role:'Intensive',hours:48,progress:18,desc:'Analog electronics, digital logic, interfacing and the hardware foundations of intelligent systems.'},
  {id:'PWR401',school:'Electrical',title:'Power Electronics & Drives',stage:'Electrical Intensive',role:'Intensive',hours:50,progress:0,desc:'Converters, inverters, motor drives, switching systems and power conversion for electrified machines.'},
  {id:'MCH501',school:'Mechatronics',title:'Mechatronics Systems',stage:'Systems Core',role:'Intensive',hours:45,progress:0,desc:'Integrated mechanical, electrical, embedded and control architectures with design-build-test thinking.'},
  {id:'CTL402',school:'Control',title:'Control Systems & System Dynamics',stage:'Control Core',role:'Core',hours:50,progress:0,desc:'Dynamic modeling, feedback, state-space, stability, simulation, system identification and digital control.'},
  {id:'INS403',school:'Control',title:'Measurement, Instrumentation & DAQ',stage:'Control Core',role:'Core',hours:38,progress:0,desc:'Sensors, signal conditioning, uncertainty, metrology, ADC/DAC and data acquisition for experiments.'},
  {id:'EMB501',school:'Embedded',title:'Embedded Systems',stage:'Systems Intensive',role:'Intensive',hours:50,progress:0,desc:'Microcontrollers, C/C++, real-time concepts, peripherals, buses, sensors and motor interfacing.'},
  {id:'ROB601',school:'Robotics',title:'Robotics: Kinematics to Autonomy',stage:'Advanced',role:'Intensive',hours:64,progress:0,desc:'Robot kinematics, dynamics, planning, manipulation, mobile robotics, ROS 2 and autonomous behavior.'},
  {id:'SYS601',school:'Systems',title:'Engineering Systems Development',stage:'Advanced',role:'Intensive',hours:42,progress:0,desc:'Requirements, architecture, interfaces, verification, validation, trade studies and integration.'},
  {id:'MFG501',school:'Manufacturing',title:'Manufacturing & Metrology',stage:'Manufacturing',role:'Intensive',hours:44,progress:0,desc:'Manufacturing processes, digital manufacturing, metrology, quality, tolerancing and production systems.'},
  {id:'SIM601',school:'Simulation',title:'Simulation, FEA/CFD & Digital Twins',stage:'Advanced',role:'Intensive',hours:48,progress:0,desc:'Numerical simulation workflows, model validation, FEA, CFD, digital twins and engineering decision-making.'},
  {id:'EV601',school:'Specialization',title:'Electric Vehicles & Battery Systems',stage:'Electrification',role:'Elective',hours:42,progress:0,desc:'Traction drives, power electronics, battery modeling, BMS, thermal considerations and vehicle integration.'},
  {id:'HVAC501',school:'Specialization',title:'HVAC, Refrigeration & Thermal Systems',stage:'Thermal Expansion',role:'Elective',hours:34,progress:0,desc:'Refrigeration cycles, air conditioning, system sizing and engineering applications.'},
  {id:'FLP501',school:'Specialization',title:'Fluid Power & Industrial Automation',stage:'Automation',role:'Elective',hours:36,progress:0,desc:'Hydraulics, pneumatics, electro-hydraulics, actuators, valves and automation integration.'},
  {id:'CIV301',school:'Civil Expansion',title:'Structures, Steel, RCC & BIM',stage:'Civil Expansion',role:'Core',hours:58,progress:64,desc:'Structural behavior, steel and concrete design, Revit/Navisworks/BIM workflows and detailing.'},
  {id:'PRO701',school:'Professional',title:'Engineering Economics, Project Management & Ethics',stage:'Professional',role:'Core',hours:28,progress:0,desc:'Engineering decisions, cost, project planning, contracts, ethics, risk and professional communication.'}
];

const projects = [
  {title:'Motor Test Bench',type:'Design-Build-Test',status:'Ready',desc:'Model, instrument and characterize a small DC/BLDC motor system.'},
  {title:'Smart Mechatronic Arm',type:'Robotics',status:'Planned',desc:'Build a simulated pick-and-place system with kinematics, control and ROS 2.'},
  {title:'Digital Twin of a Pumping System',type:'Systems + Simulation',status:'Planned',desc:'Create a physics-based model, instrumentation layer and monitoring dashboard.'},
  {title:'Engineering Capstone',type:'Thesis / Capstone',status:'Locked',desc:'Year-scale multidisciplinary design project integrating requirements, design, testing and documentation.'}
];

const library = [
  {title:'Modern Robotics',meta:'Lynch & Park · Core reference',tag:'Robotics'},
  {title:'Shigley’s Mechanical Engineering Design',meta:'Budynas & Nisbett · Design reference',tag:'Mechanical'},
  {title:'Engineering Mechanics',meta:'Statics + Dynamics · Foundation',tag:'Mechanics'},
  {title:'Measurement and Instrumentation Principles',meta:'Morris · Measurement reference',tag:'Instrumentation'},
  {title:'Control Systems Engineering',meta:'Nise · Control reference',tag:'Control'},
  {title:'Lessons in Industrial Instrumentation',meta:'Practical industrial reference',tag:'Automation'}
];

const state = {
  page: 'dashboard',
  user: JSON.parse(localStorage.getItem('eoc-user') || 'null'),
  setup: localStorage.getItem('eoc-user') ? false : true,
  query:'',
  school:'All',
  role:'All'
};

function esc(value){ return String(value).replace(/[&<>\"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[c])); }
function icon(name){
  const icons={
    home:'⌂',courses:'▣',map:'⌘',lab:'⚙',library:'▤',progress:'◒',profile:'◉',logout:'↪',arrow:'→',check:'✓',book:'✦'
  }; return icons[name]||'•';
}
function toast(msg){
  const el=document.createElement('div'); el.className='toast'; el.textContent=msg; document.body.appendChild(el); setTimeout(()=>el.remove(),2200);
}

function saveUser(user){ localStorage.setItem('eoc-user', JSON.stringify(user)); state.user=user; state.setup=false; }
function logout(){ localStorage.removeItem('eoc-user'); state.user=null; state.setup=true; render(); }

function loginView(){
  const first = state.setup;
  return `<div class="login-screen">
    <div class="login-grid">
      <section class="hero-panel">
        <div>
          <div class="brand"><div class="brand-mark">E</div><div><strong>ENGINEERING ONLINE CAMPUS</strong><div class="tiny muted">PERSONAL UNIVERSITY PORTAL</div></div></div>
          <div class="eyebrow" style="margin-top:52px">STUDENT PORTAL · ENGINEERING MASTERY</div>
          <h1>Build the engineer you want to become.</h1>
          <p>A personal online campus built around serious engineering fundamentals, advanced design, robotics, systems thinking, projects and a world-class curriculum.</p>
          <div class="quest-card"><strong>Adventure principle</strong><div class="muted" style="margin-top:7px">Learn. Model. Build. Measure. Verify. Repeat.</div></div>
        </div>
        <div class="muted tiny">Inspired by the atmosphere of modern Japanese games: exploration, progression, mastery and a little adventure — without using third-party artwork.</div>
      </section>
      <section class="auth-panel">
        <div class="eyebrow">${first?'First-time setup':'Student login'}</div>
        <h2>${first?'Create your campus profile':'Welcome back'}</h2>
        <p class="muted">${first?'This is a private personal campus. Your profile is stored locally on this device.':'Enter your student number and campus password.'}</p>
        ${first?'<div class="setup-note">Zero-cost mode: this prototype uses local browser storage only. No external account, server, payment or API is required.</div>':''}
        <form id="auth-form">
          <div class="field"><label for="student">Student number</label><input id="student" autocomplete="username" required placeholder="e.g. ENG-2026-001" /></div>
          <div class="field"><label for="password">Campus password</label><input id="password" type="password" autocomplete="current-password" required placeholder="At least 6 characters" /></div>
          ${first?'<div class="field"><label for="name">Display name</label><input id="name" required placeholder="Your name on campus" /></div>':''}
          <div class="error" id="auth-error"></div>
          <button class="primary" type="submit">${first?'Create campus profile':'Enter campus'} ${icon('arrow')}</button>
        </form>
        <div class="footer-note">Personal study portal · static, private-on-device authentication prototype</div>
      </section>
    </div>
  </div>`;
}

function navItem(id,label,ico){ return `<button class="nav-btn ${state.page===id?'active':''}" data-nav="${id}"><span>${icon(ico)}</span><span class="nav-label">${label}</span></button>`; }
function layout(content){
  return `<div class="campus">
    <aside class="sidebar">
      <div class="brand"><div class="brand-mark">E</div><div class="brand-text"><strong>ENGINEERING</strong><div class="tiny muted">ONLINE CAMPUS</div></div></div>
      <nav class="nav" aria-label="Primary navigation">
        ${navItem('dashboard','Campus Home','home')}
        ${navItem('courses','My Courses','courses')}
        ${navItem('curriculum','Curriculum','map')}
        ${navItem('labs','Labs & Projects','lab')}
        ${navItem('library','Engineering Library','library')}
        ${navItem('progress','Academic Progress','progress')}
        ${navItem('profile','Student Profile','profile')}
      </nav>
      <div class="sidebar-footer"><div class="tiny muted">Current quest</div><strong>STEM → Systems → Mastery</strong><div class="progress" style="margin-top:10px"><span style="width:38%"></span></div><div class="tiny muted" style="margin-top:7px">38% overall roadmap</div></div>
      <button class="nav-btn" id="logout-btn"><span>${icon('logout')}</span><span class="nav-label">Sign out</span></button>
    </aside>
    <main class="main">
      <header class="topbar"><div class="topbar-left"><button class="ghost mobile-menu" id="quick-dashboard">☰</button><div><div class="eyebrow">STUDENT PORTAL</div><div class="page-title">${pageTitle()}</div><div class="sub">Welcome back, ${esc(state.user.name)}.</div></div></div><div class="topbar-left"><div><strong>${esc(state.user.student)}</strong><div class="tiny muted">Personal student ID</div></div><div class="avatar">${esc(initials(state.user.name))}</div></div></header>
      ${content}
    </main>
  </div>`;
}
function initials(name){ return name.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase(); }
function pageTitle(){ return ({dashboard:'Campus Home',courses:'My Courses',curriculum:'Curriculum Map',labs:'Labs & Projects',library:'Engineering Library',progress:'Academic Progress',profile:'Student Profile'})[state.page]||'Campus Home'; }

function dashboard(){
  const active=curriculum.filter(c=>c.progress>0 && c.progress<100).slice(0,4);
  const avg=Math.round(curriculum.reduce((a,c)=>a+c.progress,0)/curriculum.length);
  return `<section class="grid" style="gap:20px">
    <div class="anime-banner"><div class="orb"></div><div class="mountain"></div><div class="banner-copy"><div class="eyebrow">YOUR ENGINEERING JOURNEY</div><h2>Semester zero: build the foundation.</h2><p>Your campus is organized like a real multidisciplinary engineering university: foundations first, then design, systems, laboratories, specializations and a capstone.</p><button class="primary" data-nav="curriculum">Open curriculum map ${icon('arrow')}</button></div></div>
    <div class="grid grid-4">
      <div class="card metric"><div><div class="label">Roadmap progress</div><div class="value">${avg}%</div></div><span class="pill good">Active</span></div>
      <div class="card metric"><div><div class="label">Core courses</div><div class="value">${curriculum.filter(c=>c.role==='Core').length}</div></div><span class="pill">Foundation</span></div>
      <div class="card metric"><div><div class="label">Intensive tracks</div><div class="value">${curriculum.filter(c=>c.role==='Intensive').length}</div></div><span class="pill">Depth</span></div>
      <div class="card metric"><div><div class="label">Projects</div><div class="value">${projects.length}</div></div><span class="pill">Build</span></div>
    </div>
    <div class="grid grid-2">
      <div class="card"><div class="section-head"><div><h2>Continue studying</h2><div class="sub">Courses with active progress</div></div><button class="ghost" data-nav="courses">View all</button></div><div class="grid">${active.map(c=>courseCard(c,true)).join('')}</div></div>
      <div class="card"><div class="section-head"><div><h2>Today on campus</h2><div class="sub">Suggested rhythm</div></div></div><div class="timeline"><div class="timeline-item"><div class="timeline-time">09:00</div><div><strong>Engineering mathematics</strong><div class="muted tiny">25–40 min concept review + 5 practice problems</div></div></div><div class="timeline-item"><div class="timeline-time">11:00</div><div><strong>Primary engineering course</strong><div class="muted tiny">Lecture, notes and worked examples</div></div></div><div class="timeline-item"><div class="timeline-time">19:00</div><div><strong>Design / lab block</strong><div class="muted tiny">One tangible output before the day ends</div></div></div></div></div>
    </div>
    <div class="card"><div class="section-head"><div><h2>Engineering schools</h2><div class="sub">Your campus is intentionally multidisciplinary.</div></div></div><div class="grid grid-4">${['Mechanical Engineering','Electrical Engineering','Mechatronics & Robotics','Engineering Computing','Civil + BIM','Control + Instrumentation','Manufacturing','Energy + Electrification'].map((x,i)=>`<button class="card" data-school="${esc(x)}" style="text-align:left;box-shadow:none;background:rgba(255,255,255,.02);border-color:var(--line)"><div class="eyebrow">0${i+1}</div><strong>${esc(x)}</strong><div class="tiny muted" style="margin-top:7px">Open track</div></button>`).join('')}</div></div>
  </section>`;
}
function courseCard(c,compact=false){
  return `<article class="card course-card" data-course="${c.id}"><div class="course-head"><div><div class="eyebrow">${esc(c.school)}</div><h3>${esc(c.title)}</h3></div><span class="pill ${c.progress>0?'good':''}">${esc(c.role)}</span></div><div class="course-meta"><span class="pill">${esc(c.stage)}</span><span class="pill">${c.hours}h target</span></div><p>${esc(c.desc)}</p><div class="progress"><span style="width:${c.progress}%"></span></div><div style="display:flex;justify-content:space-between;margin-top:8px" class="tiny muted"><span>${c.progress}% complete</span><button class="ghost course-open" data-id="${c.id}" style="padding:6px 10px">Open ${icon('arrow')}</button></div>${compact?'':'<div class="tiny muted" style="margin-top:10px">Prerequisites → foundation / related systems as mapped in the full curriculum.</div>'}</article>`;
}
function courses(){
  const schools=['All',...new Set(curriculum.map(c=>c.school))];
  const roles=['All','Core','Intensive','Elective'];
  const filtered=curriculum.filter(c=>(state.school==='All'||c.school===state.school)&&(state.role==='All'||c.role===state.role)&&(`${c.title} ${c.desc}`.toLowerCase().includes(state.query.toLowerCase())));
  return `<section><div class="card"><div class="filterbar"><input id="course-search" value="${esc(state.query)}" placeholder="Search courses, topics, systems…"/><select id="school-filter">${schools.map(s=>`<option ${s===state.school?'selected':''}>${esc(s)}</option>`).join('')}</select><select id="role-filter">${roles.map(r=>`<option ${r===state.role?'selected':''}>${esc(r)}</option>`).join('')}</select></div><div class="grid grid-2" id="course-list">${filtered.map(c=>courseCard(c)).join('')||'<div class="empty">No courses match this filter.</div>'}</div></div></section>`;
}
function curriculumPage(){
  const nodes=['Foundation','Mechanical Core','Electrical Core','Control + Instrumentation','Systems + Embedded','Mechatronics','Robotics','Advanced Simulation','Manufacturing','Specializations','Professional Engineering','Capstone'];
  return `<section class="grid" style="gap:18px"><div class="card"><div class="eyebrow">ACADEMIC ARCHITECTURE</div><h2>Depth before breadth.</h2><p class="muted" style="line-height:1.7;max-width:850px">Each stage is a prerequisite layer. You do not simply collect certificates; you build capability. The final structure is benchmarked against strong engineering curricula and strengthened with measurement, systems engineering, design-build-test, professional practice and a thesis-style capstone.</p></div><div class="card"><div class="map">${nodes.map((n,i)=>`<div class="map-node"><div class="num">STAGE ${String(i+1).padStart(2,'0')}</div><h3>${esc(n)}</h3><div class="tiny muted">${i<7?'Core sequence':'Advanced / integration'}</div></div>`).join('')}</div></div><div class="grid grid-3"><div class="card"><h3>Core</h3><p class="muted">Non-negotiable engineering foundation and breadth.</p></div><div class="card"><h3>Intensive</h3><p class="muted">Deep study with calculations, software, labs and design.</p></div><div class="card"><h3>Elective / Lab</h3><p class="muted">Focused specialization or hands-on practice after prerequisites.</p></div></div></section>`;
}
function labsPage(){
 return `<section class="grid grid-2">${projects.map((p,i)=>`<article class="card"><div class="course-head"><div><div class="eyebrow">PROJECT ${String(i+1).padStart(2,'0')}</div><h2>${esc(p.title)}</h2></div><span class="pill">${esc(p.status)}</span></div><div class="course-meta"><span class="pill">${esc(p.type)}</span><span class="pill">Tangible output</span></div><p>${esc(p.desc)}</p><div class="checklist"><label class="check"><input type="checkbox" data-project="${i}" ${localStorage.getItem(`project-${i}`)==='1'?'checked':''}/> Mark project milestone complete</label></div></article>`).join('')}<div class="card span-2"><div class="eyebrow">CAPSTONE PHILOSOPHY</div><h2>Design → Build → Measure → Verify → Document</h2><p class="muted">The campus is not complete without engineering practice. Your capstone should integrate requirements, theory, simulation, prototype or high-fidelity digital validation, testing, and professional documentation.</p></div></section>`;
}
function libraryPage(){ return `<section><div class="grid grid-3">${library.map(x=>`<article class="card library-card"><div><span class="pill">${esc(x.tag)}</span><h2 style="font-size:1.35rem;margin-top:16px">${esc(x.title)}</h2><div class="muted">${esc(x.meta)}</div></div><button class="ghost" data-library="${esc(x.title)}">Open reference ${icon('arrow')}</button></article>`).join('')}</div></section>`; }
function progressPage(){ const done=curriculum.filter(c=>c.progress>=100).length; const avg=Math.round(curriculum.reduce((a,c)=>a+c.progress,0)/curriculum.length); return `<section class="grid grid-2"><div class="card"><div class="eyebrow">ACADEMIC PROGRESS</div><h2>${avg}% roadmap complete</h2><p class="muted">This is your personal degree-style progress view. It tracks capability, not just attendance.</p><div class="progress" style="height:13px;margin:18px 0"><span style="width:${avg}%"></span></div><div class="grid grid-3"><div><div class="metric"><span class="label">Active</span><strong>${curriculum.filter(c=>c.progress>0&&c.progress<100).length}</strong></div></div><div><div class="metric"><span class="label">Done</span><strong>${done}</strong></div></div><div><div class="metric"><span class="label">Planned</span><strong>${curriculum.filter(c=>c.progress===0).length}</strong></div></div></div></div><div class="card"><div class="eyebrow">MASTER PLAN</div><h2>What “graduating” means here</h2><div class="checklist">${['Complete engineering foundation','Reach mechanical + electrical design depth','Complete control + instrumentation','Build embedded/mechatronic systems','Complete robotics / systems integration','Finish advanced specialization','Deliver capstone + technical portfolio'].map((x,i)=>`<label class="check"><input type="checkbox" ${i<avg/15?'checked':''}/><span>${esc(x)}</span></label>`).join('')}</div></div></section>`; }
function profilePage(){ return `<section class="grid grid-2"><div class="card"><div class="eyebrow">STUDENT IDENTITY</div><h2>${esc(state.user.name)}</h2><p class="muted">Student number: <strong>${esc(state.user.student)}</strong></p><div class="grid grid-2"><div class="card" style="box-shadow:none;background:rgba(255,255,255,.02)"><div class="tiny muted">Campus</div><strong>Engineering Online Campus</strong></div><div class="card" style="box-shadow:none;background:rgba(255,255,255,.02)"><div class="tiny muted">Program</div><strong>Multidisciplinary Engineering</strong></div></div></div><div class="card"><div class="eyebrow">PRIVATE MODE</div><h2>Zero-cost personal portal</h2><p class="muted">Your login profile is stored on this browser only. There is no server, subscription or paid API in this first version.</p><button class="ghost" id="reset-profile">Reset local profile</button></div></section>`; }
function renderPage(){
  if(!state.user) { app.innerHTML=loginView(); bindLogin(); return; }
  let content = dashboard();
  if(state.page==='courses') content=courses();
  if(state.page==='curriculum') content=curriculumPage();
  if(state.page==='labs') content=labsPage();
  if(state.page==='library') content=libraryPage();
  if(state.page==='progress') content=progressPage();
  if(state.page==='profile') content=profilePage();
  app.innerHTML=layout(content);
  bindCampus();
}
function bindLogin(){
  const form=document.getElementById('auth-form');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const student=document.getElementById('student').value.trim();
    const password=document.getElementById('password').value;
    const err=document.getElementById('auth-error');
    if(password.length<6){ err.textContent='Use a password of at least 6 characters.'; return; }
    if(state.setup){ const name=document.getElementById('name').value.trim(); if(!name){err.textContent='Add your display name.';return;} saveUser({student,name,password}); toast('Campus profile created'); renderPage(); }
    else { if(student===state.user.student && password===state.user.password){toast('Signed in');renderPage();} else err.textContent='Student number or password is incorrect.'; }
  });
}
function bindCampus(){
  document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',()=>{ state.page=el.dataset.nav; renderPage(); }));
  document.getElementById('logout-btn')?.addEventListener('click',logout);
  document.getElementById('quick-dashboard')?.addEventListener('click',()=>{state.page='dashboard';renderPage();});
  document.querySelectorAll('.course-open').forEach(b=>b.addEventListener('click',()=>toast(`Course ${b.dataset.id} opened — next build will add full course workspace.`)));
  document.getElementById('course-search')?.addEventListener('input',e=>{state.query=e.target.value; renderPage(); requestAnimationFrame(()=>{const el=document.getElementById('course-search');el?.focus();el?.setSelectionRange(el.value.length,el.value.length);});});
  document.getElementById('school-filter')?.addEventListener('change',e=>{state.school=e.target.value;renderPage();});
  document.getElementById('role-filter')?.addEventListener('change',e=>{state.role=e.target.value;renderPage();});
  document.querySelectorAll('[data-project]').forEach(c=>c.addEventListener('change',e=>{localStorage.setItem(`project-${c.dataset.project}`,e.target.checked?'1':'0');toast(e.target.checked?'Milestone saved':'Milestone reopened');}));
  document.querySelectorAll('[data-library]').forEach(b=>b.addEventListener('click',()=>toast(`${b.dataset.library} — reference workspace coming next.`)));
  document.getElementById('reset-profile')?.addEventListener('click',()=>{if(confirm('Reset the local campus profile on this browser?')){localStorage.removeItem('eoc-user');state.user=null;state.setup=true;render();}});
}

function render(){ renderPage(); }
render();
