import Config from "@ioc:Adonis/Core/Config";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import crypto from "crypto";
const helpers = {
  sendSuccessPaginationMessage: (msg, data, response) => {
    let response_to_send = {
      msg: "",
      data: {},
      page: {},
    };

    data = data.toJSON();

    response_to_send.msg = msg;

    response_to_send.page = data.meta;

    response_to_send.data = data.data;

    response.ok(response_to_send);
  },

  sendSuccessMessage: (msg, data, response) => {
    const { docs, ...rest } = data ?? {};

    const response_to_send =
      docs !== undefined
        ? {
            msg: msg ?? "Success",
            data: docs,
            page: { ...rest, total: rest.totalDocs },
          }
        : {
            msg: msg ?? "Success",
            data: data,
          };

    response.ok(response_to_send);
  },

  sendErrorMessage: (
    msg: string,
    data: any,
    response: HttpContextContract["response"],
    code = 400,
    extra: Object = {}
  ) => {
    const response_to_send = {
      msg,
      data,
      ...extra,
    };

    response.status(code).send(response_to_send);
  },

  paginationParams: (params) => {
    params.limit = params.limit ? parseInt(params.limit) : 10;

    params.page = params.page ? parseInt(params.page) : 1;
  },

  sendUnauthenticatedMessage: (msg, data, response) => {
    let response_to_send = {
      msg: "",
      data: {},
    };

    response_to_send.msg = msg;

    response_to_send.data = data;

    response.status(403).send(response_to_send);
  },

  generateUUID: () => {
    let d = new Date().getTime();

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  },

  replaceAll: (str, find, replace) => {
    return str.replace(new RegExp(find, "g"), replace);
  },

  otp: () => {
    const otp = crypto.randomInt(100000, 999999); // generate a random 6-digit OTP

    return otp;
  },
  cardAttributesTitle: (card) => {
    switch (card.configuration.cardType) {
      case Config.get("constants.cardType.SPELL"):
        card.attributesTitle = Config.get("constants.spellCardAttributesTitle");
        break;

      default:
        card.attributesTitle = Config.get("constants.cardAttributesTitle");
        break;
    }
  },
};

export default helpers;
