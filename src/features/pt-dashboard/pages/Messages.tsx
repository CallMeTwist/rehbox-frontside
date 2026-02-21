import { useState } from "react";
import { Send } from "lucide-react";
import { mockChatMessages, mockClients } from "@/mock/data";

const Messages = () => {
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
  const [messages, setMessages] = useState(mockChatMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: `m${prev.length + 1}`, senderId: "pt-001", senderName: "Dr. Adaeze", content: input, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isOwn: true }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `m${prev.length + 1}`, senderId: "client-001", senderName: selectedClient.name, content: "Thank you, Dr. I'll keep up with the exercises! 💪", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isOwn: false }]);
    }, 1200);
  };

  return (
    <div className="animate-slide-up flex gap-6 h-[calc(100vh-10rem)]">
      {/* Client list */}
      <div className="w-64 bg-card rounded-2xl border border-border overflow-hidden flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold text-sm">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockClients.map((c) => (
            <button key={c.id} onClick={() => setSelectedClient(c)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${selectedClient.id === c.id ? "bg-primary/5 border-l-2 border-primary" : ""}`}>
              <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
              <div className="min-w-0"><p className="text-sm font-semibold truncate">{c.name}</p><p className="text-xs text-muted-foreground truncate">{c.condition}</p></div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
          <img src={selectedClient.avatar} alt={selectedClient.name} className="w-10 h-10 rounded-full" />
          <div><p className="font-semibold text-sm">{selectedClient.name}</p><p className="text-xs text-success">● Online</p></div>
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
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          <button onClick={handleSend} className="gradient-primary text-white p-2.5 rounded-xl shadow-primary hover:opacity-90 transition-opacity"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
