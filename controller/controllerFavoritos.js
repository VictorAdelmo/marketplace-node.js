const favoritosDAO = require("../model/FavoritosDAO");
const autenticar = require("../jwts/autenticar");

async function marcarFavorito(req, res) {
  const id = +req.params.id;
  if(autenticar.verificarToken(req,res)){
    await favoritosDAO.marcarFavorito(req, res,autenticar.pegarIdToken(req,res),id);
    return res.redirect("/detalhes-produto/" + id);
  }else{
    return res.redirect("/login");
  }
}
async function listarFavoritos(req, res) {
  if (autenticar.verificarToken) {
    let favoritos = await favoritosDAO.listarFavoritos(
      req,
      res,
      autenticar.pegarIdToken(req, res)
    );
    if (favoritos != null) {
      return res.render("favorites", { lista: favoritos });
    } else {
      return res.send("Nulo");
    }
  } else {
    return res.redirect("/login");
  }
}
async function excluirFavoritos(req, res) {
  const id = +req.params.id;
  const pagina = req.params.pagina;

  if (autenticar.verificarToken) {
    if(pagina == "favoritos-pagina"){
    await favoritosDAO.excluirFavoritos(req, res,id,autenticar.pegarIdToken(req,res));
    return res.redirect("/perfil/favoritos");
    
  }else if(pagina == "produto-loja"){
      await favoritosDAO.excluirFavoritos(req, res,id,autenticar.pegarIdToken(req,res));
      console.log("DEletado")
      return res.redirect( "/detalhes-produto/" + id);
    }
  }else{
    return res.redirect("/login");
  }
}

module.exports = {
  marcarFavorito,
  listarFavoritos,
  excluirFavoritos,
};
