// Função para tratar datas
function formatarData(dataISO) {
  var data = new Date(dataISO);
  var dia = String(data.getDate()).padStart(2, "0");
  var mes = String(data.getMonth() + 1).padStart(2, "0");
  var ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

// Função para exibir os materiais na página
function mostrarEmprestimos(lista) {
  const container = document.getElementById("emprestimos");
  container.innerHTML = ""; // Limpa antes de adicionar

  lista.forEach(emprestimo => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${emprestimo["ID_Emprestimo"]} - ${emprestimo["Nome"]} ${emprestimo["Sobrenome"]}</strong><br>
      <b><i class="fa-solid fa-box"></i> Material Emprestado:</b> ${emprestimo["Material"]}<br>
      <b><i class="fa-solid fa-calendar-days"></i> Data de Empréstimo:</b> ${formatarData(emprestimo["DataEmprestimo"])}<br>
      <b><i class="fa-solid fa-file-circle-check"></i> Status:</b> ${emprestimo["Status"]}<br><br>
      <hr>
      <br>
    `;
    container.appendChild(div);
  });
};

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
};

// Chama a função ao carregar a página
carregarEmprestimos();
