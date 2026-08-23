// UI companion for the master academic layer.
(function(){
  if(!window.CAMPUS_ACADEMIC) return;
  const A=window.CAMPUS_ACADEMIC;
  const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[c]));
  const key=id=>`academic-progress-${id}`;
  function progress(id){return Number(localStorage.getItem(key(id))||0)}
  function setProgress(id,v){localStorage.setItem(key(id),String(Math.max(0,Math.min(100,v))))}
  function blueprint(id){return A.core[id] || A.civilExpansion.find(x=>x.id===id)}
  function sourceBlock(s){return `<div class="academic-source"><div class="academic-source-head"><strong>${esc(s.provider)}</strong><span>${esc(s.kind)}</span></div><div class="academic-source-title">${esc(s.title)}</div><a href="${esc(s.url)}" target="_blank" rel="noopener">Open full course / source ↗</a></div>`}
  function injectIntoDetail(){
    const detail=document.querySelector('.catalog-detail-card'); if(!detail || detail.querySelector('.academic-panel')) return;
    const heading=detail.querySelector('h2'); if(!heading) return;
    const title=heading.textContent.trim();
    const item=[...(window.COURSE_LIBRARY||[]),...(window.ELECTIVE_CATALOG||[])].find(c=>String(c.title).trim()===title);
    const b=item ? blueprint(item.courseId) : null;
    if(!b) return;
    const p=progress(b.id||item.courseId);
    const credits=b.credits||'Elective';
    const modules=b.modules||[];
    const prereq=b.prereq||[];
    const labs=b.labs||[];
    const outputs=b.outputs||b.output;
    const assess=b.assessment||[];
    const sources=b.sources||[];
    const el=document.createElement('section'); el.className='academic-panel';
    el.innerHTML=`<div class="academic-kicker">UNIVERSITY COURSE SPECIFICATION</div><div class="academic-grid">
      <div><span class="academic-label">Credits</span><strong>${esc(credits)}</strong></div>
      <div><span class="academic-label">Local progress</span><strong>${p}%</strong></div>
      <div><span class="academic-label">Prerequisites</span><strong>${prereq.length?prereq.map(esc).join(' · '):'None'}</strong></div>
      <div><span class="academic-label">Assessment</span><strong>${assess.length?assess.length+' components':'Applied / project based'}</strong></div>
    </div>
    <div class="academic-section"><h3>Modules</h3><ol>${modules.map(m=>`<li>${esc(m)}</li>`).join('')}</ol></div>
    ${labs.length?`<div class="academic-section"><h3>Laboratory / Practice</h3><ul>${labs.map(m=>`<li>${esc(m)}</li>`).join('')}</ul></div>`:''}
    ${assess.length?`<div class="academic-section"><h3>Assessment plan</h3><ul>${assess.map(m=>`<li>${esc(m)}</li>`).join('')}</ul></div>`:''}
    ${outputs?`<div class="academic-output"><strong>Required tangible output</strong><div>${Array.isArray(outputs)?outputs.map(esc).join(' · '):esc(outputs)}</div></div>`:''}
    <div class="academic-section"><h3>Study sources</h3>${sources.map(sourceBlock).join('')||'<div class="academic-muted">Source audit pending.</div>'}</div>
    <div class="academic-progress-actions"><button id="academic-plus10" class="catalog-btn primary">+10% progress</button><button id="academic-complete" class="catalog-btn">Mark complete</button></div>`;
    detail.appendChild(el);
    el.querySelector('#academic-plus10').addEventListener('click',()=>{setProgress(b.id||item.courseId,p+10);el.querySelector('.academic-grid strong:nth-child(2)')?.replaceChildren(document.createTextNode(Math.min(100,p+10)+'%'));if(window.toast)window.toast('Academic progress saved')});
    el.querySelector('#academic-complete').addEventListener('click',()=>{setProgress(b.id||item.courseId,100);window.toast?.('Course marked complete');});
  }
  function css(){if(document.getElementById('academic-ui-css'))return;const s=document.createElement('style');s.id='academic-ui-css';s.textContent=`
  .academic-panel{margin-top:24px;padding-top:22px;border-top:1px solid rgba(196,220,240,.12)}
  .academic-kicker{font-size:.65rem;letter-spacing:.14em;font-weight:900;color:#63d8ff}.academic-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:12px}.academic-grid>div{border:1px solid rgba(196,220,240,.1);background:rgba(255,255,255,.025);border-radius:12px;padding:12px}.academic-label{display:block;text-transform:uppercase;letter-spacing:.08em;font-size:.62rem;color:#71879a;margin-bottom:5px}.academic-grid strong{font-size:.85rem}.academic-section{margin-top:18px}.academic-section h3{margin:0 0 8px}.academic-section ol,.academic-section ul{margin:0;padding-left:19px;color:#b4c3d1;line-height:1.65}.academic-source{border:1px solid rgba(99,216,255,.12);border-radius:12px;padding:11px;margin-top:9px;background:rgba(99,216,255,.03)}.academic-source-head{display:flex;justify-content:space-between;gap:10px}.academic-source-head span{font-size:.62rem;color:#63d8ff;text-transform:uppercase}.academic-source-title{margin:5px 0;color:#dfe9f2}.academic-source a{color:#63d8ff;font-size:.8rem}.academic-output{margin-top:17px;padding:14px;border:1px solid rgba(225,190,112,.2);background:rgba(225,190,112,.06);border-radius:12px;color:#ead9aa}.academic-output div{margin-top:6px;color:#f3ead2}.academic-progress-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:17px}.academic-muted{color:#879bae}.academic-degree-card{margin:16px 0;padding:18px;border:1px solid rgba(99,216,255,.12);background:linear-gradient(135deg,rgba(99,216,255,.04),rgba(143,155,255,.035));border-radius:15px}.academic-degree-card h3{margin:0 0 7px}.academic-sem-row{display:grid;grid-template-columns:70px 1fr auto;gap:12px;padding:10px 0;border-bottom:1px solid rgba(196,220,240,.08);align-items:center}.academic-sem-index{font-weight:900;color:#63d8ff}.academic-sem-courses{color:#b9c7d5;font-size:.8rem}.academic-sem-output{color:#879bae;font-size:.72rem;text-align:right}@media(max-width:850px){.academic-grid{grid-template-columns:1fr 1fr}.academic-sem-row{grid-template-columns:52px 1fr}.academic-sem-output{grid-column:2;text-align:left}}@media(max-width:560px){.academic-grid{grid-template-columns:1fr}.academic-sem-row{grid-template-columns:1fr}.academic-sem-output{grid-column:1}}
  `;document.head.appendChild(s)}
  function addDegreeButton(){
    const nav=document.querySelector('.sidebar .nav'); if(!nav || nav.querySelector('[data-academic-degree]')) return;
    const b=document.createElement('button');b.className='nav-btn';b.dataset.academicDegree='1';b.innerHTML='<span>🎓</span><span class="nav-label">Degree Blueprint</span>';b.addEventListener('click',openDegree);nav.appendChild(b)
  }
  function openDegree(){
    css();
    const rows=A.semesterPlan.map((s,i)=>`<div class="academic-sem-row"><div class="academic-sem-index">${String(i+1).padStart(2,'0')}</div><div><strong>${esc(s.name)}</strong><div class="academic-sem-courses">${[...(s.required||[]),...(s.recommended||[])].join(' · ')}</div></div><div class="academic-sem-output">${esc(s.theme)}<br>${esc(s.outputs.join(' · '))}</div></div>`).join('');
    const panel=document.createElement('div');panel.className='catalog-detail';panel.id='degree-blueprint';panel.innerHTML=`<div class="catalog-detail-card"><button class="catalog-close catalog-detail-close" id="degree-close">×</button><div class="eyebrow">ACADEMIC ARCHITECTURE</div><h2>${esc(A.degree.title)}</h2><p>${esc(A.degree.rule)}</p><div class="academic-degree-card"><h3>Eight-semester spine</h3>${rows}</div><div class="academic-output"><strong>University completion standard</strong><div>Every core course requires academic study + problem solving; each designated lab requires a reproducible artifact; each design-intensive course requires a design review; the final capstone requires verification, validation, technical documentation and defense.</div></div></div>`;document.body.appendChild(panel);document.getElementById('degree-close').addEventListener('click',()=>panel.remove())
  }
  css();
  const obs=new MutationObserver(()=>{addDegreeButton();injectIntoDetail()});obs.observe(document.body,{childList:true,subtree:true});
  addDegreeButton();
})();
