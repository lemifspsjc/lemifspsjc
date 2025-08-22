// Função para exibir os dados no HTML

// URL da API do Google Apps Script
const API_URL_CONSULTA_MATERIAIS = "https://script.google.com/macros/s/AKfycbxdC8WGd8afkiUr3WE98NzWKkFi9H220Lj7ZkVHjoxmQRow2F7LP8ITsoJqUgtagiU/exec";

//------------------------------------------------------------------------------------------------
// FUNÇÃO PARA CONSULTAR DADOS

async function carregarMateriais() {

  try {
    const resposta = await fetch(API_URL_CONSULTA_MATERIAIS + "?t=" + Date.now());
    const dados = await resposta.json(); // Converte JSON em objeto JS

    console.log("Dados recebidos:", dados);

    const materiaisDisponiveis = dados;

    // Exibir no HTML
    mostrarMateriais(materiaisDisponiveis);

  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
};

// Chama a função ao carregar a página
carregarMateriais();