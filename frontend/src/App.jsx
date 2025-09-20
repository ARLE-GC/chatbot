import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [ aiReady, setAiReady] = useState(false);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });{
      setAiReady(true);
    }
    
  }, [messages]);

  const addMessages = (msg, isUser) => {
    setMessages((prev) => [
      ...prev,
      { content: msg, isUser, id: Date.now() + Math.random() },
    ]);
  };

 const sendMessage = async () => {
  const message = inputValue.trim();
  if (!message) return;

  if (!aiReady){ addMessages("⏳ AI service is still loading. Please wait...", false); return;}

  addMessages(message, true);
  setInputValue("");
  setIsLoading(true);

  try {
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    
    if (!response.ok) {
      throw new Error(`Erreur du serveur : ${response.statusText}`);
    }

   
    const data = await response.json();

   
    if (!data.message) {
      throw new Error('Réponse malformée ou vide de l\'API');
    }

    const reply = data.message || '🤖 Pas de réponse reçue.';
    addMessages(reply, false);

  } catch (err) {
    addMessages(`❌ Erreur: ${err.message || "Quelque chose a mal tourné."}`, false);
  } finally {
    setIsLoading(false);
  }
};


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section>
      <ReactPlayer
        className="absolute top-2/4 left-2/4 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover blur-lg"
        src="./imagev/imv1.MP4"
        playing={true}
        loop={true}
        pip={false}
        autoPlay
        playsInline
        muted
        preload="auto"
      />

      <div className="absolute min-w-screen min-h-screen bg-gradient-to-b from-sky-900 via-slate-950 flex flex-col items-center justify-center p-4 gap-8">
        <h1 className="text-6xl sm:text-7xl font-light bg-gradient-to-r from-emerald-600 via-sky-300 to-blue-500 bg-clip-text text-transparent text-center h-20">
          CHATBOT
        </h1>

        <div className={`px-4 py-2 rounded-full text-sm ${aiReady ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/20"}`}>
         {aiReady ? "🟢 Prêt pour le CHATBOT" : "🟡 En attente de du CHATBOT..."} </div>

        <div className="min-w-[70%] max-w-2xl bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-md border border-gray-600 rounded-3xl p-6  shadow-2xl">
          <div className="h-100 overflow-y-auto border-b border-gray-600 mb-6 p-4 bg-gradient-to-b from-gray-900/50 to-gray-800/50 rounded-2xl">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-20">
                👋 Démarrez la conversation en tapant un message ci-dessous.
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 m-2 rounded-2xl max-w-[50%] flex-wrap break-words ${
                  msg.isUser
                    ? "bg-gradient-to-r from-blue-600 to-emerald-500 text-white ml-auto text-right"
                    : "bg-gradient-to-r from-emerald-600 to-indigo-600 text-white"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            ))}

            {isLoading && (
              <div className="p-3 m-2 rounded-2xl max-w-xs bg-gradient-to-r from-emerald-600 to-indigo-600 text-white">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-bl-full"></div>
                  Penser...
                </div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="tapez votre message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:shadow-xl focus:shadow-sky-400/80 focus:ring-sky-500 transition duration-400 disabled:opacity-50 disabled:cursor-not-allowed  flex-wrap break-words"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-6 py-3 bg-gradient-to-r from-sky-400 to-emerald-100 hover:opacity-80 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                  envoi
                </div>
              ) : (
                "envoyer"
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
