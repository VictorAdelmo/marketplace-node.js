const autenticar = require("../jwts/autenticar");
const notificacaoDAO = require("../model/NotificacaoDAO");

const navbar = async (req, res) => {
  let iconeNotificacao = "/logo_imgs/notification-without.png";
  let botao = "";
  let acaoBotao2 = "";

  if (autenticar.verificarToken(req, res)) {
    botao = "Sair";
    acaoBotao2 = "/logout";
    if (
      await notificacaoDAO.checarNotificacao(
        req,
        res,
        autenticar.pegarIdToken(req, res)
      )
    ) {
      iconeNotificacao = "/logo_imgs/notification-have.png";
      let a = { icone: iconeNotificacao, botao: botao, acaoBotao: acaoBotao2 };
      JSON.stringify(a);
      JSON.parse(a);
      return a;
    } else {
      return { icone: iconeNotificacao, botao: botao, acaoBotao: acaoBotao2 };
    }
  } else {
    botao = "Entrar";
    acaoBotao2 = "/login";
    return { icone: iconeNotificacao, botao: botao, acaoBotao: acaoBotao2 };
  }
}

module.exports = navbar ;
