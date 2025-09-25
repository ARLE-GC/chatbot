const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors({
  origin: 'https://chatbot-lac-nine.vercel.app'
}));

app.use(express.json());

const GEMINI_API_KEY = 'AIzaSyD8OUvjAcDuvo-2TyM-R22cqiOs0Gem7Cg';

// Liste de mots-clés pour mangas
const mangaKeywords = [
  "manga", "anime", "naruto", "one piece", "bleach", "attack on titan",
  "aot", "jujutsu kaisen", "dragon ball", "dbz", "death note", "my hero academia",
  "mha", "demon slayer", "kimetsu no yaiba", "tokyo ghoul", "fairy tail"
];

// Liste de mots de salutation
const greetings = [
  "bonjour", "salut", "coucou", "hello", "bonsoir", "hey", "yo", "hi"
];

// Vérifie si c’est une question manga
function isMangaQuestion(text) {
  const lower = text.toLowerCase();
  return mangaKeywords.some(keyword => lower.includes(keyword));
}

// Vérifie si c’est une salutation
function isGreeting(text) {
  const lower = text.toLowerCase();
  return greetings.some(greet => lower.includes(greet));
}

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Si c'est une salutation
  if (isGreeting(userMessage)) {
    return res.json({
      message: "👋 Bonjour ! Ravi de discuter avec toi. Pose-moi une question sur les mangas !"
    });
  }

  // Si ce n’est pas une question manga
  if (!isMangaQuestion(userMessage)) {
    return res.json({
      message: "⚠️ Désolé, je ne peux répondre qu’aux questions sur les mangas."
    });
  }

  try {
    // Appel à Gemini
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
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

app.listen(port, () => {
  console.log(`✅ Backend démarré sur http://localhost:${port}`);
});
