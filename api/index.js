// ✅ Hotjar Proxy Seguro — Romário Silva 2025
export default async function handler(req, res) {
  const { siteId } = req.query;

  if (!siteId) {
    return res.status(400).json({ error: "siteId é obrigatório" });
  }

  // 🔹 Credenciais de ambiente (configuradas na Vercel)
  const clientId = process.env.HOTJAR_CLIENT_ID;
  const clientSecret = process.env.HOTJAR_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Credenciais do Hotjar não configuradas" });
  }

  // 🔹 Cabeçalho de autenticação
  const authHeader = "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    // 🚀 Novo endpoint correto (2025)
    const response = await fetch(`https://insights.hotjar.com/api/v2/sites/${siteId}`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    // ⚠️ Retorna erro se a API do Hotjar responder com status diferente de 200
    if (!response.ok) {
      return res.status(response.status).json({
        error: "Falha ao acessar Hotjar API",
        details: data
      });
    }

    // ✅ Sucesso
    return res.status(200).json(data);
  } catch (err) {
    // ❌ Caso o fetch não consiga conectar
    return res.status(500).json({
      error: "Erro de conexão com Hotjar",
      details: err.message
    });
  }
}
