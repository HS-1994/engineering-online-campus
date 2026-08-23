// Adds source audit and academic metadata to every catalog detail, including electives.
(function(){
  const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[c]));
  const inject=()=>{
    const detail=document.querySelector('.catalog-detail-card'); if(!detail || detail.querySelector('.source-audit')) return;
    const h=detail.querySelector('h2'); if(!h) return;
    const title=h.textContent.trim();
    const item=[...(window.COURSE_LIBRARY||[])].find(c=>String(c.title).trim()===title);
    if(!item) return;
    const audit=document.createElement('div');audit.className='source-audit';
    const verified=Boolean(item.isSourceMapped) && !item.needsSourceAudit;
    const kind=verified ? (item.platform && item.platform!=='Elective' ? 'YOUR LIBRARY' : 'VERIFIED FREE COURSE') : 'SOURCE AUDIT NEEDED';
    const note=item.sourceNote || 'A title-specific complete course has not yet been pinned.';
    audit.innerHTML=`<div class="source-audit-head"><div><div class="eyebrow">SOURCE AUDIT</div><strong>${esc(kind)}</strong></div><span class="source-badge ${verified?'ok':'pending'}">${verified?'READY':'PENDING'}</span></div><div class="source-audit-body"><div><span class="source-label">Provider</span><strong>${esc(item.sourceProvider||item.provider||item.platform||'—')}</strong></div><div><span class="source-label">Access</span><strong>${esc(item.access||'Free / Library')}</strong></div><div class="source-audit-note">${esc(note)}</div>${item.sourceUrl?`<a href="${esc(item.sourceUrl)}" target="_blank" rel="noopener">Open source route ↗</a>`:''}</div>`;
    detail.appendChild(audit);
    addCss();
  };
  const addCss=()=>{if(document.getElementById('source-audit-css'))return;const s=document.createElement('style');s.id='source-audit-css';s.textContent=`.source-audit{margin-top:18px;border:1px solid rgba(99,216,255,.12);background:rgba(99,216,255,.03);border-radius:14px;padding:14px}.source-audit-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.source-audit-head strong{font-size:.85rem}.source-badge{font-size:.62rem;font-weight:900;letter-spacing:.1em;padding:6px 8px;border-radius:999px}.source-badge.ok{background:rgba(72,220,160,.12);color:#6df0b8;border:1px solid rgba(72,220,160,.2)}.source-badge.pending{background:rgba(225,190,112,.1);color:#edd694;border:1px solid rgba(225,190,112,.2)}.source-audit-body{display:grid;gap:9px;margin-top:10px}.source-audit-body>div:not(.source-audit-note){display:flex;justify-content:space-between;gap:10px}.source-label{color:#71879a;text-transform:uppercase;letter-spacing:.08em;font-size:.62rem}.source-audit-note{color:#9fb1c3;font-size:.78rem;line-height:1.5}.source-audit a{color:#63d8ff;font-size:.8rem}`;document.head.appendChild(s)};
  const observer=new MutationObserver(inject);observer.observe(document.body,{childList:true,subtree:true});
  inject();
})();
