const canvas=document.getElementById('world'),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
const W=960,H=540;let mode='dusk',raining=false,soundOn=false,frame=0,raf=0;let soundCtx,noiseNode,soundGain;
const palettes={dusk:{sky:['#d9a3ab','#af92ac','#726e96','#515772'],far:'#615d78',near:'#363f5b',lit:'#f0ccab',wall:'#866b77',brick:'#755763',floor:'#4d4352',glass:'#d1aac0'},night:{sky:['#363c60','#343652','#262d47','#1f2941'],far:'#2d3854',near:'#1e2d45',lit:'#eec6a0',wall:'#666078',brick:'#58516c',floor:'#3f394b',glass:'#7986a2'}};
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.floor(x),Math.floor(y),Math.ceil(w),Math.ceil(h))}function line(x1,y1,x2,y2,c,w=1){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}function hash(n){let s=Math.sin(n*172.16+5.23)*43758.5453;return s-Math.floor(s)}
const buildings=Array.from({length:45},(_,i)=>({x:i*28-28,w:24+Math.floor(hash(i+17)*25),h:45+Math.floor(hash(i+20)*115),roof:hash(i+39)}));const drops=Array.from({length:140},(_,i)=>({x:hash(i+190)*960,y:hash(i+390)*540,s:2+hash(i+88)*5}));
function draw(){frame++;const p=palettes[mode];let grad=ctx.createLinearGradient(0,0,0,315);p.sky.forEach((c,i)=>grad.addColorStop(i/(p.sky.length-1),c));ctx.fillStyle=grad;ctx.fillRect(0,0,W,360);
// Weathered skyline and tall water towers
rect(0,267,960,75,p.far);for(let i=0;i<buildings.length;i++){let b=buildings[i];rect(b.x,315-b.h,b.w,b.h+30,p.far);if(i%7===0){rect(b.x+5,304-b.h,13,10,p.far);rect(b.x+8,296-b.h,2,11,p.far)}for(let j=0;j<4;j++)for(let k=0;k<4;k++)if(hash(i*53+j*8+k)>.62)rect(b.x+4+j*6,321-b.h+k*13,3,5,mode==='night'?'#d4ae94':'#d6a2a0')}
for(let i=0;i<18;i++){let x=i*61-8,h=65+hash(i+50)*100;rect(x,335-h,50,120,p.near);rect(x+4,335-h-4,40,4,'#32374e');for(let r=0;r<8;r++)for(let c=0;c<4;c++){let on=hash(i*100+r*5+c)>.48;rect(x+7+c*10,340-h+r*14,5,7,on?p.lit:'#48506a')}}
// bridge and river slice
rect(0,325,960,25,'#343c53');for(let i=0;i<90;i++){rect(i*13+hash(i)*7,338+hash(i+15)*11,4,1,mode==='night'?'#a998a0':'#b19ba9')}
// side industrial walls
rect(0,0,131,392,p.wall);rect(836,0,124,392,p.wall);rect(0,0,960,60,p.wall);
for(let y=0;y<395;y+=19){for(let x=(Math.floor(y/19)%2)*-18;x<131;x+=38)line(x,y,x+35,y,'#a2828c77');for(let x=838+((Math.floor(y/19)%2)*-18);x<960;x+=38)line(x,y,x+35,y,'#a2828c77')}
// 3 giant warehouse panes
rect(117,36,738,343,'#2b3045');rect(130,52,712,298,p.glass);ctx.globalAlpha=.18;rect(130,52,712,298,'#e0bbbc');ctx.globalAlpha=1;
// transparently render skyline again in window limited with clip
ctx.save();ctx.beginPath();ctx.rect(137,57,698,284);ctx.clip();ctx.fillStyle=grad;ctx.fillRect(137,57,700,285);for(let i=0;i<buildings.length;i++){let b=buildings[i],x=137+b.x*.74;rect(x,330-b.h*1.23,b.w*.8,b.h*1.23+12,p.far);for(let j=0;j<3;j++)for(let k=0;k<6;k++)if(hash(i*32+j*8+k)>.57)rect(x+4+j*7,333-b.h*1.23+k*11,3,5,p.lit)}for(let i=0;i<24;i++){let x=134+i*35,h=35+hash(i+70)*93;rect(x,343-h,29,h,p.near);for(let r=0;r<7;r++)for(let c=0;c<3;c++)if(hash(i*19+r*3+c)>.52)rect(x+5+c*8,345-h+r*12,4,5,p.lit)}if(mode==='night'){rect(698,90,22,22,'#e5d4c2');rect(704,86,15,10,'#e5d4c2')}ctx.restore();
for(let i=0;i<4;i++){rect(132+i*174,45,11,317,'#494356');rect(136+i*174,48,3,311,'#967b89')}rect(827,45,13,318,'#494356');rect(128,182,711,9,'#484455');rect(128,349,711,17,'#403b4b');rect(123,40,721,12,'#a18a8f');rect(123,46,721,3,'#e1b3ae');
// sunset glows on glass
ctx.globalAlpha=mode==='dusk'?.12:.035;rect(158,65,8,257,'#fff2d6');rect(525,70,6,247,'#fff2d6');ctx.globalAlpha=1;
// rain outside glass
if(raining){for(const d of drops){let xx=137+((d.x+frame*(.38+d.s*.15))%698),yy=57+((d.y+frame*(.8+d.s*.24))%284);rect(xx,yy,1,d.s+2,'#d3d5df9a')}}
// timber floor perspective
ctx.fillStyle=p.floor;ctx.beginPath();ctx.moveTo(0,359);ctx.lineTo(960,359);ctx.lineTo(960,540);ctx.lineTo(0,540);ctx.fill();for(let i=0;i<15;i++){line(480,365,i*100-210,540,'#6c5a66',2)}for(let y=385;y<=540;y+=(y-345)/5){line(0,y,960,y,'#342f42',2)}
// ceiling beams + exposed hanging pendants
rect(0,0,960,21,'#4e424e');rect(0,19,960,8,'#af888c');rect(65,20,18,343,'#493e4d');rect(893,21,18,350,'#493e4d');for(let xx of [253,753]){rect(xx,20,3,87,'#292e3d');rect(xx-12,102,27,9,'#403542');rect(xx-8,111,19,5,'#eac8a5');ctx.fillStyle='#f0be87';ctx.globalAlpha=.08;ctx.beginPath();ctx.ellipse(xx,165,47,45,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
// artwork on wall
rect(21,106,73,95,'#3d364a');rect(26,111,63,85,'#d2b2a9');rect(31,115,53,75,'#5f637e');rect(37,124,41,49,'#b98d9b');rect(42,132,30,20,'#e6baa6');rect(42,162,30,18,'#484b63');
// shelf + books vinyl
rect(22,264,100,9,'#3c3544');for(let i=0;i<11;i++)rect(27+i*8,226+hash(i)*9,6,38-hash(i)*9,['#b07b80','#c4a29b','#596375','#d0b49e'][i%4]);
// plant right
rect(862,414,56,11,'#342e40');rect(874,390,34,26,'#a47b78');rect(878,404,27,11,'#795d66');for(let i=0;i<14;i++){let x=891+(hash(i+2)-.5)*78,y=393-hash(i+43)*80;line(891,397,x,y,'#728773',3);rect(x-5,y-4,12,7,i%2?'#759282':'#92a28b')}
// sofa behind table
rect(570,371,274,45,'#9c7b82');rect(566,407,287,78,'#ad8690');rect(580,415,120,42,'#c4979a');rect(710,415,128,42,'#ae808b');rect(553,403,32,79,'#8b6b77');rect(824,403,34,79,'#876876');rect(589,480,13,25,'#332f3c');rect(818,480,13,25,'#332f3c');rect(719,398,54,25,'#d4a7a5');rect(755,401,52,27,'#7b6e8a');
// rug
rect(341,477,377,54,'#735e72');for(let i=0;i<4;i++)rect(353+i*95,485,51,2,'#b58d95');rect(354,525,346,4,'#b59291');
// coffee table and cup
rect(441,466,143,13,'#9c7a72');rect(457,478,10,49,'#5d4b50');rect(562,478,10,49,'#5d4b50');rect(489,456,21,11,'#dfc6ac');rect(507,457,5,5,'#d9b7a3');rect(492,451,15,5,'#6d535b');
// large desk and chair left
rect(154,402,281,17,'#8e716a');rect(166,417,18,105,'#58474c');rect(405,417,17,101,'#58474c');rect(179,427,226,8,'#664e53');rect(220,381,66,20,'#34384d');rect(229,388,44,9,'#71839a');rect(241,399,9,6,'#55576b');rect(203,404,90,5,'#d4b4a5');rect(318,386,35,18,'#ddd0bc');rect(354,378,19,26,'#b090a1');rect(376,397,28,9,'#e3c9a5');rect(304,441,63,65,'#514858');rect(289,485,88,14,'#675568');rect(310,499,10,26,'#403645');rect(359,499,10,26,'#403645');
// tiny paper calendar
rect(91,382,42,48,'#d3bfaf');rect(91,382,42,8,'#b68a8e');for(let j=0;j<3;j++)for(let i=0;i<4;i++)rect(99+i*8,396+j*9,3,3,'#897d82');
// radio low cabinet
rect(53,430,109,67,'#68535a');rect(57,424,100,10,'#9f7e71');rect(71,437,70,47,'#313445');rect(80,443,48,7,'#968d86');for(let i=0;i<6;i++)rect(80+i*8,459,4,15,'#8b7b85');rect(60,498,9,18,'#443a46');rect(146,498,9,18,'#443a46');if(soundOn&&frame%64<32)rect(124,439,6,6,'#e4b9ae');
// string fairy lights
for(let i=0;i<17;i++){let x=135+i*44,y=66+Math.sin(i*.42)*17;rect(x,y,3,7,'#524c61');rect(x,y+8,5,5,i%3?'#efd3a9':'#f1bcc0');}if(frame%160<80)rect(517,73,5,5,'#ffdcac');
// film grain dots
for(let i=0;i<190;i++){let x=hash(i+frame%17*14)*960,y=hash(i+460+frame%19)*540;ctx.globalAlpha=.035;rect(x,y,2,2,'#f5d4ce')}ctx.globalAlpha=1;
raf=requestAnimationFrame(draw)}draw();
const $=s=>document.querySelector(s);let toastTimeout;function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('on'),2500)}
function updateUI(){document.querySelectorAll('.ctl').forEach(x=>x.classList.remove('active'));$('#'+mode).classList.add('active');$('#rain').classList.toggle('active',raining);$('#rain').textContent='☂ Lluvia: '+(raining?'sí':'no');$('#sound').classList.toggle('active',soundOn);$('#sound').textContent='♫ Sonido: '+(soundOn?'sí':'no');$('#mood').textContent=mode==='dusk'?'The city feels softer from up here.':'Somewhere between midnight and forever.';localStorage.setItem('manhattan_pref',JSON.stringify({mode,raining}))}
try{const p=JSON.parse(localStorage.getItem('manhattan_pref'));if(p){mode=p.mode==='night'?'night':'dusk';raining=!!p.raining}}catch{}updateUI();
$('#dusk').onclick=()=>{mode='dusk';updateUI()};$('#night').onclick=()=>{mode='night';updateUI()};$('#rain').onclick=()=>{raining=!raining;updateUI();toast(raining?'Empieza a llover sobre la ciudad.':'La lluvia se detiene poco a poco.')};
function audioStart(){let AC=window.AudioContext||window.webkitAudioContext;if(!AC){toast('Tu navegador no admite sonido ambiental.');return false}soundCtx??=new AC();soundCtx.resume();const length=soundCtx.sampleRate*2,b=soundCtx.createBuffer(1,length,soundCtx.sampleRate),data=b.getChannelData(0);let last=0;for(let i=0;i<length;i++){let white=Math.random()*2-1;last=(last+.022*white)/1.022;data[i]=last*2.8}noiseNode=soundCtx.createBufferSource();noiseNode.buffer=b;noiseNode.loop=true;let lp=soundCtx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=450;soundGain=soundCtx.createGain();soundGain.gain.value=.085;noiseNode.connect(lp);lp.connect(soundGain);soundGain.connect(soundCtx.destination);noiseNode.start();return true}
function audioStop(){if(noiseNode){try{noiseNode.stop()}catch{}noiseNode.disconnect();noiseNode=null}}
function toggleSound(){if(soundOn){audioStop();soundOn=false}else{soundOn=audioStart()}updateUI();toast(soundOn?'La ciudad suena a lo lejos…':'Vuelve el silencio.')};$('#sound').onclick=toggleSound;
const modal=$('#modalwrap');function openModal(title,html){$('#modtitle').textContent=title;$('#modbody').innerHTML=html;modal.classList.add('open');$('#close').focus()}function closeModal(){modal.classList.remove('open')}$('#close').onclick=closeModal;modal.onclick=e=>{if(e.target===modal)closeModal()};document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
const snippets={window:['La ventana','<p>Abajo, los taxis dibujan líneas amarillas en la avenida. Hay un apartamento enfrente con la luz encendida. En algún lugar, alguien está escuchando su canción favorita por primera vez.</p><p>La ciudad sigue viviendo aunque tú no hagas absolutamente nada. Y eso es maravilloso.</p>'],sofa:['El sofá junto al ventanal','<p>Te hundes en los cojines. La taza está tibia, las luces de los edificios parecen estrellas domesticadas y tienes toda la noche por delante.</p><p>Hoy no hay nada que demostrar. Este es tu lugar.</p>'],plant:['La planta del rincón','<p>No sabes bien cómo se llama, pero lleva contigo desde que llegaste al loft. Crece despacito, igual que algunas cosas bonitas.</p><p>Quizá mañana le cambies la maceta. Hoy está bien así.</p>']};
function journal(){const d=new Date(),key='manhattan_journal_'+d.toISOString().slice(0,10),entry=localStorage.getItem(key)||'';openModal('Querido Manhattan…',`<p>Un pequeño diario privado, como escribir al borde de la ventana. Se guarda solo en este navegador, en este dispositivo.</p><textarea class="journal" id="entry" placeholder="Hoy, desde mi rincón de Manhattan…"></textarea><div class="row2"><span class="saved" id="savedtxt">${d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})} · sin sincronización</span><button class="save" id="saveentry">Guardar página ♡</button></div>`);$('#entry').value=entry;$('#saveentry').onclick=()=>{try{localStorage.setItem(key,$('#entry').value);$('#savedtxt').textContent='Guardado en este dispositivo ♡';toast('Una página más en tu vida de película.')}catch{toast('No se ha podido guardar en este navegador.')}}}
document.querySelectorAll('.hotspot').forEach(b=>b.onclick=()=>{let id=b.dataset.id;if(id==='desk')journal();else if(id==='radio')toggleSound();else{openModal(...snippets[id]);$('#sceneNote').textContent={window:'La ciudad te queda bien.',sofa:'Aquí no hay ningún sitio al que llegar.',plant:'Las cosas bonitas también tardan en crecer.'}[id]}});
function time(){let now=new Date();let ny=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'numeric',minute:'2-digit',hour12:true}).format(now);$('#clock').innerHTML=ny+'<small>NEW YORK CITY · YOUR OWN LITTLE 1996</small>'}time();setInterval(time,60000);
if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
