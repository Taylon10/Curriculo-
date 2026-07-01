const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", function () {
    nav.classList.toggle("ativo");
  });
}

const links = document.querySelectorAll(".link");

links.forEach(function (link) {
  link.addEventListener("click", function () {
    if (nav) {
      nav.classList.remove("ativo");
    }
  });
});

const ano = document.getElementById("ano");

if (ano) {
  ano.textContent = new Date().getFullYear();
}

function somenteNumeros(texto) {
  return texto.replace(/\D/g, "");
}

const formCnpj = document.getElementById("formCnpj");
const inputCnpj = document.getElementById("inputCnpj");
const erroCnpj = document.getElementById("erroCnpj");
const resultCnpj = document.getElementById("resultCnpj");

if (formCnpj) {
  formCnpj.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    erroCnpj.textContent = "";
    resultCnpj.style.display = "none";

    const cnpj = somenteNumeros(inputCnpj.value);

    if (cnpj.length !== 14) {
      erroCnpj.textContent = "Digite um CNPJ válido com 14 números.";
      return;
    }

    try {
      resultCnpj.innerHTML = "<p>Carregando...</p>";
      resultCnpj.style.display = "block";

      const resposta = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`
      );

      if (!resposta.ok) {
        throw new Error("CNPJ não encontrado.");
      }

      const dados = await resposta.json();

      resultCnpj.innerHTML = `<pre>${JSON.stringify(dados, null, 2)}</pre>`;
    } catch (erro) {
      resultCnpj.style.display = "none";
      erroCnpj.textContent = erro.message;
    }
  });
}

const formCep = document.getElementById("formCep");
const inputCep = document.getElementById("inputCep");
const erroCep = document.getElementById("erroCep");
const resultCep = document.getElementById("resultCep");

if (formCep) {
  formCep.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    erroCep.textContent = "";
    resultCep.style.display = "none";

    const cep = somenteNumeros(inputCep.value);

    if (cep.length !== 8) {
      erroCep.textContent = "Digite um CEP válido com 8 números.";
      return;
    }

    try {
      resultCep.innerHTML = "<p>Carregando...</p>";
      resultCep.style.display = "block";

      const resposta = await fetch(
        `https://brasilapi.com.br/api/cep/v1/${cep}`
      );

      if (!resposta.ok) {
        throw new Error("CEP não encontrado.");
      }

      const dados = await resposta.json();

      resultCep.innerHTML = `<pre>${JSON.stringify(dados, null, 2)}</pre>`;
    } catch (erro) {
      resultCep.style.display = "none";
      erroCep.textContent = erro.message;
    }
  });
}

const formFipe = document.getElementById("formFipe");
const selectTipo = document.getElementById("selectTipo");
const selectMarca = document.getElementById("selectMarca");
const erroFipe = document.getElementById("erroFipe");
const resultFipe = document.getElementById("resultFipe");

async function carregarMarcas() {
  if (!selectTipo || !selectMarca) return;

  const tipo = selectTipo.value;

  selectMarca.innerHTML =
    "<option value=''>Carregando marcas...</option>";

  try {
    const resposta = await fetch(
      `https://brasilapi.com.br/api/fipe/marcas/v1/${tipo}`
    );

    if (!resposta.ok) {
      throw new Error();
    }

    const marcas = await resposta.json();

    selectMarca.innerHTML =
      "<option value=''>Selecione uma marca</option>";

    marcas.forEach(function (marca) {
      const option = document.createElement("option");

      option.value = marca.valor;
      option.textContent = marca.nome;

      selectMarca.appendChild(option);
    });
  } catch (erro) {
    selectMarca.innerHTML =
      "<option value=''>Erro ao carregar marcas</option>";
  }
}

if (selectTipo) {
  carregarMarcas();
  selectTipo.addEventListener("change", carregarMarcas);
}

if (formFipe) {
  formFipe.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    erroFipe.textContent = "";
    resultFipe.style.display = "none";

    const tipo = selectTipo.value;
    const marca = selectMarca.value;

    if (!marca) {
      erroFipe.textContent = "Selecione uma marca.";
      return;
    }

    try {
      resultFipe.innerHTML = "<p>Carregando...</p>";
      resultFipe.style.display = "block";

      const resposta = await fetch(
        `https://brasilapi.com.br/api/fipe/veiculos/v1/${tipo}/${marca}`
      );

      if (!resposta.ok) {
        throw new Error("Erro ao consultar a FIPE.");
      }

      const dados = await resposta.json();

      resultFipe.innerHTML = `<pre>${JSON.stringify(dados, null, 2)}</pre>`;
    } catch (erro) {
      resultFipe.style.display = "none";
      erroFipe.textContent = erro.message;
    }
  });
}