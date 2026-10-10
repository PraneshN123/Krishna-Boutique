const products = [
  {id:1,name:'Gulabi Garden Suit Set',category:'Suits',kind:'The occasion edit',price:3290,badge:'JUST IN',image:'collection-suits.jpg',colors:['#c98280','#e6cdbb','#6c7460']},
  {id:2,name:'Meher Embroidered Kurta',category:'Kurtas',kind:'Easy, every day',price:1890,badge:'BEST LOVED',image:'collection-kurtas.jpg',colors:['#b36e6b','#e3d9ca']},
  {id:3,name:'Noor Chanderi Suit Set',category:'Suits',kind:'The occasion edit',price:4290,badge:'JUST IN',image:'hero-campaign.jpg',colors:['#e7d7be','#928c9d']},
  {id:4,name:'Gulmohar Mulmul Dupatta',category:'Dupattas',kind:'The finishing touch',price:990,badge:'A LITTLE FAVOURITE',image:'collection-dupatta.jpg',colors:['#b85f56','#ddc39e','#769184']},
  {id:5,name:'Saanjh Everyday Kurta',category:'Kurtas',kind:'Easy, every day',price:1590,badge:'JUST IN',image:'collection-kurtas.jpg',colors:['#77846d','#c28b79']},
  {id:6,name:'Chandni Handwork Set',category:'Suits',kind:'The occasion edit',price:3890,badge:'LIMITED EDITION',image:'hero-campaign.jpg',colors:['#e9e0d5','#ba7c7b']},
  {id:7,name:'Genda Phool Kota Dupatta',category:'Dupattas',kind:'The finishing touch',price:1290,badge:'JUST IN',image:'collection-dupatta.jpg',colors:['#d8a34f','#c87973']},
  {id:8,name:'Aabha Cotton Kurta Set',category:'Suits',kind:'Easy, every day',price:2490,badge:'BEST LOVED',image:'collection-suits.jpg',colors:['#9e6c61','#d8ccb9']}
];
const imageUrl = (path) => path;
const rupees = (amount) => `₹${amount.toLocaleString('en-IN')}`;
const productGrid = document.querySelector('#product-grid');
const cart = new Map();
let activeFilter = 'All';
let searchTerm = '';
let toastTimer;
const visibilityTimers = new WeakMap();

function setAnimatedVisibility(element, open, className='is-open', duration=300){
  clearTimeout(visibilityTimers.get(element));
  if(open){
    element.hidden=false;
    requestAnimationFrame(()=>element.classList.add(className));
  }else{
    element.classList.remove(className);
    visibilityTimers.set(element,setTimeout(()=>{element.hidden=true},duration));
  }
}

function renderProducts(){
  const shown = products.filter((product) => (activeFilter === 'All' || product.category === activeFilter) && product.name.toLowerCase().includes(searchTerm.toLowerCase()));
  productGrid.innerHTML = shown.map((product) => `<article class="product-card">
    <div class="product-photo"><img src="${imageUrl(product.image)}" alt="${product.name}" loading="lazy"><span class="product-label">${product.badge}</span>
      <button class="heart-button" aria-label="Save ${product.name}" aria-pressed="false">♡</button>
      <button class="quick-add" data-add="${product.id}">ADD TO BAG &nbsp; +</button>
    </div><div class="product-info"><div><p class="product-type">${product.kind}</p><h3 class="product-name">${product.name}</h3><div class="product-swatches" aria-label="Available colours">${product.colors.map(color=>`<span class="swatch" style="background:${color}"></span>`).join('')}</div></div><span class="product-price">${rupees(product.price)}</span></div>
  </article>`).join('');
  document.querySelector('.result-count').textContent = `${shown.length} PIECES`;
  if (!shown.length) productGrid.innerHTML = '<p class="empty-results">Nothing found just yet. Try another search or explore everything.</p>';
  observeScrollReveals(productGrid);
}
function showToast(message){const toast=document.querySelector('.toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2400)}
function cartQuantity(){return [...cart.values()].reduce((sum,item)=>sum+item.quantity,0)}
function addToBag(id){const product=products.find(item=>item.id===Number(id));const current=cart.get(product.id);cart.set(product.id,{product,quantity:(current?.quantity||0)+1});renderBag();showToast(`${product.name} added to your bag`)}
function renderBag(){
  const quantity=cartQuantity();document.querySelector('.bag-count').textContent=quantity;document.querySelector('.dock-bag-count').textContent=quantity;document.querySelector('.drawer-count').textContent=`(${quantity})`;
  const items=[...cart.values()];const lines=document.querySelector('.bag-items');const empty=document.querySelector('.bag-empty');const footer=document.querySelector('.drawer-footer');
  empty.style.display=items.length?'none':'block';footer.hidden=!items.length;
  lines.innerHTML=items.map(({product,quantity})=>`<div class="bag-line"><img src="${imageUrl(product.image)}" alt=""><div><p class="product-type">${product.kind}</p><h3>${product.name}</h3><span class="bag-price">${rupees(product.price)}</span><div class="quantity-control"><button data-quantity="${product.id}" data-change="-1" aria-label="Remove one ${product.name}">−</button><span>${quantity}</span><button data-quantity="${product.id}" data-change="1" aria-label="Add one ${product.name}">+</button></div><button class="remove-item" data-remove="${product.id}">Remove</button></div><strong class="bag-price">${rupees(product.price*quantity)}</strong></div>`).join('');
  const total=items.reduce((sum,item)=>sum+item.product.price*item.quantity,0);document.querySelector('.subtotal strong').textContent=rupees(total);
}
function openBag(){const drawer=document.querySelector('.bag-drawer');const backdrop=document.querySelector('.drawer-backdrop');setAnimatedVisibility(backdrop,true,'is-visible',300);setAnimatedVisibility(drawer,true,'is-open',340);document.body.classList.add('no-scroll');document.querySelector('.drawer-close').focus()}
function closeBag(){const drawer=document.querySelector('.bag-drawer');const backdrop=document.querySelector('.drawer-backdrop');setAnimatedVisibility(drawer,false,'is-open',340);setAnimatedVisibility(backdrop,false,'is-visible',300);document.body.classList.remove('no-scroll');document.querySelector('.bag-toggle').focus()}

const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}
  });
},{threshold:.12,rootMargin:'0px 0px -32px 0px'}) : null;
function observeScrollReveals(root=document){
  if(!revealObserver)return;
  const targets=root.querySelectorAll('.collections .section-heading,.collection-card,.products-heading,.product-toolbar,.product-card,.story-image,.story-copy,.newsletter-mark,.newsletter .eyebrow,.newsletter h2,.newsletter-form,.site-footer .footer-links');
  targets.forEach((element,index)=>{
    if(element.classList.contains('scroll-reveal'))return;
    element.classList.add('scroll-reveal');
    element.style.setProperty('--reveal-delay',`${Math.min(index,4)*55}ms`);
    revealObserver.observe(element);
  });
}
renderProducts();observeScrollReveals();renderBag();document.querySelector('#year').textContent=new Date().getFullYear();
// Hide the browser's broken-image glyph if an asset is ever removed during deployment.
document.addEventListener('error',(event)=>{if(event.target instanceof HTMLImageElement){event.target.classList.add('image-unavailable');event.target.alt='Fashion image unavailable';event.target.removeAttribute('src')}},true);
document.addEventListener('click',(event)=>{
  const add=event.target.closest('[data-add]');if(add){addToBag(add.dataset.add);return}
  const filter=event.target.closest('[data-filter]');if(filter){activeFilter=filter.dataset.filter;document.querySelectorAll('.filter-chip').forEach(button=>button.classList.toggle('active',button===filter));renderProducts();return}
  const collection=event.target.closest('[data-filter-link]');if(collection){activeFilter=collection.dataset.filterLink;document.querySelectorAll('.filter-chip').forEach(button=>button.classList.toggle('active',button.dataset.filter===activeFilter));renderProducts();return}
  const love=event.target.closest('.heart-button');if(love){const saved=love.getAttribute('aria-pressed')==='true';love.setAttribute('aria-pressed',String(!saved));love.classList.toggle('is-loved',!saved);love.textContent=saved?'♡':'♥';showToast(saved?'Removed from your saved pieces':'Saved for later');return}
  const change=event.target.closest('[data-quantity]');if(change){const id=Number(change.dataset.quantity);const item=cart.get(id);item.quantity+=Number(change.dataset.change);if(item.quantity<=0)cart.delete(id);renderBag();return}
  const remove=event.target.closest('[data-remove]');if(remove){cart.delete(Number(remove.dataset.remove));renderBag();return}
  if(event.target.closest('.bag-toggle')){openBag();return}
  if(event.target.closest('.drawer-close')||event.target.classList.contains('drawer-backdrop')||event.target.closest('.continue-shopping')){closeBag();return}
  if(event.target.closest('.checkout-button')){showToast('Demo checkout — connect Shopify or a payment provider to accept orders.');return}
  if(event.target.closest('.search-toggle')){const panel=document.querySelector('.search-panel');const open=panel.hidden;setAnimatedVisibility(panel,open);if(open){panel.style.top=`${document.querySelector('.site-header').getBoundingClientRect().bottom}px`;document.querySelector('#product-search').focus()}return}
  if(event.target.closest('.search-close')){setAnimatedVisibility(document.querySelector('.search-panel'),false);document.querySelector('#product-search').value='';searchTerm='';renderProducts();return}
  const menu=event.target.closest('.menu-toggle');if(menu){const nav=document.querySelector('.mobile-nav');const open=nav.hidden;setAnimatedVisibility(nav,open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');return}
  if(event.target.closest('.mobile-nav a')){setAnimatedVisibility(document.querySelector('.mobile-nav'),false);document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');document.querySelector('.menu-toggle').setAttribute('aria-label','Open menu')}
});
document.querySelector('#product-search').addEventListener('input',(event)=>{searchTerm=event.target.value;renderProducts()});
document.querySelector('#newsletter-form').addEventListener('submit',(event)=>{event.preventDefault();const email=document.querySelector('#email');if(!email.checkValidity()){email.reportValidity();return}document.querySelector('.newsletter-message').textContent='Thank you — you’re on the list for this demo.';event.target.reset()});
document.addEventListener('keydown',(event)=>{if(event.key==='Escape'){if(!document.querySelector('.bag-drawer').hidden)closeBag();setAnimatedVisibility(document.querySelector('.search-panel'),false);setAnimatedVisibility(document.querySelector('.mobile-nav'),false);document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');document.querySelector('.menu-toggle').setAttribute('aria-label','Open menu')}});
