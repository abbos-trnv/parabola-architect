const studioIcons={
 home:'<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z"/>',bank:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>', saved:'<path d="M6 3h12v18l-6-4-6 4z"/>',results:'<path d="M3 21h18M5 16V9m7 7V3m7 13v-5"/>',search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',book:'<path d="M3 4q5-2 9 2 4-4 9-2v14q-5-2-9 2-4-4-9-2zM12 6v13"/>',point:'<path d="M4 20h16M8 22V3m-3 4 3-4 3 4"/><circle cx="16" cy="9" r="3"/>',line:'<path d="M2 20h20M4 18 19 5"/><circle cx="19" cy="5" r="2"/>',arch:'<path d="M2 19Q12-12 22 19M6 19Q12 0 18 19"/>',rotate:'<path d="M4 9a9 9 0 1 1 0 7m0-12v5h5"/>',check:'<path d="m3 12 6 6L21 5"/>'};
function icon(name){return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+studioIcons[name]+'</svg>';}
studioIcons.bench='<path d="M2 16Q12 -3 22 16M2 20h20M6 15h10l-2 3H8z"/>';
studioIcons.theory=studioIcons.book;
const sections=[['home','Моё обучение'],['theory','Теория'],['bank','Банк задач'],['bench','Испытания'],['saved','Избранное'],['results','Мой прогресс']];
const studioHeader=document.querySelector('header');
studioHeader.innerHTML='<a class="studio-brand" href="index.html"><svg class="graph-logo" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="#205953"/><path d="M7 28Q15 -12 22 22T34 12" fill="none" stroke="#e8ff9a" stroke-width="3.4"/><circle cx="22" cy="22" r="3.5" fill="#f5ab75"/></svg>Графика</a><nav aria-label="Разделы платформы">'+sections.map(([key,title])=>'<a data-section="'+key+'" href="index.html'+(key==='home'?'':'#'+key)+'">'+icon(key)+'<span>'+title+'</span></a>').join('')+'</nav><div class="rail-foot">'+icon('book')+' Алгебра · 9 класс</div>';
function highlightSection(key){studioHeader.querySelectorAll('[data-section]').forEach(a=>{if(a.dataset.section===key)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
highlightSection('home');
const catalogue=[
 ['points','left','Отметь первую опору'],['points','right','Прочитай план'],['line','slope','Соедини две площадки'],['line','offset','Подними начало пандуса'],
 ['arch','a','Куда смотрят ветви?'],['arch','b','Куда уходит вершина?'],['arch','c','Где график встретит ось y?'],['arch','lab','Построй арку для катера']
];
const topicNames={points:'Координаты',line:'Прямая',arch:'Парабола'};
const savedTasks=new Set();
try{for(const id of JSON.parse(localStorage.getItem('bureau.bookmarks')||'[]'))savedTasks.add(id);}catch{}
function taskLink(topic,id){return topic==='arch'?'parabola.html#'+id:'index.html#'+topic+'/'+id;}
function updateBookmark(id){if(savedTasks.has(id))savedTasks.delete(id);else savedTasks.add(id);try{localStorage.setItem('bureau.bookmarks',JSON.stringify([...savedTasks]));}catch{}}
function archView(yaw){
 const ca=Math.cos(yaw),sa=Math.sin(yaw);
 const project=(x,y,z)=>[190+ca*x+sa*z,132-y*.85+.26*(sa*x-ca*z)];
 const points=coords=>coords.map(p=>project(...p).map(v=>v.toFixed(1)).join(',')).join(' ');
 const face=(coords,color)=>'<polygon points="'+points(coords)+'" fill="'+color+'" stroke="#26554e" stroke-width=".6" stroke-linejoin="round"/>';
 let s='<defs><radialGradient id="glow"><stop stop-color="#b99ae7" stop-opacity=".42"/><stop offset="1" stop-color="#b99ae7" stop-opacity="0"/></radialGradient></defs><ellipse cx="190" cy="96" rx="188" ry="100" fill="url(#glow)"/>';
 for(let i=-180;i<=180;i+=24){s+='<polyline points="'+points([[i,0,-100],[i,0,100]])+'" fill="none" stroke="#b8a5db" opacity=".2"/><polyline points="'+points([[-170,0,i],[170,0,i]])+'" fill="none" stroke="#b8a5db" opacity=".2"/>';}
 const height=(x,r,h)=>h*(1-(x/r)**2);
 for(let z=55;z>=-55;z-=17){
 for(let i=0;i<24;i++){
 const t=i/24*2-1,u=(i+1)/24*2-1,x=t*128,x2=u*128;
 const outer=[x,height(x,128,132)],outer2=[x2,height(x2,128,132)],inside=[t*99,height(t*99,99,91)],inside2=[u*99,height(u*99,99,91)];
 const p=(a,d)=>[...a,d];
 s+=face([p(outer,z),p(outer2,z),p(outer2,z-10),p(outer,z-10)],'hsl(158 30% '+(65+16*(1-Math.abs(t)))+'%)');
 s+=face([p(inside,z),p(inside2,z),p(inside2,z-10),p(inside,z-10)],'#345e59');
 s+=face([p(outer,z-10),p(outer2,z-10),p(inside2,z-10),p(inside,z-10)],(i===12?'#f5ad73':'hsl(164 34% '+(40+16*(1-Math.abs(t)))+'%)'));
 }}
 return s;
}
function dashboard(){
 document.title='Моё обучение — Графика';
 const done=catalogue.filter(([t,id])=>CourseProgress.has(t,id)).length,n=lessons.filter(l=>CourseProgress.finished(l.id)).length;
 const next=lessons.find(l=>!CourseProgress.finished(l.id))||lessons[0];
 course.innerHTML='<div class="dashboard-heading"><div class="eyeline">МАТЕМАТИЧЕСКАЯ СТУДИЯ</div><h1>Моё обучение</h1></div><section class="mission"><div class="mission-copy"><span class="course-label">'+icon('book')+' Практический курс</span><h2>От чертежа <br>к функции</h2><p>Спроектируй переправу: от координат первой опоры до формы арки.</p><a class="launch" href="'+next.url+'">'+(n===3?'Повторить курс':done?'Продолжить курс':'Начать курс')+' →</a></div><div class="model"><div class="model-tabs"><button id="modelView" aria-pressed="true">Макет</button><button id="sectionView" aria-pressed="false">Сечение</button></div><svg id="model" role="img" aria-label="Поворотная модель арочной переправы" viewBox="0 0 380 205"></svg><label>'+icon('rotate')+'<span>Поворот модели</span><input type="range" id="yaw" aria-label="Поворот модели" min="10" max="65" value="37"></label></div></section>'+
 '<section class="learning"><div class="planhead"><h2>Программа курса</h2><span>'+n+' из 3 уроков пройдено</span></div><div class="module-list">'+lessons.map((l,i)=>'<a class="module u'+i+'" href="'+l.url+'"><div class="module-icon">'+icon(['point','line','arch'][i])+'</div><div class="module-desc"><small>Урок '+(i+1)+' · '+l.topic+'</small><h3>'+l.title+'</h3><p>'+l.summary+'</p></div><span class="module-count">'+CourseProgress.count(l.id)+' / '+CourseProgress.goals[l.id].length+'</span>'+icon('arrow')+'</a>').join('')+'</div></section>'+
 '<aside class="dash-aside"><div class="result-card"><div class="eyeline">МОЙ ПРОГРЕСС</div><div class="dial" style="--arc:'+done/8*360+'deg"><b>'+Math.round(done/8*100)+'<small>%</small></b></div><strong>'+done+' из 8 задач решено</strong><a href="#results">По темам '+icon('arrow')+'</a></div><a class="practice-tile" href="#bench">'+icon('bench')+'<h3>Испытай переправу</h3><p>Измени размеры катера и найди границу, при которой он заденет арку.</p><b>На стенд →</b></a></aside>';
 const yaw=document.getElementById('yaw'),model=document.getElementById('model');
 const paint=()=>model.innerHTML=archView(Number(yaw.value)*Math.PI/180);
   const modelView=document.getElementById('modelView'),sectionView=document.getElementById('sectionView');
 function toggle(cross){
  modelView.setAttribute('aria-pressed',String(!cross));sectionView.setAttribute('aria-pressed',String(cross));
  yaw.closest('label').hidden=cross;
  model.setAttribute('viewBox',cross?'0 0 544 330':'0 0 380 205');model.setAttribute('aria-label',cross?'Поперечный разрез моста с катером':'Поворотная модель арочной переправы');
  if(cross)model.innerHTML=bridgeDiagram(4,3.2,false);else paint();
 }
 modelView.onclick=()=>toggle(false);sectionView.onclick=()=>toggle(true);
 yaw.oninput=paint;
 let startX, startAngle;
 model.onpointerdown=e=>{if(sectionView.getAttribute('aria-pressed')==='true')return;startX=e.clientX;startAngle=Number(yaw.value);model.setPointerCapture(e.pointerId);};
 model.onpointermove=e=>{if(model.hasPointerCapture(e.pointerId)){yaw.value=startAngle+(e.clientX-startX)*.3;paint();}};
 paint();
}
function library(view){
 const favorites=view==='saved', title=favorites?'Избранное':'Банк задач';
 document.title=title+' — Графика';
 course.innerHTML='<div class="viewhead"><small>ПРАКТИКА</small><h1>'+title+'</h1><p>'+(favorites?'Здесь собраны задачи, которые ты сохранил для повторения.':'Выбери тему и открой задачу сразу в тренажёре.')+'</p></div><section class="library"><label class="find">'+icon('search')+'<input type="search" placeholder="Найти задачу" aria-label="Найти задачу"></label><div class="filters">'+[['all','Все темы'],...Object.entries(topicNames)].map(([id,t])=>'<button data-filter="'+id+'" aria-pressed="'+(id==='all')+'">'+t+'</button>').join('')+'</div><div id="items"></div></section>';
 let topic='all';const input=course.querySelector('input');
 const draw=()=>{let rows=catalogue.filter(([t,id,name])=>(!favorites||savedTasks.has(t+'/'+id))&&(topic==='all'||t===topic)&&(name+' '+topicNames[t]).toLowerCase().includes(input.value.toLowerCase().trim()));
 document.getElementById('items').innerHTML=rows.length?rows.map(([t,id,name])=>{let key=t+'/'+id,s=savedTasks.has(key);return '<div class="task-row"><a href="'+taskLink(t,id)+'"><small>'+topicNames[t]+(CourseProgress.has(t,id)?' · ✓ Решено':'')+'</small><strong>'+name+'</strong></a><button class="bookmark" aria-label="'+(s?'Убрать из избранного':'Сохранить задачу')+' «'+name+'»" aria-pressed="'+s+'" data-save="'+key+'">'+icon('saved')+'</button></div>';}).join(''):'<p class="empty">'+(favorites&&!savedTasks.size?'Пока нет сохранённых задач. Нажми на закладку рядом с интересной задачей в банке. <a href="#bank">Открыть банк задач →</a>':'Совпадений нет. Попробуй другую тему или запрос.')+'</p>';};
 course.querySelector('.filters').onclick=e=>{if(!e.target.dataset.filter)return;topic=e.target.dataset.filter;course.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===e.target)));draw();};
 document.getElementById('items').onclick=e=>{const btn=e.target.closest('[data-save]');if(btn){updateBookmark(btn.dataset.save);draw();const replacement=[...course.querySelectorAll('[data-save]')].find(b=>b.dataset.save===btn.dataset.save);(replacement||input).focus();}};
 input.oninput=draw;draw();
}
function results(){
 document.title='Мой прогресс — Графика';
 const count=catalogue.filter(([t,k])=>CourseProgress.has(t,k)).length;
 course.innerHTML='<div class="viewhead"><small>ЛИЧНЫЙ КАБИНЕТ</small><h1>Мой прогресс</h1><p>Решено '+count+' из 8 задач. Результаты сохраняются в этом браузере.</p></div><div class="result-list">'+lessons.map(l=>'<article><h2>'+l.topic+'</h2><progress value="'+CourseProgress.count(l.id)+'" max="'+CourseProgress.goals[l.id].length+'"></progress>'+catalogue.filter(([t])=>t===l.id).map(([t,id,name])=>'<a href="'+taskLink(t,id)+'"><span>'+(CourseProgress.has(t,id)?'✓':'○')+' '+name+'</span> →</a>').join('')+'</article>').join('')+'</div>';
}




