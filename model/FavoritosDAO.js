const db = require("../database/Conexao");

async function marcarFavorito(req, res, id , idProduto) {
  if (!idProduto) {
    return res.status(500).send("Bad Request");
  }
  try {
    await db.connect;
    await db
      .query("INSERT INTO favoritos (user_id,produto_id) VALUES ($1,$2)", [
        id,
        idProduto,
      ])
      .catch((e) => console.error(e.stack));
    return;
  } catch (err) {
    console.log(err);
  }
}

const listarFavoritos = async (req, res, id) => {
  try {
    await db.connect();
    let resultado = await db.query(
      "SELECT produtos.nome,produtos.img,produtos.preco,favoritos.id,favoritos.produto_id" +
        " FROM favoritos" +
        " INNER JOIN produtos ON favoritos.produto_id = produtos.id WHERE favoritos.user_id = $1",
      [id]
    );
    resultado = JSON.stringify(resultado.rows);
    resultado = JSON.parse(resultado);
    return resultado;
  } catch (err) {
    console.log(err);
  }
};

async function excluirFavoritos(req, res, idFavoritos, idUser) {
  try {
    await db.connect();
    await db
      .query("DELETE FROM favoritos WHERE id = $1 AND user_id = $2", [
        idFavoritos,
        idUser,
      ]);
    return;
  } catch (err) {
    console.log(err);
  }
}

async function checarFavorito(req,res,idFavorito,idUser){
    if(!idUser){
      return false;
    }

    try{
      await db.connect();
      let resultado = await db.query("SELECT id FROM favoritos WHERE user_id = $1 AND produto_id = $2",[idUser,idFavorito]);

      if (resultado.rows[0] == null) {
        return false;
      } else {
        return true;
      }
    }catch(err){
      console.log(err);
    }
}

module.exports = {
  marcarFavorito,
  listarFavoritos,
  excluirFavoritos,
  checarFavorito
};
