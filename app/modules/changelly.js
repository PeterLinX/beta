"use strict";
module.exports = (function() {
  let URL = "https://api.changelly.com";
  let io = require("socket.io-client");
  let jayson = require("jayson");
  let crypto = require("crypto");
  let client = jayson.client.https(URL);

  function Changelly(apiKey, apiSecret) {
    this._id = function() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        let r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    this._sign = function(message) {
      return crypto
        .createHmac("sha512", apiSecret)
        .update(JSON.stringify(message))
        .digest("hex");
    };

    this._request = function(method, options, callback) {
      let id = this._id();
      let message = jayson.utils.request(method, options, id);
      client.options.headers = {
        "api-key": apiKey,
        sign: this._sign(message)
      };

      client.request(method, options, id, function(err, response) {
        callback(err, response);
      });
    };

    let self = this;

    this._socket = io.connect(URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: "Infinity"
    });

    this._socket.on("connect", function() {
      let message = {
        Login: {}
      };

      self._socket.emit("subscribe", {
        apiKey,
        sign: self._sign(message),
        message
      });
    });
  }

  Changelly.prototype = {
    getCurrencies(callback) {
      return this._request("getCurrencies", {}, callback);
    },
    createTransaction(from, to, address, amount, extraId, callback) {
      let params = {
        from,
        to,
        address,
        amount,
        extraId
      };

      return this._request("createTransaction", params, callback);
    },
    getMinAmount(from, to, callback) {
      let params = {
        from,
        to
      };

      return this._request("getMinAmount", params, callback);
    },
    getExchangeAmount(from, to, amount, callback) {
      let params = {
        from,
        to,
        amount
      };

      return this._request("getExchangeAmount", params, callback);
    },
    getTransactions(limit, offset, currency, address, extraId, callback) {
      let params = {
        limit,
        offset,
        currency,
        address,
        extraId
      };

      return this._request("getTransactions", params, callback);
    },
    getStatus(id, callback) {
      let params = {
        id
      };

      return this._request("getStatus", params, callback);
    },
    on(channel, callback) {
      this._socket.on(channel, callback);
    }
  };

  return Changelly;
})();
