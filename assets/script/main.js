const input = document.getElementById("search");
const btnBuscar = document.querySelector(".button button");
const listaSugestoes = document.getElementById("lista");

const headerContainer = document.querySelector(".header_container");
const headerContent = document.querySelector(".header_content");

let plantas = [];

// Carrega o JSON local
fetch("./plantas.json")
  .then((res) => res.json())
  .then((data) => (plantas = data));

// Sugestões enquanto digita (somente do JSON local)
input.addEventListener("input", () => {
  const termo = input.value.trim().toLowerCase();
  listaSugestoes.innerHTML = "";

  if (termo.length < 2) {
    listaSugestoes.style.display = "none";
    return;
  }

  const filtradas = plantas.filter(
    (p) =>
      p.nomePopular?.toLowerCase().includes(termo) ||
      p.nomeCientifico?.toLowerCase().includes(termo) ||
      p.localColeta?.toLowerCase().includes(termo)
  );

  if (filtradas.length > 0) {
    listaSugestoes.style.display = "block";
    filtradas.slice(0, 5).forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p.nomePopular;
      li.addEventListener("click", () => {
        input.value = p.nomePopular;
        listaSugestoes.style.display = "none";
      });
      listaSugestoes.appendChild(li);
    });
  } else {
    listaSugestoes.style.display = "none";
  }
});

btnBuscar.addEventListener("click", () => buscar());
input.addEventListener("keyup", (e) => e.key === "Enter" && buscar());

/* 
 Função auxiliar: buscar dados da OpenFarm API
*/
async function buscarOpenFarm(nome) {
  try {
    const res = await fetch(
      `https://openfarm.cc/api/v1/crops/?filter=${encodeURIComponent(nome)}`
    );
    if (!res.ok) throw new Error("Erro na OpenFarm");
    const json = await res.json();
    if (json.data.length === 0) return [];
    return json.data.map((p) => p.attributes);
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function buscar() {
  const termo = input.value.trim().toLowerCase();
  if (!termo) return;

  // Filtra no JSON local
  let filtradas = plantas.filter(
    (p) =>
      p.nomePopular?.toLowerCase().includes(termo) ||
      p.nomeCientifico?.toLowerCase().includes(termo) ||
      p.localColeta?.toLowerCase().includes(termo)
  );

  // Se não encontrar nada no JSON local -> buscar diretamente na API
  let resultadosAPI = [];
  if (filtradas.length === 0) {
    resultadosAPI = await buscarOpenFarm(termo);
  }

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
  span.textContent = ` plantas encontradas ( ${
    filtradas.length || resultadosAPI.length
  } ) `;

  head.appendChild(h1);
  head.appendChild(span);
  headerContent.appendChild(head);

  const cardsContainer = document.createElement("div");
  cardsContainer.classList.add("cards-container");
  headerContent.appendChild(cardsContainer);

  // Mostrar do JSON local
  for (const planta of filtradas) {
    await renderizarCard(cardsContainer, planta);
  }

  // Mostrar diretamente da API se não achou nada local
  if (filtradas.length === 0) {
    for (const planta of resultadosAPI) {
      renderizarCardAPI(cardsContainer, planta);
    }
  }
}

/* Renderiza card das plantas do JSON local */
async function renderizarCard(container, planta) {
  // Busca dados extras da API
  const dadosAPI = await buscarOpenFarm(
    planta.nomeCientifico || planta.nomePopular
  );
  const apiData = dadosAPI.length > 0 ? dadosAPI[0] : null;

  const card = document.createElement("div");
  card.classList.add("card");

  const h3 = document.createElement("h3");
  h3.classList.add("card__title");
  h3.textContent = planta.nomePopular;
  card.appendChild(h3);

  const linha = document.createElement("div");
  linha.classList.add("card__scientific-img");

  const cientifico = document.createElement("p");
  cientifico.classList.add("card__scientific-name");
  cientifico.textContent = planta.nomeCientifico;

  const img = document.createElement("img");
  img.classList.add("card__image");
  img.src = apiData?.main_image_path || planta.imagem;
  img.alt = planta.nomePopular;

  linha.appendChild(cientifico);
  linha.appendChild(img);
  card.appendChild(linha);

  const desc = document.createElement("p");
  desc.classList.add("card__description");
  desc.textContent =
    planta.descricao || apiData?.description || "Sem descrição disponível.";
  card.appendChild(desc);

  container.appendChild(card);
}

/* Renderiza card diretamente de um resultado da API */
function renderizarCardAPI(container, plantaAPI) {
  const card = document.createElement("div");
  card.classList.add("card");

  const h3 = document.createElement("h3");
  h3.classList.add("card__title");
  h3.textContent = plantaAPI.name;
  card.appendChild(h3);

  const linha = document.createElement("div");
  linha.classList.add("card__scientific-img");

  const cientifico = document.createElement("p");
  cientifico.classList.add("card__scientific-name");
  cientifico.textContent = plantaAPI.binomial_name || "Desconhecido";

  const img = document.createElement("img");
  img.classList.add("card__image");
  img.src = plantaAPI.main_image_path || "sem-imagem.png";
  img.alt = plantaAPI.name;

  linha.appendChild(cientifico);
  linha.appendChild(img);
  card.appendChild(linha);

  const desc = document.createElement("p");
  desc.classList.add("card__description");
  desc.textContent = plantaAPI.description || "Sem descrição disponível.";
  card.appendChild(desc);

  container.appendChild(card);
}
