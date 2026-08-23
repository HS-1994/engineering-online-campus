/* Raster anime layer: replace vector placeholder art with actual generated anime artwork. */
(function(){
  'use strict';
  const SRC='assets/anime-hero.webp?v=20260823-19';
  function apply(){
    const root=document.querySelector('.eoc');
    if(!root)return false;
    const hero=document.querySelector('.eoc-hero-art');
    if(hero){hero.innerHTML='';hero.style.backgroundImage=`linear-gradient(90deg,rgba(5,8,18,.15),rgba(5,8,18,.05)),url(${JSON.stringify(SRC)})`;hero.style.backgroundSize='cover';hero.style.backgroundPosition='center';hero.style.backgroundRepeat='no-repeat';}
    document.querySelectorAll('.e-card-art').forEach((el,i)=>{el.innerHTML='';el.style.backgroundImage=`linear-gradient(180deg,rgba(4,8,16,.03),rgba(4,8,16,.18)),url(${JSON.stringify(SRC)})`;el.style.backgroundSize='cover';el.style.backgroundPosition=['57% 45%','44% 42%','67% 45%','50% 55%'][i%4];});
    document.querySelectorAll('.crew-art,.eoc-user-art').forEach((el,i)=>{el.innerHTML='';el.style.backgroundImage=`url(${JSON.stringify(SRC)})`;el.style.backgroundSize='cover';el.style.backgroundPosition=['60% 35%','44% 40%','70% 42%','52% 55%'][i%4];});
    return true;
  }
  function boot(){ if(apply()) return; requestAnimationFrame(()=>{if(!apply())setTimeout(apply,400);}); }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot); else boot();
})();
