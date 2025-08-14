// URL da API do Google Apps Script
const API_URL_REGISTRA_DEVOLUCAO =
  "https://script.google.com/macros/s/AKfycbzKEl82fwqdQGWL9eBo0_QJ04mf6_qMIGGqf18Jxl_U_Kd6Cx2shkZwQeYi6zdbvZs/exec";


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formDevolucao");
  const container = document.getElementById("lista-emprestimos");
  const btnDevolver = document.getElementById("btnDevolver");

  if (!form || !container) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Seleciona todas as checkboxes marcadas
    const checkboxes = document.querySelectorAll(
      'input[name="emprestimosSelecionados"]:checked'
    );
    if (checkboxes.length === 0) {
      alert("Selecione ao menos um empréstimo para registrar a devolução.");
      return;
    }

    // Pede quem recebeu a devolução
    const recebidoPor = prompt("Informe quem recebeu a devolução:");
    if (!recebidoPor || recebidoPor.trim() === "") {
      alert("O campo 'Recebido por' é obrigatório.");
      return;
    }

    btnDevolver.disabled = true;
    btnDevolver.textContent = "Registrando...";

    // Coleta os dados das checkboxes selecionadas
    const selecionados = Array.from(checkboxes).map((cb) => ({
      ID: Number(cb.value),
      Nome: cb.dataset.nome,
      Sobrenome: cb.dataset.sobrenome,
      Material: cb.dataset.material,
      DataEmprestimo: cb.dataset.dataemprestimo,
    }));

    try {
      // Envia cada empréstimo como registro separado
      const respostas = await Promise.all(
        selecionados.map((dado) =>
          fetch(API_URL_REGISTRA_DEVOLUCAO, {
            method: "POST",
            body: JSON.stringify({
              acao: "adicionar",
              Nome: dado.Nome,
              Sobrenome: dado.Sobrenome,
              Material: dado.Material,
              DataEmprestimo: dado.DataEmprestimo,
              DataDevolucao: new Date().toISOString().split("T")[0],
              RecebidoPor: recebidoPor.trim(),
            }),
          }).then((res) => res.json())
        )
      );

      if (respostas.length > 0) {
        const API_URL_EMPRESTIMOS = "https://script.google.com/macros/s/AKfycbzImkmTkpoH8qA5Q6rA9jQVidow6icvDO_lozHkvqpBI4TxSDe7h1wkH-4CGoOfLk9wuA/exec";
        const atualizaEmprestimos = await Promise.all(
          selecionados.map((dado) => fetch(API_URL_EMPRESTIMOS, {
            method: "POST",
            body: JSON.stringify({
              acao: "editar",
              ID: dado.ID,
              Nome: dado.Nome,
              Sobrenome: dado.Sobrenome,
              Material: dado.Material,
              DataEmprestimo: dado.DataEmprestimo,
              Status: "Devolvido"
            })
          }).then(res => res.json())
        ));
      }

      const todosSucesso = respostas.every((r) => r.status === "sucesso");
      alert(
        todosSucesso
          ? "Devoluções registradas com sucesso!"
          : "Erro em algum registro."
      );

      if (typeof listarEmprestimos === "function") listarEmprestimos();
    } catch (erro) {
      console.error("Erro ao registrar devoluções:", erro);
      alert("Erro na comunicação com a API.");
    }
    window.location.href = "./consulta.html";
  });
});
