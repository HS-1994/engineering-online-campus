// Final academic completion layer.
(function(){
  const degrees={
    'Integrated Engineering':{
      core:['MTH101','PHY101','CHE101','PRG101','MEC201','MAT301','THM401','ELC201','ELC301','CTL402','INS403','MCH501','EMB501','MFG501','ROB601','SYS601','SIM601','PRO701','CAP801'],
      clusters:{
        'Mechanical Engineering':['MDE501','ME-E01','ME-E02','ME-E03','ME-E04','ME-E06','ME-E08','ME-E13','ME-E14','ME-E15','ME-E16','ME-E17','ME-E21','ME-E22'],
        'Electrical & Electronics':['ELC201','ELC301','PWR401','EE-E02','EE-E03','EE-E06','EE-E07','EE-E10','EE-E12','EE-E14','EE-E15','EE-E18','EE-E24','EE-E25','EE-E26'],
        'Mechatronics & Robotics':['MCH501','EMB501','ROB601','CTL402','INS403','ROB-E01','ROB-E02','ROB-E03','ROB-E04','ROB-E05','ROB-E07','ROB-E08','ROB-E09','CTL-E08'],
        'Civil & Digital Construction':['CIV-E01','CIV-E02','CIV-E03','CIV-E05','CIV-E06','CIV-E08','CIV-E11','CIV-E12','CIV-E16','CIV-E17','CIV-E18','CIV-E24','CIV-E28','CIV-E31','CIV-E32'],
        'Systems, Simulation & Manufacturing':['SYS601','SIM601','MFG501','SYS-E01','SYS-E02','SYS-E03','SYS-E05','SYS-E06','MFG-E01','MFG-E02','MFG-E03','MFG-E10','MFG-E13','MFG-E14','MFG-E15'],
        'Computing for Engineers':['PRG101','COMP-E01','COMP-E02','COMP-E03','COMP-E04','COMP-E05','COMP-E06','COMP-E08','COMP-E10','COMP-E11','COMP-E12','COMP-E13','COMP-E14','COMP-E15']
      }
    }
  };
  window.DEGREE_COMPLETION=degrees;

  const courseSpec={
    MTH101:{pr:[],modules:['Functions and engineering algebra','Calculus and multivariable methods','Linear algebra','ODEs','Numerical methods'],lab:'Python/MATLAB numerical notebook',assessment:'Problem sets + closed-book exam',output:'Validated engineering calculation notebook'},
    PHY101:{pr:['MTH101'],modules:['Mechanics','Electricity and magnetism','Waves','Thermal/modern physics'],lab:'Experimental measurement notebook',assessment:'Problems + lab report + exam',output:'Physics model validated against data'},
    PRG101:{pr:['MTH101'],modules:['Python','Scientific computing','C/C++ foundations','Version control'],lab:'Numerical engineering mini-project',assessment:'Coding exercises + project',output:'Reproducible engineering software repo'},
    MEC201:{pr:['MTH101','PHY101'],modules:['Statics','Kinematics','Dynamics','Rigid-body systems','Energy and momentum'],lab:'Mechanics simulation',assessment:'Problem sets + analysis exam',output:'Mechanics model with verification'},
    MAT301:{pr:['MTH101','MEC201'],modules:['Stress/strain','Material behavior','Failure','Fatigue','Design allowables'],lab:'Material/failure case study',assessment:'Design problems + report',output:'Material selection + failure assessment'},
    THM401:{pr:['MTH101','PHY101'],modules:['Thermodynamics','Heat transfer','Fluid mechanics','System sizing'],lab:'Thermal/fluid simulation',assessment:'Problems + design report',output:'Sized thermal-fluid system'},
    MDE501:{pr:['MEC201','MAT301'],modules:['Machine elements','Loads and shafts','Bearings/gears','DFM/DFA','FEA-assisted design'],lab:'CAD + FEA',assessment:'Design review + report',output:'Released manufacturing-ready design package'},
    ELC201:{pr:['MTH101','PHY101'],modules:['DC circuits','AC phasors','Transient response','Frequency response','Network theorems'],lab:'SPICE circuit lab',assessment:'Problems + lab + exam',output:'Verified circuit design'},
    ELC301:{pr:['ELC201'],modules:['Diodes/transistors','Amplifiers','Digital logic','Interfaces','AD/DA'],lab:'SPICE + digital simulation',assessment:'Lab + design project',output:'Working mixed-signal subsystem'},
    CTL402:{pr:['MTH101','ELC201','PRG101'],modules:['Dynamic modeling','Laplace methods','Feedback','State space','Digital control'],lab:'MATLAB/Simulink control lab',assessment:'Analysis exam + controller project',output:'Validated closed-loop controller'},
    INS403:{pr:['ELC201','CTL402'],modules:['Sensors','Signal conditioning','Metrology','Uncertainty','DAQ'],lab:'Sensor + DAQ experiment',assessment:'Lab report + practical',output:'Calibrated measurement chain'},
    MCH501:{pr:['MDE501','ELC301','CTL402'],modules:['System architecture','Actuation','Sensing','Control integration','Design-build-test'],lab:'Mechatronic prototype/simulation',assessment:'Integration demo + report',output:'Integrated mechatronic system'},
    EMB501:{pr:['PRG101','ELC301'],modules:['MCUs','Embedded C/C++','Interrupts','Buses','RT fundamentals'],lab:'Microcontroller lab',assessment:'Firmware project + test report',output:'Tested embedded controller'},
    ROB601:{pr:['MEC201','CTL402','EMB501'],modules:['Robot kinematics','Dynamics','Planning','Perception','ROS 2'],lab:'ROS 2 simulation',assessment:'Robotics project + oral defense',output:'Robotic system demonstration'},
    SYS601:{pr:['MCH501','ROB601'],modules:['Requirements','Architecture','Interfaces','Trade studies','V&V'],lab:'Systems engineering case',assessment:'Architecture review + report',output:'System requirements and V&V baseline'},
    SIM601:{pr:['MAT301','THM401','MEC201'],modules:['Discretization','FEA','CFD','Verification/validation','Digital twins'],lab:'Open-source simulation workflow',assessment:'Validated technical case study',output:'Simulation correlated to reference data'},
    MFG501:{pr:['MAT301','MDE501'],modules:['Manufacturing processes','Metrology','Tolerancing','Quality','Production systems'],lab:'Process planning/CMM or virtual metrology',assessment:'Process plan + quality study',output:'Manufacturing and inspection plan'},
    PRO701:{pr:['PRG101'],modules:['Engineering economics','Project management','Risk','Ethics','Technical communication'],lab:'Decision memo',assessment:'Case studies + final memo',output:'Professional engineering decision dossier'},
    CAP801:{pr:['SYS601','SIM601','PRO701'],modules:['Proposal','Requirements','Design','Build/simulate','Verify','Report/defense'],lab:'Capstone project',assessment:'Milestones + final defense',output:'Portfolio-ready multidisciplinary engineering project'}
  };
  window.COURSE_SPECS=courseSpec;
})();
