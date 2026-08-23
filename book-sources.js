// Personal engineering book shelf integration.
// The campus intentionally stores BOOK TITLES / subject mappings only; no copyrighted
// book files are copied into GitHub. On the user's laptop, the Book Shelf can be mapped
// to his local SSD folder and opened with a local file:// handler or OS file picker.
window.PERSONAL_BOOK_POLICY={
  label:'Personal SSD Book Library',
  mode:'local-title-index',
  note:'Book titles are study-source metadata. The actual files remain on the student SSD.',
  fields:['title','author','subject','edition','language','localPath','sourceCourseIds','tags']
};

// High-value engineering reference titles to use as course-level source suggestions.
// This is a starter semantic index; the full 12k+ personal-library inventory can be
// imported later without copying copyrighted files into the public repository.
window.ENGINEERING_BOOK_MAP={
  'MTH101':['Advanced Engineering Mathematics — Erwin Kreyszig','Engineering Mathematics — K. A. Stroud'],
  'MEC201':['Engineering Mechanics: Statics — Hibbeler','Engineering Mechanics: Dynamics — Hibbeler'],
  'MAT301':['Mechanics of Materials — Gere & Goodno','Materials Science and Engineering — Callister'],
  'THM401':['Thermodynamics: An Engineering Approach — Çengel & Boles','Fundamentals of Heat and Mass Transfer — Incropera et al.','Fluid Mechanics — Çengel & Cimbala'],
  'MDE501':['Shigley’s Mechanical Engineering Design','Machine Design — Norton'],
  'ELC201':['Engineering Circuit Analysis — Hayt & Kemmerly'],
  'ELC301':['Microelectronic Circuits — Sedra/Smith','Digital Design — Mano & Ciletti'],
  'CTL402':['Modern Control Engineering — Ogata','Feedback Systems — Åström & Murray'],
  'INS403':['Measurement Systems — Doebelin','Instrument Engineers’ Handbook — Lipták'],
  'MCH501':['Mechatronics — Bolton'],
  'EMB501':['Making Embedded Systems — White','Embedded Systems: Introduction to ARM Cortex-M — Valvano'],
  'ROB601':['Robotics: Modelling, Planning and Control — Siciliano et al.','Modern Robotics — Lynch & Park'],
  'MFG501':['Manufacturing Engineering and Technology — Kalpakjian & Schmid','Engineering Metrology — Jain'],
  'SIM601':['Finite Element Analysis — Cook et al.','Computational Fluid Dynamics — Anderson'],
  'CIV-E01':['Structural Analysis — Hibbeler','Structural Analysis — Kassimali'],
  'CIV-E03':['Reinforced Concrete: Mechanics and Design — MacGregor'],
  'CIV-E11':['Principles of Foundation Engineering — Das'],
  'CIV-E16':['Applied Hydrology — Chow, Maidment & Mays'],
  'CIV-E24':['Traffic Engineering — Roess, Prassas & McShane'],
  'CIV-E31':['BIM Handbook — Eastman et al.'],
  'SYS-E01':['Systems Engineering and Analysis — Blanchard & Fabrycky'],
  'PRO701':['Engineering Economy — Blank & Tarquin']
};

window.BOOK_SHELF_HELPER=function(courseId){
  return (window.ENGINEERING_BOOK_MAP&&window.ENGINEERING_BOOK_MAP[courseId])||[];
};
