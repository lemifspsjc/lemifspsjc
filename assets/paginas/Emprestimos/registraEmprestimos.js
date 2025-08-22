// validação dos dados do formulário
const nome = document.getElementById("nome");
const sobrenome = document.getElementById("sobrenome");
const botaoEnviar = document.getElementById("botao");
function validarDados() {
  if (nome.value.length > 2 && sobrenome.value.length > 2) {
    botaoEnviar.disabled = false;
  } else {
    botaoEnviar.disabled = true;
  }
}

// URL da API do Google Apps Script
const API_URL_EMPRESTIMOS =
  "https://script.google.com/macros/s/AKfycbzImkmTkpoH8qA5Q6rA9jQVidow6icvDO_lozHkvqpBI4TxSDe7h1wkH-4CGoOfLk9wuA/exec";

//------------------------------------------------------------------------------------------------
// Função para tratar datas
function formatarData(dataISO) {
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// FUNÇÃO PARA REGISTRAR DADOS
document
  .getElementById("formEmprestimo")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Captura os materiais selecionados (checkbox)
    const selecionados = [];
    document
      .querySelectorAll('input[name="materiaisSelecionados"]:checked')
      .forEach((checkbox) => {
        const material = checkbox.value;

        // procura o input de quantidade dentro da mesma div do checkbox
        const quantidadeInput = checkbox
          .closest("div")
          .querySelector('input[name="Quantidade a Emprestar"]');
        const quantidade = quantidadeInput ? quantidadeInput.value : 1;

        selecionados.push(`${material} (${quantidade})`);
      });
    if (selecionados.length === 0) {
      Swal.fire({
        icon: "question",
        title: "Nenhum material selecionado.",
        text: "Selecione ao menos um material para registrar o empréstimo.",
        confirmButtonText: "Tudo bem!",
        confirmButtonColor: "#38B42E",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return;
    }

    const formData = new FormData(this);
    const dados = {};

    formData.forEach((valor, chave) => {
      dados[chave] = valor;

      botaoEnviar.disabled = true;
      botaoEnviar.textContent = "Prosseguindo...";
      Swal.fire({
        title: "Prosseguindo...",
        html: "<div class='spinner'></div>",
        heightAuto: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    });

    dados["Material"] = selecionados.join(", ");
    dados["Status"] = "Emprestado";
    dados["acao"] = "adicionar";

    // Envia via POST
    const resposta = await fetch(API_URL_EMPRESTIMOS, {
      method: "POST",
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (resultado.status === "sucesso") {
      // busca o registro recém-criado pelo ID retornado
      const todos = await fetch(API_URL_EMPRESTIMOS);
      const lista = await todos.json();
      const ultimo = lista.find(
        (r) => Number(r.ID_Emprestimo || r.ID) === resultado.idGerado
      );

      if (ultimo) {
        const materiaisSelecionados = (ultimo.Material || "").split(", ");

        let materiaisHTML = `<strong>Material(s) Selecionado(s)</strong><br>`;
        materiaisSelecionados.forEach((mat) => {
          materiaisHTML += `
            <input type="checkbox" value="${mat}" checked disabled>
            <label>${mat}</label><br>
          `;
        });

        async function excluir() {
          await fetch(API_URL_EMPRESTIMOS, {
            method: "POST",
            body: JSON.stringify({
              acao: "excluir",
              ID: ultimo.ID || ultimo.ID_Emprestimo,
            }),
          });
        }

        Swal.fire({
          html: `
            <div class="mostrar-dados">
              <label>
                <i class="fa-solid fa-user"></i>
                <input type="text" id="nome" placeholder="Nome" name="Nome" value="${
                  ultimo.Nome
                }" readonly required> <br>
              </label>

              <label>
                <i class="fa-solid fa-signature"></i>
                <input type="text" id="Sobrenome" placeholder="Sobrenome" name="Sobrenome" value="${
                  ultimo.Sobrenome
                }" readonly required> <br>
              </label>

              <label>
                <i class="fa-solid fa-calendar-days"></i>
                <input type="text" name="DataEmprestimo" value="${formatarData(
                  ultimo.DataEmprestimo
                )}" readonly required>
              </label>
            </div>

            <div id="materiais">${materiaisHTML}</div>
          `,
          confirmButtonText: "Finalizar",
          confirmButtonColor: "#38B42E",
          showDenyButton: true,
          denyButtonText: "Cancelar",
          denyButtonColor: "#EA1010",
          showCancelButton: true,
          cancelButtonText: "Editar",
          cancelButtonColor: "#38B42E",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Registro bem-sucedido!",
              text: "O empréstimo foi registrado com sucesso!",
              icon: "success",
              confirmButtonText: "Obrigado!",
              confirmButtonColor: "#38B42E",
              allowOutsideClick: false,
              allowEscapeKey: false,
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "./consulta.html";
              }
            });
          } else if (result.isDenied) {
            Swal.fire({
              title: "Cancelamento bem-sucedido!",
              text: "O empréstimo foi cancelado com sucesso!",
              icon: "success",
              confirmButtonText: "Obrigado!",
              confirmButtonColor: "#38B42E",
              allowOutsideClick: false,
              allowEscapeKey: false,
            }).then((result) => {
              if (result.isConfirmed) {
                excluir();
                window.location.href = "../../../index.html";
              }
            });
          } else {
            excluir();
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = "Prosseguir";
          }
        });
      }
    } else {
      Swal.fire({
        title: "Erro ao inserir!",
        text: resultado.mensagem,
        icon: "error",
        showDenyButton: true,
        denyButtonText: "Tentar novamente",
        denyButtonColor: "#EA1010",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      botaoEnviar.disabled = false;
      botaoEnviar.textContent = "Prosseguir";
    }
  });

// -------------------- FUNÇÃO MOSTRAR MATERIAIS --------------------
function mostrarMateriais(lista, selecionados = []) {
  const container = document.getElementById("materiais");
  container.innerHTML = ""; // Limpa antes de adicionar

  lista.forEach((material) => {
    const div = document.createElement("div");
    div.className = "mostrar-dados";
    div.style.alignItems = "center";
    div.style.flexDirection = "row";

    const checked = selecionados.includes(material["Material"])
      ? "checked"
      : "";

    div.innerHTML = `
      <input type="checkbox" name="materiaisSelecionados" value="${material["Material"]}" ${checked}>
      <div>
        <strong>${material["Material"]}</strong><br>
        <b><i class="fa-solid fa-boxes-stacked"></i> Quantidade Disponivel:</b> ${material["Disponivel"]}<br>
        <b><i class="fa-solid fa-window-restore"></i> Local:</b> ${material["Armário"]}, ${material["Prateleira"]}<br>
        <b><i class="fa-solid fa-brain"></i> Área Trabalhada:</b> ${material["Área Trabalhada"]}<br>
        <b><i class="fa-solid fa-boxes-stacked"></i> Quantidade a Emprestar:</b><input type="number" name="Quantidade a Emprestar" value="1" min="1" max="${material["Disponivel"]}" style="background-color: white; border-radius: 5px; width: 35px; height: 20px; font-size: 20px"></input><br>
      </div>
      <div style="width: 80px; height: 80px; background-color: #eee; display: flex; align-items: center; justify-content: center;">
        <span>Imagem</span>
      </div>
      
    `;
    container.appendChild(div);
  });
}
