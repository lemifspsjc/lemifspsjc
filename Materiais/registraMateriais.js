// URL da API do Google Apps Script
const API_URL_REGISTRA_MATERIAIS = "https://script.google.com/macros/s/AKfycbxdC8WGd8afkiUr3WE98NzWKkFi9H220Lj7ZkVHjoxmQRow2F7LP8ITsoJqUgtagiU/exec";

//------------------------------------------------------------------------------------------------
// FUNÇÃO PARA REGISTRAR DADOS

document.getElementById("formMaterial").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const dados = {};
  formData.forEach((valor, chave) => {
    dados[chave] = valor;
  });

  const resposta = await fetch(API_URL_REGISTRA_MATERIAIS, {
    method: "POST",
    body: JSON.stringify(dados)
  });

  const resultado = await resposta.json();
  alert(resultado.status === "sucesso" ? "Registro inserido!" : "Erro ao inserir!");
});