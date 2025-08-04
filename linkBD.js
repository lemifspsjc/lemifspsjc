// URL da API do Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbzyoAZWWJTqSp9IKPsY7uCDHk5DBOrMnmlBhhIHTpyB7WoeI3737NUzPZLmUG8okg8JbQ/exec";

//------------------------------------------------------------------------------------------------
// FUNÇÃO PARA CONSULTAR DADOS

async function carregarMateriais() {
  try {
    const resposta = await fetch(API_URL + "?t=" + Date.now());
    const dados = await resposta.json(); // Converte JSON em objeto JS

    console.log("Dados recebidos:", dados);

    const materiaisDisponiveis = dados

    // Exibir no HTML
    mostrarMateriais(materiaisDisponiveis);

  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
}

// Função para exibir os materiais na página
function mostrarMateriais(lista) {
  const container = document.getElementById("materiais");
  container.innerHTML = ""; // Limpa antes de adicionar

  lista.forEach(material => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${material["ID"]} - ${material["Material"]}</strong><br>
      Quantidade Total: ${material["Quantidade Total"]}<br>
      Armário: ${material["Armário"]}<br>
      Prateleira: ${material["Prateleira"]}<br>
      Área Trabalhada: ${material["Área Trabalhada"]}<br>
      Habilidade(s): ${material["Habilidade(s) Trabalhada(s)"]}<br>
      Descrição: ${material["Descrição do Material"]}
      <hr>
    `;
    container.appendChild(div);
  });
}

// Chama a função ao carregar a página
carregarMateriais();


//------------------------------------------------------------------------------------------------
// FUNÇÃO PARA REGISTRAR DADOS

document.getElementById("formMaterial").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const dados = {};
  formData.forEach((valor, chave) => {
    dados[chave] = valor;
  });

  const resposta = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(dados)
  });

  const resultado = await resposta.json();
  alert(resultado.status === "sucesso" ? "Registro inserido!" : "Erro ao inserir!");
});