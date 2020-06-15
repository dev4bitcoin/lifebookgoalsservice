const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    throw new error("FATAL ERROR: jwtPrivateKey is not defined");
  }
};
