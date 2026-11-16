const trialKey='grafika.bridge.trials.v1';
let recordedTrials=[];
try{const raw=JSON.parse(localStorage.getItem(trialKey)||'[]');if(Array.isArray(raw))recordedTrials=raw.filter(t=>Number.isFinite(t.width)&&Number.isFinite(t.height)&&typeof t.guess==='boolean').slice(0,5);}catch{}
function clearance(width,height){return 4-(width/2)**2/4-height;}
function bridgeDiagram(width,height,reveal){
 const X=x=>55+53*x,Y=y=>267-53*y,start=4-width/2,end=4+width/2,edge=4-width*width/16;
 const coord=(x,y)=>X(x)+' '+Y(y);
 const label=(x,y,txt,anchor='middle')=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" fill="#303e47" font-size="13" font-family="Arial,sans-serif">'+txt+'</text>';
 const line=(x,y,xx,yy,attrs)=>'<path d="M'+coord(x,y)+' L'+coord(xx,yy)+'" '+attrs+'/>';
 let art='<defs><pattern id="paper" width="26.5" height="26.5" x="55" y="267" patternUnits="userSpaceOnUse"><path d="M26.5 0H0V26.5" fill="none" stroke="#c5d6d7" stroke-width=".7"/></pattern></defs><rect width="544" height="330" fill="#f7fbf7"/><rect width="544" height="330" fill="url(#paper)"/><path d="M0 270q16-5 32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0v60H0Z" fill="#c1e7e7"/>';
 art+='<path d="M'+coord(-.33,0)+'Q'+coord(4,9.05)+' '+coord(8.33,0)+'L'+coord(8,0)+'Q'+coord(4,8)+' '+coord(0,0)+'Z" fill="#b1aaed" stroke="#444878" stroke-width="2"/>';
 for(let i=1;i<20;i++){const t=i/20,x=8*t;art+=line(x,4-(x-4)**2/4,-.33+8.66*t,18.1*t*(1-t),'stroke="#666095" stroke-width="1"');}
 art+=line(4,0,4,4,'stroke="#647775" stroke-dasharray="4 5"')+label(X(4),Y(4)-32,'вершина (4; 4)');
 const hull=Math.min(.35,height/4),cabin=Math.min(.24,width/10);
 art+='<path d="M'+coord(start,hull)+'L'+coord(end,hull)+' '+coord(end-.15,0)+' '+coord(start+.15,0)+'Z" fill="#e27b4d" stroke="#77462d" stroke-width="1.5"/>';
 art+='<path d="M'+coord(start,hull)+'V'+Y(height)+'H'+X(end)+'V'+Y(hull)+'Z" fill="#fff2d9" stroke="#77462d" stroke-width="1.5"/>';
 for(let i=0;i<3;i++){const windowW=(width-2*cabin)/3;art+='<rect x="'+X(start+cabin+i*windowW)+'" y="'+Y(height-.12)+'" width="'+Math.max(1,windowW*53-5)+'" height="'+Math.max(4,(height-hull)*30)+'" rx="3" fill="#a6c5ce"/>';}
 art+=label(272,302,'Ширина катера '+fmt(width)+' м');
 if(reveal){for(const x of [start,end]){
 art+=line(x,height,x,edge,'stroke="'+(height>edge?'#bb3423':'#20765c')+'" stroke-width="4"')+'<circle cx="'+X(x)+'" cy="'+Y(edge)+'" r="4" fill="#253f40"/>';}
 art+=label(272,323,'Высота арки над краями '+fmt(Math.round(edge*1000)/1000)+' м');}
 return art;
}
function testBench(){
 document.title='Испытание моста — Графика';
 course.innerHTML='<div class="viewhead"><small>ИНЖЕНЕРНАЯ ЛАБОРАТОРИЯ</small><h1>Пройдёт ли катер?</h1><p>В центре арка высотой 4 м. Подбери габариты катера и проверь зазор над двумя верхними углами.</p></div><section class="bench"><div class="test-canvas"><div class="sheetbar"><strong>Поперечный разрез</strong><span>y = −¼(x − 4)² + 4</span></div><svg viewBox="0 0 544 330" id="bridgeDiagram" role="img" aria-label="Мост и катер в поперечном разрезе"></svg></div><div class="test-controls"><h2>Параметры катера</h2><div id="dimensions"></div><strong>Катер пройдёт с зазором?</strong><div class="predictions"><button data-guess="yes">Да, пройдёт</button><button data-guess="no">Нет, заденет</button></div><p id="testResult" role="status">Выбери прогноз, чтобы измерить зазор.</p></div></section><section class="triallog"><h2>Журнал испытаний</h2><div id="trialRows"></div></section>';
 const dimensions=document.getElementById('dimensions');
 dimensions.innerHTML=[['width','Ширина',2,6,.5,4],['height','Высота',1,4,.1,3.2]].map(([id,t,min,max,step,val])=>'<label class="slider"><span class="shead">'+t+'<output id="value-'+id+'"></output></span><input id="boat-'+id+'" aria-label="'+t+' катера" type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'"></label>').join('');
 const width=document.getElementById('boat-width'),height=document.getElementById('boat-height'),result=document.getElementById('testResult'),svg=document.getElementById('bridgeDiagram');
 function render(reveal){document.getElementById('value-width').textContent=fmt(+width.value)+' м';document.getElementById('value-height').textContent=fmt(+height.value)+' м';svg.innerHTML=bridgeDiagram(+width.value,+height.value,reveal);}
 function recent(){document.getElementById('trialRows').innerHTML=recordedTrials.length?recordedTrials.map(t=>{const gap=clearance(t.width,t.height);return '<div><b>'+fmt(t.width)+' × '+fmt(t.height)+' м</b><span>'+(Math.abs(gap)<1e-8?'Касание':gap>0?'Проходит':'Заденет')+'</span><span>'+((gap>1e-8)===t.guess?'✓ Верный прогноз':'Ошибка прогноза')+'</span></div>';}).join(''):'<p>Здесь появятся результаты пяти последних проверок.</p>';}
 const buttons=[...course.querySelectorAll('[data-guess]')];
 dimensions.oninput=()=>{render(false);buttons.forEach(b=>b.disabled=false);result.textContent='Размеры изменились. Сделай новый прогноз.';};
 buttons.forEach(btn=>btn.onclick=()=>{
 const w=+width.value,h=+height.value,gap=clearance(w,h),guess=btn.dataset.guess==='yes',pass=gap>1e-8;
 result.textContent=(pass===guess?'Верно. ':'Проверь верхние углы. ')+(Math.abs(gap)<1e-8?'Верхние углы касаются арки. Зазор равен нулю.':gap>0?'Запас высоты над краями — '+fmt(+((gap*100).toFixed(2)))+' см.':'Катеру не хватает '+fmt(+((-gap*100).toFixed(2)))+' см высоты у краёв.')+' Высота арки у края равна 4 − (ширина / 2)² / 4.';
 recordedTrials.unshift({width:w,height:h,guess});recordedTrials=recordedTrials.slice(0,5);
 try{localStorage.setItem(trialKey,JSON.stringify(recordedTrials));}catch{}
 render(true);recent();buttons.forEach(b=>b.disabled=true);
 });
 render(false);recent();
}
