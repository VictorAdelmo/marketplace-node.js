const produtoDAO = require("../model/ProdutoDAO");
const favoritosDAO = require("../model/FavoritosDAO");
const autenticar = require("../jwts/autenticar");

async function deletarProduto(req, res) {
  if (autenticar.verificarToken(req, res)) {
    if (
      produtoDAO.verificarIdProduto(req, res, autenticar.pegarIdToken(req, res))
    ) {
      //Produto Existe portanto vai deletar
      await produtoDAO.deletarProduto(req, res);
      return res.redirect("/vendedor/meus-produtos");
    } else {
      //Produto não existe portanto ira retornar um erro
      return res.status(404).send("Produto não existe");
    }
  } else {
    return res.redirect("/login");
  }
}
async function listarProdutos(req, res) {
  //let produtos = await produtoDAO.getProdutos(req, res);
  return res.redirect("/produtos/roupas");
}
async function listarProdutoporId(req, res) {
  const id = req.params.id;
  if (id != null) {
    let produtos = await produtoDAO.getProdutoPorId(req, res);
    let favoritoImg = "";
    let acao = "";

    if(await favoritosDAO.checarFavorito(req,res,id,autenticar.pegarIdToken(req,res))){
      favoritoImg = "/logo_imgs/coracao_cheio.png";
      acao = "/deletar-favorito/" + id + "/produto-loja";
    }else{
      acao = "/marcar-favorito/" + id;   
      favoritoImg = "/logo_imgs/coracao_vazio.png";
    }
      return res.render("product", { produtoLista: produtos , favorito : favoritoImg, url : acao });
  } else {
    return res.status(401).send("Erro");
  }
}
async function listarProdutoComprar(req, res) {
  const id = req.params.id;
  if (autenticar.verificarToken) {
    if (id != null) {
      let produtos = await produtoDAO.getProdutoPorId(req, res);
      return res.render("buy", { produtoLista: produtos });
    } else {
      return res.status(401).send("Erro");
    }
  } else {
    return res.redirect("/login");
  }
}
async function listarPorCategoria(req, res) {
  const categoria = req.params.categoria;
  if (categoria != null) {
    if (categoria === "roupas") {
      let produtos = await produtoDAO.listarPorCategoria(req, res, categoria);
      return res.render("shop", {
        produtoLista: produtos,
        categoria: categoria,
      });
    } else if (categoria === "tenis") {
      let produtos = await produtoDAO.listarPorCategoria(req, res, categoria);
      return res.render("shop", {
        produtoLista: produtos,
        categoria: categoria,
      });
    } else if (categoria === "blusas") {
      let produtos = await produtoDAO.listarPorCategoria(req, res, categoria);
      return res.render("shop", {
        produtoLista: produtos,
        categoria: categoria,
      });
    } else if (categoria === "acessorios") {
      let produtos = await produtoDAO.listarPorCategoria(req, res, categoria);
      return res.render("shop", {
        produtoLista: produtos,
        categoria: categoria,
      });
    } else if (categoria === "joias") {
      let produtos = await produtoDAO.listarPorCategoria(req, res, categoria);
      return res.render("shop", {
        produtoLista: produtos,
        categoria: categoria,
      });
    } else if (categoria === "bones") {
      let produtos = await produtoDAO.listarPorCategoria(req, res, categoria);
      return res.render("shop", {
        produtoLista: produtos,
        categoria: categoria,
      });
    } else {
      return res.send("Categoria Invalida");
    }
  } else {
    return res.send("Nulo");
  }
}
async function ordenarPreco(req, res) {
  const categoria = req.params.categoria;
  const order = req.params.order;

  if (categoria != null && order != null) {
    if (order === "preco-alto") {
      if (categoria === "roupas") {
        let produtos = await produtoDAO.ordenarPrecoAlto(req, res, categoria);
        return res.render("shop", {
          produtoLista: produtos,
          categoria: categoria,
        });
      } else if (categoria === "tenis") {
        let produtos = await produtoDAO.ordenarPrecoAlto(req, res, categoria);
        return res.render("shop", {
          produtoLista: produtos,
          categoria: categoria,
        });
      } else if (categoria === "blusas") {
        let produtos = await produtoDAO.ordenarPrecoAlto(req, res, categoria);
        return res.render("shop", {
          produtoLista: produtos,
          categoria: categoria,
        });
      } else if (categoria === "acessorios") {
        let produtos = await produtoDAO.ordenarPrecoAlto(req, res, categoria);
        return res.render("shop", {
          produtoLista: produtos,
          categoria: categoria,
        });
      } else if (categoria === "bones") {
        let produtos = await produtoDAO.ordenarPrecoAlto(req, res, categoria);
        return res.render("shop", {
          produtoLista: produtos,
          categoria: categoria,
        });
      } else if (categoria === "joias") {
        let produtos = await produtoDAO.ordenarPrecoAlto(req, res, categoria);
        return res.render("shop", {
          produtoLista: produtos,
          categoria: categoria,
        });
      } else {
        return res.status(404).send("Categoria Invalida");
      }
    } else if (order === "preco-baixo") {
      if (categoria === "roupas") {
        let produtos = await produtoDAO.ordenarPrecoBaixo(req, res, categoria);
        return res.render("shop", {
          produtoLista: produtos,
          categoria: categoria,
        });
      } else if (categoria === "tenis") {
        let produtos = await produtoDAO.ordenarPrecoBaixo(req, res, categoria);
        return res.render("shop", {
          produtoLista: produtos,
          categoria: categoria,
        });
      } else if (categoria === "blusas") {
        let produtos = await produtoDAO.ordenarPrecoBaixo(req, res, categoria);
        return res.render("shop", {
          produtoLista: produtos,
          categoria: categoria,
        });
      }
    } else {
      return res.status(404).send("Categoria Invalida");
    }
  }
}
async function inserirProduto(req, res, img) {
  const { nome, preco, categoria, quantidade, descricao, descricao_curta } =
    req.body;

  if (
    !nome ||
    !preco ||
    !categoria ||
    !quantidade ||
    !descricao ||
    !descricao_curta ||
    !img
  ) {
    return res.send("Erro");
  }

  if (autenticar.verificarToken(req, res)) {
    await produtoDAO.inserirProduto(req,res,autenticar.pegarIdToken(req, res),img);
    return res.redirect("/vendedor/meus-produtos");
  } else {
    return res.redirect("/login");
  }
}
async function atualizarProduto(req, res) {
  const { nome, descricao, preco, categoria, descriacao_curta } = req.body;

  if (!nome || !descricao || !preco || !categoria) {
    return res.status(500).send("Bad Request");
  }

  if (autenticar.verificarToken(req, res)) {
    if ( produtoDAO.verificarIdProduto(req, res, autenticar.pegarIdToken(req, res))) {
      await produtoDAO.atualizarProduto(req,res,autenticar.pegarIdToken(req, res));
      return res.redirect("/vendedor/meus-produtos");
    }else {
      return res.status(500).send("Bad Request");
    }
  }else {
    return res.redirect("/login");
  }
}
async function editarProduto(req, res) {
  if (autenticar.verificarToken(req, res)) {
    if (produtoDAO.verificarIdProduto(req, res, autenticar.pegarIdToken(req, res))) {
      const produto = await produtoDAO.getProdutoPorId(req, res);
      return res.render("edit_product", { produtoData: produto});
    } else {
      return res.status(500).send("Erro");
    }
  } else {
    return res.redirect("/login");
  }
}

module.exports = {
  listarProdutos,
  listarProdutoporId,
  listarPorCategoria,
  ordenarPreco,
  deletarProduto,
  inserirProduto,
  atualizarProduto,
  listarProdutoComprar,
  editarProduto,
};
