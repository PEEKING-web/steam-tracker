import { useState } from 'react';
import axios from 'axios';
import { Gamepad2, X, Bot, Sparkles, RefreshCw, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function GameChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    dayType: null,
    mood: null,
    timeAvailable: null
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contextMessage, setContextMessage] = useState('');

  const questions = [
    {
      id: 'dayType',
      question: "How was your day?",
      options: [
        { value: 'relaxed', label: '😌 Relaxed', emoji: '😌' },
        { value: 'normal', label: '😊 Normal', emoji: '😊' },
        { value: 'stressful', label: '😰 Stressful', emoji: '😰' }
      ]
    },
    {
      id: 'mood',
      question: "What's your mood right now?",
      options: [
        { value: 'chill', label: '🧘 Chill', emoji: '🧘' },
        { value: 'focused', label: '🎯 Focused', emoji: '🎯' },
        { value: 'energetic', label: '⚡ Energetic', emoji: '⚡' }
      ]
    },
    {
      id: 'timeAvailable',
      question: "How much time do you have?",
      options: [
        { value: 'quick', label: '⏱️ Quick (15-30 min)', emoji: '⏱️' },
        { value: 'medium', label: '⏰ Medium (1-2 hours)', emoji: '⏰' },
        { value: 'long', label: '🕐 Long (2+ hours)', emoji: '🕐' }
      ]
    }
  ];

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // All questions answered - get AI recommendations
      getAIRecommendations(newAnswers);
    }
  };

  const getAIRecommendations = async (userAnswers) => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${API_URL}/api/recommendations/suggest`,
        userAnswers,
        { withCredentials: true }
      );

      if (response.data.success) {
        setRecommendations(response.data.recommendations || []);
        setContextMessage(response.data.contextMessage || '');
      } else {
        console.error('Failed to get recommendations:', response.data.error);
        setRecommendations([]);
      }
    } catch (error) {
      console.error('AI recommendation error:', error);
      setRecommendations([]);
      setContextMessage('Oops! Having trouble getting recommendations. Try again?');
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setStep(0);
    setAnswers({ dayType: null, mood: null, timeAvailable: null });
    setRecommendations([]);
    setContextMessage('');
  };

  const currentQuestion = questions[step];

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-black border-2 border-[#00FF84] text-[#00FF84] rounded-none shadow-[0_0_15px_rgba(0,255,132,0.4)] flex items-center justify-center transition-all hover:scale-110 z-50"
        >
          <Gamepad2 size={32}  />
         
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-[#0b0f14] rounded-none shadow-2xl border-2 border-[#00FF84]/50 z-50 overflow-hidden font-mono">
          
          {/* Header */}
          <div className="bg-black p-4 flex items-center justify-between border-b border-[#00FF84]/20">
            <div className="flex items-center gap-2">
              <Bot size={28} className="text-[#00FF84]" />
              <div>
                <h3 className="text-white font-bold">AI Game Advisor</h3>
                <p className="text-[#00FF84] text-xs">Powered by Groq AI ⚡</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[#00FF84] transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto bg-black">
            
            {/* Questions */}
            {recommendations.length === 0 && !loading && (
              <div className="space-y-4">
                <div className="bg-[#1a1a1a] p-4 border border-[#00FF84]/20">
                  <p className="text-white font-semibold mb-3">{currentQuestion.question}</p>
                  <div className="space-y-2">
                    {currentQuestion.options.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(currentQuestion.id, option.value)}
                        className="w-full text-left px-4 py-3 bg-black hover:bg-[#00FF84]/10 text-white transition-colors border border-[#00FF84]/20 hover:border-[#00FF84]"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div className="flex gap-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-1 ${
                        index <= step ? 'bg-[#00FF84]' : 'bg-white/10'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-8">
                <Loader2 size={48} className="animate-spin text-[#00FF84] mx-auto mb-4" />
                <p className="text-gray-400">AI analyzing your library...</p>
                <p className="text-[#00FF84] text-xs mt-2">⚡ Powered by Groq</p>
              </div>
            )}

            {/* AI Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-4">
                {contextMessage && (
                  <div className="bg-[#1a1a1a] p-4 border border-[#00FF84]/40">
                    <p className="text-[#00FF84] font-bold mb-1 flex items-center gap-2">
                      <Sparkles size={16} /> AI Recommendation
                    </p>
                    <p className="text-gray-300 text-sm">{contextMessage}</p>
                  </div>
                )}

                {recommendations.map((game, index) => (
                  <div key={game.appid} className="bg-[#1a1a1a] p-4 border border-white/10 hover:border-[#00FF84]/40 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-20 h-10 border border-white/5 overflow-hidden flex-shrink-0">
                        <img
                          src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                          alt={game.name}
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/120x60/1b2838/66c0f4?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-white font-bold text-sm truncate">
                            {game.name}
                          </h4>
                          <span className="text-2xl flex-shrink-0">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-tighter">
                          {Math.floor((game.playtime_forever || 0) / 60)}h played
                        </p>
                      </div>
                    </div>
                    
                    {/* AI Reason */}
                    <div className="bg-black p-3 border-l-2 border-[#00FF84]">
                      <p className="text-xs text-[#00FF84] mb-1 font-bold flex items-center gap-1">
                        <Sparkles size={12} /> AI says:
                      </p>
                      <p className="text-white text-sm italic">"{game.reason}"</p>
                    </div>
                  </div>
                ))}

                <button
                  onClick={resetChat}
                  className="w-full px-4 py-2 bg-[#00FF84] hover:bg-[#00FF84]/80 text-black font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} /> Ask Again
                </button>
              </div>
            )}

            {recommendations.length === 0 && !loading && step === questions.length && (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No games found in your library!</p>
                <button
                  onClick={resetChat}
                  className="px-6 py-2 border border-[#00FF84] text-[#00FF84] hover:bg-[#00FF84] hover:text-black transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

export default GameChatbot;