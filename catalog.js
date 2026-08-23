// Full Engineering Catalog layer: current 67-course library + 204 elective/specialization catalog.
(function(){
  const core = Array.isArray(window.COURSE_LIBRARY) ? window.COURSE_LIBRARY : [];
  const electives = Array.isArray(window.ELECTIVE_CATALOG) ? window.ELECTIVE_CATALOG : [];
  const all = [...core, ...electives];
  const esc = v => String(v ?? '').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[c]));
  const key = id => `catalog-progress-${id}`;
  const getProgress = c => { const x=localStorage.getItem(key(c.courseId)); return x===null ? (Number(c.progress)||0) : Number(x); };
  const setProgress = (id,v) => localStorage.setItem(key(id),String(Math.max(0,Math.min(100,v))));
  const sourceLabel = c => c.platform === 'Elective' ? 'University Elective' : (c.platform || 'Course Library');
  const catalog = all.map(c=>({...c, progress:getProgress(c)}));
  let state={query:'',track:'All',type:'All',open:null};
  const unique=(arr)=>['All',...Array.from(new Set(arr)).filter(Boolean).sort()];
  function css(){
    if(document.getElementById('catalog-css')) return;
    const s=document.createElement('style');s.id='catalog-css';s.textContent=`
      .catalog-launch{margin-top:6px!important;color:#f0d99c!important;border:1px solid rgba(225,190,112,.28)!important}
      .catalog-backdrop{position:fixed;inset:0;z-index:200;background:rgba(2,7,12,.88);backdrop-filter:blur(15px);padding:22px;overflow:auto}
      .catalog-shell{max-width:1450px;margin:0 auto;background:linear-gradient(180deg,#122235,#08131f);border:1px solid rgba(196,220,240,.15);border-radius:24px;box-shadow:0 35px 130px rgba(0,0,0,.6);min-height:calc(100vh - 44px);overflow:hidden}
      .catalog-head{padding:28px 30px;border-bottom:1px solid rgba(196,220,240,.12);display:flex;justify-content:space-between;gap:20px;align-items:flex-start;position:sticky;top:0;z-index:2;background:rgba(9,19,30,.94);backdrop-filter:blur(20px)}
      .catalog-title{font-size:clamp(2rem,4vw,3.4rem);letter-spacing:-.04em;margin:.2rem 0 .5rem;font-weight:900}
      .catalog-sub{color:#9fb1c3;max-width:850px;line-height:1.6}
      .catalog-close{width:42px;height:42px;border-radius:50%;border:1px solid rgba(196,220,240,.15);background:rgba(255,255,255,.03);color:#eff5fb;font-size:1.4rem}
      .catalog-tools{padding:18px 30px;display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:10px;border-bottom:1px solid rgba(196,220,240,.10)}
      .catalog-tools input,.catalog-tools select{width:100%;background:#06111c;color:#eff5fb;border:1px solid rgba(196,220,240,.14);padding:12px 13px;border-radius:12px}
      .catalog-stat{padding:16px 30px;display:flex;gap:10px;flex-wrap:wrap;color:#9fb1c3;font-size:.82rem}
      .catalog-grid{padding:0 30px 35px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}
      .catalog-card{border:1px solid rgba(196,220,240,.12);border-radius:16px;background:linear-gradient(155deg,rgba(18,34,52,.88),rgba(7,16,27,.88));padding:17px;display:flex;flex-direction:column;gap:10px;min-height:195px;transition:.18s ease}.catalog-card:hover{transform:translateY(-2px);border-color:rgba(99,216,255,.3)}
      .catalog-card h3{font-size:1.05rem;margin:0}.catalog-meta{display:flex;gap:6px;flex-wrap:wrap}.catalog-pill{display:inline-flex;padding:5px 8px;border-radius:999px;border:1px solid rgba(196,220,240,.13);color:#c6d4e2;font-size:.68rem}
      .catalog-source{color:#879bae;font-size:.73rem}.catalog-progress{height:7px;background:#06101a;border-radius:999px;overflow:hidden}.catalog-progress span{display:block;height:100%;background:linear-gradient(90deg,#63d8ff,#8f9bff)}
      .catalog-actions{display:flex;gap:8px;justify-content:space-between;margin-top:auto}.catalog-btn{border:1px solid rgba(196,220,240,.14);background:rgba(255,255,255,.025);color:#eff5fb;border-radius:10px;padding:8px 10px;font-size:.78rem}.catalog-btn.primary{background:linear-gradient(135deg,#63d8ff,#8f9bff);color:#07111b;border:0;font-weight:850}.catalog-empty{grid-column:1/-1;padding:45px;text-align:center;color:#9fb1c3;border:1px dashed rgba(196,220,240,.15);border-radius:16px}
      .catalog-detail{position:fixed;inset:0;z-index:220;background:rgba(2,7,12,.72);display:grid;place-items:center;padding:20px}.catalog-detail-card{width:min(900px,100%);max-height:90vh;overflow:auto;background:linear-gradient(180deg,#122235,#08131f);border:1px solid rgba(196,220,240,.15);border-radius:22px;padding:28px;box-shadow:0 30px 120px rgba(0,0,0,.6)}
      .catalog-detail-card h2{font-size:2.3rem;margin:10px 40px 12px 0}.catalog-detail-card p{color:#b4c3d1;line-height:1.7}.catalog-detail-close{float:right}.catalog-link{display:inline-block;color:#63d8ff;text-decoration:underline;margin-top:10px}.catalog-note{margin-top:20px;border:1px solid rgba(225,190,112,.2);background:rgba(225,190,112,.07);padding:14px;border-radius:12px;color:#ead9aa}
      @media(max-width:1000px){.catalog-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.catalog-tools{grid-template-columns:1fr 1fr}}
      @media(max-width:680px){.catalog-backdrop{padding:8px}.catalog-shell{min-height:calc(100vh - 16px);border-radius:17px}.catalog-head{padding:20px}.catalog-tools{padding:14px 20px;grid-template-columns:1fr}.catalog-stat{padding:14px 20px}.catalog-grid{padding:0 20px 25px;grid-template-columns:1fr}.catalog-title{font-size:2rem}}
    `;document.head.appendChild(s);
  }
  function launchButton(){
    const nav=document.querySelector('.sidebar .nav'); if(!nav || nav.querySelector('[data-full-catalog]')) return;
    const b=document.createElement('button'); b.className='nav-btn catalog-launch'; b.dataset.fullCatalog='1'; b.innerHTML='<span>✦</span><span class="nav-label">Full Catalog</span>'; b.addEventListener('click',openCatalog); nav.appendChild(b);
  }
  function filtered(){ return catalog.filter(c=>(state.track==='All'||c.track===state.track)&&(state.type==='All'||c.role===state.type)&&(`${c.courseId} ${c.title} ${c.track} ${c.provider} ${sourceLabel(c)}`.toLowerCase().includes(state.query.toLowerCase()))); }
  function render(){
    const list=filtered();
    const total=all.length, completed=catalog.filter(c=>c.progress>=100).length, active=catalog.filter(c=>c.progress>0&&c.progress<100).length;
    const tracks=unique(catalog.map(c=>c.track)); const types=unique(catalog.map(c=>c.role));
    return `<div class="catalog-backdrop" id="catalog-backdrop"><div class="catalog-shell"><header class="catalog-head"><div><div class="eyebrow">ENGINEERING ONLINE CAMPUS · MASTER CATALOG</div><div class="catalog-title">${total} learning options.</div><div class="catalog-sub">Your university does not stop at the required spine. This catalog contains the current Engineering Mastery library plus a large elective/specialization bank. Core subjects stay in the main degree path; electives let you deepen into the areas you actually want.</div></div><button class="catalog-close" id="catalog-close">×</button></header><div class="catalog-tools"><input id="catalog-search" value="${esc(state.query)}" placeholder="Search 200+ courses, fields, topics…"/><select id="catalog-track">${tracks.map(x=>`<option ${x===state.track?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="catalog-type">${types.map(x=>`<option ${x===state.type?'selected':''}>${esc(x)}</option>`).join('')}</select></div><div class="catalog-stat"><span>Showing <strong>${list.length}</strong></span><span>·</span><span>Core library <strong>${core.length}</strong></span><span>·</span><span>Elective bank <strong>${electives.length}</strong></span><span>·</span><span>Active <strong>${active}</strong></span><span>·</span><span>Complete <strong>${completed}</strong></span></div><div class="catalog-grid">${list.map(card).join('')||'<div class="catalog-empty">No courses match those filters.</div>'}</div></div></div>`;
  }
  function card(c){const p=getProgress(c);return `<article class="catalog-card"><div class="catalog-meta"><span class="catalog-pill">${esc(c.courseId)}</span><span class="catalog-pill">${esc(c.role)}</span><span class="catalog-pill">${esc(c.stage)}</span></div><h3>${esc(c.title)}</h3><div class="catalog-source">${esc(c.track)} · ${esc(sourceLabel(c))}${c.provider?' · '+esc(c.provider):''}</div><div class="catalog-progress"><span style="width:${p}%"></span></div><div class="catalog-source">${p}% complete</div><div class="catalog-actions"><button class="catalog-btn" data-detail="${esc(c.courseId)}">Details</button><button class="catalog-btn primary" data-study="${esc(c.courseId)}">${p>=100?'Review':'Study'}</button></div></article>`;}
  function openCatalog(){css();document.body.insertAdjacentHTML('beforeend',render());bind();}
  function closeCatalog(){document.getElementById('catalog-backdrop')?.remove();document.getElementById('catalog-detail')?.remove();}
  function bind(){
    document.getElementById('catalog-close')?.addEventListener('click',closeCatalog);
    document.getElementById('catalog-backdrop')?.addEventListener('click',e=>{if(e.target.id==='catalog-backdrop')closeCatalog()});
    const search=document.getElementById('catalog-search'); search?.addEventListener('input',e=>{state.query=e.target.value;refresh()});
    document.getElementById('catalog-track')?.addEventListener('change',e=>{state.track=e.target.value;refresh()});
    document.getElementById('catalog-type')?.addEventListener('change',e=>{state.type=e.target.value;refresh()});
    document.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>detail(b.dataset.detail)));
    document.querySelectorAll('[data-study]').forEach(b=>b.addEventListener('click',()=>study(b.dataset.study)));
  }
  function refresh(){const old=document.getElementById('catalog-backdrop'); if(!old)return; old.outerHTML=render(); bind(); const s=document.getElementById('catalog-search'); if(s){s.focus();s.setSelectionRange(s.value.length,s.value.length)}}
  function detail(id){const c=catalog.find(x=>x.courseId===id);if(!c)return;const p=getProgress(c);const note=localStorage.getItem(`catalog-note-${id}`)||'';document.body.insertAdjacentHTML('beforeend',`<div class="catalog-detail" id="catalog-detail"><div class="catalog-detail-card"><button class="catalog-close catalog-detail-close" id="catalog-detail-close">×</button><div class="eyebrow">${esc(c.track)} · ${esc(c.role)}</div><h2>${esc(c.title)}</h2><div class="catalog-meta"><span class="catalog-pill">${esc(c.courseId)}</span><span class="catalog-pill">${esc(c.stage)}</span><span class="catalog-pill">${esc(sourceLabel(c))}</span></div><p><strong>Provider:</strong> ${esc(c.provider||'University-level reference path')}</p><div class="catalog-progress"><span style="width:${p}%"></span></div><p><strong>Progress:</strong> ${p}%</p>${c.url?`<a class="catalog-link" href="${esc(c.url)}" target="_blank" rel="noopener">Open course/resource ↗</a>`:''}<div class="catalog-note">Elective rule: do not add this to the required spine unless it supports your chosen specialization. Treat the catalog as your engineering department library.</div><div style="display:grid;gap:8px;margin-top:18px"><label style="font-weight:800">Private note</label><textarea id="catalog-note" style="min-height:120px;background:#06111c;color:#eff5fb;border:1px solid rgba(196,220,240,.14);border-radius:12px;padding:12px">${esc(note)}</textarea><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="catalog-btn primary" id="catalog-save-note">Save note</button><button class="catalog-btn" id="catalog-plus">+10% progress</button><button class="catalog-btn" id="catalog-complete">Mark complete</button></div></div></div></div>`);document.getElementById('catalog-detail-close').addEventListener('click',()=>document.getElementById('catalog-detail')?.remove());document.getElementById('catalog-save-note').addEventListener('click',()=>{localStorage.setItem(`catalog-note-${id}`,document.getElementById('catalog-note').value);toast('Catalog note saved')});document.getElementById('catalog-plus').addEventListener('click',()=>{setProgress(id,p+10);document.getElementById('catalog-detail')?.remove();refresh()});document.getElementById('catalog-complete').addEventListener('click',()=>{setProgress(id,100);document.getElementById('catalog-detail')?.remove();refresh()});}
  function study(id){const c=catalog.find(x=>x.courseId===id);if(!c)return;if(c.url)window.open(c.url,'_blank','noopener');else detail(id);}
  function toast(msg){const e=document.createElement('div');e.className='toast';e.textContent=msg;document.body.appendChild(e);setTimeout(()=>e.remove(),2200)}
  function attach(){css();const observer=new MutationObserver(()=>launchButton());observer.observe(document.body,{childList:true,subtree:true});launchButton();}
  attach();
})();
