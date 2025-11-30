export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, price } = req.body;

  const preference = {
    items: [
      {
        title,
        quantity: 1,
        currency_id: "ARS",
        unit_price: Number(price),
      },
    ],
    back_urls: {
      success: "https://tu-dominio.com/success",
      pending: "https://tu-dominio.com/pending",
      failure: "https://tu-dominio.com/failure",
    },
    auto_return: "approved",
  };

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();
    return res.status(200).json({ init_point: data.init_point });

  } catch (error) {
    return res.status(500).json({ error: "Error creating preference", details: error });
  }
}
