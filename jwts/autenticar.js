const jwt = require("jsonwebtoken");
require("dotenv").config();

function gerarToken(req, res, id) {
  try {
    const token = jwt.sign({ id: id }, process.env.SECRET, {
      expiresIn: 100000,
    });
    res.cookie("token", token);
    return token;
  } catch (err) {
    return console.log(err);
  }
}

function verificarToken(req, res) {
  try {
    const token = req.cookies["token"];
    if (!token) {
      return false;
    }

    jwt.verify(token, process.env.SECRET, function (err, decode) {
      if (err) return false;
    });
  } catch (err) {
    console.log(err);
  }
  return true;
}

function pegarIdToken(req, res) {
  const token = req.cookies["token"];
  const decoded = jwt.verify(token, process.env.SECRET);
  const userId = decoded.id;

  return userId;
}

module.exports = {
  gerarToken,
  verificarToken,
  pegarIdToken,
};
