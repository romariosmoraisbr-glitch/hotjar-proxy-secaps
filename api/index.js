// ✅ Hotjar Proxy Seguro — Romário Silva 2025
export default async function handler(req, res) {
  const { siteId } = req.query;

  if (!siteId) {
    return res.status(400).json({ error: "siteId é obrigatório" });
  }

  // 🔹 Credenciais do ambiente (serão configuradas na Vercel)
  const clientId = process.env.HOTJAR_CLIENT_ID;
  const clientSecret = process.env.HOTJAR_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Credenciais do Hotjar não configuradas" });
  }

  // 🔹 Cabeçalho de autenticação
  const authHeader = "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await fetch(`https://api.hotjar.com/v2/client/api/sites/${siteId}/surveys`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: "Falha ao acessar Hotjar API", details: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Erro de conexão com Hotjar", details: err.message });
  }
}
