const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");

var privateKEY = fs.readFileSync(
  path.resolve(__dirname, "key/private.key"),
  "utf8"
);
var publicKEY = fs.readFileSync(
  path.resolve(__dirname, "key/public.key"),
  "utf8"
);

/**
 *
 * @param {object} payload
 */
function sign(payload) {
  const signOptions = {
    expiresIn: "30d",
    algorithm: "RS256",
  };
  return jwt.sign(payload, privateKEY, signOptions);
}
exports.sign = sign;

/**
 *
 * @param {string} token
 */
function verify(token) {
  const verifyOptions = {
    expiresIn: "30d",
    algorithm: ["RS256"],
  };
  try {
    return jwt.verify(token, publicKEY, verifyOptions);
  } catch (error) {
    return false;
  }
}
exports.verify = verify;

function decode(token) {
  return jwt.decode(token, { complete: true });
}
exports.decode = decode;

const checkJwtMiddleware = (req, res, next) => {
  const { token } = req.headers;
  if (verify(token)) {
    next();
  } else {
    res.status(401).json({ error: "unauthorized" });
  }
};
exports.checkJwtMiddleware = checkJwtMiddleware;
