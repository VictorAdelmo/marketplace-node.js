const userDAO = require("../model/UserDAO");
const favoritosDAO = require("../model/FavoritosDAO");
const notificacaoDAO = require("../model/NotificacaoDAO");
const autenticar = require("../jwts/autenticar");

async function perfil(req, res) {
  const categoria = req.params.categoria;
  if (autenticar.verificarToken(req, res)) {
    if (categoria == "informacoes-perfil") {
      let data = await userDAO.listarDadosUsuario(req,res,autenticar.pegarIdToken(req, res));
      return res.render("profile", { dados: data });

    } else if (categoria == "favoritos") {
      let favoritos = await favoritosDAO.listarFavoritos(req,res,autenticar.pegarIdToken(req, res));
      let data = await userDAO.listarDadosUsuario(req,res,autenticar.pegarIdToken(req, res));
      return res.render("favorites", {
        lista: favoritos,
        dados: data,
      });
    } else if (categoria == "editar-perfil") {
      let data = await userDAO.listarDadosUsuario(req,res,autenticar.pegarIdToken(req, res));
      return res.render("edit-profile", { dados: data});
    }
  } else {
    return res.redirect("/login");
  }
}
async function registrarUser(req, res) {
  const { nome, email, senha, telefone } = req.body;
    if(!nome || !email || !senha || !telefone){
        return res.render("registrar",{erro: "Preencha todos os campos"})
    }

  if (await userDAO.checarEmail(req, res)) {
    //Realizar Cadastro
    await userDAO.cadastrar(req, res);
    return res.redirect("/login");
  } else {
    //Conta ja existe
    return res.render("registrar", { erro: "Email Indisponivel" });
  }
}
async function verificarLogin(req, res) {
  const loginSucesso = await userDAO.checarLogin(req, res);
  if (loginSucesso > 0) {
    autenticar.gerarToken(req, res, loginSucesso);
    return res.redirect("/produtos/roupas");
  } else {
    return res.render("login", { erro: "Usuario ou Senha Invalidos"});
  }
}
async function atualizarSenha(req, res) {
  const {senha,confirmarSenha} = req.body;
 
  if(autenticar.verificarToken(req,res)){
    let data = await userDAO.listarDadosUsuario(req,res,autenticar.pegarIdToken(req, res));

    if (!senha || !confirmarSenha){
    return res.render("edit-profile",{erroSenha : "PREENCHA OS 2 CAMPOS", dados: data})
    }
    if(senha == confirmarSenha){      
    await userDAO.atualizarSenha(req,res,autenticar.pegarIdToken(req,res));
    return res.render("edit-profile",{sucessoSenha : "SENHA ALTERADA COM SUCESSO", dados: data});
    }else{
    return res.render("edit-profile",{erroSenha : "SENHAS DIFERENTES", dados: data});
  }
}else{
  res.redirect("/login");
}
}
async function atualizarInformacoes(req, res, img) {
  const {nome,descricao,telefone} = req.body;

  if(!nome && !descricao && !telefone){
    return res.redirect("/perfil/editar-perfil");  
  }

  if(autenticar.verificarToken(req,res)){    
    await userDAO.atualizarDadosUser(req, res,img,autenticar.pegarIdToken(req,res)); 
    let data = await userDAO.listarDadosUsuario(req,res,autenticar.pegarIdToken(req, res));
    return res.render("edit-profile",{dados:data});
  }else{
    return res.redirect("/login");
  }
}
async function sideBarProfile(req, res) {
  if (autenticar.verificarToken(req, res)) {
    let dados = await userDAO.listarDadosUsuario(req,res,autenticar.pegarIdToken(req, res));
    return res.render("side_bar_profile", { dados: dados });
  } else {
    return res.redirect("/login");
  }
}
async function navbar(req, res) {
  let iconeNotificacao = "/logo_imgs/notification-without.png";
  let botao = "";
  let acaoBotao2 = "";

  if (autenticar.verificarToken(req, res)) {
    botao = "Sair";
    acaoBotao2 = "/logout";
    if (await notificacaoDAO.checarNotificacao(req,res,autenticar.pegarIdToken(req, res))) {
      iconeNotificacao = "/logo_imgs/notification-have.png";
      return res.render("nav_bar", {
        icone: iconeNotificacao,
        botao: botao,
        acaoBotao: acaoBotao2,
      });
    } else {
      return res.render("nav_bar", {
        icone: iconeNotificacao,
        botao: botao,
        acaoBotao: acaoBotao2,
      });
    }
  } else {
    botao = "Entrar";
    acaoBotao2 = "/login";

    return res.render("nav_bar", {
      icone: iconeNotificacao,
      botao: botao,
      acaoBotao: acaoBotao2,
      extractScripts: true,
    });
  }
}
async function listarNotificacoes(req,res){
  if(autenticar.verificarToken(req,res)){
      const notificacao = await notificacaoDAO.getNotificacoes(req,res,autenticar.pegarIdToken(req,res));
      return res.render("notifications",{notificacao: notificacao});
  }else{
    return res.redirect("/login");
  }
}
function loginOuDeslogar(req,res){
    if(autenticar.verificarToken(req,res)){
      res.clearCookie("token"); //Exclui Sessao
      return res.redirect("/produtos/roupas");
    }else{
      return res.redirect("/login");
    }
}
async function deletarNotificacao(req,res){
    const id = req.params.id;
    if(!id){
      return res.status(500).send("Erro");
    }

    if(autenticar.verificarToken(req,res)){
      await notificacaoDAO.deletarNotificacao(req,res,autenticar.pegarIdToken(req,res));
      return res.redirect("/notificacoes");
    }else{
      return res.redirect("/login");
    }
}

module.exports = {
  deletarNotificacao,
  perfil,
  verificarLogin,
  registrarUser,
  atualizarSenha,
  atualizarInformacoes,
  sideBarProfile,
  navbar,
  listarNotificacoes,
  loginOuDeslogar
};
