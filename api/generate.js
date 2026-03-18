const MODELS = {
  claude: {
    url: "https://api.anthropic.com/v1/messages",
    envKey: "CLAUDE_KEY",
  },
  qwen: {
    url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    envKey: "QWEN_KEY",
  },
  deepseek: {
    url: "https://api.deepseek.com/chat/completions",
    envKey: "DEEPSEEK_KEY",
  },
  kimi: {
    url: "https://api.moonshot.cn/v1/chat/completions",
    envKey: "KIMI_KEY",
  },
  zhipu: {
    url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    envKey: "ZHIPU_KEY",
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { modelId, system, message } = req.body;
  const model = MODELS[modelId];

  if (!model) {
    return res.status(400).json({ error: "Unknown model" });
  }

  const apiKey = process.env[model.envKey];
  if (!apiKey) {
    return res.status(503).json({ error: `${modelId} is not configured yet` });
  }

  try {
    if (modelId === "claude") {
      const r = await fetch(model.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system,
          messages: [{ role: "user", content: message }],
        }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      const text = d.content?.map(b => b.text || "").join("") || "";
      return res.status(200).json({ text });

    } else {
      const modelNames = {
        qwen: "qwen-plus",
        deepseek: "deepseek-chat",
        kimi: "moonshot-v1-8k",
        zhipu: "glm-4-flash",
      };
      const r = await fetch(model.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelNames[modelId],
          messages: [
            { role: "system", content: system },
            { role: "user", content: message },
          ],
        }),
      });
      const d = await r.json();
      if (d.error) throw new Error(typeof d.error === "string" ? d.error : d.error.message);
      const text = d.choices?.[0]?.message?.content || "";
      return res.status(200).json({ text });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
