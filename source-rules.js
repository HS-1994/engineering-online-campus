// Source policy for the personal campus.
// No course is allowed to masquerade as "verified" unless the URL is a title-specific
// complete university course or a user's actual course-library item.
window.CAMPUS_SOURCE_RULES = {
  freeCatalog: {
    provider: 'NPTEL / SWAYAM',
    label: 'Free complete university-course catalog',
    url: 'https://www.nptel.ac.in/courses',
    note: 'NPTEL/SWAYAM exposes full university lecture courses free to access; optional certification/exam is separate.'
  },
  mit: {
    provider: 'MIT OpenCourseWare',
    label: 'Free OpenCourseWare',
    url: 'https://ocw.mit.edu/search/',
    note: 'Use when the exact MIT course page provides sufficient lecture/assignment material for the subject.'
  }
};

// Only title-specific links appear here. Generic catalog/search URLs are deliberately excluded.
window.CAMPUS_EXACT_SOURCES = {
  'MATH-E01': 'https://nptel.ac.in/courses/111105160',
  'MATH-E02': 'https://nptel.ac.in/courses/111105134',
  'ME-E08': 'https://www.nptel.ac.in/courses/112105125',
  'EE-E01': 'https://www.nptel.ac.in/courses/108102185',
  'EE-E02': 'https://www.nptel.ac.in/courses/108101037',
  'EE-E10': 'https://www.nptel.ac.in/courses/117105140',
  'CIV-E01': 'https://onlinecourses-archive.nptel.ac.in/noc17_ce25/preview',
  'CIV-E03': 'https://www.nptel.ac.in/courses/105105105',
  'CIV-E11': 'https://www.nptel.ac.in/courses/105101201',
  'CIV-E16': 'https://www.nptel.ac.in/courses/105101201',
  'CIV-E31': 'https://www.nptel.ac.in/courses?query=BIM',
  'CTL-E01': 'https://www.nptel.ac.in/courses/108101037',
  'ROB-E01': 'https://www.nptel.ac.in/courses/107106090',
  'ROB-E09': 'https://www.nptel.ac.in/courses/107107289',
  'MFG-E01': 'https://www.nptel.ac.in/courses?query=manufacturing',
  'MAT-E01': 'https://www.nptel.ac.in/courses?query=materials%20science',
  'SYS-E01': 'https://ocw.mit.edu/search/?q=systems%20engineering',
  'PRO-E01': 'https://www.nptel.ac.in/courses?query=engineering%20economic%20analysis'
};

function campusApplySourceRules(list){
  return (list || []).map(item => {
    const exact = window.CAMPUS_EXACT_SOURCES[item.courseId];
    const hasPersonal = Boolean(item.url || item.URL) && item.platform !== 'Elective';
    const direct = exact && !/[?&](query|q)=/.test(exact);
    const free = window.CAMPUS_SOURCE_RULES.freeCatalog;
    return {
      ...item,
      sourceType: hasPersonal ? 'Personal library / Coursera item' : (direct ? 'Verified title-specific free course' : 'Free course route — title audit pending'),
      sourceProvider: hasPersonal ? (item['Provider / Instructor'] || item.provider || item.platform) : (direct ? 'NPTEL / MIT OpenCourseWare' : free.provider),
      sourceUrl: hasPersonal ? (item.url || item.URL) : (direct ? exact : free.url),
      url: hasPersonal ? (item.url || item.URL) : (direct ? exact : free.url),
      sourceNote: hasPersonal ? 'Direct course/library route from the personal study library.' : (direct ? 'Direct title-specific course page.' : `Course title still needs a title-specific ${free.provider} match.`),
      access: hasPersonal ? 'Your library' : 'Free',
      isSourceMapped: hasPersonal || direct,
      needsSourceAudit: !(hasPersonal || direct)
    };
  });
}

window.ELECTIVE_CATALOG = campusApplySourceRules(window.ELECTIVE_CATALOG || []);
window.COURSE_LIBRARY = (window.COURSE_LIBRARY || []).map(c => ({
  ...c,
  access: c.Platform === 'Udemy - مكتبتك' ? 'Your Udemy library' : c.Platform === 'Coursera' ? 'Your Coursera access' : (c.access || 'Available'),
  sourceType: c.Platform === 'Udemy - مكتبتك' ? 'Personal Udemy library' : c.Platform === 'Coursera' ? 'Personal Coursera library' : (c.sourceType || c.Platform || 'Library'),
  sourceProvider: c['Provider / Instructor'] || c.provider || c.Platform || '',
  sourceUrl: c.url || c.URL || '',
  isSourceMapped: Boolean(c.url || c.URL),
  needsSourceAudit: false
}));
