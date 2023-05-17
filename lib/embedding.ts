import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

const configuration = new Configuration({
  apiKey: Deno.env.get("OPENAI_API_KEY") || "",
});

const openai = new OpenAIApi(configuration);

export const createEmbedding = async (text: string) => {
  const resp = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: text,
  });

  const [embedding] = resp.data.data;

  return embedding.embedding;
};
