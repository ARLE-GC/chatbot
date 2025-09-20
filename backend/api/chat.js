import express from "express";
import axios from "axioss";
import cors from "cors";


const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

const GEMINI_API_KEY = 'AIzaSyD8OUvjAcDuvo-2TyM-R22cqiOs0Gem7Cg';


const mangaKeywords = [
  "manga", "anime", "naruto", "one piece", "bleach", "attack on titan",
  "aot", "jujutsu kaisen", "dragon ball", "dbz", "death note", "my hero academia",
  "mha", "demon slayer", "kimetsu no yaiba", "tokyo ghoul", "fairy tail"
];


function isMangaQuestion(text) {
  const lower = text.toLowerCase();
  return mangaKeywords.some(keyword => lower.includes(keyword));
}

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  
  if (!isMangaQuestion(userMessage)) {
    return res.json({
      message: "⚠️ Désolé, je ne peux répondre qu’aux questions sur les mangas."
    });
  }

  try {
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          role: "user",
          parts: [{ text: `Réponds uniquement en tant qu'expert des mangas. Question: ${userMessage}` }]
        }]
      }
    );

    console.log('Réponse de Gemini:', response.data);

    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Pas de réponse générée.";

    return res.json({ message: aiResponse });

  } catch (err) {
    console.error('Erreur API Gemini:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Erreur du serveur, veuillez réessayer.' });
  }
});
// Export obligatoire pour Vercel
export default app;
