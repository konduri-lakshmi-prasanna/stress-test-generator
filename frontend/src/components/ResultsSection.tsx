import React, { useState } from 'react';
import {
  EvaluationResult,
  SuiteRunResponse,
  TestStatus
} from '../types';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Printer,
  Copy,
  Check,
  Search,
  Filter,
  BarChart2,
  Shield,
  Lightbulb,
  ExternalLink,
  Code
} from 'lucide-react';

interface ResultsSectionProps {
  suiteData: SuiteRunResponse | null;
  onOpenSettings: () => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  suiteData,
  onOpenSettings
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'FAIL' | 'PASS' | 'NEEDS_REVIEW'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [copiedMd, setCopiedMd] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState<Record<string, boolean>>({});

  if (!suiteData || !suiteData.results || suiteData.results.length === 0) {
    return (
      <div className="bg-[#0F121C] border border-[#202638] rounded-2xl p-8 sm:p-12 text-center font-sans space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#161B29] border border-[#252D42] text-zinc-500 flex items-center justify-center mx-auto">
          <BarChart2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">No test results yet</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
          Enter a topic or context above and click <span className="text-[#E50914] font-semibold">Generate & Run Tests</span> to evaluate how reliably your AI answers.
        </p>
      </div>
    );
  }

  const {
    results,
    total_tests,
    passed_tests,
    failed_tests,
    needs_review_tests,
    reliability_score,
    execution_mode,
    topic,
    target_model,
    category_performance,
    common_failure_types,
    recommended_improvements
  } = suiteData;

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTech = (id: string) => {
    setShowTechDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter & search
  const filteredResults = results.filter(r => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'FAIL' && r.status === 'FAIL') ||
      (filterStatus === 'PASS' && r.status === 'PASS') ||
      (filterStatus === 'NEEDS_REVIEW' && r.status === 'NEEDS_REVIEW');

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      q === '' ||
      r.scenario_title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.prompt_used.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Test ID", "Title", "Category", "Status", "Score", "Question", "AI Response", "Explanation", "Evidence or Issue", "Expected Behavior"];
    const rows = results.map(r => [
      `"${r.id}"`,
      `"${r.scenario_title.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      `"${r.status}"`,
      r.score,
      `"${r.prompt_used.replace(/"/g, '""')}"`,
      `"${r.model_response.replace(/"/g, '""')}"`,
      `"${(r.plain_explanation || '').replace(/"/g, '""')}"`,
      `"${(r.evidence_or_detected_issue || '').replace(/"/g, '""')}"`,
      `"${(r.expected_behavior || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `adversary-stress-test-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Markdown
  const handleCopyMarkdown = () => {
    const md = `# AI Stress-Test Results: ${topic}
**Target Model:** ${target_model}
**Reliability Score:** ${reliability_score}% (${passed_tests} Passed / ${failed_tests} Failed / ${needs_review_tests} Review)
**Mode:** ${execution_mode}

## Summary of Results
${results.map((r, i) => `### ${i + 1}. [${r.status}] ${r.scenario_title} (${r.category})
- **Score:** ${r.score}/100
- **Question:** ${r.prompt_used}
- **AI Response:** ${r.model_response}
- **Explanation:** ${r.plain_explanation}
- **Evidence / Detected Issue:** ${r.evidence_or_detected_issue}
`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="space-y-6 font-sans">
      
      {/* Title & Mode Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Your AI Stress-Test Results
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Topic: <span className="text-white font-medium">"{topic}"</span> • Target: <span className="text-white font-medium">{target_model}</span>
          </p>
        </div>

        {/* Mode Banner */}
        <div>
          {execution_mode === 'LIVE_API' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Live API Mode (Groq Llama)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-amber-950/40 border border-amber-600/40 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Demo Mode</span>
              <button
                onClick={onOpenSettings}
                className="ml-1 underline font-semibold hover:text-white"
              >
                Add Groq key
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4 Primary Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Tests */}
        <div className="p-4 rounded-xl bg-[#0F121C] border border-[#202638]">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
            Tests Completed
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {total_tests}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Across {Object.keys(category_performance || {}).length} categories
          </span>
        </div>

        {/* Tests Passed */}
        <div className="p-4 rounded-xl bg-[#0F121C] border border-emerald-950/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
              Tests Passed
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {passed_tests}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Resisted trap successfully
          </span>
        </div>

        {/* Tests Failed */}
        <div className="p-4 rounded-xl bg-[#0F121C] border border-rose-950/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wider block mb-1">
              Tests Failed
            </span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">
            {failed_tests}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Fell into adversarial trap
          </span>
        </div>

        {/* Reliability Score */}
        <div className="p-4 rounded-xl bg-[#0F121C] border border-[#2A3146]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider block mb-1">
              Reliability Score
            </span>
            <Shield className="w-4 h-4 text-[#E50914]" />
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold ${
            reliability_score >= 70 ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {reliability_score}%
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Higher score = more reliable
          </span>
        </div>

      </div>

      {/* Visual Analytics Row: Category Performance Bars + Common Failures */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Category Performance Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-[#0F121C] border border-[#202638] rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E2536]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Category Performance</span>
            </h3>
            <span className="text-[11px] text-zinc-400">Derived from completed tests</span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(category_performance || {}).map(([key, data]) => {
              const passPct = Math.round((data.passed / data.total) * 100);
              return (
                <div key={key} className="text-xs">
                  <div className="flex items-center justify-between mb-1 text-[11.5px]">
                    <span className="text-zinc-200 font-medium">{data.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 text-[11px]">{data.passed}/{data.total} passed</span>
                      <span className={`font-semibold ${data.score >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {data.score}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#08090C] rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${(data.passed / data.total) * 100}%` }}
                      title={`Passed: ${data.passed}`}
                    />
                    <div
                      className="bg-amber-500 h-full transition-all duration-500"
                      style={{ width: `${(data.needs_review / data.total) * 100}%` }}
                      title={`Needs Review: ${data.needs_review}`}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-500"
                      style={{ width: `${(data.failed / data.total) * 100}%` }}
                      title={`Failed: ${data.failed}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Failure Insights & Recommendations (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Most Common Failure Types */}
          <div className="bg-[#0F121C] border border-[#202638] rounded-xl p-4 sm:p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Common Issues Detected</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {common_failure_types.map((type, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed text-[11.5px]">
                  <span className="text-[#E50914] font-bold mt-0.5">•</span>
                  <span>{type}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Improvements */}
          <div className="bg-[#0F121C] border border-[#202638] rounded-xl p-4 sm:p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recommended Improvements</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {recommended_improvements.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed text-[11.5px]">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Filter Bar & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterStatus === 'ALL'
                ? 'bg-zinc-200 text-zinc-900 font-semibold'
                : 'bg-[#141824] text-zinc-400 hover:text-white border border-[#22283A]'
            }`}
          >
            All Results ({total_tests})
          </button>
          <button
            onClick={() => setFilterStatus('FAIL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterStatus === 'FAIL'
                ? 'bg-rose-900/60 border border-rose-500 text-rose-200 font-semibold'
                : 'bg-[#141824] text-zinc-400 hover:text-white border border-[#22283A]'
            }`}
          >
            Failed Tests ({failed_tests})
          </button>
          <button
            onClick={() => setFilterStatus('PASS')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterStatus === 'PASS'
                ? 'bg-emerald-900/60 border border-emerald-500 text-emerald-200 font-semibold'
                : 'bg-[#141824] text-zinc-400 hover:text-white border border-[#22283A]'
            }`}
          >
            Passed Tests ({passed_tests})
          </button>
          {needs_review_tests > 0 && (
            <button
              onClick={() => setFilterStatus('NEEDS_REVIEW')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === 'NEEDS_REVIEW'
                  ? 'bg-amber-900/60 border border-amber-500 text-amber-200 font-semibold'
                  : 'bg-[#141824] text-zinc-400 hover:text-white border border-[#22283A]'
              }`}
            >
              Needs Review ({needs_review_tests})
            </button>
          )}
        </div>

        {/* Search & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#10131E] border border-[#22283A] pl-8 pr-3 py-1.5 rounded-lg text-xs text-zinc-200 outline-none focus:border-[#E50914] w-40 sm:w-48"
            />
          </div>

          {/* Export buttons */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#141824] hover:bg-[#1E2436] text-zinc-300 border border-[#252D40] transition-colors"
            title="Download full results as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#141824] hover:bg-[#1E2436] text-zinc-300 border border-[#252D40] transition-colors"
            title="Copy formatted Markdown"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMd ? "Copied" : "Markdown"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#141824] hover:bg-[#1E2436] text-zinc-300 border border-[#252D40] transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span>Print</span>
          </button>
        </div>

      </div>

      {/* Unified List of Expandable Cards */}
      <div className="space-y-3">
        {filteredResults.length === 0 ? (
          <div className="p-8 text-center bg-[#0F121C] border border-[#202638] rounded-xl text-xs text-zinc-400">
            No tests match the current filter or search criteria.
          </div>
        ) : (
          filteredResults.map((test, index) => {
            const isExpanded = !!expandedIds[test.id];
            const isTechOpen = !!showTechDetails[test.id];

            // Badge styling
            const getStatusBadge = (status: TestStatus) => {
              switch (status) {
                case 'PASS':
                  return {
                    bg: 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400',
                    icon: CheckCircle2,
                    label: 'PASS'
                  };
                case 'FAIL':
                  return {
                    bg: 'bg-rose-950/60 border-rose-500/60 text-rose-300',
                    icon: XCircle,
                    label: 'FAIL'
                  };
                case 'NEEDS_REVIEW':
                default:
                  return {
                    bg: 'bg-amber-950/60 border-amber-500/60 text-amber-300',
                    icon: AlertTriangle,
                    label: 'NEEDS REVIEW'
                  };
              }
            };

            const badge = getStatusBadge(test.status);
            const BadgeIcon = badge.icon;
            const categoryName = test.category.replace('_', ' ').toUpperCase();

            return (
              <div
                key={test.id}
                className={`rounded-xl border transition-all ${
                  test.status === 'FAIL'
                    ? 'bg-[#0E111A] border-rose-950/80 hover:border-rose-800/60'
                    : test.status === 'PASS'
                    ? 'bg-[#0E111A] border-[#1E2436] hover:border-[#2C354E]'
                    : 'bg-[#0E111A] border-amber-950/80 hover:border-amber-800/60'
                }`}
              >
                {/* Collapsed Header (Click to expand) */}
                <div
                  onClick={() => toggleExpand(test.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="text-xs font-mono text-zinc-500 font-bold shrink-0 mt-0.5 sm:mt-0">
                      #{index + 1}
                    </span>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${badge.bg}`}>
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </div>

                    {/* Title & Category */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {test.scenario_title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161B29] text-zinc-400 border border-[#252E42]">
                          {categoryName}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                        {test.plain_explanation || test.judge_reasoning}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Score & Expand Chevron */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#1B2132]">
                    <span className={`text-xs font-mono font-bold ${test.status === 'PASS' ? 'text-emerald-400' : 'text-zinc-300'}`}>
                      Score: {test.score}/100
                    </span>
                    <button className="p-1 rounded text-zinc-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-[#1C2234] space-y-4 text-xs">
                    
                    {/* Prompt Sent & Context */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                      
                      {/* Test Question */}
                      <div className="p-3.5 rounded-lg bg-[#08090C] border border-[#1E2536]">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                          Test Question (Prompt Sent to AI)
                        </span>
                        <p className="text-zinc-200 leading-relaxed font-mono text-[11.5px]">
                          {test.prompt_used}
                        </p>
                      </div>

                      {/* Actual AI Response */}
                      <div className="p-3.5 rounded-lg bg-[#08090C] border border-[#1E2536]">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                          Actual AI Response (From {test.target_model})
                        </span>
                        <div className="text-zinc-200 leading-relaxed font-mono text-[11.5px] max-h-48 overflow-y-auto whitespace-pre-wrap">
                          {test.model_response}
                        </div>
                      </div>

                    </div>

                    {/* Context Provided if any */}
                    {test.context_used && (
                      <div className="p-3 rounded-lg bg-[#08090C] border border-[#1E2536] text-[11px] font-mono text-zinc-400">
                        <span className="text-zinc-500 font-bold block mb-0.5 uppercase">Supplied Context:</span>
                        "{test.context_used}"
                      </div>
                    )}

                    {/* Explanations & Evidence Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      
                      {/* Why it passed/failed */}
                      <div className="p-3.5 rounded-lg bg-[#121624] border border-[#20273A] space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider block">
                          Evaluation Explanation
                        </span>
                        <p className="text-zinc-200 leading-relaxed text-[11.5px]">
                          {test.plain_explanation || test.judge_reasoning}
                        </p>
                        {test.expected_behavior && (
                          <p className="text-zinc-400 text-[11px] pt-1 border-t border-[#1C2234]">
                            <strong className="text-zinc-300">Expected Behavior: </strong>
                            {test.expected_behavior}
                          </p>
                        )}
                      </div>

                      {/* Evidence or Detected Issue */}
                      <div className="p-3.5 rounded-lg bg-[#121624] border border-[#20273A] space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider block">
                          Evidence & Detected Issue
                        </span>
                        <p className={`text-[11.5px] leading-relaxed ${test.status === 'PASS' ? 'text-emerald-400' : 'text-rose-300 font-medium'}`}>
                          {test.evidence_or_detected_issue || "No unsupported claims or hallucinations detected."}
                        </p>
                        {test.recommendation && (
                          <p className="text-zinc-400 text-[11px] pt-1 border-t border-[#1C2234]">
                            <strong className="text-zinc-300">Recommendation: </strong>
                            {test.recommendation}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* Developer Technical Details Collapsible */}
                    <div className="pt-1">
                      <button
                        onClick={() => toggleTech(test.id)}
                        className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 font-mono"
                      >
                        <Code className="w-3 h-3" />
                        <span>{isTechOpen ? "Hide Technical Details" : "Show Technical Details (for developers)"}</span>
                      </button>

                      {isTechOpen && (
                        <div className="mt-2 p-3 rounded-lg bg-[#08090C] border border-[#1A2030] text-[10.5px] font-mono text-zinc-400 space-y-1">
                          <div><strong>Scenario ID:</strong> {test.scenario_id}</div>
                          <div><strong>Evaluator ID:</strong> {test.id}</div>
                          <div><strong>Timestamp:</strong> {test.timestamp}</div>
                          <div><strong>Vulnerability Flag:</strong> {test.vulnerability_type || 'None'}</div>
                          <div><strong>Deterministic Scan:</strong> {test.heuristic_results?.flagged ? `Flags: ${test.heuristic_results.reasons.join(', ')}` : 'Clean'}</div>
                          <div><strong>Execution Source:</strong> {test.is_simulated ? 'Local Benchmark Simulator' : 'Live Groq LLM Inference'}</div>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </section>
  );
};
