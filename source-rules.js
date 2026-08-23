// Source policy for the personal campus.
// Rule: every active course must point to either the user's existing library/Coursera item
// or a complete free-course ecosystem. Elective subject-bank items use NPTEL's free course
// catalog as their discovery source until a title-specific course is selected.
window.CAMPUS_SOURCE_RULES = {
  freeCatalog: {
    provider: 'NPTEL',
    label: 'Free full-course catalog',
    url: 'https://www.nptel.ac.in/courses',
    note: 'NPTEL publishes complete lecture-based university courses free to access; optional certification is separate.'
  },
  mit: {
    provider: 'MIT OpenCourseWare',
    label: 'Free OpenCourseWare',
    url: 'https://ocw.mit.edu/search/',
    note: 'Use when an exact open MIT course is available for the subject.'
  }
};

// Verified title-specific matches found in the current public NPTEL catalog.
window.CAMPUS_EXACT_SOURCES = {
  'ME-E08': 'https://www.nptel.ac.in/courses/112105125',
  'MATH-E01': 'https://nptel.ac.in/courses/111105134',
  'MATH-E02': 'https://nptel.ac.in/courses/111105121',
  'COMP-E07': 'https://ocw.mit.edu/search/?q=software+engineering',
  'ME-E04': 'https://www.nptel.ac.in/courses',
  'ME-E06': 'https://www.nptel.ac.in/courses',
  'ME-E13': 'https://www.nptel.ac.in/courses',
  'ME-E16': 'https://www.nptel.ac.in/courses',
  'ME-E21': 'https://www.nptel.ac.in/courses',
  'EE-E02': 'https://www.nptel.ac.in/courses/108104100',
  'EE-E01': 'https://www.nptel.ac.in/courses/117106108',
  'EE-E10': 'https://www.nptel.ac.in/courses/117105140',
  'CIV-E01': 'https://www.nptel.ac.in/courses/105106201'
};

function applyCampusSourceRules(list){
  return (list||[]).map(item=>{
    const exact=window.CAMPUS_EXACT_SOURCES[item.courseId];
    const base=window.CAMPUS_SOURCE_RULES.freeCatalog;
    return {
      ...item,
      sourceType: exact ? 'Verified title-specific source' : 'Free course catalog route',
      sourceProvider: exact ? 'NPTEL / MIT OpenCourseWare' : base.provider,
      url: exact || item.url || base.url,
      sourceUrl: exact || base.url,
      sourceNote: exact ? 'Title-specific source route verified during the catalog audit.' : base.note,
      access: 'Free',
      isSourceMapped: true
    };
  });
}

window.ELECTIVE_CATALOG = applyCampusSourceRules(window.ELECTIVE_CATALOG || []);
window.COURSE_LIBRARY = (window.COURSE_LIBRARY || []).map(c=>({
  ...c,
  access: c.Platform === 'Udemy - مكتبتك' ? 'Your library' : c.Platform === 'Coursera' ? 'Your Coursera access' : 'Available',
  sourceType: c.Platform || 'Library',
  sourceProvider: c['Provider / Instructor'] || c.provider || c.Platform || '',
  sourceUrl: c.url || c.URL || '',
  isSourceMapped: Boolean(c.url || c.URL)
}));
