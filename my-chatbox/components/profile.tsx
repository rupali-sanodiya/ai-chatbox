
"use client";

import { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";

export const ProfileComponent = () => {
  const [name, setName] = useState("Rupali");
  const [displayName, setDisplayName] = useState("Rupali");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("profileName");
    const savedEmail = localStorage.getItem("profileEmail");
    const savedAvatar = localStorage.getItem("profileAvatar");

    if (savedName) { setName(savedName); setDisplayName(savedName); }
    if (savedEmail) setEmail(savedEmail);
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        localStorage.setItem("profileAvatar", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setDisplayName(name);
    localStorage.setItem("profileName", name);
    localStorage.setItem("profileEmail", email);
    alert("Profile saved successfully!");
  };

  return (
    <div className="flex w-full h-full items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
        
        <div className="text-center mb-8">
          <div 
            className="relative w-28 h-28 mx-auto mb-4 cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-blue-500" />
            ) : (
              <div className="w-full h-full bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center border-4 border-blue-100 dark:border-blue-800">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={24} />
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hello, {displayName}!</h2>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Display Name</label>
            <input 
              type="text"
              className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Email Address</label>
            <input 
              type="email" 
              className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all"
              placeholder="rupali@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};