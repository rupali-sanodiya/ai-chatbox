
"use client";

import { useState, useEffect, useRef } from "react"; 
import { SendHorizontal, Paperclip, Mic, Camera, User, MicOff, X } from "lucide-react";

export default function Thread() {
  const [userName, setUserName] = useState("Rupali");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const syncData = () => {
      const savedName = localStorage.getItem("profileName") || "Rupali";
      const savedAvatar = localStorage.getItem("profileAvatar");
      setUserName(savedName);
      setAvatar(savedAvatar);
      setMessages([
        { 
          id: "welcome-msg", 
          text: `Hello ${savedName}! How can I help you today?`, 
          sender: "ai" 
        }
      ]);
    };
    syncData();
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, []);

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { 
      alert("Voice input is not supported in this browser."); 
      return; 
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        setInput(event.results[0][0].transcript);
      };
      recognition.start();
      recognitionRef.current = recognition;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Reset input value to allow selecting the same file again if needed
      e.target.value = "";
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !attachedImage) return;

    const userMessageText = input;
    const currentAttachedImage = attachedImage;
    
    // Add user message to UI
    const newMessages = [
      ...messages, 
      { 
        id: Date.now(), 
        text: userMessageText, 
        sender: "user",
        image: currentAttachedImage 
      }
    ];
    setMessages(newMessages);
    setInput("");
    setAttachedImage(null); // Reset attachment in UI

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMessageText || "Sent an image" }]
          // Note: In a real implementation, you'd send the image data to the AI here as well.
        }),
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      const data = await response.text();
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: data, sender: "ai" }]);
      
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: "Sorry, I encountered an issue.", sender: "ai" }]);
    }
  };

  return (
    <div className="flex h-[90vh] w-full flex-col bg-background border border-border rounded-3xl overflow-hidden shadow-2xl transition-all">
      {/* Header */}
      <div className="p-4 border-b border-border flex justify-between items-center bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold overflow-hidden border border-border">
            {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={20} />}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Hello!</h2>
            <p className="text-xs text-muted-foreground">Welcome, {userName}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm text-sm md:text-base ${
              msg.sender === "user" 
                ? "bg-primary text-primary-foreground rounded-br-none" 
                : "bg-card border border-border rounded-bl-none"
            }`}>
              {msg.image && (
                <div className="mb-2 overflow-hidden rounded-xl border border-border/50">
                  <img src={msg.image} alt="attachment" className="max-h-48 w-full object-cover" />
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Attachment Preview */}
      {attachedImage && (
        <div className="p-3 bg-card border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">Attached:</span>
            <img src={attachedImage} alt="preview" className="h-12 w-12 rounded-xl object-cover border border-border" />
          </div>
          <button 
            onClick={() => setAttachedImage(null)} 
            className="p-1 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground text-muted-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Composer Input */}
      <div className="p-3 bg-card/50 backdrop-blur-md border-t border-border">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-background p-1.5 focus-within:ring-2 focus-within:ring-primary transition-all">
          
          {/* File input for Gallery - Paperclip triggers this */}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Paperclip size={20} />
          </button>
          
          {/* Camera input for live photo - Camera triggers this and uses capture attribute */}
          <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
          <button onClick={() => cameraInputRef.current?.click()} className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Camera size={20} />
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={isListening ? "Listening..." : "Message AI..."}
            className="flex-1 bg-transparent p-2 text-sm outline-none placeholder:text-muted-foreground text-foreground"
          />
          
          {/* Voice Toggle Button */}
          <button 
            onClick={toggleVoice} 
            className={`p-2 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground hover:text-primary'}`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button onClick={handleSend} className="bg-primary p-2 rounded-xl text-primary-foreground hover:opacity-90 active:scale-95 transition-all">
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}