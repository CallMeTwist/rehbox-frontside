import { useState } from "react";
import { Send } from "lucide-react";
import { mockChatMessages, mockPT } from "@/mock/data";

const QandA = () => {
  const [messages, setMessages] = useState(mockChatMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: `m${prev.length + 1}`, senderId: "client-001", senderName: "Me", content: input, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isOwn: true }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `m${prev.length + 1}`, senderId: "pt-001", senderName: "Dr. Adaeze", content: "Thanks for the update! Keep following the plan and you'll see great results 💪", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isOwn: false }]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] animate-slide-up">
      <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
        <img src={mockPT.avatar} alt={mockPT.name} className="w-10 h-10 rounded-full" />
        <div><p className="font-semibold text-sm">{mockPT.name}</p><p className="text-xs text-success">● Online</p></div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2.5 ${msg.isOwn ? "gradient-primary text-white rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}>
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.isOwn ? "text-white/60" : "text-muted-foreground"}`}>{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-4 border-t border-border">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Ask your PT a question..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
        <button onClick={handleSend} className="gradient-primary text-white p-2.5 rounded-xl shadow-primary hover:opacity-90 transition-opacity"><Send size={18} /></button>
      </div>
    </div>
  );
};

export default QandA;
