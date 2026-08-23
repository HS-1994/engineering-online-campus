// Merge the full personal library + university spine + elective subject bank before the app boots.
// Loaded after course-data/elective/source rules and before final-app.
window.COURSE_LIBRARY = [
  ...(window.COURSE_LIBRARY || []),
  ...((window.ELECTIVE_CATALOG || []).map(x => ({...x, sourceType: x.sourceType || 'Free course catalog route'})))
];
