const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", function () {
  nav.classList.toggle("ativo");
});

const links = document.querySelectorAll(".link");
for (let i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function () {
    nav.classList.remove("ativo");
  });
}

const ano = document.getElementById("ano");
ano.textContent = new Date().getFullYear();

function somenteNumeros(texto) {
  return texto.replace(/\D/g, "");
}

const formCnpj = document.getElementById("formCnpj");
const inputCnpj = document.getElementById("inputCnpj");
const erroCnpj = document.getElementById("erroCnpj");
const resultCnpj = document.getElementById("resultCnpj");

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
    const resposta = await fetch("https://brasilapi.com.br/api/cnpj/v1/" + cnpj);

    if (!resposta.ok) {
      erroCnpj.textContent = "CNPJ não encontrado.";
      return;
    }

    const dados = await resposta.json();

    console.log(dados);

    resultCnpj.innerHTML =
      "<p><strong>Razão Social:</strong> " + dados.razao_social + "</p>" +
      "<p><strong>Situação:</strong> " + dados.descricao_situacao_cadastral + "</p>" +
      "<p><strong>Cidade:</strong> " + dados.municipio + " - " + dados.uf + "</p>";

    resultCnpj.style.display = "block";

  } catch (erro) {
    erroCnpj.textContent = "Erro ao consultar o CNPJ.";
  }
});


const formCep = document.getElementById("formCep");
const inputCep = document.getElementById("inputCep");
const erroCep = document.getElementById("erroCep");
const resultCep = document.getElementById("resultCep");

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
    const resposta = await fetch("https://brasilapi.com.br/api/cep/v1/" + cep);

    if (!resposta.ok) {
      erroCep.textContent = "CEP não encontrado.";
      return;
    }

    const dados = await resposta.json();

    console.log(dados);

    resultCep.innerHTML =
      "<p><strong>Rua:</strong> " + dados.street + "</p>" +
      "<p><strong>Bairro:</strong> " + dados.neighborhood + "</p>" +
      "<p><strong>Cidade:</strong> " + dados.city + " - " + dados.state + "</p>";

    resultCep.style.display = "block";

  } catch (erro) {
    erroCep.textContent = "Erro ao consultar o CEP.";
  }
});


const formFipe = document.getElementById("formFipe");
const selectTipo = document.getElementById("selectTipo");
const selectMarca = document.getElementById("selectMarca");
const erroFipe = document.getElementById("erroFipe");
const resultFipe = document.getElementById("resultFipe");

async function carregarMarcas() {
  const tipo = selectTipo.value;
  selectMarca.innerHTML = "<option value=''>Carregando marcas...</option>";

  try {
    const resposta = await fetch("https://brasilapi.com.br/api/fipe/marcas/v1/" + tipo);
    const marcas = await resposta.json();

    selectMarca.innerHTML = "";

    for (let i = 0; i < marcas.length; i++) {
      const opcao = document.createElement("option");
      opcao.value = marcas[i].valor;
      opcao.textContent = marcas[i].nome;
      selectMarca.appendChild(opcao);
    }

  } catch (erro) {
    selectMarca.innerHTML = "<option value=''>Erro ao carregar marcas</option>";
  }
}

carregarMarcas();

selectTipo.addEventListener("change", carregarMarcas);

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
    const resposta = await fetch("https://brasilapi.com.br/api/fipe/veiculos/v1/" + tipo + "/" + marca);
    const modelos = await resposta.json();

    console.log(modelos);

    let lista = "<ul>";
    for (let i = 0; i < modelos.length; i++) {
      lista += "<li>" + modelos[i].nome + "</li>";
    }
    lista += "</ul>";

    resultFipe.innerHTML = lista;
    resultFipe.style.display = "block";

  } catch (erro) {
    erroFipe.textContent = "Erro ao consultar a FIPE.";
  }
});