// URL da API do Google Apps Script
const API_URL_REGISTRA_DEVOLUCAO = "https://script.google.com/macros/s/AKfycbzKEl82fwqdQGWL9eBo0_QJ04mf6_qMIGGqf18Jxl_U_Kd6Cx2shkZwQeYi6zdbvZs/exec";

//------------------------------------------------------------------------------------------------
// FUNÇÃO PARA REGISTRAR DADOS

document.getElementById("formDevolucao").addEventListener("submit", async function(e) {
  e.preventDefault();

  const checkboxes = document.querySelectorAll(".checkbox-emprestimo:checked");
  if (checkboxes.length === 0) {
    alert("Selecione ao menos um empréstimo para registrar a devolução.");
    return;
  }

  const recebidoPor = prompt("Informe quem recebeu a devolução:");
  if (!recebidoPor || recebidoPor.trim() === "") {
    alert("O campo 'Recebido por' é obrigatório.");
    return;
  }

  // Monta dados para enviar
  const dados = {
    recebidoPor: recebidoPor.trim(),
    emprestimos: Array.from(checkboxes).map(cb => cb.value) // assumindo que o value identifica o empréstimo
  };

  try {
    const resposta = await fetch(API_URL_REGISTRA_DEVOLUCAO, {
      method: "POST",
      body: JSON.stringify(dados),
      headers: { "Content-Type": "application/json" }
    });

    const resultado = await resposta.json();

    alert(resultado.status === "sucesso" ? "Devolução registrada!" : "Erro ao registrar devolução!");
  } catch (erro) {
    alert("Erro na comunicação com a API.");
  }
});