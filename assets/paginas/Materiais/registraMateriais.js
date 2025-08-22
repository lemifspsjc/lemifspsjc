// validação dos dados do formulário
const btnCadastrar = document.getElementById('cadastrar');

const nome = document.getElementById('material');
const qtdTotal = document.getElementById('qtd-total');
const disponivel = document.getElementById('disponivel');
const defeito = document.getElementById('defeito');
const descDefeito = document.getElementById('desc-defeito');
const descMaterial = document.getElementById('desc-material');

const lblQtdTotal = document.getElementById('lbl-qtd-total');
const lbldisponivel = document.getElementById('lbl-disponivel');
const lblDefeito = document.getElementById('lbl-defeito');
const lblDescDefeito = document.getElementById('lbl-desc-defeito');

function validarDados() {
  if ((apropriado.value.length >= 1 || defeito.value.length >= 1) && qtdTotal.value.length >= 1) {
    if ((Number(apropriado.value) + Number(defeito.value)) <= qtdTotal.value) {
      if (defeito.value.length >= 1) {
        if ((descDefeito.value.length == 0 && defeito.value == 0) || (descDefeito.value.length > 1 && defeito.value >= 1)) {
          if (nome.value.length > 2 && qtdTotal.value >= 1 && apropriado.value >= 1 && descMaterial.value.length > 2) {
            btnCadastrar.disabled = false;
          } else {
            btnCadastrar.disabled = true;
          }
          document.getElementById('erro-defeito').style.display = "none";
          lblDefeito.style.border = "none";
          lblDescDefeito.style.border = "none";
          console.log(Number(apropriado.value) + Number(defeito.value))
        } else {
          document.getElementById('erro-defeito').style.display = "block";
          
          lblDefeito.style.border = "1px solid #EA1010";
          lblDescDefeito.style.border = "1px solid #EA1010";
        }
      }
      document.getElementById('erro-qtd').style.display = "none";
      lblQtdTotal.style.border = "none";
      lblApropriado.style.border = "none";
    } else {
      document.getElementById('erro-qtd').style.display = "block";
      
      lblQtdTotal.style.border = "1px solid #EA1010";
      lblApropriado.style.border = "1px solid #EA1010";
      lblDefeito.style.border = "1px solid #EA1010";
    }
  }
};

// URL da API do Google Apps Script
const API_URL_REGISTRA_MATERIAIS = "https://script.google.com/macros/s/AKfycbxdC8WGd8afkiUr3WE98NzWKkFi9H220Lj7ZkVHjoxmQRow2F7LP8ITsoJqUgtagiU/exec";

//------------------------------------------------------------------------------------------------
// FUNÇÃO PARA REGISTRAR DADOS

document.getElementById("formMaterial").addEventListener("submit", async function(e) {
  e.preventDefault();

  const botaoSalva = document.getElementById("cadastrar")
  botaoSalva.disabled = true;
  botaoSalva.textContent = "Salvando...";

  Swal.fire({
    title: "Registrando...",
    html: "<div class='spinner'></div>",
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false
  });

  const formData = new FormData(this);
  const dados = {};
  formData.forEach((valor, chave) => {
    dados[chave] = valor;
  });

  const resposta = await fetch(API_URL_REGISTRA_MATERIAIS, {
    method: "POST",
    body: JSON.stringify({
      acao: "adicionar",
      ...dados
    }),
  });

  const resultado = await resposta.json();
  if (resultado.status === "sucesso") {
    Swal.fire({
      title: "Registro bem-sucedido!",
      text: "O material foi registrado com sucesso!",
      icon: "success",
      confirmButtonText: "Obrigado!",
      confirmButtonColor: '#38B42E',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "../../../index.html";
      }
    });
  }
});