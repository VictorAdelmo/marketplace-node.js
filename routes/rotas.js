const express = require("express");
const router = express.Router();

const fileUplaod = require("../model/fileUpload");
const controllerProduto = require("../controller/controllerProduto");
const controllerUser = require("../controller/controllerUser");
const controllerCompra = require("../controller/controllerComprar");
const controllerFavoritos = require("../controller/controllerFavoritos");
const controllerVendedor = require("../controller/controllerVendedor");

// -------------------- Produtos ---------------------------
router.get("/", controllerProduto.listarProdutos); //Pronto
router.get("/detalhes-produto/:id", controllerProduto.listarProdutoporId); //Pronto
router.get("/comprar-produto/:id",  controllerProduto.listarProdutoComprar); 
router.get("/produtos/:categoria", controllerProduto.listarPorCategoria); //Pronto
router.get("/produtos/:categoria/:order", controllerProduto.ordenarPreco); //Pronto
router.get("/editar-produto/:id",controllerProduto.editarProduto);

//--------------------- Usuario -----------------------------
router.get("/registrar",  function (req, res) {
  return res.render("registrar");
}); 
router.get("/login",function (req, res) {
  return res.render("login");

}); //Pronto
router.get("/perfil/:categoria", controllerUser.perfil); //Pronto
router.get("/minhas-compras", controllerCompra.listarCompras); //Pronto
 //Pronto
router.get("/vendedor/:categoria", controllerVendedor); 
router.get("/notificacoes", controllerUser.listarNotificacoes);
router.get("/login-ou-deslogar",controllerUser.loginOuDeslogar); //Pronto

//-----------------------------------------------------------

//--------------------- POST --------------------------------
router.post("/registrar",controllerUser.registrarUser); //Pronto
router.post("/login", controllerUser.verificarLogin); //Pronto
router.post("/comprar-produto", controllerCompra.comprar);
router.post("/inserir-produto",fileUplaod.single("file"),function(req,res){
  const img = req.file.filename;
  return controllerProduto.inserirProduto(req,res,img);
}); //Pronto
router.post("/marcar-favorito/:id",  controllerFavoritos.marcarFavorito);
router.post("/atualizar-produto/:id",controllerProduto.atualizarProduto);
router.post("/atualizar-perfil", fileUplaod.single("file"),function(req,res){
  let img = req.file;
  if(img != null){
    img = req.file.filename;
    return controllerUser.atualizarInformacoes(req,res,img);
  }else{
    return controllerUser.atualizarInformacoes(req,res,"nulo");
  }
}); //Pronto
router.post("/atualizar-senha",  controllerUser.atualizarSenha); //Pronto
router.post("/calcular-preco/:id",  controllerCompra.calcularPreco);
//-----------------------------------------------------------

//---------------------- DELETE -----------------------------
router.post("/deletar-favorito/:id/:pagina",  controllerFavoritos.excluirFavoritos); //Pronto
router.post("/deletar-produto/:id",controllerProduto.deletarProduto); //Pronto
router.post("/deletar-notificacao/:id", controllerUser.deletarNotificacao);
//---------------------- Design -----------------------------
router.get("/nav_bar/", controllerUser.navbar); //Pronto
router.get("/side_bar/", function (req, res) {
  return res.render("side_bar");
}); //Pronto
router.get("/side_bar_perfil/", controllerUser.sideBarProfile); //Pronto

module.exports = router;
