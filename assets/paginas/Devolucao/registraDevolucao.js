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
      Swal.fire({
        icon: "question",
        title: "Nenhum empréstimo selecionado.",
        text: "Selecione ao menos um empréstimo para registrar a devolução.",
        confirmButtonText: "Tudo bem!",
        confirmButtonColor: '#38B42E',
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

    // Utiliza o usuário logado para marcar o campo "RecebidoPro"
    const recebidoPor = localStorage.getItem("usuario");

    btnDevolver.disabled = true;
    Swal.fire({
      title: "Registrando...",
      html: "<div class='spinner'></div>",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false
    });

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
              RecebidoPor: recebidoPor,
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
      if (todosSucesso) {
        Swal.fire({
          title: "Registro bem-sucedido!",
          text: "Devoluções registradas com sucesso!",
          icon: "success",
          confirmButtonText: "Obrigado!",
          confirmButtonColor: '#38B42E',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "./consulta.html";
          }
        });
      } else {
        Swal.fire({
          title: "Erro ao inserir!",
          text: "Houve erro em algum registro.",
          icon: "error",
          showDenyButton: true,
          denyButtonText: "OK...",
          denyButtonColor: "#EA1010",
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((result) => {
          if (result.isDenied) {
            window.location.href = "./consulta.html";
          }
        });
      }

      if (typeof listarEmprestimos === "function") listarEmprestimos();
    } catch (erro) {
      console.error("Erro ao registrar devoluções:", erro);
      Swal.fire({
          title: "Erro na comunicação com o servidor!",
          text: "Desculpe, não conseguimos nos comunicar com o servidor.",
          icon: "error",
          showDenyButton: true,
          denyButtonText: "OK...",
          denyButtonColor: "#EA1010",
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((result) => {
          if (result.isDenied) {
            window.location.href = "./consulta.html";
          }
        });
    }
  });
});
