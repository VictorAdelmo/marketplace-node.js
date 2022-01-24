const autenticar = require("../jwts/autenticar");
const produtosDAO = require("../model/ProdutoDAO");
const vendedorDAO = require("../model/VendedorDAO");

async function vendedor(req, res) {
  const categoria = req.params.categoria;

  if (autenticar.verificarToken(req, res)) {
    if (categoria === "informacoes") {
      let informacoes = await vendedorDAO.listarInformacoes(req,res, autenticar.pegarIdToken(req, res));
      return res.render("vendor", { informacoes : informacoes });
    } else if (categoria === "meus-produtos") {
      let produto = await produtosDAO.meusProdutos(req,res,autenticar.pegarIdToken(req, res));
      return res.render("meus_produtos", {lista: produto });
    } else if (categoria === "adicionar-produto") {
      return res.render("add_product");
    } else if (categoria === "vendas") {
      let vendas = await vendedorDAO.listarVendas(req,res,autenticar.pegarIdToken(req, res));
      return res.render("orders", { listCompra: vendas });
    } else {
      res.status(404).send("Pagina Invalida");
    }
  } else {
    return res.redirect("/login");
  }
}

module.exports = vendedor;
