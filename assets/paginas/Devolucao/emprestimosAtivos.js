const API_URL_CONSULTA_EMPRESTIMOS =
  "https://script.google.com/macros/s/AKfycbzImkmTkpoH8qA5Q6rA9jQVidow6icvDO_lozHkvqpBI4TxSDe7h1wkH-4CGoOfLk9wuA/exec";

function formatarData(dataISO) {
  var data = new Date(dataISO);
  var dia = String(data.getDate()).padStart(2, "0");
  var mes = String(data.getMonth() + 1).padStart(2, "0");
  var ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

async function listarEmprestimos() {
  try {
    const resposta = await fetch(API_URL_CONSULTA_EMPRESTIMOS);
    const dados = await resposta.json();
    const ativos = dados.filter((e) => e.Status === "Emprestado");

    const container = document.getElementById("lista-emprestimos");
    container.innerHTML = ""; // limpa container

    ativos.forEach((emprestimo) => {
      const div = document.createElement("div"); // cria div para cada item
      div.innerHTML = `

      
      <input type="checkbox" name="emprestimosSelecionados" class="checkbox-emprestimo" value="${
        emprestimo.ID_Emprestimo
      }" id="chk-${emprestimo.ID_Emprestimo}"
      data-nome="${emprestimo.Nome}"
      data-sobrenome="${emprestimo.Sobrenome}"
      data-material="${emprestimo.Material}"
      data-dataemprestimo="${formatarData(emprestimo.DataEmprestimo)}">
    <label for="chk-${emprestimo.ID_Emprestimo}">
      <strong>${emprestimo.Nome} ${emprestimo.Sobrenome}</strong><br>
      Material: ${emprestimo.Material}<br>
      Data Empréstimo: ${formatarData(emprestimo.DataEmprestimo)}
    </label>
  `;
      container.appendChild(div);
      document.getElementById('btnDevolver').style.display = "block";
      document.querySelector('img').style.display = "none"; 
    });

  } catch (error) {
    Swal.fire({
      title: "Erro ao listar empréstimos:",
      text: error,
      icon: "error",
      showDenyButton: true,
      denyButtonText: "Tentar novamente",
      denyButtonColor: "#EA1010",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isDenied) {
        window.location.href = "./consulta.html";
      }
    });
    console.error("Erro ao listar empréstimos:", error);
  }
}

// Chama para listar quando carregar o script
listarEmprestimos();
