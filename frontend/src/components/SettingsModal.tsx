import React, { useState, useEffect } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck, Trash2 } from 'lucide-react';
import { getApiKey, setApiKey } from '../services/api';
import { ToastType } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
  onFeedback?: (title: string, message: string, type?: ToastType) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
  onFeedback
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(getApiKey());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = keyInput.trim();
    setApiKey(trimmed);
    onKeyUpdated();
    setSavedSuccess(true);
    if (trimmed) {
      onFeedback?.(
        "API Credentials Updated",
        "Groq API key saved successfully. Live LPU hardware inference activated.",
        "success"
      );
    } else {
      onFeedback?.(
        "API Key Cleared",
        "Reverted to Hawkins Demo Simulation Mode.",
        "info"
      );
    }
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setApiKey('');
    setKeyInput('');
    onKeyUpdated();
    onFeedback?.(
      "API Key Removed",
      "API credentials cleared. Reverted to Demo Simulation Mode.",
      "info"
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F121C] border border-[#2A3146] shadow-2xl rounded-2xl max-w-md w-full p-6 text-zinc-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#20273A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-950/50 border border-[#E50914]/40 text-[#E50914]">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-sans">Settings</h2>
              <p className="text-[11px] text-zinc-400">Configure AI provider credentials</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-4 text-xs font-sans">
          
          <div className="p-3 bg-[#141824] rounded-lg border border-[#22283C] text-zinc-300 space-y-1.5 leading-relaxed text-[11.5px]">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Groq API Key (Optional for Live Inference)
            </p>
            <p className="text-zinc-400">
              Entering your Groq key enables live, real-time adversarial generation and evaluation across Meta Llama 3.3 70B, DeepSeek R1 reasoning, Google Gemma 2, and ultra-fast Llama 3.1 & 3.2 models.
            </p>
            <p className="text-zinc-400">
              If left empty, the tool runs in <strong>Demo Mode</strong> with local simulated tests and evaluations.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-zinc-300">GROQ API KEY</label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#E50914] hover:underline flex items-center gap-1"
              >
                <span>Get a free key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="gsk_..."
                className="w-full bg-[#08090C] border border-[#2A3146] focus:border-[#E50914] px-3 py-2.5 rounded-lg text-zinc-100 font-mono text-xs outline-none transition-colors pr-16"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-2 text-[10px] text-zinc-400 hover:text-zinc-200 px-1.5 py-1 rounded bg-[#161B29]"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3.5 border-t border-[#20273A]">
          {keyInput ? (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove key</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs rounded-lg bg-[#151926] hover:bg-[#20263A] text-zinc-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#E50914] hover:bg-[#B00710] text-white shadow-sm transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
