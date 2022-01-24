const db = require("../database/Conexao");

async function comprar(req, res,userId,preco) {
  const { quantidade, cep, estado, endereco, idProduto, cidade , vendedorId } = req.body;
  if (!quantidade || !cep  || !endereco || !idProduto || !cidade || !vendedorId) {
    return res.status(500).send("Bad Request");
  }
  try {
    await db.connect;
    await db
      .query(
        "INSERT INTO compra (quantidade,cep,estado,endereco,produto_id,cidade,preco_total,user_id,vendedor_id)" +
         "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
        [quantidade, cep, "Nulo", endereco, idProduto,cidade,preco,userId,vendedorId]
      ).catch((e) => console.error(e.stack))
    return;
  } catch (err) {
    console.log(err);
  }
}

const listarCompras = async (req, res, id) => {
  try {
    await db.connect();
    let resultado = await db.query(
      "SELECT compra.id,compra.quantidade,compra.estado,compra.cep,compra.status,compra.endereco,compra.produto_id,compra.cidade,compra.preco_total,produtos.nome,produtos.img" +
        " FROM compra" +
        " INNER JOIN produtos ON compra.produto_id = produtos.id WHERE compra.user_id = $1 ORDER BY id DESC",
      [id]
    );
    resultado = JSON.stringify(resultado.rows);
    resultado = JSON.parse(resultado);
    return resultado;
    
  } catch (err) {
    console.log(err);
  }
}

async function verificarVendedor(idProduto,idUser){

  try {
    await db.connect();
    let resultado = await db
      .query("SELECT id FROM produtos WHERE id = $1 AND user_id = $2", [
        idProduto,
        idUser]);

        if (resultado.rows[0] == null) {
          return false; //Correto
        } else {
          return true; //Errado
        }

  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  comprar,
  listarCompras,
  verificarVendedor
};
