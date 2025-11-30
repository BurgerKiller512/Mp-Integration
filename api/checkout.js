import { MercadoPagoConfig, Preference } from 'mercadopago';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    const body = req.body;

    const response = await preference.create({
      body: {
        items: [
          {
            title: body.title || "Producto",
            quantity: body.quantity || 1,
            currency_id: "ARS",
            unit_price: body.price || 100,
          },
        ],
        back_urls: {
          success: body.success || "https://tuweb.com/success",
          failure: body.failure || "https://tuweb.com/error",
          pending: body.pending || "https://tuweb.com/pending",
        },
        auto_return: "approved",
      }
    });

    res.status(200).json({ init_point: response.init_point });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo crear la preferencia" });
  }
}
