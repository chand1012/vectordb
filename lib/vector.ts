// See here for why I'm using this seemingly random
// source: https://github.com/eveningkid/denodb/issues/379#issuecomment-1445411440
// Revert back to official version when this is fixed
import {
  Database,
  SQLite3Connector,
} from "https://raw.githubusercontent.com/jerlam06/denodb/1b2e53461df56673d4048fe357c4d5ffaf5d8b1e/mod.ts";
// } from "https://deno.land/x/denodb@v1.4.0/mod.ts";
import { ensureDirSync } from "https://deno.land/std@0.187.0/fs/mod.ts";

import { cosineSimilarity } from "./math.ts";
import { createEmbedding } from "./embedding.ts";
import { Content } from "./models.ts";

export const connect = (path: string | undefined = undefined, drop = false) => {
  // if string is falsy, use in-memory database
  if (!path) {
    path = ":memory:";
  }
  const connector = new SQLite3Connector({
    filepath: path,
  });

  const db = new Database(connector);
  db.link([Content]);
  db.sync({ drop });

  return db;
};

function createDirectories(path: string) {
  const directories = path.split("/").filter((dir) => dir.length > 0);

  // Remove the last directory from the array
  directories.pop();

  if (directories.length === 0) {
    return;
  }

  let currentDir = ".";
  for (const directory of directories) {
    if (directory === "") {
      continue;
    }
    currentDir += `/${directory}`;
    ensureDirSync(currentDir);
  }
}

class VectorDB {
  db: Database;

  constructor(path: string | undefined = undefined, drop = false) {
    if (path) {
      createDirectories(path);
    }
    this.db = connect(path, drop);
  }

  async add(
    text: string,
    source = "unknown",
    url = "unknown",
    embedding: number[] = [],
  ) {
    if (text.length === 0 && embedding.length === 0) {
      throw new Error("Text or embedding must be provided");
    }

    if (embedding.length === 0) {
      embedding = await createEmbedding(text);
    }

    const content = new Content();
    content.text = text;
    content.source = source;
    content.url = url;
    content.embedding = JSON.stringify(embedding);
    const c = await content.save();

    return c.id as number;
  }

  async get(id: number) {
    const content = await Content.where("id", id).first();
    if (!content) {
      return null;
    }

    return {
      id: content.id as number,
      text: content.text as string,
      source: content.source as string,
      url: content.url as string,
      embedding: JSON.parse(content.embedding as string),
    };
  }

  async search(embedding: number[], maxResults = 10) {
    const contents = await Content.all();
    const results = contents.map((content) => {
      const embedding2 = JSON.parse(content.embedding as string);
      const similarity = cosineSimilarity(embedding, embedding2);

      return {
        id: content.id as number,
        text: content.text as string,
        source: content.source as string,
        url: content.url as string,
        similarity,
      };
    });

    return results.sort((a, b) => b.similarity - a.similarity).slice(
      0,
      maxResults,
    );
  }

  async searchText(text: string, maxResults = 10) {
    const embedding = await createEmbedding(text);

    const contents = await Content.all();
    const results = contents.map((content) => {
      const embedding2 = JSON.parse(content.embedding as string);
      const similarity = cosineSimilarity(embedding, embedding2);

      return {
        id: content.id as number,
        text: content.text as string,
        source: content.source as string,
        url: content.url as string,
        similarity,
      };
    });

    return results.sort((a, b) => b.similarity - a.similarity).slice(
      0,
      maxResults,
    );
  }
}

export default VectorDB;
