// Função para tratar datas
function formatarData(dataISO) {
  var data = new Date(dataISO);
  var dia = String(data.getDate()).padStart(2, "0");
  var mes = String(data.getMonth() + 1).padStart(2, "0");
  var ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

// Função para exibir os materiais na página
function mostrarDevolucoes(lista) {
  const container = document.getElementById("devolucoes");
  container.innerHTML = ""; // Limpa antes de adicionar

  lista.forEach(devolucao => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${devolucao["ID_Devolucao"]} - ${devolucao["Nome"]} ${devolucao["Sobrenome"]}</strong><br>
      <b><i class="fa-solid fa-box"></i> Material Emprestado:</b> ${devolucao["Material"]}<br>
      <b><i class="fa-solid fa-calendar-days"></i> Data de Empréstimo:</b> ${formatarData(devolucao["DataEmprestimo"])}<br>
      <b><i class="fa-solid fa-calendar-check"></i> Data de Devolução:</b> ${formatarData(devolucao["DataDevolucao"])}<br>
      <hr>
    `;
    container.appendChild(div);
  });
};

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
};

// Chama a função ao carregar a página
carregarDevolucoes();