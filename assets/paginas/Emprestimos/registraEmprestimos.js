// URL da API do Google Apps Script
const API_URL_REGISTRA_EMPRESTIMOS = "https://script.google.com/macros/s/AKfycbzImkmTkpoH8qA5Q6rA9jQVidow6icvDO_lozHkvqpBI4TxSDe7h1wkH-4CGoOfLk9wuA/exec";

//------------------------------------------------------------------------------------------------
// FUNÇÃO PARA REGISTRAR DADOS

document
  .getElementById("formEmprestimo")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const dados = {};

    // Captura campos normais (Nome, Sobrenome, Data)
    formData.forEach((valor, chave) => {
      dados[chave] = valor;
    });

    // Captura os materiais selecionados (checkbox)
    const selecionados = [];
    document
      .querySelectorAll('input[name="materiaisSelecionados"]:checked')
      .forEach((checkbox) => {
        selecionados.push(checkbox.value);
      });

    
    dados["Material"] = selecionados.join(", ");
    dados["Status"] = "Emprestado";

    // Envia via POST
    const resposta = await fetch(API_URL_REGISTRA_EMPRESTIMOS, {
      method: "POST",
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();
    alert(
      resultado.status === "sucesso" ? "Registro inserido!" : "Erro ao inserir!"
    );
  });
