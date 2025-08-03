const input = document.getElementById("search");
const btnBuscar = document.querySelector(".button button");
const listaSugestoes = document.getElementById("lista");

const headerContainer = document.querySelector(".header_container");
const headerContent = document.querySelector(".header_content");

let plantas = [];

// Função para normalizar texto (remove espaços e hífens, converte para minúsculas)
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")              // separa os caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // remove os diacríticos (acentos)
    .replace(/[\s\-]+/g, "");     // remove espaços e hífens;
}

// Carrega o JSON e só depois habilita a busca
fetch("./plantas.json")
  .then((res) => res.json())
  .then((data) => {
    plantas = data;
    // Opcional: console.log para garantir que carregou
    console.log("Plantas carregadas:", plantas.length);
  })
  .catch((err) => {
    console.error("Erro ao carregar plantas.json:", err);
  });

// Sugestões enquanto digita
input.addEventListener("input", () => {
  if (!plantas.length) return; // evita erro se JSON não carregou ainda

  const termo = normalizar(input.value.trim());
  listaSugestoes.innerHTML = "";

  if (termo.length < 2) {
    listaSugestoes.style.display = "none";
    return;
  }

  const filtradas = plantas.filter((p) => {
    const nomePopular = normalizar(p.nome_popular || "");
    const nomeCientifico = normalizar(p.nome_cientifico || "");
    const reino = normalizar(p.Reino || "");
    const divisao = normalizar(p.Divisão || "");
    const classe = normalizar(p.Classe || "");
    const ordem = normalizar(p.Ordem || "");
    const familia = normalizar(p["Família"] || "");
    return (
      nomePopular.includes(termo) ||
      nomeCientifico.includes(termo) ||
      reino.includes(termo) ||
      divisao.includes(termo) ||
      classe.includes(termo) ||
      ordem.includes(termo) ||
      familia.includes(termo)
    );
  });

  if (filtradas.length > 0) {
    listaSugestoes.style.display = "block";
    filtradas.slice(0, 5).forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p.nome_popular;
      li.addEventListener("click", () => {
        input.value = p.nome_popular;
        listaSugestoes.style.display = "none";
      });
      listaSugestoes.appendChild(li);
    });
  } else {
    listaSugestoes.style.display = "none";
  }
});

// Busca ao clicar no botão
btnBuscar.addEventListener("click", () => {
  buscar();
});

// Busca ao pressionar Enter
input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") buscar();
});

function buscar() {
  if (!plantas.length) return; // evita erro se JSON não carregou

  const termo = normalizar(input.value.trim());
  if (!termo) return;

  const filtradas = plantas.filter((p) => {
    const nomePopular = normalizar(p.nome_popular || "");
    const nomeCientifico = normalizar(p.nome_cientifico || "");
    const reino = normalizar(p.Reino || "");
    const divisao = normalizar(p.Divisão || "");
    const classe = normalizar(p.Classe || "");
    const ordem = normalizar(p.Ordem || "");
    const familia = normalizar(p["Família"] || "");
    return (
      nomePopular.includes(termo) ||
      nomeCientifico.includes(termo) ||
      reino.includes(termo) ||
      divisao.includes(termo) ||
      classe.includes(termo) ||
      ordem.includes(termo) ||
      familia.includes(termo)
    );
  });

  // Esconde o container inicial e limpa resultados
  headerContainer.style.display = "none";
  headerContent.innerHTML = "";

  // Cabeçalho resultados
  const head = document.createElement("div");
  head.classList.add("header-results-header");

  const h1 = document.createElement("h1");
  h1.classList.add("header-results-title");
  h1.textContent = "Resultados da Pesquisa";

  const span = document.createElement("span");
  span.classList.add("header-results-count");
  span.textContent = ` plantas encontradas ( ${filtradas.length} ) `;

  head.appendChild(h1);
  head.appendChild(span);
  headerContent.appendChild(head);

  // Cards container
  const cardsContainer = document.createElement("div");
  cardsContainer.classList.add("cards-container");
  headerContent.appendChild(cardsContainer);

  // Criar os cards
  filtradas.forEach((planta) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Nome popular
    const h3 = document.createElement("h3");
    h3.classList.add("card__title");
    h3.textContent = planta.nome_popular;
    card.appendChild(h3);

    // Nome científico
    const cientifico = document.createElement("p");
    cientifico.classList.add("card__scientific-name");
    cientifico.textContent = planta.nome_cientifico;
    card.appendChild(cientifico);

    // Linha com imagem
    const linha = document.createElement("div");
    linha.classList.add("card__scientific-img");

    // Adiciona imagem se houver
    if (planta.imagem) {
      const img = document.createElement("img");
      img.src = planta.imagem;
      img.alt = planta.nome_popular;
      img.classList.add("card__image");
      linha.appendChild(img);
    }

    card.appendChild(linha);

    // Família
    const bottom = document.createElement("div");
    bottom.classList.add("card__info");

    const familiaWrapper = document.createElement("div");
    familiaWrapper.classList.add("card__info-item");

    // SVG para Família
    const svgIconFamilia = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgIconFamilia.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgIconFamilia.setAttribute("width", "18");
    svgIconFamilia.setAttribute("height", "18");
    svgIconFamilia.setAttribute("viewBox", "0 0 24 24");
    svgIconFamilia.setAttribute("fill", "none");
    svgIconFamilia.setAttribute("stroke", "currentColor");
    svgIconFamilia.setAttribute("stroke-width", "2");
    svgIconFamilia.setAttribute("stroke-linecap", "round");
    svgIconFamilia.setAttribute("stroke-linejoin", "round");
    svgIconFamilia.classList.add("card__icon");

    const circleFam = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circleFam.setAttribute("cx", "12");
    circleFam.setAttribute("cy", "12");
    circleFam.setAttribute("r", "10");
    svgIconFamilia.appendChild(circleFam);

    const path1Fam = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path1Fam.setAttribute("d", "M12 16v-4");
    svgIconFamilia.appendChild(path1Fam);

    const path2Fam = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path2Fam.setAttribute("d", "M12 8h.01");
    svgIconFamilia.appendChild(path2Fam);

    const labelFamilia = document.createElement("span");
    labelFamilia.classList.add("card__label");
    labelFamilia.textContent = "Família: ";

    const valueFamilia = document.createElement("span");
    valueFamilia.classList.add("card__value");
    valueFamilia.textContent = planta["família"] ? planta["família"] : "Não informado";

    familiaWrapper.appendChild(svgIconFamilia);
    familiaWrapper.appendChild(labelFamilia);
    familiaWrapper.appendChild(valueFamilia);

    bottom.appendChild(familiaWrapper);

    // Categorias extras
    const categorias = [
      { chave: "reino", label: "Reino"},
      { chave: "divisão", label: "Divisão" },
      { chave: "classe", label: "Classe" },
      { chave: "ordem", label: "Ordem" },
      { chave: "género", label: "Gênero"},
      { chave: "local", label: "Local"},
    ];

    categorias.forEach(({ chave, label }) => {
      if (planta[chave]) {
        const divCat = document.createElement("div");
        divCat.classList.add("card__info-item");

        // SVG para cada categoria
        const svgIcon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgIcon.setAttribute("width", "15");
        svgIcon.setAttribute("height", "15");
        svgIcon.setAttribute("viewBox", "0 0 24 24");
        svgIcon.setAttribute("fill", "none");
        svgIcon.setAttribute("stroke", "currentColor");
        svgIcon.setAttribute("stroke-width", "2");
        svgIcon.setAttribute("stroke-linecap", "round");
        svgIcon.setAttribute("stroke-linejoin", "round");
        svgIcon.classList.add("card__icon");

        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "12");
        circle.setAttribute("r", "10");
        svgIcon.appendChild(circle);

        const path1 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path1.setAttribute("d", "M12 16v-4");
        svgIcon.appendChild(path1);

        const path2 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path2.setAttribute("d", "M12 8h.01");
        svgIcon.appendChild(path2);

        const labelSpan = document.createElement("span");
        labelSpan.classList.add("card__label");
        labelSpan.textContent = label + ": ";

        const valueSpan = document.createElement("span");
        valueSpan.classList.add("card__value");
        valueSpan.textContent = planta[chave];

        divCat.appendChild(svgIcon);
        divCat.appendChild(labelSpan);
        divCat.appendChild(valueSpan);

        bottom.appendChild(divCat);
      }
    });

    card.appendChild(bottom);
    cardsContainer.appendChild(card);
  });
}
