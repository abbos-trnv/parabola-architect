const byId = id => document.getElementById(id);
const format = value => Number(value.toFixed(2)).toLocaleString('ru-RU').replace('-', '−');
const svgLine = (x1,y1,x2,y2,attributes) => '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" '+attributes+'/>';
const svgText = (x,y,value,attributes='') => '<text x="'+x+'" y="'+y+'" '+attributes+'>'+value+'</text>';

function illustrate(){
  let art='<defs><pattern id="dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".65" fill="#a69999"/></pattern></defs>';
  art+='<path d="M28 175 275 99 459 153 202 234Z" fill="url(#dots)"/><path d="m60 185 208-70 147 39-195 66z" fill="#d7c7e1"/>';
  // A sequence of parallel arch ribs, projected onto a common ground plane.
  for(let i=10;i>=0;i--){
    const x=49+i*12.4, y=183-i*4.5;
    const path='M0 0 Q91 -286 199 25 L182 29 Q93 -184 26 6Z';
    art+='<g transform="translate('+x+' '+y+')"><path d="'+path+'" transform="translate(6 -2)" fill="#36263f" stroke="#302335" stroke-width="1.5"/><path d="'+path+'" fill="'+(i===0?'#f67839':i%3===0?'#a787c2':'#d7bee8')+'" stroke="#302335" stroke-width="1.5"/>';
    if(i===0)for(let j=1;j<17;j++){let t=j/17, u=1-t;const q=(a,b,c)=>u*u*a+2*u*t*b+t*t*c;art+=svgLine(q(0,91,199),q(0,-286,25),q(26,93,182),q(6,-184,29),'stroke="#8f4a37" stroke-width=".7"');}
    art+='</g>';
  }
  art+='<g stroke="#76677e" fill="none" stroke-width="1"><path d="m43 195 204 28m-204-32v9m204 18v10m22-13 129-49m-128 45v10m128-59v10"/><path d="m236 58 36-26h56" stroke-dasharray="3 3"/></g>'+svgText(333,34,'y = ax² + bx + c','fill="#64526c" font-family="Georgia" font-style="italic" font-size="14"');
  byId('sculpture').innerHTML=art;
}

const config={
 a:{name:'Изгиб',label:'Направление и ширина',min:-2,max:2,step:.25,tint:'#e3d1f6',title:'Куда смотрят ветви?',explain:'Знак a задаёт направление ветвей. Чем больше |a|, тем уже парабола при тех же b и c.',task:'Разверни ветви вниз и сделай параболу шире исходной.'},
 b:{name:'Вершина',label:'Положение оси симметрии',min:-4,max:4,step:.5,tint:'#ffd5ae',title:'Куда уходит вершина?',explain:'Ось симметрии проходит через x = −b/(2a). При изменении b вершина движется и по горизонтали, и по вертикали. Точка (0; c) остаётся на месте.',task:'Помести вершину на прямую x = 2. Здесь a = 1 и c = 0.'},
 c:{name:'Высота',label:'Сдвиг по вертикали',min:-4,max:4,step:.5,tint:'#d9eabc',title:'Где график встретит ось y?',explain:'При x = 0 значение y равно c. Добавь единицу к c — и каждая точка графика поднимется ровно на единицу.',task:'Опусти график так, чтобы он пересёк ось y в точке (0; −2).'},
 lab:{name:'Мастерская',title:'Собери свою параболу',explain:'Меняй все три коэффициента и наблюдай за вершиной. Для проверки модели попробуй построить арку по размерам.'}
};
const keys=['a','b','c'], order=[...keys,'lab'];
const base=()=>({a:1,b:0,c:0});
let mode='a', mission='', complete=new Set(CourseProgress.goals.arch.filter(step=>CourseProgress.has('arch',step))), values=Object.fromEntries(order.map(k=>[k,base()]));
values.a.a=1.5;
const state=()=>values[mode];
function equation({a,b,c}){
 let terms=[];
 for(const [v,symbol] of [[a,'x²'],[b,'x'],[c,'']]){
  if(v===0)continue;
  const sign=v<0?'−':terms.length?'+':'';
  const magnitude=symbol&&Math.abs(v)===1?'':format(Math.abs(v));
  terms.push((terms.length? ' '+sign+' ':sign)+magnitude+symbol);
 }
 return 'y = '+(terms.join('')||'0');
}
function curve(a,b,c,X,Y,start,end){
 const mid=(start+end)/2, f=x=>(a*x+b)*x+c;
 // Quadratic Bezier representation of the exact polynomial on this interval.
 const controlY=2*f(mid)-(f(start)+f(end))/2;
 return 'M'+X(start)+' '+Y(f(start))+'Q'+X(mid)+' '+Y(controlY)+' '+X(end)+' '+Y(f(end));
}
function graph(){
 const {a,b,c}=state(), vx=a===0?0:-b/(2*a),vy=(a*vx+b)*vx+c;
 const width=600,height=308, cx=300,cy=154;
 const unit=Math.min(27,128/Math.max(1,Math.abs(vy),Math.abs(c)),275/Math.max(1,Math.abs(vx)));
 const X=x=>cx+x*unit,Y=y=>cy-y*unit,lim=cx/unit;
 const tick=unit<11?5:unit<20?2:1;
 let g='<defs><pattern id="net" x="'+cx+'" y="'+cy+'" width="'+unit*tick+'" height="'+unit*tick+'" patternUnits="userSpaceOnUse"><path d="M'+unit*tick+' 0H0V'+unit*tick+'" fill="none" stroke="#d5cfdd" stroke-width=".95"/></pattern></defs><rect width="600" height="308" fill="url(#net)"/>';
 g+=svgLine(0,cy,width,cy,'stroke="#867b90"')+svgLine(cx,0,cx,height,'stroke="#867b90"');
 const font='font-family="Consolas,monospace" font-size="12" fill="#685f70"';
 for(let x=-Math.floor(lim/tick)*tick;x<=lim;x+=tick){if(x%(2*tick)===0&&X(x)>13&&X(x)<570)g+=svgText(X(x)+3,cy+14,format(x),font);}
 for(let y=-Math.floor(cy/unit/tick)*tick;y<cy/unit;y+=tick){if(y&&y%(2*tick)===0&&Y(y)>15)g+=svgText(cx+5,Y(y)-3,format(y),font);}
 g+=svgText(581,cy-7,'x',font)+svgText(cx+7,13,'y',font);
 const path=(a,b,c,attr)=>'<path d="'+curve(a,b,c,X,Y,-lim,lim)+'" fill="none" '+attr+'/>';
 if(byId('compare').checked)g+=path(1,0,0,'stroke="#8c8097" stroke-width="3" stroke-dasharray="6 5"');
 if(mode==='b'&&a)g+=svgLine(X(vx),0,X(vx),height,'stroke="#a35d22" stroke-dasharray="4 4"');
 g+=path(a,b,c,'stroke="#653592" stroke-width="4"');
 if(a)g+='<circle cx="'+X(vx)+'" cy="'+Y(vy)+'" r="5" fill="#fff" stroke="#713e9b" stroke-width="3"/>';
 if(mode==='c')g+='<circle cx="'+X(0)+'" cy="'+Y(c)+'" r="7" fill="none" stroke="#38683b" stroke-width="2"/>';
 if(mode==='lab'&&mission){for(const x of [0,8])g+='<circle cx="'+X(x)+'" cy="'+Y(0)+'" r="6" fill="#ff9b62" stroke="#563b31"/>';
 if(mission==='boat')g+='<rect x="'+X(2)+'" y="'+Y(3.2)+'" width="'+4*unit+'" height="'+3.2*unit+'" fill="#ffad7066" stroke="#aa552b" stroke-dasharray="4 3"/>';}
 byId('plot').innerHTML=g;byId('plot').setAttribute('aria-label','График функции '+equation(state()));
 byId('numeric').textContent=equation(state());byId('vertex').textContent=a?'Вершина ('+format(vx)+'; '+format(vy)+')':'Прямая · вершины нет';
 let note='';
 if(a===0)note='При a = 0 член x² исчезает. График теперь прямая.';
 else if(mode==='a')note='Ветви '+(a>0?'направлены вверх':'направлены вниз')+'. '+(Math.abs(a)===1?'Ширина такая же, как у y = x².':Math.abs(a)>1?'Парабола уже, чем y = x².':'Парабола шире, чем y = x².');
 else if(mode==='b')note='Ось симметрии: x = '+format(vx)+'. При x = 0 обе кривые проходят через начало координат.';
 else if(mode==='c')note=c===0?'График проходит через начало координат.':'Все точки сместились '+(c>0?'вверх':'вниз')+' на '+format(Math.abs(c))+'. Пересечение с осью y: (0; '+format(c)+').';
 else note='Ветви '+(a>0?'направлены вверх':'направлены вниз')+'. Ось симметрии: x = '+format(vx)+'. Пересечение с осью y: (0; '+format(c)+').';
 byId('observation').textContent=note;
}
function tabs(){byId('tabs').innerHTML=order.map(key=>'<button class="tab" data-key="'+key+'" aria-current="'+(mode===key)+'"><span class="glyph">'+(key==='lab'?'⌁':key)+'</span>'+config[key].name+(complete.has(key)?'<span class="tick" aria-label="решено">✓</span>':'')+'</button>').join('');}
function feedback(message,ok=false){byId('feedback').textContent=message;byId('feedback').className=ok?'ok':'';}
function action(text,callback){let el=document.createElement('button');el.className='action';el.textContent=text;el.onclick=callback;byId('buttons').append(el);}
function check(){
 const {a,b,c}=state();
 const valid=mode==='a'?a<0&&a>-1:mode==='b'?b===-4:c===-2;
 if(!valid){feedback(mode==='a'?(a>=0?'Нужен отрицательный a. Попробуй значение между −1 и 0.':'Ветви идут вниз. Приблизь a к нулю, чтобы расширить параболу.'):mode==='b'?'Подставь x = 2 в равенство 2 = −b/2. Какой знак получится у b?':'При x = 0 остаётся только c. Поставь его на отметку −2.');return;}
 complete.add(mode);CourseProgress.mark('arch',mode);courseFooter();tabs();feedback(mode==='a'?'Верно. При −1 < a < 0 ветви идут вниз, а парабола шире исходной.':mode==='b'?'Верно. При b = −4 вершина находится в точке (2; −4).':'Верно. Каждая точка параболы опустилась на две единицы.',true);
 byId('buttons').replaceChildren();action(mode==='c'?'Открыть мастерскую →':'Следующий опыт →',()=>select(order[order.indexOf(mode)+1]));
}
function challenge(){
 feedback('');byId('buttons').replaceChildren();
 if(mode!=='lab'){byId('challengeTitle').textContent='Проверь на графике';byId('challengeText').textContent=config[mode].task;action('Проверить →',check);return;}
 byId('challengeTitle').textContent=mission==='boat'?'Пройдёт ли катер?':'Инженерная задача';
 byId('challengeText').textContent=mission==='boat'?'Катер шириной 4 м и высотой 3,2 м идёт по центру. Проверь верхние углы при x = 2 и x = 6.':mission==='bridge'?'Построй арку с опорами (0; 0), (8; 0) и вершиной (4; 4).':'Примени три коэффициента, чтобы рассчитать мост и проверить габариты катера.';
 if(!mission)action('Построить мост →',()=>{mission='bridge';challenge();graph();});
 else if(mission==='bridge')action('Проверить арку →',()=>{const {a,b,c}=state();if(c!==0)feedback('Левая опора в начале координат. Проверь c.');else if(a>=0||b!==-8*a)feedback('Для арки ветви должны идти вниз, а ось −b/(2a) должна проходить через x = 4.');else if(a!==-.25)feedback('Опоры совпали. Подставь вершину в равенство 4 = 16a + 4b.');else{mission='boat';challenge();graph();feedback('Арка рассчитана. Проверь, хватит ли места у краёв катера.',true);}});
 else {action('Пройдёт',()=>feedback('Над краями всего 3 м, хотя в центре есть 4 м. Сравни 3 с высотой катера.'));action('Заденет арку',()=>{complete.add('lab');CourseProgress.mark('arch','lab');courseFooter();mission='';tabs();challenge();graph();feedback('Верно! Над краями не хватает 20 см. Теперь можно продолжить эксперименты.',true);});}
}
function render(){
 tabs();const lab=mode==='lab', active=lab?keys:[mode],spec=config[mode];
 byId('kicker').textContent=lab?'СВОБОДНЫЙ ОПЫТ':'ОПЫТ '+(order.indexOf(mode)+1)+' ИЗ 3';
 byId('title').textContent=spec.title;byId('explain').textContent=spec.explain;
 document.querySelectorAll('[data-term]').forEach(el=>{const key=el.dataset.term;el.className=active.includes(key)?'on':'';el.style.setProperty('--tint',config[key].tint);});
 byId('sliders').innerHTML=active.map(k=>{const t=config[k];return '<label class="slider" style="--tint:'+t.tint+'"><span class="shead"><span>'+k+' · '+t.label+'</span><output id="out-'+k+'">'+format(state()[k])+'</output></span><input type="range" id="slider-'+k+'" aria-label="Коэффициент '+k+'" min="'+t.min+'" max="'+t.max+'" step="'+t.step+'" value="'+state()[k]+'"><span class="limits"><span>'+format(t.min)+'</span><span>'+format(t.max)+'</span></span></label>';}).join('');
 active.forEach(k=>{byId('slider-'+k).oninput=e=>{state()[k]=Number(e.target.value);byId('out-'+k).value=format(state()[k]);if(mode==='lab'&&mission==='boat')mission='bridge';challenge();graph();};});
 challenge();graph();
}
function select(key){mode=key;render();}
byId('tabs').onclick=e=>{const tab=e.target.closest('[data-key]');if(tab)select(tab.dataset.key);};
byId('reset').onclick=()=>{values[mode]=base();if(mission==='boat'&&mode==='lab')mission='bridge';render();};
byId('compare').onchange=graph;illustrate();mode=order.find(key=>!complete.has(key)) || 'a';render();courseFooter();


function courseFooter(){
 const n=CourseProgress.count('arch');
 byId('courseEnd').innerHTML='<span>'+ (n===4?'Урок пройден. ':'')+'Выполнено заданий: '+n+' из 4</span><a href="index.html">К карте курса →</a>';
}
