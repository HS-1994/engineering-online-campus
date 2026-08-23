// Source policy for the personal Engineering Online Campus.
// Rule: every catalog item must point to either the user's library or a free,
// full-course academic source. We distinguish verified direct links from catalog finders.
window.SOURCE_POLICY={
  freeProviders:[
    {name:'NPTEL',url:'https://nptel.ac.in/courses',note:'Free self-study course materials from IITs/IISc; certification exam is optional and may cost money.'},
    {name:'MIT OpenCourseWare',url:'https://ocw.mit.edu/search/?q=',note:'Free MIT course materials; no paid enrollment required.'}
  ],
  verified:{
    'MATH-E01':'https://www.nptel.ac.in/courses/111107108',
    'MATH-E02':'https://www.nptel.ac.in/courses',
    'MATH-E03':'https://www.nptel.ac.in/courses',
    'MATH-E05':'https://www.nptel.ac.in/courses/111102160',
    'MATH-E06':'https://www.nptel.ac.in/courses',
    'MATH-E09':'https://www.nptel.ac.in/courses/111102133',
    'MATH-E10':'https://www.nptel.ac.in/courses/111107108',
    'ME-E13':'https://nptel.ac.in/courses',
    'ME-E14':'https://nptel.ac.in/courses/112106294',
    'ME-E16':'https://nptel.ac.in/courses/112107080',
    'ME-E17':'https://nptel.ac.in/courses',
    'ME-E18':'https://nptel.ac.in/courses',
    'ME-E19':'https://nptel.ac.in/courses',
    'ME-E20':'https://nptel.ac.in/courses',
    'ME-E21':'https://nptel.ac.in/courses',
    'ME-E22':'https://nptel.ac.in/courses',
    'ME-E25':'https://nptel.ac.in/courses',
    'ME-E26':'https://nptel.ac.in/courses',
    'ME-E27':'https://nptel.ac.in/courses/101104001',
    'ME-E30':'https://nptel.ac.in/courses',
    'EE-E02':'https://nptel.ac.in/courses',
    'EE-E05':'https://nptel.ac.in/courses',
    'EE-E07':'https://nptel.ac.in/courses',
    'EE-E10':'https://nptel.ac.in/courses',
    'EE-E12':'https://archive.nptel.ac.in/content/syllabus_pdf/108105017.pdf',
    'COMP-E11':'https://nptel.ac.in/courses/106106198',
    'COMP-E12':'https://nptel.ac.in/courses',
    'COMP-E15':'https://nptel.ac.in/courses',
    'ME-E16':'https://nptel.ac.in/courses/112107080'
  }
};
(function(){
  const policy=window.SOURCE_POLICY;
  window.resolveSource=(c)=>{
    if(c.url) return {kind:'library',label:c.platform||'Course library',url:c.url,verified:true,note:'Direct source from the current course library.'};
    const direct=policy.verified[c.courseId];
    if(direct && direct!=='https://nptel.ac.in/courses') return {kind:'free',label:'Verified free source',url:direct,verified:true,note:'Direct academic course/resource page verified during the source audit.'};
    const q=encodeURIComponent(c.title||'');
    return {kind:'finder',label:'Free-source finder',url:`https://www.google.com/search?q=site%3Anptel.ac.in%2Fcourses+%22${q}%22`,verified:false,note:'Search shortcut only; the exact direct course URL still requires title-level verification.'};
  };
})();
