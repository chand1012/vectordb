import {
  DataTypes,
  Model,
} from "https://raw.githubusercontent.com/jerlam06/denodb/1b2e53461df56673d4048fe357c4d5ffaf5d8b1e/mod.ts";
// } from "https://deno.land/x/denodb@v1.4.0/mod.ts";

export class Content extends Model {
  static table = "content";
  static timestamps = true;

  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING,
      length: 1024,
    },
    embedding: {
      type: DataTypes.JSON,
    },
    source: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
    },
  };

  static defaults = {
    source: "unknown",
  };
}
