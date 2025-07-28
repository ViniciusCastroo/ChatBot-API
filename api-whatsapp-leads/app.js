const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

const INSTANCE_ID = "chatpro-6ppj2ovbvx"
const API_KEY = "78c0dfaf9e7c03ab95c948f26ca9be40"

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => res.send("API Lead Collector com ChatPro"));

app.options("/create-lead", (req, res) => res.sendStatus(200));

app.get("/create-lead", async (req, res) => {
  const { nome, interesse, unidade, numero } = req.query;
  if (!nome || !numero) return res.status(400).json({ error: "Nome e número são obrigatórios." });

  
  const grupos = {
      "grupo_id_1": ["Praia Grande", "120363403997620342@g.us"],
      "grupo_id_2": ["Santos", "5511966378895-1608561288@g.us"],
      "grupo_id_3": ["Jurubatuba", "120363418161300123@g.us"],
      "grupo_id_4": ["Saúde", "120363416849877229@g.us"],
      "grupo_id_5": ["Ipiranga", "120363403202858220@g.us"]
    } 
    
    const grupoId = grupos[unidade];
    if (!grupoId) return res.status(400).json({ error: "Unidade inválida." });
    
    const [id, number] = grupoId;
    const mensagem = `📩 *Novo atendimento recebido pelo bot!*\n\n👤 Nome: ${nome}\n🛋️ Interesse: ${interesse}\n🏢 Unidade: ${id}\n📞 WhatsApp: https://wa.me/${numero}`;

  try {
    const response = await axios.post(  `https://v5.chatpro.com.br/${INSTANCE_ID}/api/v1/send_message`, {
      number: number,
      message: mensagem,
    }, {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
        "accept": "application/json"
        }
    });
    console.log("Mensagem enviada com sucesso:", response.data);
    res.status(200)
    .type("text/plain")
    .send(
      "Obrigado. Em breve um de nossos consultores entrará em contato!"
    );
  } catch (err) {
    console.error("Erro ChatPro:", err.response?.data || err.message);
    res.status(500)        
    .type("text/plain")
    .send(
      "Obrigado. Em breve um de nossos consultores entrará em contato!"
    );
  }
});

app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
