import dotenv from "dotenv";
dotenv.config();

import Knex from "knex";
import _ from "lodash";
import knexConfig from "./knexfile.js";
import { Model } from "objection";

import db from "./models/index.js";

import Discord from "discord.js";
import fs from "fs";
const knex = Knex(knexConfig.development);
Model.knex(knex);

const __STATUS_ENUM__ = {
  OFFLINE: 0,
  ONLINE: 1,
  IDLE: 2,
  ERROR: 3,
};

class Neobot {
  constructor() {
    this.client = new Discord.Client();
    this.status = 0;
    this.events = {};
    this.onError = (error) => {
      console.log(error);
      this.status = __STATUS_ENUM__["ERROR"];
      return false;
    };
    (async function () {
      try {
        const result = await db.Configs.query();
        var configs = _.mapValues(_.keyBy(result, "name"), "value");
        if (
          configs.prefix == undefined ||
          configs.minCaliente == undefined ||
          configs.minCemiterio == undefined
        ) {
          await db.Configs.query().delete();
          await db.Configs.query().insertGraph([
            {
              name: "prefix",
              value: "n!",
            },
            {
              name: "minCaliente",
              value: "10",
            },
            {
              name: "minCemiterio",
              value: "10",
            },
          ]);
        }
      } catch (error) {
        console.log(error);
      }
    })();
    this.select = async (table, selects, where) => {
      if (!table)
        return this.onError("Select: Você precisa informar uma tabela!");
      var result = await db[table].query().select(selects).where(where);
      return result;
    };
    this.update = async (table, patch, where) => {
      if (!table)
        return this.onError("Update: Você precisa informar uma tabela!");
      if (patch.length < 1)
        return this.onError("Update: Você precisa informar o que quer editar!");
      if (where.length < 1)
        return this.onError(
          "Update: Você precisa informar qual campo quer editar!"
        );
      var result = await db[table].query().patch(patch).where(where);
      return result;
    };
    this.insert = async (table, insert) => {
      if (!table)
        return this.onError("Insert: Você precisa informar uma tabela!");
      var result = await db[table].query().insert(insert);
      return result;
    };
    this.delete = async (table, where) => {
      if (!table)
        return this.onError("Delete: Você precisa informar uma tabela!");
      if (where.length < 1)
        return this.onError(
          "Delete: Você precisa informar qual campo quer deletar!"
        );
      var result = await db[table].query().delete().where(where);
      return result;
    };
    this.commandHandler = (command, args) => {};
    this.getMissingPermissionJoke = async () => {
      var jokes = await db.Jokes.query();
      var rnd = Math.round(Math.random() * jokes.length) - 1;
      var selected = jokes[rnd].text;
      return selected;
    };
    this.getUserFromMention = (mention) => {
      if (!mention) return;
      if (mention.startsWith("<@") && mention.endsWith(">")) {
        mention = mention.slice(2, -1);
        if (mention.startsWith("!")) {
          mention = mention.slice(1);
        }
        return this.client.users.cache.get(mention);
      }
    };
  }
  loadEvent(event) {
    if (this.status === __STATUS_ENUM__["OFFLINE"])
      return this.onError("O bot esta desligado!");

    if (fs.existsSync(`events/${event}.js`)) {
      import(`./events/${event}.js`).then((e) => {
        Object.assign(this.events, {
          [event]: e.default,
        });
        this.client.on(event, (...arg) => this.events[event](this, ...arg));
      });
    }
    return this;
  }
  login(token) {
    this.client.login(token);
    this.status = __STATUS_ENUM__["ONLINE"];
    return this;
  }
}

var Neo = new Neobot();
Neo.login(process.env.BOT_TOKEN).loadEvent("ready").loadEvent("message");
// .loadEvent("messageReactionAdd");
