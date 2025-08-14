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

    const formData = new FormData(this);
    const dados = {};

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
    dados["acao"] = "adicionar";

    // Envia via POST
    const resposta = await fetch(API_URL_EMPRESTIMOS, {
      method: "POST",
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (resultado.status === "sucesso") {
      const formulario = document.getElementById("formEmprestimo");
      formulario.innerHTML = "";

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

        formulario.style.border = "1px solid #ccc";
        formulario.style.padding = "10px";
        formulario.style.marginBottom = "10px";
        formulario.style.display = "flex";
        formulario.style.flexDirection = "column";
        formulario.style.gap = "10px";

        formulario.innerHTML = `
          <strong>Nome:</strong><input type="text" name="Nome" value="${ultimo.Nome}" readonly>
          <strong>Sobrenome:</strong><input type="text" name="Sobrenome" value="${ultimo.Sobrenome}" readonly>
          <strong>Data:</strong><input type="text" name="DataEmprestimo" value="${formatarData(ultimo.DataEmprestimo)}" readonly><br>
          <div id="materiais">${materiaisHTML}</div>
          <button type="button" id="editarUltimo">Editar</button>
          <button type="button" id="cancelarUltimo" style="background-color:red; color:white;">Cancelar</button>
          <button type="button" id="finalizar">Finalizar</button>
        `;

        document.getElementById("finalizar").addEventListener("click", () => {
           window.location.href = "./consulta.html";
        });

        // -------------------- CANCELAR --------------------
        document
          .getElementById("cancelarUltimo")
          .addEventListener("click", async () => {
            await fetch(API_URL_EMPRESTIMOS, {
              method: "POST",
              body: JSON.stringify({
                acao: "excluir",
                ID: ultimo.ID || ultimo.ID_Emprestimo,
              }),
            });
            formulario.innerHTML = "";
            alert("Empréstimo cancelado!");
          });

        // -------------------- EDITAR --------------------
        document
          .getElementById("editarUltimo")
          .addEventListener("click", async () => {
            const API_URL_CONSULTA_MATERIAIS =
              "https://script.google.com/macros/s/AKfycbxdC8WGd8afkiUr3WE98NzWKkFi9H220Lj7ZkVHjoxmQRow2F7LP8ITsoJqUgtagiU/exec";

            const respostaMateriais = await fetch(API_URL_CONSULTA_MATERIAIS);
            const listaMateriais = await respostaMateriais.json();
            const materiaisSelecionados = (ultimo.Material || "").split(", ");

            mostrarMateriais(listaMateriais, materiaisSelecionados);

            const botaoSalvar = document.getElementById("editarUltimo");
            botaoSalvar.textContent = "Salvar";

            botaoSalvar.addEventListener("click", async () => {
              // 1️⃣ Exclui antigo
              await fetch(API_URL_EMPRESTIMOS, {
                method: "POST",
                body: JSON.stringify({
                  acao: "excluir",
                  ID: ultimo.ID || ultimo.ID_Emprestimo,
                }),
              });

              // 2️⃣ Captura os novos dados editados
              const formDataEdit = new FormData(formulario);
              const novosDados = {};
              formDataEdit.forEach((valor, chave) => {
                novosDados[chave] = valor;
              });

              // Materiais selecionados
              const novosMateriais = [];
              document
                .querySelectorAll('input[name="materiaisSelecionados"]:checked')
                .forEach((checkbox) => novosMateriais.push(checkbox.value));

              novosDados["Material"] = novosMateriais.join(", ");
              novosDados["Status"] = "Emprestado";
              novosDados["acao"] = "adicionar";

              // 3️⃣ Envia edição
              await fetch(API_URL_EMPRESTIMOS, {
                method: "POST",
                body: JSON.stringify(novosDados),
              });

              formulario.innerHTML = "";
              alert("Empréstimo editado!");
               window.location.href = "./consulta.html";
            });
          });
      }
    } else {
      alert("Erro ao inserir: " + (resultado.mensagem || ""));
    }
  });

// -------------------- FUNÇÃO MOSTRAR MATERIAIS --------------------
function mostrarMateriais(lista, selecionados = []) {
  const container = document.getElementById("materiais");
  container.innerHTML = ""; // Limpa antes de adicionar

  lista.forEach((material) => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.marginBottom = "10px";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "10px";

    const checked = selecionados.includes(material["Material"]) ? "checked" : "";

    div.innerHTML = `
      <input type="checkbox" name="materiaisSelecionados" value="${material["Material"]}" ${checked}>
      <div>
        <strong>${material["Material"]}</strong><br>
        <b><i class="fa-solid fa-boxes-stacked"></i> Quantidade Total:</b> ${material["Quantidade Total"]}<br>
        <b><i class="fa-solid fa-window-restore"></i> Local:</b> ${material["Armário"]}, ${material["Prateleira"]}<br>
        <b><i class="fa-solid fa-brain"></i> Área Trabalhada:</b> ${material["Área Trabalhada"]}<br>
      </div>
      <div style="width: 80px; height: 80px; background-color: #eee; display: flex; align-items: center; justify-content: center;">
        <span>Imagem</span>
      </div>
    `;
    container.appendChild(div);
  });
}
