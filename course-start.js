// Course start / active-course layer for the personal campus.
(function(){
  const key='campus-started-courses';
  const load=()=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return[]}};
  const save=v=>localStorage.setItem(key,JSON.stringify(v));
  const has=id=>load().includes(String(id));
  const start=id=>{id=String(id);const a=load();if(!a.includes(id))a.push(id);save(a);localStorage.setItem(`status-${id}`,'Started');localStorage.setItem(`started-at-${id}`,new Date().toISOString());window.toast?.('Course started — added to My Started Courses');window.dispatchEvent(new CustomEvent('course-started',{detail:{id}}));};
  const stop=id=>{id=String(id);save(load().filter(x=>x!==id));localStorage.setItem(`status-${id}`,'Not started');window.dispatchEvent(new CustomEvent('course-stopped',{detail:{id}}));};
  window.CAMPUS_COURSE_STATE={load,has,start,stop};
})();
