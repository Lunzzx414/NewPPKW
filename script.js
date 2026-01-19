// Small interactions: theme toggle, order button confetti, and contact form mock
// Cart system with Rupiah currency
let cart = [];

function formatRupiah(num){
  return new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', minimumFractionDigits:0}).format(num);
}

document.addEventListener('DOMContentLoaded',()=>{
  // set year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Restore dark mode preference
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  if (savedDarkMode) {
    document.documentElement.classList.add('dark');
  }

  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click',()=>{
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    themeToggle.textContent = isDark ? '☀️' : '🌙';
  });

  // Set correct icon based on current theme
  const isDark = document.documentElement.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';

  // Cart sidebar toggle
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const closeCartBtn = document.getElementById('closeCartBtn');

  cartToggleBtn.addEventListener('click', ()=>{
    cartSidebar.setAttribute('aria-hidden', cartSidebar.getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
  });

  closeCartBtn.addEventListener('click', ()=>{
    cartSidebar.setAttribute('aria-hidden', 'true');
  });

  // Quantity multiplier calculator
  const quantityMultiplier = document.getElementById('quantityMultiplier');
  quantityMultiplier.addEventListener('change', updateCartTotal);
});

function launchConfetti(){
  const container = document.createElement('div');
  container.className = 'confetti';
  document.body.appendChild(container);
  const colors = ['#FFD1E6','#C8F7FF','#FFF2C8','#FDE9FF','#E8FFD8'];
  for(let i=0;i<32;i++){
    const el = document.createElement('div');
    el.style.position='absolute';
    el.style.width = Math.random()*10 + 6 + 'px';
    el.style.height = Math.random()*8 + 6 + 'px';
    el.style.left = Math.random()*100 + '%';
    el.style.top = '-10%';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.opacity = Math.random()*0.9 + 0.3;
    el.style.borderRadius = Math.random()>.5? '50%':'6px';
    el.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`;
    el.style.transition = `transform ${2+Math.random()*1.5}s cubic-bezier(.2,.8,.2,1), top ${2+Math.random()*1.5}s linear, opacity 1s ease`;
    container.appendChild(el);
    requestAnimationFrame(()=>{
      el.style.top = (70 + Math.random()*30) + '%';
      el.style.transform = `translateY(0) translateX(${(Math.random()-0.5)*30}vw) rotate(${Math.random()*720}deg)`;
    });
  }
  setTimeout(()=>{container.remove();},3000);
}

function handleContact(e){
  e.preventDefault();
  const name = document.getElementById('name').value;
  alert(`Thanks ${name}! We'll get back to you ✨`);
  e.target.reset();
}

// Modal & purchase flow
function openModal(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.setAttribute('aria-hidden','false');
}
function closeModal(el){
  if(typeof el === 'string') el = document.getElementById(el);
  if(!el) return;
  el.setAttribute('aria-hidden','true');
}

document.addEventListener('click', (e)=>{
  // close buttons / backdrop
  const close = e.target.closest('[data-close]');
  if(close){
    const modal = e.target.closest('.modal');
    if(modal) closeModal(modal.id);
  }
});

// Add to cart function
function addToCart(name, price, img){
  const existingItem = cart.find(item => item.name === name);
  if(existingItem){
    existingItem.qty += 1;
  } else {
    cart.push({name, price: parseInt(price), img, qty: 1});
  }
  updateCartUI();
  updateCartTotal();
  document.getElementById('cartSidebar').setAttribute('aria-hidden', 'false');
}

function removeFromCart(name){
  cart = cart.filter(item => item.name !== name);
  updateCartUI();
  updateCartTotal();
}

function updateCartUI(){
  const cartItemsContainer = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  
  cartItemsContainer.innerHTML = '';
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${formatRupiah(item.price)}</p>
      </div>
      <div class="cart-item-qty">
        <button onclick="updateQty('${item.name}', -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="updateQty('${item.name}', 1)">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">Remove</button>
    `;
    cartItemsContainer.appendChild(div);
  });
}

function updateQty(name, change){
  const item = cart.find(item => item.name === name);
  if(item){
    item.qty += change;
    if(item.qty <= 0) removeFromCart(name);
    else {
      updateCartUI();
      updateCartTotal();
    }
  }
}

function updateCartTotal(){
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const multiplier = parseInt(document.getElementById('quantityMultiplier').value) || 1;
  const total = subtotal * multiplier;
  
  document.getElementById('subtotal').textContent = formatRupiah(subtotal);
  document.getElementById('cartTotal').textContent = formatRupiah(total);
}

// open product modal from menu items (cakes and snacks)
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.menu-grid li').forEach(li=>{
    li.style.cursor = 'pointer';
    li.addEventListener('click', ()=>{
      const name = li.dataset.name || li.querySelector('strong')?.textContent;
      const price = li.dataset.price || li.querySelector('span')?.textContent.replace('Rp ','').replace('.','');
      const img = li.dataset.img || li.querySelector('img')?.src;
      const category = li.classList.contains('cake-item') ? 'Cake' : 'Snack';
      document.getElementById('modalName').textContent = name;
      document.getElementById('modalPrice').textContent = formatRupiah(parseInt(price));
      document.getElementById('buyPrice').textContent = formatRupiah(parseInt(price));
      document.getElementById('modalImg').src = img;
      document.getElementById('modalImg').alt = name;
      openModal('productModal');
    });
  });

  // add to cart
  document.getElementById('buyBtn').addEventListener('click', ()=>{
    const name = document.getElementById('modalName').textContent;
    const priceText = document.getElementById('modalPrice').textContent;
    const price = priceText.replace(/[^\d]/g, '');
    const img = document.getElementById('modalImg').src;
    
    addToCart(name, price, img);
    closeModal('productModal');
    launchConfetti();
    alert('Added to cart! 🎉');
  });

  // checkout button
  document.getElementById('checkoutBtn').addEventListener('click', ()=>{
    if(cart.length === 0){
      alert('Your cart is empty!');
      return;
    }
    const total = document.getElementById('cartTotal').textContent;
    const itemList = cart.map(item => `${item.qty}x ${item.name}`).join(', ');
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push({
      items: itemList,
      total: total,
      date: new Date().toLocaleDateString(),
      status: 'Processing'
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert(`Order confirmed! Total: ${total} ✨\nThank you for your purchase!`);
    cart = [];
    updateCartUI();
    updateCartTotal();
    document.getElementById('cartSidebar').setAttribute('aria-hidden', 'true');
    launchConfetti();
  });

  // keyboard ESC to close
  document.addEventListener('keydown',(ev)=>{
    if(ev.key === 'Escape'){
      document.querySelectorAll('.modal[aria-hidden="false"]').forEach(m=> closeModal(m.id));
    }
  });
});
