function mostrarMateriais(lista) {
  const container = document.getElementById("materiais");
  container.innerHTML = ""; // Limpa antes de adicionar

  lista.forEach(material => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.marginBottom = "10px";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "10px";
    div.innerHTML = `
      <input type="checkbox" name="materiaisSelecionados" value="${material["Material"]}">
      <div>
        <strong>${material["Material"]}</strong><br>
        Quantidade Total: ${material["Quantidade Total"]}<br>
        Armário: ${material["Armário"]}, Prateleira: ${material["Prateleira"]}<br>
        Área Trabalhada: ${material["Área Trabalhada"]}<br>
        Habilidades: ${material["Habilidade(s) Trabalhada(s)"]}<br>
        <em>${material["Descrição do Material"]}</em>
      </div>
      <div style="width: 80px; height: 80px; background-color: #eee; display: flex; align-items: center; justify-content: center;">
        <span>Imagem</span>
      </div>
      `;

    container.appendChild(div);
  });
}

// URL da API do Google Apps Script
const API_URL_REGISTRA_EMPRESTIMOS = "https://script.google.com/macros/s/AKfycbzImkmTkpoH8qA5Q6rA9jQVidow6icvDO_lozHkvqpBI4TxSDe7h1wkH-4CGoOfLk9wuA/exec";

//------------------------------------------------------------------------------------------------
// FUNÇÃO PARA REGISTRAR DADOS

document
  .getElementById("formEmprestimo")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const dados = {};

    // Captura campos normais (Nome, Sobrenome, Data)
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

    // Envia via POST
    const resposta = await fetch(API_URL_REGISTRA_EMPRESTIMOS, {
      method: "POST",
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();
    alert(
      resultado.status === "sucesso" ? "Registro inserido!" : "Erro ao inserir!"
    );
  });
