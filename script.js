document.addEventListener('DOMContentLoaded', () => {
  let cart = [];
  const cartCount = document.getElementById('cart-count');
  const cartToggle = document.getElementById('cart-toggle');
  const cartPanel = document.getElementById('carrito');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartEmpty = document.getElementById('cart-empty');
  const cartOffers = document.getElementById('cart-offers');
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
        alert('¡Por favor selecciona una talla!');
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
    let cremasCount = 0;
    let perfumesCount = 0;
    cartCount.textContent = cart.reduce((s, i) => s + i.cantidad, 0);
    if (cart.length === 0) {
      cartEmpty.style.display = 'block';
      pagarBtn.disabled = true;
      cartOffers.textContent = '';
      cartTotal.textContent = 'Total: $0.00';
      return;
    }
    cartEmpty.style.display = 'none';
    pagarBtn.disabled = false;
    cart.forEach((item, i) => {
      let precioFinal = item.price;
      let nombreMostrar = item.name;
      if (item.name.toLowerCase().includes('crema')) cremasCount += item.cantidad;
      if (item.name.toLowerCase().includes('perfume')) perfumesCount += item.cantidad;
      if (item.name.toLowerCase().includes('crema')) {
        const pagadas = Math.ceil(item.cantidad / 2);
        precioFinal = (item.price * pagadas) / item.cantidad;
        if (item.cantidad >= 2) nombreMostrar += ' (2x1)';
      }
      if (item.name.toLowerCase().includes('perfume')) {
        precioFinal = item.price * 0.8;
        nombreMostrar += ' (-20%)';
      }
      total += precioFinal * item.cantidad;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div>
          <strong>${nombreMostrar}</strong> ${item.size ? `(${item.size})` : ''}
          <br><small>${item.cantidad} × $${item.price.toFixed(2)}</small>
          → <strong>$${(precioFinal * item.cantidad).toFixed(2)}</strong>
        </div>
        <button data-index="${i}">X</button>
      `;
      cartItems.appendChild(div);
    });
    let ofertas = [];
    if (cremasCount >= 2) ofertas.push('2x1 en cremas');
    if (perfumesCount >= 1) ofertas.push('20% OFF en perfumes');
    if (total >= 999) ofertas.push('Envío GRATIS');
    cartOffers.textContent = ofertas.length ? 'Ofertas activas: ' + ofertas.join(' • ') : '';
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  }

  cartItems.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      const i = parseInt(e.target.dataset.index);
      cart.splice(i, 1);
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

  cartToggle.addEventListener('click', e => {
    e.preventDefault();
    cartPanel.classList.toggle('active');
  });
  document.getElementById('close-cart').addEventListener('click', () => cartPanel.classList.remove('active'));
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('menu').classList.toggle('active');
    document.getElementById('hamburger').classList.toggle('active');
  });

  pagarBtn.addEventListener('click', () => {
    document.getElementById('modal-nombre').style.display = 'flex';
    document.getElementById('nombre-cliente').focus();
  });
  document.getElementById('cancelar-pago').addEventListener('click', () => {
    document.getElementById('modal-nombre').style.display = 'none';
  });
  document.getElementById('confirmar-pago').addEventListener('click', () => {
    const nombre = document.getElementById('nombre-cliente').value.trim();
    if (!nombre) {
      alert('¡Por favor escribe tu nombre!');
      return;
    }
    generarTicket(nombre);
    document.getElementById('modal-nombre').style.display = 'none';
  });

  function generarTicket(cliente) {
    const ahora = new Date();
    const folio = 'LUA' + Date.now().toString().slice(-8);
    let subtotal = 0;
    let itemsHTML = '';
    cart.forEach(item => {
      let precioUnitario = item.price;
      if (item.name.toLowerCase().includes('perfume')) precioUnitario *= 0.8;
      if (item.name.toLowerCase().includes('crema') && cart.filter(i => i.name.toLowerCase().includes('crema')).reduce((a, b) => a + b.cantidad, 0) >= 2) {
        precioUnitario = item.price * 0.5;
      }
      const totalItem = precioUnitario * item.cantidad;
      subtotal += totalItem;
      itemsHTML += `
        <div style="display:flex;justify-content:space-between;margin:6px 0;">
          <span>${item.cantidad}x ${item.name} ${item.size ? '(' + item.size + ')' : ''}</span>
          <span>$${totalItem.toFixed(2)}</span>
        </div>`;
    });
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    document.getElementById('folio').textContent = folio;
    document.getElementById('fecha').textContent = ahora.toLocaleString('es-MX');
    document.getElementById('cliente').textContent = cliente;
    document.getElementById('items-ticket').innerHTML = itemsHTML;
    document.getElementById('subtotal-ticket').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('iva-ticket').textContent = '$' + iva.toFixed(2);
    document.getElementById('total-ticket').textContent = '$' + total.toFixed(2);
    document.getElementById('ticket-print').style.display = 'block';
    cart = [];
    updateCart();
    cartPanel.classList.remove('active');
    setTimeout(() => {
      window.print();
      setTimeout(() => document.getElementById('ticket-print').style.display = 'none', 1000);
    }, 600);
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
      ${p.name.includes('Camiseta') ? `
        <div class="size-select">
          <select class="size-dropdown">
            <option value="">Talla</option>
            <option>S</option><option>M</option><option>L</option><option>XL</option>
          </select>
        </div>` : ''}
      <button class="btn add-to-cart" data-name="${p.name}" data-price="${p.price}">Agregar</button>
    `;
    container.appendChild(article);
  });

  const chatbotBtn = document.getElementById('chatbot-floating-btn');
  const chatbotContainer = document.getElementById('chatbot-container');
  const cerrarChat = document.getElementById('chatbot-close');
  const mensajes = document.getElementById('chatbot-messages');
  const input = document.getElementById('chatbot-input');
  const enviarBtn = document.getElementById('chatbot-send');

  function msg(texto, tipo = 'bot') {
    const div = document.createElement('div');
    div.className = `message ${tipo}`;
    div.innerHTML = texto;
    mensajes.appendChild(div);
    mensajes.scrollTop = mensajes.scrollHeight;
  }

  function responderSoporte(opcion) {
    const respuestas = {
      "Tiempos de envío": "Los envíos son de <strong>2 a 7 días hábiles</strong> en todo México con paqueterías como Estafeta, FedEx y DHL. Incluye número de guía.",
      "Métodos de pago": "Aceptamos:<br>• Tarjeta de crédito/débito<br>• Pago en OXXO<br>• Transferencia bancaria<br>• Mercado Pago<br>Todos 100% seguros.",
      "Cambios y devoluciones": "Tienes <strong>15 días naturales</strong> para cambios o devoluciones. Producto sin usar + empaque original + ticket.",
      "Hablar por WhatsApp": "Escríbenos al WhatsApp <strong>+52 566 545 9207</strong><br>Te atendemos de 9:00 AM a 9:00 PM todos los días.",
      "Ver catálogo completo": "Aquí tienes todo nuestro catálogo:",
      "Términos y Condiciones": `
        <div style="background:rgba(30,25,15,0.6); padding:20px; border-radius:15px; border:2px solid #b8860b; font-size:14px; line-height:1.7;">
          <strong>TÉRMINOS Y CONDICIONES - Tienda Lua</strong><br><br>
          • Todos los precios incluyen IVA<br>
          • Tiempos de entrega: 2-7 días hábiles<br>
          • Cambios y devoluciones en 15 días naturales<br>
          • Promociones no acumulables<br>
          • Nos reservamos el derecho de cancelar pedidos por falta de stock<br><br>
          <em>Operado por Lua Cosmetics S.A. de C.V.</em>
        </div>
      `,
      "Aviso de Privacidad": `
        <div style="background:rgba(30,25,15,0.6); padding:20px; border-radius:15px; border:2px solid #b8860b; font-size:14px; line-height:1.7;">
          <strong>AVISO DE PRIVACIDAD</strong><br><br>
          Tus datos (nombre, teléfono, dirección) solo se usan para:<br>
          • Procesar y enviar tu pedido<br>
          • Notificaciones de estatus<br>
          • Soporte post-venta<br><br>
          <strong>NUNCA compartimos ni vendemos tu información.</strong><br><br>
          Puedes solicitar eliminación de datos en cualquier momento a:<br>
          <strong>soporte@tiendalua.mx</strong>
        </div>
      `
    };

    if (opcion === "Ver catálogo completo") {
      msg(respuestas[opcion], 'bot');
      msg(`
        <div style="text-align:center; margin:25px 0;">
          <a href="#productos" onclick="document.querySelector('[data-section=productos]').click(); chatbotContainer.classList.remove('open'); chatbotBtn.style.display='flex';"
             style="display:inline-block; padding:16px 40px; background:var(--accent); color:#000; border-radius:30px; font-weight:800; text-decoration:none; font-size:16px; box-shadow:0 10px 30px rgba(255,215,0,0.5);">
            IR AL CATÁLOGO
          </a>
        </div>
      `, 'bot');
    } else {
      msg(respuestas[opcion], 'bot');
    }
  }

  function despedirse() {
    msg("¡Perfecto! Ha sido un placer ayudarte<br>¡Que tengas un excelente día!<br><strong>Tienda Lua</strong>", 'bot');
    setTimeout(() => {
      chatbotContainer.classList.remove('open');
      chatbotBtn.style.display = 'flex';
    }, 3500);
  }

  chatbotBtn.onclick = () => {
    chatbotContainer.classList.add('open');
    chatbotBtn.style.display = 'none';
    mensajes.innerHTML = '';
    msg("¡Hola! Bienvenido(a) a <strong>Tienda Lua</strong><br>Soy <strong>Lua Assistant</strong>, tu asistente virtual<br><br>Hola, ¿cómo estás? Puedes pedirme lo que esté dentro de mi alcance:<br><br>• Tiempos de envío<br>• Métodos de pago<br>• Cambios y devoluciones<br>• Hablar por WhatsApp<br>• Ver catálogo completo<br>• Términos y Condiciones<br>• Aviso de Privacidad", 'bot');
  };

  cerrarChat.onclick = () => {
    chatbotContainer.classList.remove('open');
    chatbotBtn.style.display = 'flex';
  };

  enviarBtn.onclick = () => {
    const texto = input.value.trim();
    if (!texto) return;
    msg(texto, 'user');
    input.value = '';
    const t = texto.toLowerCase();

    if (t.includes('gracias') || t.includes('adiós') || t.includes('hasta luego') ||
        t.includes('bye') || t.includes('ok gracias') || t.includes('perfecto')) {
      despedirse();
      return;
    }

    if (t.includes('envio') || t.includes('cuando llega')) responderSoporte("Tiempos de envío");
    else if (t.includes('pago') || t.includes('como pago')) responderSoporte("Métodos de pago");
    else if (t.includes('devolucion') || t.includes('cambio')) responderSoporte("Cambios y devoluciones");
    else if (t.includes('whatsapp') || t.includes('hablar')) responderSoporte("Hablar por WhatsApp");
    else if (t.includes('catalogo') || t.includes('ver productos')) responderSoporte("Ver catálogo completo");
    else if (t.includes('terminos') || t.includes('condiciones')) responderSoporte("Términos y Condiciones");
    else if (t.includes('privacidad') || t.includes('datos')) responderSoporte("Aviso de Privacidad");
    else {
      msg("Lo siento, no entendí tu pregunta.<br>Puedes pedirme información sobre tiempos de envío, pagos, devoluciones, WhatsApp, catálogo, términos o privacidad.", 'bot');
    }
  };

  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') enviarBtn.click();
  });
});
