// Engineering Online Campus — academic layer v2
// This file intentionally sits after app.js. It extends the local-first campus without a server or paid services.

const semesterCatalog = [
  {term:'Year 1 · Semester 1',subtitle:'Engineering foundation',courses:['MTH101','ELC201'],focus:'Mathematics, physics-informed thinking, circuit fundamentals and engineering study habits.'},
  {term:'Year 1 · Semester 2',subtitle:'Mechanics & computation',courses:['MEC201','CIV301'],focus:'Mechanics, dynamics, structural/BIM expansion and computational engineering practice.'},
  {term:'Year 2 · Semester 3',subtitle:'Materials & thermal science',courses:['MAT301','THM401'],focus:'Materials, strength, thermodynamics, heat transfer and fluids.'},
  {term:'Year 2 · Semester 4',subtitle:'Design & electronics',courses:['MDE501','ELC301'],focus:'Mechanical design depth, electronics, digital systems and design-for-manufacture.'},
  {term:'Year 3 · Semester 5',subtitle:'Power, control & measurement',courses:['PWR401','CTL402','INS403'],focus:'Power conversion, system dynamics, feedback, sensors and DAQ.'},
  {term:'Year 3 · Semester 6',subtitle:'Integrated systems',courses:['MCH501','EMB501','MFG501'],focus:'Mechatronics, embedded systems, manufacturing, metrology and integration testing.'},
  {term:'Year 4 · Semester 7',subtitle:'Robotics & advanced engineering',courses:['ROB601','SYS601','SIM601'],focus:'Robotics, systems engineering, verification, FEA/CFD and digital twins.'},
  {term:'Year 4 · Semester 8',subtitle:'Specialization & capstone',courses:['EV601','HVAC501','FLP501','PRO701'],focus:'Choose applications, complete professional practice and deliver the capstone.'}
];

const campusAssessments = [
  {id:'A01',course:'MTH101',type:'Exam',title:'Engineering Mathematics checkpoint',weight:20,status:'Planned'},
  {id:'A02',course:'MDE501',type:'Design Review',title:'Machine component design review',weight:15,status:'Planned'},
  {id:'A03',course:'INS403',type:'Lab',title:'Sensor + DAQ characterization report',weight:20,status:'Planned'},
  {id:'A04',course:'CTL402',type:'Exam',title:'Control systems analysis exam',weight:25,status:'Planned'},
  {id:'A05',course:'ROB601',type:'Project',title:'ROS 2 robotics integration demo',weight:30,status:'Planned'},
  {id:'A06',course:'SYS601',type:'Milestone',title:'Systems requirements + architecture review',weight:20,status:'Planned'},
  {id:'A07',course:'SIM601',type:'Technical Report',title:'Validated FEA/CFD case study',weight:20,status:'Planned'},
  {id:'A08',course:'PRO701',type:'Professional',title:'Engineering decision memo + project charter',weight:15,status:'Planned'}
];

const weeklySchedule = [
  ['Monday','09:00','Engineering Mathematics','Concepts + worked problems'],
  ['Monday','18:30','Mechanical / Electrical Core','Lecture + notes'],
  ['Tuesday','10:00','Primary Engineering Course','Deep work block'],
  ['Wednesday','18:30','Lab / Simulation','Produce one tangible output'],
  ['Thursday','10:00','Problem Session','Calculations + deliberate practice'],
  ['Friday','17:30','Design Studio','CAD / MATLAB / control / robotics'],
  ['Saturday','11:00','Review + Assessment','Weekly consolidation'],
  ['Sunday','Rest / catch-up','Planning','Light review only']
];

function courseById(id){ return curriculum.find(c=>c.id===id); }
function gradeFor(id){ return localStorage.getItem(`grade-${id}`)||''; }
function saveGrade(id,value){ localStorage.setItem(`grade-${id}`,value); }
function gradePoint(letter){ return ({'A+':4,'A':4,'A-':3.7,'B+':3.3,'B':3,'B-':2.7,'C+':2.3,'C':2,'C-':1.7,'D':1,'F':0}[letter] ?? null); }
function estimatedGPA(){
  const graded=curriculum.map(c=>gradeFor(c.id)).filter(Boolean).map(gradePoint).filter(v=>v!==null);
  return graded.length ? (graded.reduce((a,b)=>a+b,0)/graded.length).toFixed(2) : '—';
}
function taskState(key){ return localStorage.getItem(`task-${key}`)==='1'; }
function setTaskState(key,value){ localStorage.setItem(`task-${key}`,value?'1':'0'); }
function semesterProgress(courses){
  const vals=courses.map(courseById).filter(Boolean).map(c=>c.progress);
  return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : 0;
}
function appStat(label,value,meta){return `<div class="stat-mini"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(meta)}</small></div>`}

function pageTitle(){return ({dashboard:'Campus Home',courses:'My Courses',curriculum:'Curriculum Map',schedule:'Weekly Schedule',labs:'Labs & Projects',library:'Engineering Library',assessments:'Assessments',progress:'Academic Record',profile:'Student Profile'})[state.page]||'Campus Home'}

function navItem(id,label,ico){return `<button class="nav-btn ${state.page===id?'active':''}" data-nav="${id}"><span>${icon(ico)}</span><span class="nav-label">${label}</span></button>`}
function layout(content){return `<div class="campus"><aside class="sidebar"><div class="brand"><div class="brand-mark">E</div><div class="brand-text"><strong>ENGINEERING</strong><div class="tiny muted">ONLINE CAMPUS</div></div></div><nav class="nav" aria-label="Primary navigation">${navItem('dashboard','Campus Home','home')}${navItem('courses','My Courses','courses')}${navItem('curriculum','Curriculum','map')}${navItem('schedule','Schedule','calendar')}${navItem('labs','Labs & Projects','lab')}${navItem('library','Engineering Library','library')}${navItem('assessments','Assessments','check')}${navItem('progress','Academic Record','progress')}${navItem('profile','Student Profile','profile')}</nav><div class="sidebar-footer"><div class="tiny muted">Academic standing</div><strong>${avgProgress()}% roadmap · GPA ${estimatedGPA()}</strong><div class="progress" style="margin-top:10px"><span style="width:${avgProgress()}%"></span></div><div class="tiny muted" style="margin-top:7px">Year 1 → Year 4 → Capstone</div></div><button class="nav-btn" id="logout-btn"><span>${icon('logout')}</span><span class="nav-label">Sign out</span></button></aside><main class="main"><header class="topbar"><div class="topbar-left"><button class="ghost mobile-menu" id="quick-dashboard">☰</button><div><div class="eyebrow">STUDENT PORTAL</div><div class="page-title">${pageTitle()}</div><div class="sub">Welcome back, ${esc(state.user.name)}.</div></div></div><div class="topbar-left"><div><strong>${esc(state.user.student)}</strong><div class="tiny muted">Student ID · private campus</div></div><div class="avatar">${esc(initials(state.user.name))}</div></div></header>${content}</main></div>`}

function dashboard(){
  const current=semesterCatalog[1];
  const next=semesterCatalog[2];
  const active=curriculum.filter(c=>c.progress>0&&c.progress<100).slice(0,4);
  const recent=campusAssessments.slice(0,4);
  return `<section class="grid campus-home" style="gap:20px">
    <div class="anime-banner hero-art"><div class="banner-stars"></div><div class="orb"></div><div class="mountain"></div><div class="banner-copy"><div class="eyebrow">PERSONAL ENGINEERING UNIVERSITY</div><h2>Welcome to your campus, ${esc(state.user.name.split(' ')[0])}.</h2><p>One integrated engineering education: foundation → design → measurement → control → systems → robotics → specialization → capstone.</p><div class="hero-actions"><button class="primary" data-nav="curriculum">Explore curriculum ${icon('arrow')}</button><button class="ghost" data-nav="schedule">Open schedule</button></div></div><div class="banner-badge">EXPEDITION<br><strong>01</strong></div></div>
    <div class="grid grid-4 stat-grid">
      ${appStat('Roadmap',`${avgProgress()}%`,'overall capability progress')}
      ${appStat('Current term',current.term.split(' · ')[1],'semester plan')}
      ${appStat('GPA',estimatedGPA(),'local academic record')}
      ${appStat('Assessments',String(recent.length),'upcoming in portal')}
    </div>
    <div class="grid grid-2">
      <div class="card"><div class="section-head"><div><div class="eyebrow">CURRENT SEMESTER</div><h2>${esc(current.term)}</h2><div class="sub">${esc(current.subtitle)}</div></div><button class="ghost" data-nav="curriculum">Plan</button></div><p class="muted">${esc(current.focus)}</p><div class="semester-course-list">${current.courses.map(id=>{const c=courseById(id);return c?miniCourse(c):''}).join('')}</div></div>
      <div class="card"><div class="section-head"><div><div class="eyebrow">UP NEXT</div><h2>${esc(next.term)}</h2><div class="sub">${esc(next.subtitle)}</div></div></div><p class="muted">${esc(next.focus)}</p><div class="next-semester">${next.courses.map(id=>{const c=courseById(id);return c?`<div class="next-row"><span class="pill">${esc(c.role)}</span><strong>${esc(c.title)}</strong><span class="tiny muted">${c.hours}h</span></div>`:''}).join('')}</div></div>
    </div>
    <div class="grid grid-2">
      <div class="card"><div class="section-head"><div><div class="eyebrow">CONTINUE</div><h2>Active learning</h2></div><button class="ghost" data-nav="courses">All courses</button></div><div class="grid">${active.map(c=>courseCard(c,true)).join('')}</div></div>
      <div class="card"><div class="section-head"><div><div class="eyebrow">ACADEMIC LIFE</div><h2>Upcoming assessments</h2></div><button class="ghost" data-nav="assessments">View all</button></div><div class="assessment-list">${recent.map(a=>assessmentRow(a)).join('')}</div></div>
    </div>
    <div class="card campus-quote"><div class="quote-mark">✦</div><div><div class="eyebrow">CAMPUS PRINCIPLE</div><h2>Don't collect courses. Build engineering capability.</h2><p class="muted">Every advanced course should end in a calculation, simulation, experiment, design decision, code artifact or verified project output.</p></div></div>
  </section>`;
}
function miniCourse(c){return `<button class="mini-course" data-course="${esc(c.id)}"><div class="mini-course-code">${esc(c.id)}</div><div class="mini-course-main"><strong>${esc(c.title)}</strong><span>${esc(c.role)} · ${c.hours}h</span></div><div class="mini-progress"><span style="width:${c.progress}%"></span></div><span class="tiny muted">${c.progress}%</span></button>`}
function assessmentRow(a){const c=courseById(a.course);return `<button class="assessment-row" data-assessment="${esc(a.id)}"><div><span class="pill">${esc(a.type)}</span></div><div><strong>${esc(a.title)}</strong><small>${c?esc(c.title):esc(a.course)} · ${a.weight}%</small></div><span class="tiny muted">${taskState(a.id)?'Done':'Planned'}</span></button>`}

function courses(){
  const schools=['All',...new Set(curriculum.map(c=>c.school))],roles=['All','Core','Intensive','Elective'];
  const filtered=curriculum.filter(c=>(state.school==='All'||c.school===state.school)&&(state.role==='All'||c.role===state.role)&&(`${c.title} ${c.desc} ${c.school} ${c.id}`.toLowerCase().includes(state.query.toLowerCase())));
  return `<section><div class="card"><div class="filterbar"><div class="search-wrap">${icon('search')}<input id="course-search" value="${esc(state.query)}" placeholder="Search courses, topics, systems…"/></div><select id="school-filter">${schools.map(s=>`<option ${s===state.school?'selected':''}>${esc(s)}</option>`).join('')}</select><select id="role-filter">${roles.map(r=>`<option ${r===state.role?'selected':''}>${esc(r)}</option>`).join('')}</select><span class="result-count">${filtered.length} courses</span></div><div class="catalog-note"><span class="eyebrow">CATALOG PRINCIPLE</span><span>Core = prerequisite breadth · Intensive = depth · Elective = specialization</span></div><div class="grid grid-2" id="course-list">${filtered.map(c=>courseCard(c)).join('')||'<div class="empty span-2">No courses match this filter.</div>'}</div></div></section>`;
}

function curriculumPage(){return `<section class="grid" style="gap:18px"><div class="card curriculum-intro"><div class="eyebrow">DEGREE ARCHITECTURE</div><h2>Eight semesters. One engineering identity.</h2><p class="muted">The campus uses a university-style progression while remaining personal and self-paced. Each semester has a focus, prerequisite logic and applied outputs.</p><div class="principles"><span>Math + Science</span><span>Mechanical</span><span>Electrical</span><span>Control + DAQ</span><span>Systems</span><span>Robotics</span><span>Specialization</span><span>Capstone</span></div></div><div class="semester-stack">${semesterCatalog.map((s,i)=>{const p=semesterProgress(s.courses);return `<article class="semester-card"><div class="semester-index">${String(i+1).padStart(2,'0')}</div><div class="semester-main"><div class="eyebrow">${esc(s.term)}</div><h2>${esc(s.subtitle)}</h2><p class="muted">${esc(s.focus)}</p><div class="semester-progress"><span style="width:${p}%"></span></div><div class="tiny muted">${p}% average progress · ${s.courses.length} mapped courses</div></div><div class="semester-courses">${s.courses.map(id=>{const c=courseById(id);return c?`<button class="semester-course" data-course="${esc(id)}"><span>${esc(c.id)}</span><strong>${esc(c.title)}</strong><small>${esc(c.role)} · ${c.hours}h</small></button>`:''}).join('')}</div></article>`}).join('')}</div><div class="grid grid-3"><div class="card"><h3>Core</h3><p class="muted">Non-negotiable mathematical, physical and engineering foundation.</p></div><div class="card"><h3>Intensive</h3><p class="muted">Deep calculation, software, lab and design work.</p></div><div class="card"><h3>Elective / Lab</h3><p class="muted">Specialization and practice after the common engineering spine.</p></div></div></section>`}

function schedulePage(){return `<section class="grid grid-2"><div class="card"><div class="section-head"><div><div class="eyebrow">WEEKLY RHYTHM</div><h2>Your study timetable</h2></div><span class="pill good">Self-paced</span></div><div class="schedule-list">${weeklySchedule.map((r,i)=>`<div class="schedule-row"><div class="day-chip">${esc(r[0])}</div><div class="schedule-time">${esc(r[1])}</div><div><strong>${esc(r[2])}</strong><small>${esc(r[3])}</small></div><button class="ghost schedule-done" data-slot="${i}">${taskState(`slot-${i}`)?'✓ Done':'Mark done'}</button></div>`).join('')}</div></div><div class="card"><div class="eyebrow">WEEKLY CHECKPOINT</div><h2>Study loop</h2><div class="loop"><div>01 <strong>Learn</strong><span>Read / watch / derive</span></div><div>02 <strong>Practice</strong><span>Problems before solutions</span></div><div>03 <strong>Build</strong><span>CAD / code / simulation</span></div><div>04 <strong>Measure</strong><span>Collect evidence</span></div><div>05 <strong>Verify</strong><span>Compare against a requirement</span></div><div>06 <strong>Reflect</strong><span>Update notes and next actions</span></div></div></div></section>`}

function labsPage(){return `<section class="grid grid-2">${projects.map((p,i)=>`<article class="card project-card"><div class="course-head"><div><div class="eyebrow">PROJECT ${String(i+1).padStart(2,'0')}</div><h2>${esc(p.title)}</h2></div><span class="pill">${esc(p.status)}</span></div><div class="course-meta"><span class="pill">${esc(p.type)}</span><span class="pill">${esc(p.course)}</span></div><p>${esc(p.desc)}</p><div class="project-progress"><div class="tiny muted">Milestones</div>${p.milestones.map((m,j)=>{const key=`project-${p.id}-${j}`;return `<label class="check"><input type="checkbox" data-project="${key}" ${taskState(key)?'checked':''}/><span>${esc(m)}</span></label>`}).join('')}</div><button class="ghost project-open" data-project-course="${esc(p.course)}">Open linked course ${icon('arrow')}</button></article>`).join('')}<div class="card span-2 capstone-card"><div class="eyebrow">CAPSTONE PHILOSOPHY</div><h2>Design → Build → Measure → Verify → Document → Defend</h2><p class="muted">Your final project should integrate requirements, theory, computation, prototype or high-fidelity simulation, testing, technical writing and a defendable engineering decision.</p></div></section>`}

function assessmentsPage(){return `<section class="grid grid-2"><div class="card"><div class="section-head"><div><div class="eyebrow">ASSESSMENT HUB</div><h2>Upcoming work</h2></div><span class="pill">${campusAssessments.length} items</span></div><div class="assessment-list">${campusAssessments.map(a=>assessmentRow(a)).join('')}</div></div><div class="card"><div class="eyebrow">ASSESSMENT PHILOSOPHY</div><h2>Evidence over attendance.</h2><p class="muted">The campus assessment model mixes examinations with labs, design reviews, technical reports, project milestones and a thesis-style capstone.</p><div class="assessment-rules"><div><strong>Knowledge</strong><span>Exams + problem sets</span></div><div><strong>Engineering</strong><span>Design reviews + calculations</span></div><div><strong>Practice</strong><span>Labs + simulation + measurement</span></div><div><strong>Integration</strong><span>Projects + capstone</span></div></div></div></section>`}

function progressPage(){const avg=avgProgress(),active=curriculum.filter(c=>c.progress>0&&c.progress<100).length,done=curriculum.filter(c=>c.progress>=100).length;return `<section class="grid grid-2"><div class="card progress-hero"><div class="eyebrow">ACADEMIC RECORD</div><h2>${avg}% roadmap complete</h2><p class="muted">A local transcript-style view. Enter a grade for any completed course to estimate your GPA.</p><div class="progress big"><span style="width:${avg}%"></span></div><div class="grid grid-3 stats"><div><span class="label">Active</span><strong>${active}</strong></div><div><span class="label">Complete</span><strong>${done}</strong></div><div><span class="label">GPA</span><strong>${estimatedGPA()}</strong></div></div></div><div class="card"><div class="eyebrow">DEGREE CHECKPOINTS</div><h2>Graduation standard</h2><div class="checklist">${['Complete engineering foundation','Reach mechanical + electrical design depth','Complete control + instrumentation','Build embedded/mechatronic systems','Complete robotics / systems integration','Finish advanced specialization','Deliver capstone + technical portfolio'].map((x,i)=>`<label class="check"><input type="checkbox" data-degree="${i}" ${taskState(`degree-${i}`)?'checked':''}/><span>${esc(x)}</span></label>`).join('')}</div></div><div class="card span-2"><div class="section-head"><div><div class="eyebrow">TRANSCRIPT</div><h2>Course performance</h2></div></div><div class="table"><div class="table-row head"><span>Course</span><span>Type</span><span>Grade / progress</span></div>${curriculum.map(c=>`<div class="table-row transcript-row"><span><strong>${esc(c.id)}</strong> · ${esc(c.title)}</span><span>${esc(c.role)}</span><span><select class="grade-select" data-grade="${esc(c.id)}"><option value="">—</option>${['A+','A','A-','B+','B','B-','C+','C','C-','D','F'].map(g=>`<option value="${g}" ${gradeFor(c.id)===g?'selected':''}>${g}</option>`).join('')}</select> <em>${c.progress}%</em></span></div>`).join('')}</div></div></section>`}

function profilePage(){return `<section class="grid grid-2"><div class="card"><div class="eyebrow">STUDENT IDENTITY</div><div class="profile-head"><div class="avatar large">${esc(initials(state.user.name))}</div><div><h2>${esc(state.user.name)}</h2><p class="muted">Student number: <strong>${esc(state.user.student)}</strong></p></div></div><div class="grid grid-2 profile-stats"><div class="card inset"><div class="tiny muted">Campus</div><strong>Engineering Online Campus</strong></div><div class="card inset"><div class="tiny muted">Program</div><strong>Multidisciplinary Engineering</strong></div></div></div><div class="card"><div class="eyebrow">PRIVATE MODE</div><h2>Local-first personal university</h2><p class="muted">Your profile, progress, notes, grades and project milestones stay on this browser. There is no server, subscription, paid API or external authentication service.</p><button class="ghost danger" id="reset-profile">Reset local profile</button></div><div class="card span-2"><div class="eyebrow">PERSONALIZATION</div><h2>Your campus identity</h2><p class="muted">The visual language is intentionally masculine, polished and engineering-focused, with original adventure-game-inspired graphics instead of low-quality stock or third-party game artwork.</p></div></section>`}

function courseModal(c){const notes=localStorage.getItem(`notes-${c.id}`)||'';return `<div class="modal-backdrop" id="modal-backdrop"><div class="modal course-modal"><button class="modal-close" id="modal-close">${icon('close')}</button><div class="eyebrow">${esc(c.school)} · ${esc(c.role)} · ${esc(c.id)}</div><h2>${esc(c.title)}</h2><div class="course-meta"><span class="pill">${esc(c.stage)}</span><span class="pill">${c.hours}h target</span><span class="pill">${c.progress}% complete</span><span class="pill">Grade: ${esc(gradeFor(c.id)||'—')}</span></div><p class="modal-lead">${esc(c.desc)}</p><div class="workspace-grid"><section><div class="workspace-block"><h3>Prerequisite</h3><p class="muted">${esc(c.prereq)}</p></div><div class="workspace-block"><h3>Learning outcomes</h3><div class="checklist compact-list">${c.outcomes.map(x=>`<div class="check"><span>${icon('check')}</span><span>${esc(x)}</span></div>`).join('')}</div></div><div class="workspace-block"><h3>Practical output</h3><div class="lab-callout">${esc(c.lab)}</div></div></section><section><div class="workspace-block"><h3>Course resources</h3><div class="resource-list">${c.resources.map(x=>`<button class="resource" data-resource="${esc(x)}"><span>${icon('book')}</span><span>${esc(x)}</span><span>${icon('arrow')}</span></button>`).join('')}</div></div><div class="workspace-block"><h3>Assessment</h3><p class="muted">Use the Assessments hub for exams, labs and project milestones. Course work should produce evidence, not just completion.</p><button class="ghost" id="open-assessments">Open assessment hub ${icon('arrow')}</button></div></section></div><div class="course-actions"><button class="ghost" id="minus-progress">− 5%</button><button class="primary" id="plus-progress">Mark +5% ${icon('arrow')}</button><button class="ghost" id="complete-course">Mark complete ${icon('check')}</button></div><div class="notes"><label for="course-notes">Private course notes</label><textarea id="course-notes" placeholder="What did you understand? What remains unclear? What will you build?"></textarea><button class="ghost" id="save-notes">Save notes</button></div></div></div>`}

function openCourse(id){const c=courseById(id);if(!c)return;state.selectedCourse=c;state.modal=true;renderModal()}
function renderModal(){const root=ensureModalRoot();root.innerHTML=state.modal?courseModal(state.selectedCourse):'';if(!state.modal)return;const c=state.selectedCourse;const notes=document.getElementById('course-notes');if(notes)notes.value=localStorage.getItem(`notes-${c.id}`)||'';document.getElementById('modal-close')?.addEventListener('click',()=>{state.modal=false;renderModal()});document.getElementById('modal-backdrop')?.addEventListener('click',e=>{if(e.target.id==='modal-backdrop'){state.modal=false;renderModal()}});document.getElementById('plus-progress')?.addEventListener('click',()=>changeProgress(5));document.getElementById('minus-progress')?.addEventListener('click',()=>changeProgress(-5));document.getElementById('complete-course')?.addEventListener('click',()=>changeProgress(100-c.progress));document.getElementById('save-notes')?.addEventListener('click',()=>{localStorage.setItem(`notes-${c.id}`,notes.value);toast('Private notes saved')});document.getElementById('open-assessments')?.addEventListener('click',()=>{state.modal=false;state.page='assessments';render()});document.querySelectorAll('[data-resource]').forEach(b=>b.addEventListener('click',()=>toast(`Resource queued: ${b.dataset.resource}`)))}
function changeProgress(delta){const c=courseById(state.selectedCourse.id);c.progress=Math.min(100,Math.max(0,c.progress+delta));state.selectedCourse=c;localStorage.setItem(`progress-${c.id}`,String(c.progress));toast(c.progress===100?'Course completed 🎓':`Progress saved: ${c.progress}%`);render();openCourse(c.id)}
function hydrateProgress(){curriculum.forEach(c=>{const saved=localStorage.getItem(`progress-${c.id}`);if(saved!==null)c.progress=Math.min(100,Math.max(0,Number(saved)||0))})}
function ensureModalRoot(){let root=document.getElementById('modal-root');if(!root){root=document.createElement('div');root.id='modal-root';document.body.appendChild(root)}return root}

function bindCampus(){
  document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',()=>{state.page=el.dataset.nav;render()}));
  document.getElementById('logout-btn')?.addEventListener('click',logout);
  document.getElementById('quick-dashboard')?.addEventListener('click',()=>{state.page='dashboard';render()});
  document.querySelectorAll('.course-open,.mini-course,.semester-course').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();openCourse(b.dataset.id||b.dataset.course)}));
  document.querySelectorAll('[data-course]').forEach(card=>card.addEventListener('click',e=>{if(e.target.closest('button'))return;openCourse(card.dataset.course)}));
  document.getElementById('course-search')?.addEventListener('input',e=>{state.query=e.target.value;render();requestAnimationFrame(()=>{const el=document.getElementById('course-search');el?.focus();if(el)el.setSelectionRange(el.value.length,el.value.length)})});
  document.getElementById('school-filter')?.addEventListener('change',e=>{state.school=e.target.value;render()});
  document.getElementById('role-filter')?.addEventListener('change',e=>{state.role=e.target.value;render()});
  document.querySelectorAll('[data-project]').forEach(c=>c.addEventListener('change',e=>{setTaskState(c.dataset.project,e.target.checked);toast(e.target.checked?'Milestone saved':'Milestone reopened')}));
  document.querySelectorAll('.project-open').forEach(b=>b.addEventListener('click',()=>openCourse(b.dataset.projectCourse)));
  document.querySelectorAll('.schedule-done').forEach(b=>b.addEventListener('click',()=>{const key=`slot-${b.dataset.slot}`;setTaskState(key,!taskState(key));render();}));
  document.querySelectorAll('[data-assessment]').forEach(b=>b.addEventListener('click',()=>{const a=campusAssessments.find(x=>x.id===b.dataset.assessment);if(a){setTaskState(a.id,!taskState(a.id));toast(taskState(a.id)?'Assessment marked done':'Assessment reopened');render()}}));
  document.querySelectorAll('[data-grade]').forEach(s=>s.addEventListener('change',e=>{saveGrade(s.dataset.grade,e.target.value);toast(e.target.value?`Grade ${e.target.value} saved`:'Grade cleared');render()}));
  document.querySelectorAll('[data-degree]').forEach(c=>c.addEventListener('change',e=>{setTaskState(`degree-${c.dataset.degree}`,e.target.checked);toast(e.target.checked?'Checkpoint completed':'Checkpoint reopened')}));
  document.querySelectorAll('[data-library]').forEach(b=>b.addEventListener('click',()=>toast(`${b.dataset.library} — reference workspace queued.`)));
  document.getElementById('reset-profile')?.addEventListener('click',()=>{if(confirm('Reset the local campus profile on this browser?')){localStorage.clear();state.user=null;state.setup=true;state.page='dashboard';render()}});
}

function render(){
  if(!state.user){app.innerHTML=loginView();ensureModalRoot();bindLogin();return}
  hydrateProgress();
  let content=dashboard();
  if(state.page==='courses')content=courses();
  if(state.page==='curriculum')content=curriculumPage();
  if(state.page==='schedule')content=schedulePage();
  if(state.page==='labs')content=labsPage();
  if(state.page==='library')content=libraryPage();
  if(state.page==='assessments')content=assessmentsPage();
  if(state.page==='progress')content=progressPage();
  if(state.page==='profile')content=profilePage();
  app.innerHTML=layout(content);ensureModalRoot();bindCampus();if(state.modal)renderModal();
}

// Re-run using the expanded campus layer.
hydrateProgress();
render();
