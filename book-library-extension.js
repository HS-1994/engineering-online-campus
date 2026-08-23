// Additional title-only references found in the user's private Notion book library.
// No file paths, URLs, or book files are stored here.
(function(){
  const extra={
    MEC201:['Engineering Dynamics — Andrew Pytel, Jaan Kiusalaas','Vector Mechanics for Engineers: Statics and Dynamics — Beer, Johnston, Cornwell'],
    MAT301:['Mechanics of Materials — Pytel, Kiusalaas','Mechanics of Materials — R.C. Hibbeler'],
    THM401:['Engineering Thermodynamics — J.P. Holman','Thermodynamics — Enrico Fermi','Elementary Mechanics and Thermodynamics — J. Norbury','Thermodynamics and Statistical Mechanics — Greiner, Neise, Stoecker','A First Course in Fluid Mechanics for Engineers'],
    MDE501:['Mechanical Engineering Design — J.E. Shigley','Machine Design — J.C. Ugural','Design of Machine Elements — V.B. Bhandari'],
    SIM601:['Finite Element Method — O.C. Zienkiewicz, R.L. Taylor, J.Z. Zhu','Finite Element Analysis — D. Hutton','Computational Fluid Dynamics — John D. Anderson'],
    ELC201:['Engineering Circuit Analysis — Hayt, Kemmerly, Durbin','Electric Circuits — James W. Nilsson, Susan Riedel'],
    CTL402:['Feedback Control of Dynamic Systems — Franklin, Powell, Emami-Naeini','Linear System Theory and Design — Chi-Tsong Chen'],
    ROB601:['Engineering Dynamics — Pytel, Kiusalaas','Robotics: Modelling, Planning and Control — Siciliano et al.'],
    CIV201:['Structural Analysis — Hibbeler','Structural Analysis — Kassimali','Matrix Structural Analysis — Amin Ghali, Adam Neville, Wai-Fah Chen'],
    CIV301:['Reinforced Concrete Design — Wight, MacGregor','Reinforced Concrete: Mechanics and Design — McCormac, Brown'],
    CIV401:['Soil Mechanics — R.F. Craig','Principles of Geotechnical Engineering — Braja M. Das','Fundamentals of Soil Behavior — Mitchell, Soga'],
    CIV402:['Foundation Analysis and Design — Joseph E. Bowles','Principles of Foundation Engineering — Braja M. Das'],
    CIV503:['Applied Hydrology — Chow, Maidment, Mays','Hydrology — K. Subramanya'],
    CIV504:['Open-Channel Hydraulics — Ven Te Chow','Fluid Mechanics — Streeter, Wylie, Bedford'],
    CIV601:['Traffic Engineering — Roess, Prassas, McShane','Transportation Engineering — Khisty, Lall'],
    CIV702:['BIM Handbook — Sacks, Eastman, Lee, Teicholz','The BIM Manager’s Handbook — Dominik Holzer'],
    PRO701:['Engineering Economy — Blank, Tarquin','Project Management for Engineering and Construction — Oberlender','Engineering Ethics: Concepts and Cases — Harris, Pritchard, Rabins']
  };
  window.CAMPUS_BOOKS_EXTRA=extra;
  Object.keys(extra).forEach(id=>{
    window.CAMPUS_BOOKS=window.CAMPUS_BOOKS||{};
    const base=window.CAMPUS_BOOKS[id]||[];
    window.CAMPUS_BOOKS[id]=Array.from(new Set([...base,...extra[id]]));
  });
})();
