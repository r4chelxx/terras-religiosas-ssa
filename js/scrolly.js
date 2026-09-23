const marks=['1628','1827','1832','1924','1930','1939','1949','1956','hoje'];
export function initTimeline(scenes,onScene){
 const nav=document.querySelector('#timeline');
 nav.innerHTML=`<div class="timeline-track"><i></i>${marks.map(mark=>`<span data-time="${mark}">${mark==='1930'?'c. 1930':mark.toUpperCase()}</span>`).join('')}</div>`;
 const steps=[...document.querySelectorAll('[data-scene]')];
 const activate=step=>{steps.forEach(x=>x.classList.toggle('active',x===step));const scene=scenes.find(x=>x.id===step.dataset.scene);if(!scene)return;onScene(scene);const time=scene.time==='presente'?'hoje':scene.time;const index=time?marks.indexOf(time):-1;nav.classList.toggle('visible',index>=0);nav.querySelectorAll('[data-time]').forEach(x=>x.classList.toggle('active',x.dataset.time===time));if(index>=0)nav.querySelector('i').style.width=`${index/(marks.length-1)*100}%`};
 const io=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&activate(e.target)),{rootMargin:'-38% 0px -45%',threshold:0});steps.forEach(step=>io.observe(step));
 addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('#reading-progress').style.width=`${max?scrollY/max*100:0}%`},{passive:true});
}
