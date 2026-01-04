/* ===========================
   CHATBOT LUNA - CONVERSACIONAL (SOLO TEXTO)
=========================== */

const chatbotBtn = document.getElementById('chatbot-floating-btn');
const chatbotContainer = document.getElementById('chatbot-container');
const cerrarChat = document.getElementById('chatbot-close');
const mensajes = document.getElementById('chatbot-messages');
const input = document.getElementById('chatbot-input');
const enviarBtn = document.getElementById('chatbot-send');

/* ---- ESTADO DEL CHAT ---- */
const chatState = {
  ultimoTema: null
};

/* ---- MENSAJES ---- */
function msg(texto, tipo = 'bot') {
  const div = document.createElement('div');
  div.className = `message ${tipo}`;
  div.innerHTML = texto;
  mensajes.appendChild(div);
  mensajes.scrollTop = mensajes.scrollHeight;
}

/* ---- SUGERENCIAS EN TEXTO ---- */
function sugerirMas() {
  msg(`
    ¿En qué más puedo ayudarte? 😊<br><br>
    Puedes escribirme sobre:<br>
    • Envíos<br>
    • Métodos de pago<br>
    • Cambios y devoluciones<br>
    • Ver catálogo<br>
    • Aviso de privacidad
  `);
}

/* ---- PROCESADOR PRINCIPAL ---- */
function procesarMensaje(t) {

  /* ===== DESPEDIDA ===== */
  if (t.includes('gracias') || t.includes('adios') || t.includes('bye')) {
    msg('¡Gracias por visitarnos! 💛<br>Cuando gustes aquí estaré.<br><strong>Tienda Lua</strong>');
    return;
  }

  /* ===== ENVÍOS ===== */
  if (t.includes('envio') || t.includes('llega')) {
    chatState.ultimoTema = 'envios';
    msg(`
      🚚 <strong>Envíos Tienda Lua</strong><br><br>
      • Enviamos de <strong>Lunes a Domingo</strong><br>
      • Horario de recolección: <strong>9:00 AM a 6:00 PM</strong><br>
      • Entrega estimada: <strong>2 a 7 días hábiles</strong><br>
      • Paqueterías: DHL, Estafeta y FedEx<br><br>
      En compras mayores a <strong>$999</strong>, el envío es <strong>GRATIS</strong>.
    `);
    sugerirMas();
    return;
  }

  /* ===== PAGOS ===== */
  if (t.includes('pago') || t.includes('tarjeta')) {
    chatState.ultimoTema = 'pagos';
    msg(`
      💳 <strong>Métodos de Pago</strong><br><br>
      • Tarjeta de crédito y débito<br>
      • Mercado Pago<br>
      • Transferencia bancaria<br>
      • Pago en OXXO<br><br>
      Todos los pagos son <strong>100% seguros</strong>.
    `);
    sugerirMas();
    return;
  }

  /* ===== CATÁLOGO ===== */
  if (t.includes('catalogo') || t.includes('productos')) {
    chatState.ultimoTema = 'catalogo';
    msg(`
      🛍️ <strong>Catálogo Tienda Lua</strong><br><br>
      Contamos con:<br>
      • Cremas<br>
      • Perfumes<br>
      • Playeras<br><br>
      Escribe cuál te interesa 😊
    `);
    return;
  }

  /* ===== CONTEXTO: CATÁLOGO ===== */
  if (chatState.ultimoTema === 'catalogo') {

    if (t.includes('crema')) {
      msg(`
        🧴 <strong>Cremas</strong><br><br>
        Hidratantes, anti-edad, piel sensible y más.<br>
        💥 Promoción: <strong>2x1 en cremas</strong><br>
        Precio unitario: <strong>$199</strong><br><br>
        Puedes decirme si la buscas para rostro o corporal.
      `);
      return;
    }

    if (t.includes('perfume')) {
      msg(`
        🌸 <strong>Perfumes</strong><br><br>
        Aromas florales, dulces, cítricos y amaderados.<br>
        💥 <strong>20% de descuento</strong><br>
        Precio regular: <strong>$349</strong><br><br>
        Escríbeme si prefieres un aroma dulce o fresco.
      `);
      return;
    }

    if (t.includes('playera') || t.includes('ropa')) {
      msg(`
        👕 <strong>Playeras</strong><br><br>
        • Algodón orgánico<br>
        • Tallas S a XL<br>
        • Diseños modernos<br><br>
        Precio: <strong>$249</strong><br>
        Dime qué talla usas 😊
      `);
      return;
    }
  }

  /* ===== PRIVACIDAD ===== */
  if (t.includes('privacidad') || t.includes('datos')) {
    msg(`
      🔐 <strong>Aviso de Privacidad</strong><br><br>
      Tus datos solo se usan para:<br>
      • Procesar pedidos<br>
      • Envíos<br>
      • Atención al cliente<br><br>
      Nunca compartimos tu información.
    `);
    sugerirMas();
    return;
  }

  /* ===== DEFAULT ===== */
  msg(`
    🤔 No estoy segura de haber entendido.<br><br>
    Puedes escribirme sobre:<br>
    • Envíos<br>
    • Pagos<br>
    • Catálogo<br>
    • Promociones<br>
    • Privacidad
  `);
}

/* ---- EVENTOS ---- */
chatbotBtn.onclick = () => {
  chatbotContainer.classList.add('open');
  chatbotBtn.style.display = 'none';
  mensajes.innerHTML = '';
  msg(`
    ¡Hola! 💛 Soy <strong>Luna</strong>, tu asistente de Tienda Lua.<br><br>
    Escríbeme lo que necesites saber sobre productos, envíos o pagos 😊
  `);
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
  procesarMensaje(texto.toLowerCase());
};

input.addEventListener('keypress', e => {
  if (e.key === 'Enter') enviarBtn.click();
});
