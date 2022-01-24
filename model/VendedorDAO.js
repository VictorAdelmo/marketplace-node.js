const db = require("../database/Conexao");

async function addVenda(req, res, idVendedor) {
  try {
    await db.connect;
    await db.query("UPDATE usuario SET vendas = vendas + 1 WHERE id = $1", [
      idVendedor,
    ]);
    return;
  } catch (err) {
    console.log(err);
  }
}

async function addSaldo(req,res,idVendedor,precoTotal){
  try {
    await db.connect;
    await db.query("UPDATE usuario SET saldo = saldo + $1 WHERE id = $2", [
      precoTotal,idVendedor
    ]);
    return;
  } catch (err) {
    console.log(err);
  }
}

const listarVendas = async (req, res, idUser) => {
  try {
    await db.connect;
    let resultado = await db.query(
      "SELECT compra.status,compra.quantidade,compra.preco_total,compra.endereco,compra.cidade,compra.cep,compra.produto_id,produtos.img,produtos.id,produtos.nome " +
        "FROM compra INNER JOIN produtos ON compra.produto_id = produtos.id WHERE compra.vendedor_id = $1 ORDER BY id DESC",
      [idUser]
    );
    resultado = JSON.stringify(resultado.rows);
    resultado = JSON.parse(resultado);

    return resultado;  } catch (err) {
    console.log(err);
  }
}

const listarInformacoes = async (req, res, idUser) => {
  try {
    await db.connect();
    let resultado = await db.query(
      "SELECT nome,saldo,vendas FROM usuario WHERE id = $1",
      [idUser]
    );

    resultado = JSON.stringify(resultado.rows);
    resultado = JSON.parse(resultado);

    return resultado;  } catch (err) {
    console.log(err);
  }
}



module.exports = { addVenda, listarVendas, listarInformacoes, addSaldo };
