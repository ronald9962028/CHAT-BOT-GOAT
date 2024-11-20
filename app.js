const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/json");
const path = require("path");
const fs = require("fs");

const menuPath = path.join(__dirname, "mensajes", "menu.txt");
const menu = fs.readFileSync(menuPath, "utf8");

const flowMenu = addKeyword(EVENTS.ACTION)
  .addAnswer("🌐 *CONOCENOS*")
  .addAnswer(
    "Descubre más sobre nosotros y lo que hacemos. Puedes conocernos mejor en el siguiente enlace:"
  )
  .addAnswer("https://goatpublicidad.com")
  .addAnswer("¡Gritanos!")
  .addAnswer(
    "Escribe *MENU* o el Numero *0* para volver al menu\n" +
      "- 👉 *MENU*\n" +
      "- 👉 *0*"
  );

const flowReserva = addKeyword(EVENTS.ACTION)
  .addAnswer("🚀 *NUESTROS SERVICIOS*")

  .addAnswer(
    "*MARKETING DIGITAL*\n" +
      "- Estrategias en redes sociales\n" +
      "- Publicidad online (Google Ads, Facebook Ads, etc.)\n" +
      "- SEO (Optimización en motores de búsqueda)\n" +
      "- Email marketing"
  )
  .addAnswer(
    "*PRODUCCIÓN*\n" +
      "- Producción audiovisual\n" +
      "- Videos corporativos\n" +
      "- Spots publicitarios\n" +
      "- Producción de contenido visual"
  )
  .addAnswer(
    "*FOTOGRAFÍA*\n" +
      "- Fotografía publicitaria\n" +
      "- Fotografía de producto\n" +
      "- Sesiones fotográficas para redes sociales\n" +
      "- Fotografía para eventos y lanzamientos"
  )
  .addAnswer(
    "*DESARROLLO WEB*\n" +
      "- Diseño y desarrollo de sitios web\n" +
      "- Tiendas online (eCommerce)\n" +
      "- Optimización para móviles\n" +
      "- Mantenimiento web y actualizaciones"
  )
  .addAnswer(
    "*DISEÑO GRÁFICO*\n" +
      "- Creación de identidad visual\n" +
      "- Diseño de logotipos\n" +
      "- Material publicitario (folletos, carteles, banners)\n" +
      "- Diseño para redes sociales"
  )
  .addAnswer(
    "Escribe *MENU* o el Numero *0* para volver al menu\n" +
      "- 👉 *MENU*\n" +
      "- 👉 *0*"
  );

const flowConsulta = addKeyword(EVENTS.ACTION)
  .addAnswer("🍀 *OFERTAS DEL MES*")

  .addAnswer(
    "¡Aprovecha nuestra campaña de optimización por solo 699 Bs! Mejora tu presencia en línea y maximiza tus resultados. Contáctanos para más información y comienza a transformar tu negocio hoy.",
    {
      delay: 1000,
      media: "https://goatpublicidad.com/assets/img/GOAT/promocion.jpeg",
    }
  )
  .addAnswer(
    "Escribe *MENU* o el Numero *0* para volver al menu\n" +
      "- 👉 *MENU*\n" +
      "- 👉 *0*"
  );

const flowPedido = addKeyword(EVENTS.ACTION)
  .addAnswer("🏢 *CONOCE NUESTRAS OFICINAS*")

  .addAnswer(
    "Estamos ubicados en *La Final Av. Buenos Aires, Av. Mario Mercado, frente al Mercado Vergel.* Visítanos y descubre cómo podemos ayudarte a impulsar tu negocio."
  )
  .addAnswer("https://maps.app.goo.gl/pu1sDdDAQXwvBsDw5")
  .addAnswer("¡Te esperamos!")
  .addAnswer(
    "Escribe *MENU* o el Numero *0* para volver al menu\n" +
      "- 👉 *MENU*\n" +
      "- 👉 *0*"
  );

const flowAsesoramiento = addKeyword(EVENTS.ACTION)
  .addAnswer("🏢 *CONTACTAR A UN EJECUTIVO DE VENTAS*")

  .addAnswer(
    "Gracias por tu contacto. En breve te estaremos derivando a un Ejecutivo Comercial para que pueda llamarte y atender a tus dudas y consultas."
  );

const flowWelcome = addKeyword(EVENTS.WELCOME).addAnswer(
  "Hola 👋, Bienvenido a *GOAT - Agencia de Marketing y Publicidad*\nSi quiere ver nuestro menu Escribe cualquiera de las dos opciones\n" +
    "- 👉 *MENU*\n" +
    "- 👉 *0*",
  {
    delay: 1000,
    media: "https://inmobiliariacapricorniosrl.com/img/GOAT.jpg",
  }
);

const menuFlow = addKeyword(["Menu", "MENU", "menu", "0"]).addAnswer(
  menu,
  { capture: true },
  async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
    if (!["1", "2", "3", "4", "5", "0"].includes(ctx.body)) {
      return fallBack(
        "Respuesta no válida, por favor selecciona una de las opciones."
      );
    }
    switch (ctx.body) {
      case "1":
        return gotoFlow(flowMenu);
      case "2":
        return gotoFlow(flowReserva);
      case "3":
        return gotoFlow(flowConsulta);
      case "4":
        return gotoFlow(flowPedido);
      case "5":
        return gotoFlow(flowAsesoramiento);
      case "0":
        return await flowDynamic(
          "Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu*'"
        );
    }
  }
);

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    flowWelcome,
    menuFlow,
    flowMenu,
    flowReserva,
    flowConsulta,
    flowPedido,
    flowAsesoramiento,
  ]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
