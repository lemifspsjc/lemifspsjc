const API_URL_LOGIN =
  "https://script.google.com/macros/s/AKfycbwjVa00294yRWFTYPJZeB4u4rLJ-d8oIaAcCHenyHJcvdvDUr3r872pnKxrhfkN3bpOHQ/exec";

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const btnEntrar = document.getElementById("entrar");
    btnEntrar.disabled = true;
    btnEntrar.textContent = "Entrando...";

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    try {
      // Requisição para validar login
      const loginRes = await fetch(API_URL_LOGIN, {
        method: "POST",
        body: JSON.stringify({
          acao: "login",
          USER: usuario,
          PASSWORD: senha,
        }),
      });

      const loginJson = await loginRes.json();

      if (loginJson.status === "sucesso") {
        // Requisição para registrar histórico
        const agora = new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        });
        await fetch(API_URL_LOGIN, {
          method: "POST",
          body: JSON.stringify({
            acao: "registraHistorico",
            USER: usuario,
            DATAHORA: agora,
          }),
        });

        // Salva sessão e redireciona
        localStorage.setItem("logado", "true");
        localStorage.setItem("usuario", usuario);
        // Determina o tempo de sessão para 10 minutos a partir do login
        localStorage.setItem("sessaoExpira", agora + 10*60*1000);
        window.location.href = "registro.html";
      } else {
        document.getElementById("mensagem").innerText = loginJson.mensagem;
      }
    } catch (erro) {
      document.getElementById("mensagem").innerText =
        "Erro na conexão com o servidor.";
      console.error(erro);
      btnEntrar.disabled = false;
    btnEntrar.textContent = "Entrar";
    }
  });
