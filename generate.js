export const config = { runtime: "edge" };

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

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { modelId, system, message } = await req.json();

  const model = MODELS[modelId];
  if (!model) {
    return new Response(JSON.stringify({ error: "Unknown model" }), { status: 400 });
  }

  const apiKey = process.env[model.envKey];
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: `${modelId} is not configured yet` }),
      { status: 503 }
    );
  }

  try {
    let upstreamRes;

    if (modelId === "claude") {
      upstreamRes = await fetch(model.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system,
          messages: [{ role: "user", content: message }],
        }),
      });
      const d = await upstreamRes.json();
      if (d.error) throw new Error(d.error.message);
      const text = d.content?.map(b => b.text || "").join("") || "";
      return new Response(JSON.stringify({ text }), {
        headers: { "Content-Type": "application/json" },
      });

    } else {
      const modelNames = {
        qwen: "qwen-plus",
        deepseek: "deepseek-chat",
        kimi: "moonshot-v1-8k",
        zhipu: "glm-4-flash",
      };
      upstreamRes = await fetch(model.url, {
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
      const d = await upstreamRes.json();
      if (d.error) throw new Error(typeof d.error === "string" ? d.error : d.error.message);
      const text = d.choices?.[0]?.message?.content || "";
      return new Response(JSON.stringify({ text }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
