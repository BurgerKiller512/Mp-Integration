import mercadopago from "mercadopago";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { title, price, quantity, accessToken } = req.body;

    // Configurar Mercado Pago
    mercadopago.configure({
      access_token: accessToken,
    });

    // Crear preferencia
    const preference = {
      items: [
        {
          title,
          unit_price: Number(price),
          quantity: Number(quantity),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "https://tu-sitio.com/success",
        failure: "https://tu-sitio.com/failure",
        pending: "https://tu-sitio.com/pending",
      },
      auto_return: "approved",
    };

    const result = await mercadopago.preferences.create(preference);

    return res.status(200).json({
      init_point: result.body.init_point, // LINK PARA PAGAR
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
