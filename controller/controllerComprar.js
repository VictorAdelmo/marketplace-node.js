const comprarDAO = require("../model/ComprarDAO");
const autenticar = require("../jwts/autenticar");
const notificacaoDAO = require("../model/NotificacaoDAO");
const produtoDAO = require("../model/ProdutoDAO");
const vendedorDAO = require("../model/VendedorDAO");

async function listarCompras(req, res) {
  if (autenticar.verificarToken(req, res)) {
    let compras = await comprarDAO.listarCompras(
      req,
      res,
      autenticar.pegarIdToken(req, res)
    );
    return res.render("orders", { listCompra: compras });
  }
}

async function comprar(req, res) {
  const { endereco, cep, numero, cidade, quantidade, pagamento, idProduto, vendedorId } = req.body;

  if (!endereco || !cep || !numero || !cidade || !quantidade || !pagamento || !idProduto || !vendedorId ) {
    return res.redirect("/comprar-produto/" + idProduto);
  }

  if (autenticar.verificarToken(req, res)) {
    if(await comprarDAO.verificarVendedor(idProduto,autenticar.pegarIdToken(req,res))){
      return res.render("buy", { errorMessage: "Você não pode comprar um produto de você mesmo" });
    }
    
    let precoProduto = await produtoDAO.pegarPreco(req,res,idProduto);
    let preco = parseInt(precoProduto) * quantidade;

    await comprarDAO.comprar(req,res,autenticar.pegarIdToken(req,res),preco);
    await vendedorDAO.addSaldo(req,res,vendedorId,preco);
    await vendedorDAO.addVenda(req,res,vendedorId);
    await produtoDAO.tirarQuantidade(req,res,idProduto,quantidade);
    await notificacaoDAO.inserirNotificacaoVendedor(req,res,preco,vendedorId,idProduto);
    await notificacaoDAO.inserirNotificacaoComprador(req,res,preco,autenticar.pegarIdToken(req,res),idProduto);

    return res.redirect("/minhas-compras");
  }else{
    return res.redirect("/login");
  }
}

async function calcularPreco (req,res){
  const quantidade = req.body.quantidade;
  const idProduto = req.params.id;

  let precoProduto = await produtoDAO.pegarPreco(req,res,idProduto);
  let preco = parseInt(precoProduto) * quantidade;
  let produto = await produtoDAO.getProdutoPorId(req,res) 

  return res.render("buy", {produtoLista: produto, preco : preco, quantidade2 : quantidade});
}




module.exports = {
  listarCompras,
  comprar,
  calcularPreco
};
