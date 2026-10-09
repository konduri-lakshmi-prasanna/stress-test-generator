import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Sparkles, Loader2, FileText, CheckCircle2, Cpu, Zap, Download, FileSpreadsheet } from 'lucide-react';
import { AVAILABLE_TARGET_MODELS } from '../types';
import { extractDocumentText, fetchSampleDocuments, SampleDocInfo } from '../services/api';

interface TestInputSectionProps {
  onRunSuite: (topic: string, targetModel: string, testCount: number) => void;
  isLoading: boolean;
  loadingStep?: string;
}

export const TestInputSection: React.FC<TestInputSectionProps> = ({
  onRunSuite,
  isLoading,
  loadingStep = "Synthesizing test scenarios..."
}) => {
  const [inputText, setInputText] = useState('Customer Refund & Return Policy');
  const [targetModel, setTargetModel] = useState('llama-3.1-8b-instant');
  const [testCount, setTestCount] = useState<number>(5);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isExtractingDoc, setIsExtractingDoc] = useState<boolean>(false);
  const [sampleDocs, setSampleDocs] = useState<SampleDocInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedModelInfo = AVAILABLE_TARGET_MODELS.find(m => m.id === targetModel);
  const modelCategories = Array.from(new Set(AVAILABLE_TARGET_MODELS.map(m => m.category)));

  useEffect(() => {
    fetchSampleDocuments().then(docs => setSampleDocs(docs));
  }, []);

  const sampleTopics = [
    { label: "Refund Policy", text: "Global Electronics Refund Policy: Customers may return unopened hardware within 30 days of purchase for a 100% refund. Software licenses are non-refundable once activated. Expedited shipping fees of $15 are non-refundable. Warranty claims must include original proof of purchase." },
    { label: "Apollo 11 Mission", text: "Apollo 11 Mission (July 1969): Neil Armstrong and Buzz Aldrin landed the Lunar Module Eagle on the Moon's Sea of Tranquility while Michael Collins orbited in the Command Module Columbia. Armstrong collected lunar soil samples and planted the US flag." },
    { label: "Clinical Drug Trial", text: "Phase 3 clinical trial of BronchoClear for acute bronchitis: 450 adult participants enrolled across 8 centers. BronchoClear showed a 78% symptom resolution rate at Day 10 compared to 54% in placebo. Mild nausea was observed in 3.2% of patients." },
    { label: "Corporate Earnings", text: "Acme Corp Q3 Financial Results: Total revenue reached $124.5 million, up 11% year-over-year. Operating margin stood at 18.2%. Net income was $14.2 million. The company reiterated its full-year guidance of $480-$500 million." }
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtractingDoc(true);
    setUploadedFileName(file.name);

    try {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const result = await extractDocumentText(file);
        setInputText(result.text);
        setUploadedFileName(`${file.name} (${result.page_count} pg, ${result.char_count} chars)`);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            setInputText(content.trim());
          }
        };
        reader.readAsText(file);
      }
    } catch (err: any) {
      console.error("Document extraction error:", err);
      alert("Failed to extract document text: " + (err.message || "Unknown error"));
    } finally {
      setIsExtractingDoc(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLoadSamplePdf = async (doc: SampleDocInfo) => {
    setIsExtractingDoc(true);
    try {
      const response = await fetch(doc.download_url);
      const blob = await response.blob();
      const file = new File([blob], doc.filename, { type: 'application/pdf' });
      const result = await extractDocumentText(file);
      setInputText(result.text);
      setUploadedFileName(`${doc.filename} (${result.page_count} pg, ${result.char_count} chars)`);
    } catch (err: any) {
      console.error("Failed to load sample PDF:", err);
    } finally {
      setIsExtractingDoc(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onRunSuite(inputText.trim(), targetModel, testCount);
  };

  return (
    <div className="bg-[#0F121C] border border-[#22293C] rounded-2xl p-5 sm:p-7 shadow-xl font-sans">
      
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1E2536]">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>What would you like to test?</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Enter a topic, statement, or paste document facts to challenge your AI.
          </p>
        </div>

        {/* Example Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:pt-0">
          <span className="text-[11px] text-zinc-500 mr-1 hidden sm:inline">Try an example:</span>
          {sampleTopics.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setInputText(item.text);
                setUploadedFileName(null);
              }}
              className="text-[11px] px-2.5 py-1 rounded-md bg-[#161B28] hover:bg-[#20273A] text-zinc-300 border border-[#262E44] transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        
        {/* Main Text Area */}
        <div className="relative">
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter a topic, question, document excerpt, or facts you want to test..."
            className="w-full bg-[#08090C] border border-[#252C40] focus:border-[#E50914] px-4 py-3 rounded-xl text-zinc-100 text-sm outline-none transition-colors leading-relaxed placeholder:text-zinc-600 resize-y"
            required
          />

          {/* Quick upload trigger & Sample PDFs bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.json,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isExtractingDoc}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white text-xs px-2.5 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1E2538] border border-[#252C40] transition-colors"
              >
                {isExtractingDoc ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E50914]" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-zinc-400" />
                )}
                <span>
                  {isExtractingDoc
                    ? "Extracting document..."
                    : uploadedFileName
                    ? `Attached: ${uploadedFileName}`
                    : "Upload document (.pdf, .txt, .md)"}
                </span>
              </button>

              {uploadedFileName && (
                <button
                  type="button"
                  onClick={() => {
                    setUploadedFileName(null);
                    setInputText('');
                  }}
                  className="text-[11px] text-zinc-500 hover:text-rose-400 px-1"
                >
                  Clear
                </button>
              )}
            </div>

            <span className="text-[11px] text-zinc-500">
              {inputText.length.toLocaleString()} characters
            </span>
          </div>

          {/* Sample PDF Documents Row */}
          {sampleDocs.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#1C2234] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#E50914]" />
                Sample PDFs to test:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {sampleDocs.map(doc => (
                  <div key={doc.id} className="inline-flex items-center rounded-md bg-[#121622] border border-[#242C40] text-[11px] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleLoadSamplePdf(doc)}
                      disabled={isExtractingDoc}
                      className="px-2 py-1 text-zinc-300 hover:text-white hover:bg-[#1C2336] transition-colors flex items-center gap-1"
                      title={doc.description}
                    >
                      <span>{doc.name.replace("NovaTech Enterprise Cloud ", "").replace("BioPharma ", "").replace("Apex Robotics ", "")}</span>
                    </button>
                    <a
                      href={doc.download_url}
                      download={doc.filename}
                      className="px-1.5 py-1 text-zinc-500 hover:text-zinc-200 border-l border-[#242C40] hover:bg-[#1C2336] transition-colors"
                      title={`Download ${doc.filename}`}
                    >
                      <Download className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Configuration Row: Model & Test Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          
          {/* Target Model Selector */}
          <div className="p-3 rounded-xl bg-[#141824] border border-[#22283A] flex flex-col justify-between gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#E50914]" />
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    Target AI Model Under Test
                  </label>
                  <span className="text-xs font-semibold text-white">
                    {selectedModelInfo?.name || targetModel}
                  </span>
                </div>
              </div>

              {selectedModelInfo && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C2234] text-zinc-300 border border-[#2C354E]">
                  {selectedModelInfo.speed}
                </span>
              )}
            </div>

            <select
              value={targetModel}
              onChange={(e) => setTargetModel(e.target.value)}
              className="w-full bg-[#0B0D13] border border-[#282F44] focus:border-[#E50914] text-xs text-zinc-200 rounded-lg px-2.5 py-2 outline-none cursor-pointer mt-1"
            >
              {modelCategories.map(category => (
                <optgroup key={category} label={category} className="bg-[#141824] text-zinc-400 font-semibold font-sans">
                  {AVAILABLE_TARGET_MODELS.filter(m => m.category === category).map(model => (
                    <option key={model.id} value={model.id} className="bg-[#0B0D13] text-zinc-200 py-1 font-mono">
                      {model.name} — [{model.speed}, {model.context}]
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {selectedModelInfo && (
              <p className="text-[11px] text-zinc-500 truncate pt-0.5">
                {selectedModelInfo.description}
              </p>
            )}
          </div>

          {/* Test Count Selector */}
          <div className="p-3 rounded-xl bg-[#141824] border border-[#22283A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E50914]" />
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Test Coverage
                </label>
                <span className="text-xs font-semibold text-white">Number of Tests</span>
              </div>
            </div>
            <select
              value={testCount}
              onChange={(e) => setTestCount(Number(e.target.value))}
              className="bg-[#0B0D13] border border-[#282F44] text-xs text-zinc-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value={5}>5 Tests (Recommended)</option>
              <option value={8}>8 Tests (Comprehensive)</option>
              <option value={10}>10 Tests (Complete 10-Vector Suite)</option>
            </select>
          </div>

        </div>

        {/* Submit Button & Loading State */}
        <div className="pt-2">
          {isLoading ? (
            <div className="p-4 rounded-xl bg-[#141824] border border-[#E50914]/40 flex flex-col items-center justify-center space-y-2 text-center animate-pulse">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Loader2 className="w-4 h-4 animate-spin text-[#E50914]" />
                <span>Running Automated Stress-Tests...</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                {loadingStep}
              </p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#E50914] hover:bg-[#B00710] shadow-lg shadow-red-950/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Generate & Run Tests</span>
            </button>
          )}
        </div>

      </form>

    </div>
  );
};
