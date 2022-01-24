const db = require("../database/Conexao");

const listarDadosUsuario = async (req, res, id) => {
  try {
    await db.connect();
    let resultado = await db.query(
      "SELECT nome,email,telefone,img FROM usuario WHERE id = $1",
      [id]
    );

    resultado = JSON.stringify(resultado.rows);
    resultado = JSON.parse(resultado);

    return resultado;
  } catch (err) {
    console.log(err);
  }
};

async function checarLogin(req, res) {
  const { email, senha } = req.body;

  try {
    await db.connect();
    let resultado = await db.query(
      "SELECT id FROM usuario WHERE email = $1 AND senha = $2",
      [email, senha]
    );

    if (resultado.rows[0].id == null) {
      return 0;
    } else {
      return resultado.rows[0].id;
    }
  } catch (err) {
    return console.log(err);
  }
}

async function checarEmail(req, res) {
  const { email } = req.body;

  try {
    await db.connect();
    let resultado = await db.query(
      "SELECT email FROM usuario WHERE email = $1",
      [email]
    );

    if (resultado.rows[0] == null) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return console.log(err);
  }
}

async function cadastrar(req, res) {
  const { nome, email, senha, telefone } = req.body;

  if (!nome || !email || !senha || !telefone) {
    return res.status(500).send("Bad Request");
  }
  try {
    await db.connect;
    await db
      .query(
        "INSERT INTO usuario (nome,email,senha,telefone) VALUES ($1,$2,$3,$4)",
        [nome, email, senha, telefone]
      )
      .catch((e) => console.error(e.stack))
    return;
  } catch (err) {
    console.log(err);
  }
}

async function atualizarSenha(req, res, idUser) {
  const senha =  req.body.senha;
  try {
    await db.connect;
    await db.query(
      "UPDATE usuario SET senha = $1 WHERE id = $2",
      [senha,idUser]
    );
    return;
  } catch (err) {
    console.log(err);
  }
}

async function atualizarDadosUser(req, res, img, idUser) {
  const { nome, email, telefone } = req.body;

  try {
    await db.connect;
    if (img == "nulo") {
      await db.query(
        "UPDATE usuario SET nome = $1, telefone = $2  WHERE id = $3",
        [nome,telefone,idUser]
      );
      return;
    } else {
      await db.query(
        "UPDATE usuario SET nome = $1, img = $2, telefone = $3 WHERE id = $4",
        [nome, img, telefone, idUser]
      );
      return;
    }
  } catch (err) {
    console.log(err);
  }
}

async function pegarIdUsuario(req, res) {
  let id = 0;
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(500).send("Erro");
  }

  try {
    await db.connect();
    let resultado = await db.query(
      "SELECT id FROM usuario WHERE email = $1 AND senha = $2",
      [email, senha]
    );

    if (resultado.rows[0] != null) {
      id = resultado.rows[0].id;
      return id;
    } else {
      console.log("Erro");
      return;
    }
  } catch (err) {
    return console.log(err);
  }
}

module.exports = {
  listarDadosUsuario,
  checarLogin,
  checarEmail,
  cadastrar,
  atualizarDadosUser,
  pegarIdUsuario,
  atualizarSenha
};
