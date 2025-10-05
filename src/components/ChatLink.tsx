import { useCallback, useEffect, useMemo, useState } from "react";
import { providers, type Provider } from "@data/agents";
import {
  getSelectedProvider,
  setSelectedProvider,
  launchProvider,
  validatePromptLength,
} from "@utils/agents";

type ChatLinkProps = {
  title: string;
  url: string;
  keyIdeas: string[];
  lang?: "en" | "zh-hant";
};

export default function ChatLink({
  title,
  url,
  keyIdeas,
  lang = "en",
}: ChatLinkProps) {
  const [selectedProvider, setSelectedProviderState] = useState<Provider>(
    providers[0]
  );

  // Hydrate provider from localStorage after mount
  useEffect(() => {
    const saved = getSelectedProvider(providers);
    if (saved) setSelectedProviderState(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProviderChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const p = providers.find(p => p.id === e.target.value);
      if (p) {
        setSelectedProviderState(p);
        setSelectedProvider(p);
      }
    },
    []
  );

  const prompt = useMemo(
    () => buildPrompt({ title, url, keyIdeas, lang }),
    [title, url, keyIdeas, lang]
  );

  const handleLaunch = useCallback(async () => {
    const { isValid, warning } = validatePromptLength(prompt);
    if (!isValid && warning) {
      // Let launchProvider handle clipboard fallback for non-direct providers; for direct, still try but warn in console
      console.warn(warning);
    }
    await launchProvider(selectedProvider, prompt);
  }, [prompt, selectedProvider]);

  return (
    <div className="mb-4 rounded-lg border border-skin-line bg-skin-card p-4">
      <div className="flex items-start gap-3">
        <span aria-hidden className="text-2xl">
          💬
        </span>
        <div className="flex-1">
          <h3 className="m-0 text-base font-semibold text-skin-accent">
            {lang === "zh-hant"
              ? "就這篇文章發問"
              : "Ask this article a question"}
          </h3>
          <p className="mt-1 text-sm opacity-80">
            {lang === "zh-hant"
              ? "選擇你喜歡的聊天模型，帶著重點與連結開始對話。"
              : "Pick your favorite chat LLM and start a conversation with key ideas and the link."}
          </p>

          <div className="mt-3 flex flex-col gap-2">
            <label htmlFor="chat-provider" className="text-sm opacity-80">
              {lang === "zh-hant" ? "目標 LLM" : "Target LLM"}
            </label>
            <select
              id="chat-provider"
              className="w-full rounded-md border border-skin-line bg-skin-fill px-3 py-2 text-sm focus:border-skin-accent focus:outline-none focus:ring-1 focus:ring-skin-accent"
              value={selectedProvider.id}
              onChange={handleProviderChange}
            >
              {providers.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleLaunch}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-skin-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              <span>🚀</span>
              <span>{lang === "zh-hant" ? "開始對話" : "Start chatting"}</span>
            </button>
          </div>

          <details className="mt-3 select-text">
            <summary className="cursor-pointer text-sm opacity-70">
              {lang === "zh-hant" ? "查看將發送的提示" : "Preview the prompt"}
            </summary>
            <pre className="mt-2 whitespace-pre-wrap rounded-md border border-skin-line bg-skin-fill p-3 text-xs opacity-90">
              {prompt}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}

function buildPrompt({
  title,
  url,
  keyIdeas,
  lang,
}: {
  title: string;
  url: string;
  keyIdeas: string[];
  lang: "en" | "zh-hant";
}) {
  const ideas = keyIdeas
    .filter(Boolean)
    .map(s => s.trim())
    .filter(Boolean);
  const ideasBlock = ideas.length
    ? ideas.map((k, i) => `${i + 1}. ${k}`).join("\n")
    : lang === "zh-hant"
      ? "(尚未提供重點)"
      : "(No key ideas provided)";
  if (lang === "zh-hant") {
    return `以下是文章資訊與重點，請根據這些內容回答我的提問，並在需要時引用來源：\n\n標題：${title}\n連結：${url}\n重點：\n${ideasBlock}\n\n請先給出簡潔摘要（3~5 句），再就我的問題進行具體與可採取行動的回覆。`;
  }
  return `Here are the article details and key ideas. Use them to answer my question and cite the source when useful.\n\nTitle: ${title}\nURL: ${url}\nKey ideas:\n${ideasBlock}\n\nStart with a concise 3–5 sentence summary, then provide specific, actionable answers to my query.`;
}
