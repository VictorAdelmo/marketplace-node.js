const db = require("../database/Conexao");

async function getProdutos(req, res) {
  try {
    await db.connect;
    let resultado = await db.query("SELECT * FROM produtos");
    resultado = JSON.stringify(resultado.rows);
    resultado = JSON.parse(resultado);

    return resultado;
  } catch (err) {
    console.log(err);
  }
}

async function getProdutoPorId(req, res) {
  const productId = +req.params.id;

  try {
    await db.connect();
    let resultado = await db.query("SELECT * FROM produtos WHERE id = $1", [
      productId,
    ]);
    resultado = JSON.stringify(resultado.rows);
    resultado = JSON.parse(resultado);

    return resultado;
  } catch (err) {
    console.log(err);
  }
}

const listarPorCategoria = async (req, res, categoria) => {
  try {
    await db.connect();
    let resultado = await db.query(
      "SELECT * FROM produtos WHERE categoria = $1",
      [categoria]
    );
    resultado = JSON.stringify(resultado.rows);
    resultado = JSON.parse(resultado);

    return resultado;
  } catch (err) {
    console.log(err);
  }
};

const ordenarPrecoBaixo = async (req, res, categoria) => {
  try {
    await db.connect();
    let resultado = await db.query(
      "SELECT * FROM produtos WHERE categoria = $1 ORDER BY preco ASC",
      [categoria]
    );
    resultado = JSON.stringify(resultado.rows);
    resultado = JSON.parse(resultado);

    return resultado;
  } catch (err) {
    console.log(err);
  }
};

const ordenarPrecoAlto = async (req, res, categoria) => {
  try {
    await db.connect();
    let resultado = await db.query(
      "SELECT * FROM produtos WHERE categoria = $1 ORDER BY preco DESC",
      [categoria]
    );
    resultado = JSON.stringify(resultado.rows);
    resultado = JSON.parse(resultado);

    return resultado;
  } catch (err) {
    console.log(err);
  }
};

async function deletarProduto(req, res) {
  const id = +req.params.id;

  try {
    await db.connect();
    await db.query("DELETE FROM produtos WHERE id = $1", [id]);
    return;
  } catch (err) {
    console.log(err);
  }
}

async function verificarIdProduto(req, res, userId) {
  const id = +req.params.id;

  try {
    await db.connect();
    await db
      .query("SELECT id FROM produtos WHERE id = $1 AND user_id = $2", [
        id,
        userId,
      ])
      .then((results) => {
        if (results.rows[0] == null) {
          return false;
        } else {
          return true;
        }
      })
      .catch((e) => console.error(e.stack));
  } catch (err) {
    console.log(err);
  }
}

async function inserirProduto(req, res, userId, img) {
  const {nome,preco,categoria,quantidade,descricao,descriacao_curta} = req.body

  if (!nome || !descricao || !quantidade || !preco || !categoria || !img) {
    return res.status(500).send("Bad Request");
  }
  try {
    await db.connect;
    await db.query(
      "INSERT INTO produtos (nome,descricao,img,preco,categoria,user_id,quantidade) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [nome, descricao, img, preco, categoria, userId, quantidade]
    );
  } catch (err) {
    console.log(err);
  }
}

async function atualizarProduto(req, res, userId) {
  const { nome, descricao, preco, categoria, descriacao_curta } = req.body;
  const id = +req.params.id;

  if (!nome || !descricao || !preco || !categoria) {
    return res.status(500).send("Bad Request");
  }

  try {
    await db.connect;
    await db.query(
      "UPDATE produtos SET nome = $1,descricao = $2,preco = $3,categoria = $4, descricao_curta = $5 WHERE id = $6 AND user_id = $7",
      [nome, descricao, preco, categoria,descriacao_curta,id, userId]
    );
    return;
  } catch (err) {
    console.log(err);
  }
}

const meusProdutos = async (req, res, id) => {
  try {
    await db.connect;
    let resultado = await db.query(
      "SELECT id,nome,preco,img FROM produtos WHERE user_id = $1",
      [id]
    );
    resultado = JSON.stringify(resultado.rows);
    resultado = JSON.parse(resultado);
    return resultado;
  } catch (err) {
    console.log(err);
  }
};

const pegarPreco = async (req,res,id) => {

  try {
    await db.connect;
    let resultado = await db.query(
      "SELECT preco FROM produtos WHERE id = $1",
      [id]);
    resultado = JSON.stringify(resultado.rows[0].preco);
    resultado = JSON.parse(resultado);

    return resultado;
  } catch (error) {
    console.log(error);
  }
}

async function tirarQuantidade(req,res,idProduto,quantidade){
  try {
    await db.connect;
    await db.query(
      "UPDATE produtos SET quantidade = quantidade-$1 WHERE id = $2",
      [quantidade,idProduto]
    );
    return;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getProdutos,
  getProdutoPorId,
  listarPorCategoria,
  ordenarPrecoBaixo,
  ordenarPrecoAlto,
  deletarProduto,
  verificarIdProduto,
  inserirProduto,
  atualizarProduto,
  meusProdutos,
  pegarPreco,
  tirarQuantidade
};
