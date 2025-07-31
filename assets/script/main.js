const input = document.getElementById("search");
const btnBuscar = document.querySelector(".button button");
const listaSugestoes = document.getElementById("lista");

const headerContainer = document.querySelector(".header_container");
const headerContent = document.querySelector(".header_content");

let plantas = [];

// Carrega o JSON
fetch("./plantas.json")
  .then((res) => res.json())
  .then((data) => (plantas = data));

// Sugestões enquanto digita
input.addEventListener("input", () => {
  const termo = input.value.trim().toLowerCase();
  listaSugestoes.innerHTML = "";

  if (termo.length < 2) {
    listaSugestoes.style.display = "none";
    return;
  }

  const filtradas = plantas.filter(
    (p) =>
      p.nome_popular?.toLowerCase().includes(termo) ||
      p.nome_cientifico?.toLowerCase().includes(termo) ||
      p.familia?.toLowerCase().includes(termo)
  );

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
  const termo = input.value.trim().toLowerCase();
  if (!termo) return;

  const filtradas = plantas.filter(
    (p) =>
      p.nome_popular?.toLowerCase().includes(termo) ||
      p.nome_cientifico?.toLowerCase().includes(termo) ||
      p.familia?.toLowerCase().includes(termo)
  );

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

    const h3 = document.createElement("h3");
    h3.classList.add("card__title");
    h3.textContent = planta.nome_popular;
    card.appendChild(h3);

    const linha = document.createElement("div");
    linha.classList.add("card__scientific-img");

    const cientifico = document.createElement("p");
    cientifico.classList.add("card__scientific-name");
    cientifico.textContent = planta.nome_cientifico;
    linha.appendChild(cientifico);

    card.appendChild(linha);

    // Família
    const bottom = document.createElement("div");
    bottom.classList.add("card__info");

    const familiaWrapper = document.createElement("div");
    familiaWrapper.classList.add("card__info-item");
    familiaWrapper.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
        class="card__icon">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
      </svg>
      <span class="card__family">
        Família: ${planta.familia ? planta.familia : "Não informado"}
      </span>
    `;

    bottom.appendChild(familiaWrapper);
    card.appendChild(bottom);

    cardsContainer.appendChild(card);
  });
}
