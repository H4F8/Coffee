(function(){
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt=n=>Math.round(n).toLocaleString('ru-RU');
const money=n=>fmt(n)+' ₽';
const pad=n=>String(n).padStart(2,'0');

/* ---------- ДАННЫЕ ---------- */
const MENU=[
 {id:'syrniki',cat:'breakfast',name:'Сырники со сметаной',desc:'Из фермерского творога, с малиновым соусом',weight:'180 г',price:340,seed:'syrniki-pancakes',badge:'Хит'},
 {id:'porridge',cat:'breakfast',name:'Овсянка с грушей и мёдом',desc:'Томим на молоке, гречишный мёд и пекан',weight:'250 г',price:260,seed:'oatmeal-pear-honey',badge:'🌱 Веган'},
 {id:'shakshuka',cat:'breakfast',name:'Шакшука с питой',desc:'Томаты, сладкий перец, яйца и тёплая пита',weight:'300 г',price:390,seed:'shakshuka-eggs',badge:'🌶 Остро'},
 {id:'salmon-croissant',cat:'breakfast',name:'Круассан с лососем',desc:'Крем-чиз, слабосолёный лосось, каперсы, укроп',weight:'220 г',price:450,seed:'salmon-croissant',badge:'Новинка'},
 {id:'pumpkin-soup',cat:'soups',name:'Тыквенный крем-суп',desc:'Печёная тыква, сливки, семечки, чипс из бекона',weight:'300 мл',price:320,seed:'pumpkin-cream-soup',badge:'Хит'},
 {id:'tomato-soup',cat:'soups',name:'Томатный суп с базиликом',desc:'Печёные томаты, пармезан, гренки на оливковом масле',weight:'280 мл',price:330,seed:'tomato-basil-soup'},
 {id:'noodle-soup',cat:'soups',name:'Куриный с домашней лапшой',desc:'Как у бабушки: прозрачный бульон, лапша ручной работы',weight:'350 мл',price:310,seed:'chicken-noodle-soup'},
 {id:'burger',cat:'hot',name:'Бургер «Полдень»',desc:'Мраморная говядина, чеддер, карамельный лук, фри',weight:'420 г',price:440,old:520,seed:'craft-burger-fries',badge:'Хит'},
 {id:'mushroom-pasta',cat:'hot',name:'Паста с грибами и трюфелем',desc:'Тальятелле, белые грибы, трюфельное масло, пармезан',weight:'320 г',price:480,seed:'truffle-mushroom-pasta'},
 {id:'teriyaki',cat:'hot',name:'Курица терияки с рисом',desc:'Глянцевый соус, кунжут, зелёный лук, рис жасмин',weight:'340 г',price:460,seed:'chicken-teriyaki-rice'},
 {id:'grechotto',cat:'hot',name:'Гречотто с белыми грибами',desc:'Нежная гречка, грибной крем и хрустящий лук',weight:'300 г',price:420,seed:'buckwheat-risotto',badge:'Новинка'},
 {id:'medovik',cat:'desserts',name:'Медовик по-домашнему',desc:'12 тонких коржей, сметанный крем, гречишный мёд',weight:'140 г',price:280,seed:'honey-cake-medovik',badge:'Хит'},
 {id:'cheesecake',cat:'desserts',name:'Чизкейк манго-маракуйя',desc:'Песочная основа, сливочный сыр, тропическое кули',weight:'130 г',price:310,seed:'mango-cheesecake'},
 {id:'fondant',cat:'desserts',name:'Шоколадный фондан',desc:'Жидкое сердце, пломбир и свежая малина',weight:'160 г',price:270,old:330,seed:'chocolate-fondant'},
 {id:'eclair',cat:'desserts',name:'Эклер с фисташкой',desc:'Заварное тесто, фисташковый крем, малиновый гель',weight:'90 г',price:230,seed:'pistachio-eclair'},
 {id:'croissant',cat:'bakery',name:'Круассан сливочный',desc:'Слоим тесто 72 часа, печём каждое утро',weight:'85 г',price:160,seed:'butter-croissant'},
 {id:'cinnamon',cat:'bakery',name:'Улитка с корицей',desc:'С глазурью из крем-чиза — уходит первой',weight:'110 г',price:170,seed:'cinnamon-roll-glaze',badge:'Хит'},
 {id:'apple-pie',cat:'bakery',name:'Пирожок с яблоком',desc:'Слоёное тесто и карамельные яблоки с корицей',weight:'120 г',price:120,seed:'apple-hand-pie'},
 {id:'filter',cat:'drinks',name:'Фильтр-кофе',desc:'Собственная обжарка, зерно недели — Эфиопия',weight:'250 мл',price:150,seed:'filter-coffee-cup'},
 {id:'cappuccino',cat:'drinks',name:'Капучино',desc:'На молоке 3,2% или на овсяном (+40 ₽)',weight:'300 мл',price:220,seed:'cappuccino-latte-art'},
 {id:'pumpkin-latte',cat:'drinks',name:'Тыквенный латте',desc:'Сезонный, с мускатным орехом и пенкой',weight:'350 мл',price:290,old:360,seed:'pumpkin-spice-latte',badge:'Сезон'},
 {id:'cocoa',cat:'drinks',name:'Какао с маршмеллоу',desc:'Бельгийский шоколад и домашние маршмеллоу',weight:'300 мл',price:240,seed:'cocoa-marshmallow-mug'},
 {id:'lemonade',cat:'drinks',name:'Лимонад облепиха-имбирь',desc:'Согревающий, с мёдом и розмарином',weight:'400 мл',price:260,seed:'sea-buckthorn-lemonade'},
 {id:'duck',cat:'hot',name:'Утиная грудка с вишнёвым соусом',desc:'Пюре из пастернака, печёная свёкла, демиглас',weight:'340 г',price:590,old:740,seed:'duck-breast-dinner',special:true}
];
const CATS=[
 {id:'all',name:'Всё меню',icon:'🍽️'},
 {id:'breakfast',name:'Завтраки',icon:'🍳'},
 {id:'soups',name:'Супы',icon:'🥣'},
 {id:'hot',name:'Горячее',icon:'🍝'},
 {id:'desserts',name:'Десерты',icon:'🍰'},
 {id:'bakery',name:'Выпечка',icon:'🥐'},
 {id:'drinks',name:'Напитки',icon:'☕️'}
];
const CATALOG=Object.fromEntries(MENU.map(m=>[m.id,m]));
const PROMOS={'ПОЛДЕНЬ10':{p:10,min:500},'СОЛНЦЕ15':{p:15,min:1200}};
const FREE_FROM=1500, DLV_FEE=150;
const HOURS=[[9,23.5],[8,23],[8,23],[8,23],[8,23],[8,23],[9,23.5]]; // 0=Вс

/* ---------- СОСТОЯНИЕ ---------- */
let state={cart:{},promo:null};
try{const s=JSON.parse(localStorage.getItem('polden-cart'));if(s&&s.cart)state=s;}catch(e){}
let favs=new Set(JSON.parse(localStorage.getItem('polden-favs')||'[]'));
const save=()=>{localStorage.setItem('polden-cart',JSON.stringify(state));localStorage.setItem('polden-favs',JSON.stringify([...favs]));};
let curCat='all', query='';

/* ---------- ТОСТЫ ---------- */
function toast(msg,type='ok'){
  const t=document.createElement('div');t.className='toast'+(type==='err'?' err':'');t.textContent=msg;
  $('#toasts').appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),420)},2800);
}

/* ---------- МЕНЮ ---------- */
function renderRail(){
  const box=$('#railCats');
  box.innerHTML=CATS.map(c=>{
    const n=c.id==='all'?MENU.filter(m=>!m.special).length:MENU.filter(m=>m.cat===c.id&&!m.special).length;
    return `<button class="cat-btn${c.id===curCat?' active':''}" data-cat="${c.id}"><span>${c.icon}</span>${c.name}<span class="n">${n}</span></button>`;
  }).join('');
}
$('#railCats').addEventListener('click',e=>{
  const b=e.target.closest('[data-cat]');if(!b)return;
  curCat=b.dataset.cat;renderRail();renderMenu(true);
});

function cardHTML(it,i){
  const q=state.cart[it.id]||0;
  const sale=it.old?Math.round((1-it.price/it.old)*100):0;
  const badge=sale?`<span class="badge sale">−${sale}%</span>`:it.badge?`<span class="badge">${it.badge}</span>`:'';
  const ctrl=q>0
    ?`<div class="stepper"><button data-dec="${it.id}" aria-label="Меньше">−</button><b>${q}</b><button data-inc="${it.id}" aria-label="Больше">+</button></div>`
    :`<button class="add-btn" data-add="${it.id}" aria-label="Добавить ${it.name}">+</button>`;
  return `<article class="dish" style="--d:${Math.min(i*45,420)}ms">
    <div class="dish-img">
      <img src="https://picsum.photos/seed/${it.seed}/640/480" alt="${it.name}" loading="lazy">
      ${badge}
      <button class="fav${favs.has(it.id)?' on':''}" data-fav="${it.id}" aria-label="В избранное">♥</button>
    </div>
    <div class="dish-body">
      <h3>${it.name}</h3>
      <p class="desc">${it.desc}</p>
      <span class="dish-meta">${it.weight}</span>
      <div class="dish-foot">
        <div><span class="price">${money(it.price)}</span>${it.old?`<span class="old">${money(it.old)}</span>`:''}</div>
        ${ctrl}
      </div>
    </div>
  </article>`;
}
function renderMenu(animate){
  const grid=$('#menuGrid');
  grid.classList.toggle('anim',!!animate&&!RM);
  const list=MENU.filter(m=>!m.special)
    .filter(m=>curCat==='all'||m.cat===curCat)
    .filter(m=>{if(!query)return true;const q=query.toLowerCase();return m.name.toLowerCase().includes(q)||m.desc.toLowerCase().includes(q);});
  grid.innerHTML=list.length?list.map(cardHTML).join(''):`<div class="no-res">Ничего не нашлось… попробуйте «сырники» 🤷</div>`;
  $('#menuCount').textContent=(curCat==='all'?'Всё меню':CATS.find(c=>c.id===curCat).name)+` · ${list.length} ${plural(list.length,'позиция','позиции','позиций')}`;
}
function plural(n,a,b,c){const m=n%100;if(m>=11&&m<=14)return c;switch(n%10){case 1:return a;case 2:case 3:case 4:return b;default:return c;}}
$('#searchInput').addEventListener('input',e=>{query=e.target.value.trim();renderMenu(true);});

/* ---------- ЛЕТАЮЩАЯ КАРТИНКА ---------- */
function fly(srcEl,id){
  if(RM||!srcEl)return;
  const cardImg=srcEl.closest('.dish')?.querySelector('img')||srcEl.closest('.special-img')||null;
  const from=(cardImg||srcEl).getBoundingClientRect();
  const to=$('#cartBtn').getBoundingClientRect();
  const el=document.createElement('img');
  el.src=cardImg?cardImg.src:`https://picsum.photos/seed/${CATALOG[id].seed}/120/120`;
  Object.assign(el.style,{position:'fixed',left:from.left+'px',top:from.top+'px',width:'70px',height:'70px',
    objectFit:'cover',borderRadius:'50%',border:'2px solid #2A2118',zIndex:200,pointerEvents:'none',
    transition:'transform .7s cubic-bezier(.3,.7,.3,1), opacity .7s'});
  document.body.appendChild(el);
  requestAnimationFrame(()=>{
    el.style.transform=`translate(${to.left+to.width/2-(from.left+35)}px,${to.top+to.height/2-(from.top+35)}px) scale(.12)`;
    el.style.opacity='.4';
  });
  setTimeout(()=>el.remove(),720);
}

/* ---------- КОРЗИНА ---------- */
function addToCart(id,src){
  const first=!state.cart[id];
  state.cart[id]=(state.cart[id]||0)+1;
  save();syncAll(false);fly(src,id);
  if(first)toast(`«${CATALOG[id].name}» — в корзине 🧺`);
}
function changeQty(id,d){
  const q=(state.cart[id]||0)+d;
  if(q<=0)delete state.cart[id];else state.cart[id]=q;
  save();syncAll(false);
}
function totals(view='delivery'){
  let sub=0,saleAmt=0,count=0;
  for(const [id,q] of Object.entries(state.cart)){
    const it=CATALOG[id];sub+=it.price*q;count+=q;
    if(it.old)saleAmt+=(it.old-it.price)*q;
  }
  const pr=state.promo?PROMOS[state.promo]:null;
  if(pr&&sub<pr.min){state.promo=null;save();toast('Промокод снят: сумма меньше условия','err');}
  const p=state.promo?PROMOS[state.promo]:null;
  const disc=p?Math.round(sub*p.p/100):0;
  const dlv=view==='delivery'?((sub-disc)>=FREE_FROM?0:DLV_FEE):0;
  return {sub,saleAmt,disc,dlv,total:sub-disc+dlv,count};
}
function renderCart(){
  const items=$('#cartItems'), empty=$('#drEmpty'), foot=$('#drFoot');
  const entries=Object.entries(state.cart).map(([id,q])=>({...CATALOG[id],qty:q,id}));
  const t=totals('delivery');
  $('#cartCount').textContent=t.count;
  $('#cartCount').classList.toggle('show',t.count>0);
  $('#drCount').textContent=t.count?`· ${t.count} ${plural(t.count,'позиция','позиции','позиций')}`:'';
  if(!entries.length){
    items.innerHTML='';empty.style.display='flex';foot.style.display='none';
    $('#promoRow').style.display='none';$('#promoOn').classList.remove('show');return;
  }
  empty.style.display='none';foot.style.display='block';
  $('#promoRow').style.display=state.promo?'none':'flex';
  $('#promoOn').classList.toggle('show',!!state.promo);
  if(state.promo)$('#promoOnCode').textContent=state.promo;
  items.innerHTML=entries.map(it=>`<div class="ci-wrap">
    <button class="rm" data-rm="${it.id}" aria-label="Убрать">✕</button>
    <div class="ci">
      <img src="https://picsum.photos/seed/${it.seed}/140/140" alt="">
      <div>
        <h4>${it.name}</h4>
        <div class="meta">
          <span class="p">${money(it.price*it.qty)}</span>
          <div class="stepper"><button data-dec="${it.id}">−</button><b>${it.qty}</b><button data-inc="${it.id}">+</button></div>
        </div>
      </div>
    </div></div>`).join('');
  $('#sumSub').textContent=money(t.sub);
  $('#rowSale').hidden=!t.saleAmt;if(t.saleAmt)$('#sumSale').textContent='−'+money(t.saleAmt);
  $('#rowPromo').hidden=!t.disc;if(t.disc)$('#sumPromo').textContent='−'+money(t.disc);
  $('#sumDlv').innerHTML=t.dlv===0?'<span class="free">бесплатно</span>':money(t.dlv);
  $('#sumTotal').textContent=money(t.total);
  const base=t.sub-t.disc,left=Math.max(0,FREE_FROM-base);
  $('#dlvFill').style.width=Math.min(100,base/FREE_FROM*100)+'%';
  $('#dlvHint').textContent=left>0?`До бесплатной доставки ещё ${money(left)} 🛵`:'Ура, доставка бесплатная! 🎉';
}
function bump(){const c=$('#cartCount');c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump');}
function syncAll(anim){renderMenu(anim);renderCart();if(!anim)bump();}

/* делегирование кликов по меню и корзине */
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-add]');if(a){addToCart(a.dataset.add,a);return;}
  const i=e.target.closest('[data-inc]');if(i){changeQty(i.dataset.inc,1);return;}
  const d=e.target.closest('[data-dec]');if(d){changeQty(d.dataset.dec,-1);return;}
  const r=e.target.closest('[data-rm]');if(r){delete state.cart[r.dataset.rm];save();syncAll(false);toast('Убрали из корзины');return;}
  const f=e.target.closest('[data-fav]');
  if(f){const id=f.dataset.fav;
    if(favs.has(id)){favs.delete(id);}else{favs.add(id);toast('В избранном ♥');}
    f.classList.toggle('on');save();
  }
});

/* корзина: открыть/закрыть */
function openCart(){$('#cartDrawer').classList.add('open');$('#overlay').classList.add('show');document.body.style.overflow='hidden';}
function closeCart(){$('#cartDrawer').classList.remove('open');$('#overlay').classList.remove('show');document.body.style.overflow='';}
$('#cartBtn').addEventListener('click',openCart);
$('#closeCart').addEventListener('click',closeCart);
$('#overlay').addEventListener('click',closeCart);
$('#goMenu').addEventListener('click',closeCart);
$('#clearCart').addEventListener('click',()=>{if(!Object.keys(state.cart).length)return;state.cart={};state.promo=null;save();syncAll(false);toast('Корзина очищена');});

/* промокод */
function applyPromo(){
  const inp=$('#promoInput'),code=inp.value.trim().toUpperCase();
  if(!code)return;
  const pr=PROMOS[code];
  if(!pr){toast('Такого промокода нет 🤔','err');shake();return;}
  const sub=Object.entries(state.cart).reduce((s,[id,q])=>s+CATALOG[id].price*q,0);
  if(sub<pr.min){toast(`Код работает от ${money(pr.min)}`,'err');shake();return;}
  state.promo=code;save();renderCart();toast(`Код ${code} применён: −${pr.p}% 🎉`);
  function shake(){const r=$('#promoRow');r.classList.remove('shake');void r.offsetWidth;r.classList.add('shake');}
}
$('#promoApply').addEventListener('click',applyPromo);
$('#promoInput').addEventListener('keydown',e=>{if(e.key==='Enter')applyPromo();});
$('#promoRemove').addEventListener('click',()=>{state.promo=null;save();renderCart();});
/* копирование кода */
$$('[data-copy]').forEach(b=>b.addEventListener('click',()=>{
  const code=b.dataset.copy;
  (navigator.clipboard?navigator.clipboard.writeText(code):Promise.reject()).then(
    ()=>toast(`Код ${code} скопирован 📋`),
    ()=>toast(`Ваш код: ${code}`)
  );
}));

/* ---------- ОФОРМЛЕНИЕ ---------- */
let coView='delivery';
$$('input[name=coView]').forEach(r=>r.addEventListener('change',()=>{
  coView=r.value;$('#addrWrap').style.display=coView==='delivery'?'flex':'none';fillCoSum();
}));
function fillCoSum(){
  const t=totals(coView);
  $('#coSub').textContent=money(t.sub);
  const disc=t.disc+t.saleAmt;
  $('#coRowDisc').hidden=!disc;if(disc)$('#coDisc').textContent='−'+money(disc);
  $('#coDlv').innerHTML=coView==='pickup'?'<span class="free">самовывоз — 0 ₽</span>':(t.dlv===0?'<span class="free">бесплатно</span>':money(t.dlv));
  $('#coTotal').textContent=money(t.total);
}
$('#checkoutBtn').addEventListener('click',()=>{
  if(!Object.keys(state.cart).length)return;
  fillCoSum();$('#coFormWrap').hidden=false;$('#orderOk').hidden=true;
  $('#checkoutModal').classList.add('show');
});
function closeModal(){$('#checkoutModal').classList.remove('show');}
function setErr(el,bad){el.closest('.field').classList.toggle('err',bad);return !bad;}
$('#coForm').addEventListener('submit',e=>{
  e.preventDefault();
  const name=$('#coName'),phone=$('#coPhone'),mail=$('#coMail'),addr=$('#coAddr');
  let ok=true;
  ok&=setErr(name,name.value.trim().length<2);
  ok&=setErr(phone,!/^[\d+()\s-]{10,}$/.test(phone.value));
  ok&=setErr(mail,!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value));
  if(coView==='delivery')ok&=setErr(addr,addr.value.trim().length<6);
  if(!ok){toast('Проверьте выделенные поля','err');return;}
  $('#orderId').textContent='ПД-'+(1000+Math.floor(Math.random()*9000));
  $('#okMail').textContent=mail.value.trim();
  $('#okEta').textContent=coView==='delivery'?'Привезём примерно за 45–60 минут 🛵':'Заказ будет готов через 25 минут, ждём вас! 🏃';
  $('#coFormWrap').hidden=true;$('#orderOk').hidden=false;
  state.cart={};state.promo=null;save();syncAll(false);
});
$('#closeOk').addEventListener('click',()=>{closeModal();closeCart();});
$('#checkoutModal').addEventListener('click',e=>{if(e.target.id==='checkoutModal')closeModal();});

/* ---------- ВРЕМЯ / СТАТУС / ТАЙМЕР ---------- */
function hhmm(v){const h=Math.floor(v),m=Math.round((v-h)*60);return pad(h)+':'+pad(m);}
function openStatus(){
  const now=new Date(),d=now.getDay(),t=now.getHours()+now.getMinutes()/60;
  const [o,c]=HOURS[d];
  const chip=$('#openText'),dot=$('#openDot');
  if(t>=o&&t<c){chip.textContent='Открыто · до '+hhmm(c);dot.classList.remove('closed');}
  else{
    let day=d,open=HOURS[d][0];
    if(t>=c){day=(d+1)%7;open=HOURS[day][0];}
    const label=day===d?'сегодня':day===(d+1)%7?'завтра':'';
    chip.textContent='Закрыто · откроемся '+label+' в '+hhmm(open);dot.classList.add('closed');
  }
}
function tickClock(){
  const now=new Date();
  const end=new Date(now);end.setHours(23,59,59,999);
  let s=Math.max(0,Math.floor((end-now)/1000));
  $('#cdH').textContent=pad(Math.floor(s/3600));
  $('#cdM').textContent=pad(Math.floor(s%3600/60));
  $('#cdS').textContent=pad(s%60);
  const h=now.getHours();
  $('#happyChip').classList.toggle('on',h>=15&&h<17);
}
setInterval(tickClock,1000);openStatus();tickClock();
$$('.hours-row').forEach(r=>{if(+r.dataset.day===new Date().getDay())r.classList.add('today');});

/* ---------- ОТЗЫВЫ ---------- */
$('#rvPrev').addEventListener('click',()=>$('#rvRow').scrollBy({left:-380,behavior:RM?'auto':'smooth'}));
$('#rvNext').addEventListener('click',()=>$('#rvRow').scrollBy({left:380,behavior:RM?'auto':'smooth'}));

/* ---------- БРОНЬ ---------- */
(function(){
  const sel=$('#bTime');
  for(let h=9;h<=22;h++)for(const m of['00','30']){const v=pad(h)+':'+m;sel.insertAdjacentHTML('beforeend',`<option>${v}</option>`);}
  const today=new Date(),iso=today.toISOString().slice(0,10);
  $('#bDate').min=iso;$('#bDate').value=iso;
})();
$('#bookForm').addEventListener('submit',e=>{
  e.preventDefault();
  const n=$('#bName'),p=$('#bPhone'),d=$('#bDate');
  let ok=true;
  ok&=setErr(n,n.value.trim().length<2);
  ok&=setErr(p,!/^[\d+()\s-]{10,}$/.test(p.value));
  ok&=setErr(d,!d.value);
  if(!ok){toast('Проверьте выделенные поля','err');return;}
  $('#bookSummary').textContent=`${n.value.trim()}, ждём вас ${new Date(d.value+'T00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'})} в ${$('#bTime').value}, ${$('#bGuests').value.toLowerCase()}.`;
  $('#bookForm').hidden=true;$('#bookOk').hidden=false;
  toast('Заявка на бронь отправлена ✓');
});
$('#bookAgain').addEventListener('click',()=>{$('#bookForm').hidden=false;$('#bookOk').hidden=true;});

/* ---------- ПОДПИСКА ---------- */
$('#subForm').addEventListener('submit',e=>{
  e.preventDefault();
  const m=$('#subMail');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.value)){toast('Похоже на ошибку в почте','err');m.focus();return;}
  $('#subForm').innerHTML='<p style="font-weight:800;color:var(--mustard)">Готово! Первое письмо — в пятницу 💌</p>';
  toast('Подписали на письма ✉️');
});

/* ---------- НАВИГАЦИЯ ---------- */
$('#burger').addEventListener('click',()=>$('#navLinks').classList.toggle('open'));
$$('#navLinks a').forEach(a=>a.addEventListener('click',()=>$('#navLinks').classList.remove('open')));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();closeModal();$('#navLinks').classList.remove('open');}});
addEventListener('scroll',()=>$('#siteHeader').classList.toggle('scrolled',scrollY>8),{passive:true});

/* ---------- ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ ---------- */
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{threshold:.15});
$$('.rv').forEach(el=>io.observe(el));

/* ---------- СЧЁТЧИКИ ---------- */
const ioStat=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return;ioStat.unobserve(en.target);
  const el=en.target,target=parseFloat(el.dataset.n),dec=+(el.dataset.dec||0);
  if(RM){el.textContent=dec?target.toFixed(1).replace('.',','):fmt(target);return;}
  const t0=performance.now(),dur=1500;
  (function step(t){
    const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3),v=target*e;
    el.textContent=dec?v.toFixed(1).replace('.',','):fmt(v);
    if(k<1)requestAnimationFrame(step);
  })(t0);
}),{threshold:.5});
$$('.stat-n').forEach(el=>ioStat.observe(el));

/* ---------- СТАРТ ---------- */
renderRail();renderMenu(true);renderCart();
})();
