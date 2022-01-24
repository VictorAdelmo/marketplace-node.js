const db = require("../database/Conexao");

const getNotificacoes = async (req, res, id) => {
  try {
    await db.connect;
    let resultado = await db.query(
      "SELECT notificacoes.id,notificacoes.titulo,notificacoes.descricao,produtos.img,notificacoes.produto_id" +
        " FROM notificacoes" +
        " INNER JOIN produtos ON notificacoes.produto_id = produtos.id WHERE notificacoes.user_id = $1 ORDER BY id DESC",
      [id]
    );
    resultado =  JSON.stringify(resultado.rows);
    resultado = JSON.parse(resultado);
    return resultado;
    
  } catch (err) {
    console.log(err);
  }
}

async function deletarNotificacao(req, res, userId) {
  const id = +req.params.id;

  try {
    await db.connect();
    await db
      .query("DELETE FROM notificacoes WHERE id = $1 AND user_id = $2", [
        id,
        userId,
      ]);

    return;
  } catch (err) {
    console.log(err);
  }
}

async function inserirNotificacaoVendedor(req, res, precoTotal ,vendedorId, produtoId) {
  const {endereco, cep, numero, cidade, quantidade} = req.body;  

  if (!vendedorId) {
    return res.status(500).send("Bad Request");
  }

  const mensagem = `Foi Realizada uma Venda no Valor de ${precoTotal} R$ para o Endereço: 
   ${cep}, ${endereco}, ${numero}, ${cidade}, no total de ${quantidade} quantidades`; 

  try {
    await db.connect;
    await db
      .query(
        "INSERT INTO notificacoes (titulo,descricao,produto_id,user_id) VALUES ($1,$2,$3,$4)",
        ["Venda Realizada", mensagem, produtoId, vendedorId]
      );
      return;
  } catch (err) {
    console.log(err);
  }
}

async function checarNotificacao(req, res, userId) {
  try {
    await db.connect();
    let resultado = await db.query(
      "SELECT id FROM notificacoes WHERE user_id = $1 AND lida = 0",
      [userId]
    );

    if (resultado.rows[0] == null) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    return console.log(err);
  }
}

async function notificacaoLida(req, res, userId) {
  const idNotificacao = req.params.id;

  try {
    await db.connect;
    await db.query(
      "UPDATE notificacoes SET lida  = 1 WHERE id = $1 AND user_id = $2",
      [idNotificacao, userId]
    );
    return;
  } catch (err) {
    console.log(err);
  }
}

async function inserirNotificacaoComprador(req, res, precoTotal ,userId, produtoId) {
  const {endereco, cep, numero, cidade, quantidade} = req.body;  

  if (!userId) {
    return res.status(500).send("Bad Request");
  }

  const mensagem = `Você fez uma Compra no Valor de ${precoTotal} R$ para o Endereço: 
   ${cep}, ${endereco}, ${numero}, ${cidade}, no total de ${quantidade} quantidades,
    seu produto chegara em breve`; 

  try {
    await db.connect;
    await db
      .query(
        "INSERT INTO notificacoes (titulo,descricao,produto_id,user_id) VALUES ($1,$2,$3,$4)",
        ["Compra", mensagem, produtoId, userId]
      );
    return;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getNotificacoes,
  deletarNotificacao,
  inserirNotificacaoVendedor,
  checarNotificacao,
  notificacaoLida,
  inserirNotificacaoComprador
};
