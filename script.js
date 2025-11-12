document.addEventListener('DOMContentLoaded', () => {
  let cart = [];
  const cartCount = document.getElementById('cart-count');
  const cartToggle = document.getElementById('cart-toggle');
  const cartPanel = document.getElementById('carrito');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartEmpty = document.getElementById('cart-empty');
  const pagarBtn = document.getElementById('pagar-btn');

  document.addEventListener('click', e => {
    if (e.target.classList.contains('add-to-cart')) {
      const btn = e.target;
      const product = btn.closest('.product');
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const sizeSelect = product.querySelector('.size-dropdown');
      const size = sizeSelect ? sizeSelect.value : null;

      if (sizeSelect && !size) {
        alert('Por favor selecciona una talla');
        return;
      }

      const existente = cart.find(i => i.name === name && i.size === size);
      if (existente) existente.cantidad++;
      else cart.push({ name, price, size, cantidad: 1 });

      updateCart();
    }
  });

  function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cartCount.textContent = cart.reduce((s, i) => s + i.cantidad, 0);

    if (cart.length === 0) {
      cartEmpty.style.display = 'block';
      pagarBtn.disabled = true;
    } else {
      cartEmpty.style.display = 'none';
      pagarBtn.disabled = false;
      cart.forEach((item, i) => {
        total += item.price * item.cantidad;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <div>
            <strong>${item.name}</strong> ${item.size ? `(${item.size})` : ''}
            <br>$ ${item.price.toFixed(2)} x ${item.cantidad}
          </div>
          <button data-index="${i}">X</button>
        `;
        cartItems.appendChild(div);
      });
    }
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  }

  cartItems.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      const i = e.target.dataset.index;
      cart[i].cantidad--;
      if (cart[i].cantidad === 0) cart.splice(i, 1);
      updateCart();
    }
  });

  document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
      document.getElementById(link.dataset.section).classList.add('active');
      link.classList.add('active');
    });
  });

  cartToggle.addEventListener('click', e => { e.preventDefault(); cartPanel.classList.toggle('active'); });
  document.getElementById('close-cart').addEventListener('click', () => cartPanel.classList.remove('active'));

  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('menu').classList.toggle('active');
    document.getElementById('hamburger').classList.toggle('active');
  });

  pagarBtn.addEventListener('click', () => document.getElementById('modal-nombre').style.display = 'flex');
  document.getElementById('cancelar-pago').addEventListener('click', () => document.getElementById('modal-nombre').style.display = 'none');
  document.getElementById('confirmar-pago').addEventListener('click', () => {
    const nombre = document.getElementById('nombre-cliente').value.trim();
    if (!nombre) return alert('Ingresa tu nombre');
    generarTicket(nombre);
    document.getElementById('modal-nombre').style.display = 'none';
    setTimeout(() => window.print(), 500);
  });

  function generarTicket(cliente) {
    const ahora = new Date();
    const folio = 'LUA' + Date.now().toString().slice(-6);
    const subtotal = cart.reduce((s, i) => s + i.price * i.cantidad, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    document.getElementById('folio').textContent = folio;
    document.getElementById('fecha').textContent = ahora.toLocaleString('es-MX');
    document.getElementById('cliente').textContent = cliente;
    document.getElementById('subtotal-ticket').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('iva-ticket').textContent = '$' + iva.toFixed(2);
    document.getElementById('total-ticket').textContent = '$' + total.toFixed(2);

    const itemsHTML = cart.map(item => 
      `<div style="display:flex; justify-content:space-between;">
        <span>${item.cantidad}x ${item.name} ${item.size ? `(${item.size})` : ''}</span>
        <span>$${(item.price * item.cantidad).toFixed(2)}</span>
      </div>`
    ).join('');
    document.getElementById('items-ticket').innerHTML = itemsHTML;

    document.getElementById('ticket-print').style.display = 'block';
  }

  const destacados = [
    { img: 'crema.jpg', name: 'Crema Aloe Glow', price: 199.00 },
    { img: 'perfume.jpg', name: 'Jazmín Eterno', price: 349.00 },
    { img: 'playera.jpg', name: 'Camiseta EcoSoft', price: 249.00 }
  ];
  const container = document.getElementById('destacados-container');
  destacados.forEach(p => {
    const article = document.createElement('article');
    article.className = 'product';
    article.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">$ ${p.price.toFixed(2)}</p>
      ${p.name.includes('Camiseta') ? `<div class="size-select"><select class="size-dropdown"><option value="">Talla</option><option>S</option><option>M</option><option>L</option><option>XL</option></select></div>` : ''}
      <button class="btn add-to-cart" data-name="${p.name}" data-price="${p.price}">Agregar</button>
    `;
    container.appendChild(article);
  });

  updateCart();
});
document.getElementById('confirmar-pago').addEventListener('click', () => {
  const nombre = document.getElementById('nombre-cliente').value.trim();
  if (!nombre) return alert('Ingresa tu nombre');

  generarTicket(nombre);
  document.getElementById('modal-nombre').style.display = 'none';

  const ticket = document.getElementById('ticket-print');
  ticket.style.display = 'block';

  setTimeout(() => {
    window.print();
  }, 300);
});

function generarTicket(cliente) {
  const ahora = new Date();
  const folio = 'LUA' + Date.now().toString().slice(-6);
  const subtotal = cart.reduce((s, i) => s + i.price * i.cantidad, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  document.getElementById('folio').textContent = folio;
  document.getElementById('fecha').textContent = ahora.toLocaleString('es-MX');
  document.getElementById('cliente').textContent = cliente;
  document.getElementById('subtotal-ticket').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('iva-ticket').textContent = '$' + iva.toFixed(2);
  document.getElementById('/total-ticket').textContent = '$' + total.toFixed(2);

  const items = cart.map(i => 
    `<div style="display:flex;justify-content:space-between">
      <span>${i.cantidad}x ${i.name} ${i.size ? `(${i.size})` : ''}</span>
      <span>$${(i.price * i.cantidad).toFixed(2)}</span>
    </div>`
  ).join('');
  document.getElementById('items-ticket').innerHTML = items;
}
function actualizarOfertas() {
  const cremas = cart.filter(i => i.name.includes('Crema')).length;
  const perfumes = cart.filter(i => i.name.includes('Perfume')).length;
  const subtotal = cart.reduce((s, i) => s + i.price * i.cantidad, 0);
  let ofertas = '';

  if (cremas >= 2) ofertas += '2x1 en cremas aplicado<br>';
  if (perfumes > 0) ofertas += '20% OFF en perfumes aplicado<br>';
  if (subtotal >= 999) ofertas += 'Envío GRATIS aplicado<br>';

  document.getElementById('cart-offers').innerHTML = ofertas || '';
}