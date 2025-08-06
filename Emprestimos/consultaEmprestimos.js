// URL da API do Google Apps Script
const API_URL_CONSULTA_EMPRESTIMOS = "https://script.google.com/macros/s/AKfycbzImkmTkpoH8qA5Q6rA9jQVidow6icvDO_lozHkvqpBI4TxSDe7h1wkH-4CGoOfLk9wuA/exec";

//------------------------------------------------------------------------------------------------
// FUNÇÃO PARA CONSULTAR DADOS

async function carregarEmprestimos() {
  try {
    const resposta = await fetch(
      API_URL_CONSULTA_EMPRESTIMOS + "?t=" + Date.now()
    );
    const dados = await resposta.json(); // Converte JSON em objeto JS

    console.log("Dados recebidos:", dados);

    const emprestimo = dados;

    mostrarEmprestimos(emprestimo);
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
}

// Chama a função ao carregar a página
carregarEmprestimos();
