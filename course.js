const course = document.getElementById('course');
const lessons = [
  {id:'points', topic:'Координаты', title:'Разметка опор', summary:'Прочитай план и поставь две опоры по координатам.', url:'#points', symbol:'(x; y)'},
  {id:'line', topic:'Линейная функция', title:'Линия подъёма', summary:'Соедини площадки пандусом и вычисли его наклон.', url:'#line', symbol:'kx + b'},
  {id:'arch', topic:'Квадратичная функция', title:'Архитектор парабол', summary:'Подбери изгиб арки и проверь, пройдёт ли под ней катер.', url:'parabola.html', symbol:'ax² + bx + c'}
];
const exercises = {
 points:[
  {id:'left',title:'Отметь первую опору', prompt:'На плане опора A стоит на 3 клетки левее и на 2 клетки выше начала координат. Нажми на нужный узел сетки или выставь x и y ползунками.', target:[-3,2], hint:'Левее нуля — отрицательный x. Выше нуля — положительный y.', answer:'Опора A стоит в точке (−3; 2). Сначала читаем горизонтальную координату, затем вертикальную.'},
  {id:'right',title:'Прочитай план',prompt:'Ромб B показывает вторую опору. Считай её координаты с плана и совмести с ним фиолетовую точку.',target:[4,-1],hint:'Отсчитай клетки от начала координат до B. Точка правее оси y и ниже оси x.',answer:'Верно: B = (4; −1). Обе опоры размечены.'}],
 line:[
  {id:'slope',title:'Соедини две площадки',prompt:'Пандус начинается в (0; 0) и заканчивается в (4; 2). Подбери наклон k в формуле y = kx.',target:[.5,0],hint:'Раздели подъём на горизонтальное расстояние: k = (2 − 0) / (4 − 0).',answer:'k = 0,5. На каждые два метра по горизонтали приходится метр подъёма.'},
  {id:'offset',title:'Подними начало пандуса',prompt:'Новый вход находится в (0; 1), верхняя площадка — в (4; 3). Выставь k и b, чтобы прямая прошла через обе точки.',target:[.5,1],hint:'В точке x = 0 высота равна b. Наклон равен разности высот, делённой на 4.',answer:'y = 0,5x + 1. Наклон сохранился, а весь пандус поднялся на метр.'}]
};
function fmt(v){return String(v).replace("-", "−").replace(".",",");}
function sketch(id,step,vals){
 const [v,w]=vals, X=x=>216+31*x, Y=y=>141-31*y;
 const line=(x,y,u,z,attr)=>'<path d="M'+X(x)+' '+Y(y)+'L'+X(u)+' '+Y(z)+'" '+attr+'/>';
 const dot=(x,y,attr)=>'<circle cx="'+X(x)+'" cy="'+Y(y)+'" r="5" '+attr+'/>';
 const label=(x,y,t)=>'<text x="'+x+'" y="'+y+'" font-size="13" fill="#39303e">'+t+'</text>';
 let g='<defs><pattern id="sgrid" width="31" height="31" x="216" y="141" patternUnits="userSpaceOnUse"><path d="M31 0H0V31" fill="none" stroke="#cfc7d4"/></pattern></defs><rect width="450" height="284" fill="url(#sgrid)"/>';
 g+=line(-7,0,7.5,0,'stroke="#958799"')+line(0,-5,0,5,'stroke="#958799"');
 for(let i=-6;i<7;i++)g+=label(X(i)+3,Y(0)+15,i);
 for(let i=-4;i<=4;i++)if(i)g+=label(X(0)+4,Y(i)-3,i);
 g+=label(437,Y(0)-5,'x')+label(X(0)-12,14,'y');
 if(id==='points'){
 if(step===1)g+='<path d="M340 164l8 8-8 8-8-8Z" fill="#f4a36c" stroke="#6d412f"/>'+label(350,168,'B');
 g+=line(0,w,v,w,'stroke="#8659a0" stroke-dasharray="4 3"')+line(v,0,v,w,'stroke="#8659a0" stroke-dasharray="4 3"')+dot(v,w,'fill="#713e9b"');}
 else {const b=step===1?1:0;g+=line(-7,-7*v+w,8,8*v+w,'stroke="#713e9b" stroke-width="3"');
 for(const [x,y] of [[0,b],[4,b+2]])g+=dot(x,y,'fill="#f6a46c" stroke="#663c22"')+label(X(x)+8,Y(y)-8,'('+x+'; '+y+')');}
 return g;
}
function lesson(id,step){
 const info=lessons.find(l=>l.id===id), exercisesHere=exercises[id], index=lessons.indexOf(info);
 if(step===undefined){step=exercisesHere.findIndex(e=>!CourseProgress.has(id,e.id));if(step<0)step=0;}
 const e=exercisesHere[step],points=id==='points',vals=[0,0];
 document.title=info.title+' — Графика';
 course.innerHTML='<nav class="crumb"><a href="index.html">← Карта курса</a><span>От чертежа к функции · Урок '+(index+1)+' из 3</span></nav><div class="practicehead"><small>'+info.topic.toUpperCase()+'</small><h1>'+info.title+'</h1></div><section class="worksheet"><div class="exercise"><small>ЗАДАНИЕ '+(step+1)+' ИЗ 2</small><h2>'+e.title+'</h2><p>'+e.prompt+'</p><div id="adjust"></div><button class="action" id="verify">Проверить →</button><p id="response" role="status"></p></div><div class="sheet"><div class="graphhead"><small>ЧЕРТЁЖ</small><b id="readout"></b></div><svg id="drawing" viewBox="0 0 450 284" role="img" aria-label="Координатный чертёж задания"></svg></div></section>';
 course.querySelector('.worksheet').insertAdjacentHTML('beforebegin',theoryInLesson(points?'points':e.id));
 const specs=points?[['x',-6,6,1],['y',-4,4,1]]:[['k',-1,2,.25],['b',-2,3,.5]].slice(0,step+1);
 const adjust=document.getElementById('adjust'),btn=document.getElementById('verify'),response=document.getElementById('response');
 specs.forEach(([k,min,max,unit],i)=>{const label=document.createElement('label');label.className='slider';label.innerHTML='<span class="shead">'+k+'<output>0</output></span><input aria-label="'+k+'" type="range" min="'+min+'" max="'+max+'" step="'+unit+'" value="0">';adjust.append(label);
 label.querySelector('input').oninput=event=>{vals[i]=+event.target.value;label.querySelector('output').value=fmt(vals[i]);response.textContent='';repaint();};});
 function repaint(){document.getElementById('drawing').innerHTML=sketch(id,step,vals);document.getElementById('readout').textContent=points?'('+fmt(vals[0])+'; '+fmt(vals[1])+')':'y = '+fmt(vals[0])+'x'+(vals[1]<0?' − ':' + ')+fmt(Math.abs(vals[1]));}
 if(points){
  const drawing=document.getElementById('drawing');
  drawing.classList.add('selectable');
  const move=event=>{
   const sliders=adjust.querySelectorAll('input');
   if(sliders[0].disabled)return;
   const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(drawing.getScreenCTM().inverse());
   [Math.round((point.x-216)/31),Math.round((141-point.y)/31)].forEach((value,i)=>{
    const el=sliders[i];el.value=String(value);el.dispatchEvent(new Event('input'));
   });
  };
  drawing.onpointerdown=e=>{drawing.setPointerCapture(e.pointerId);move(e);};
  drawing.onpointermove=e=>{if(drawing.hasPointerCapture(e.pointerId))move(e);};
 }
 repaint();
 btn.onclick=()=>{if(vals.some((v,i)=>v!==e.target[i])){response.textContent=e.hint;return;}
 CourseProgress.mark(id,e.id);response.textContent=e.answer;adjust.querySelectorAll('input').forEach(el=>el.disabled=true);
 btn.textContent=step===0?'Следующее задание →':'К уроку «'+lessons[index+1].title+'» →';
 btn.onclick=()=>{if(!step)lesson(id,1);else location.href=lessons[index+1].url;window.scrollTo(0,0);};};
}
function route(){
 const [key,task]=location.hash.slice(1).split('/');
 const section=sections.some(([id])=>id===key)?key:'home';
 highlightSection(section);
 course.classList.toggle('dashboard',section==='home' && !Object.hasOwn(exercises,key));
 if(Object.hasOwn(exercises,key)){
  const step=exercises[key].findIndex(e=>e.id===task);
  lesson(key,step<0?undefined:step);
 }else if(section==='bank'||section==='saved')library(section);
 else if(section==='theory')theoryLibrary();
 else if(section==='results')results();
 else if(section==='bench')testBench();
 else dashboard();
 window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);window.addEventListener('pageshow',e=>{if(e.persisted)route();});route();



