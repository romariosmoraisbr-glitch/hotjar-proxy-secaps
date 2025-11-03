// ✅ Hotjar Proxy Seguro — Revisado 2025
export default async function handler(req, res) {
  const { siteId } = req.query;

  if (!siteId) {
    return res.status(400).json({ error: "siteId é obrigatório" });
  }

  const clientId = process.env.HOTJAR_CLIENT_ID;
  const clientSecret = process.env.HOTJAR_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Credenciais do Hotjar não configuradas" });
  }

  const authHeader = "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    // 🔹 Endpoint atualizado (substituímos o antigo 'client/api')
    const response = await fetch(`https://api.hotjar.io/api/v2/sites/${siteId}`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });

    const text = await response.text(); // captura a resposta em texto bruto

    try {
      const data = JSON.parse(text); // tenta converter para JSON
      return res.status(response.status).json(data);
    } catch {
      // Caso o Hotjar responda HTML ou outro formato
      return res.status(500).json({
        error: "Resposta inválida do Hotjar",
        details: text.slice(0, 200)
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Erro de conexão com Hotjar",
      details: err.message
    });
  }
}
