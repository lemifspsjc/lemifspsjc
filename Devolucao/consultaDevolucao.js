// URL da API do Google Apps Script
const API_URL_CONSULTA_DEVOLUCAO = "https://script.google.com/macros/s/AKfycbzKEl82fwqdQGWL9eBo0_QJ04mf6_qMIGGqf18Jxl_U_Kd6Cx2shkZwQeYi6zdbvZs/exec";

//------------------------------------------------------------------------------------------------
// FUNÇÃO PARA CONSULTAR DADOS

async function carregarDevolucoes() {
  try {
    const resposta = await fetch(API_URL_CONSULTA_DEVOLUCAO + "?t=" + Date.now());
    const dados = await resposta.json(); // Converte JSON em objeto JS

    console.log("Dados recebidos:", dados);

    const devolucao = dados

    // Exibir no HTML
    mostrarDevolucoes(devolucao);

  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
}

// Chama a função ao carregar a página
carregarDevolucoes();