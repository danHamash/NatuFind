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

// Busca ao clicar no botão
btnBuscar.addEventListener("click", () => {
  buscar();
});

// Busca ao pressionar Enter
input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") buscar();
});

/* 
 Função auxiliar: buscar dados da OpenFarm API (usando proxy allOrigins para evitar CORS)
*/
async function buscarOpenFarm(nome) {
  try {
    const url = `https://www.openfarm.cc/api/v1/crops/?filter=${encodeURIComponent(
      nome
    )}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      url
    )}`;
    const res = await fetch(proxyUrl);
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

  const filtradas = plantas.filter(
    (p) =>
      p.nomePopular?.toLowerCase().includes(termo) ||
      p.nomeCientifico?.toLowerCase().includes(termo) ||
      p.localColeta?.toLowerCase().includes(termo)
  );

  // Esconde o container inicial e limpa resultados
  headerContainer.style.display = "none";
  headerContent.innerHTML = "";

  // Cabeçalho resultados (fora do grid)
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

  // Criar container para os cards (esse sim terá grid)
  const cardsContainer = document.createElement("div");
  cardsContainer.classList.add("cards-container");
  headerContent.appendChild(cardsContainer);

  // Gerar os cards dentro do cardsContainer (JSON local)
  for (const planta of filtradas) {
    await criarCardComAPI(planta, cardsContainer);
  }

  // Se não encontrou nada no JSON, buscar diretamente na API
  if (filtradas.length === 0) {
    const resultadosAPI = await buscarOpenFarm(termo);
    for (const plantaAPI of resultadosAPI) {
      criarCardDiretoAPI(plantaAPI, cardsContainer);
    }
  }
}

/* Cria o card usando dados locais + API (enriquecimento) */
async function criarCardComAPI(planta, container) {
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
  img.src = planta.imagem;
  img.alt = planta.nomePopular;

  linha.appendChild(cientifico);
  linha.appendChild(img);
  card.appendChild(linha);

  // Busca extra na OpenFarm
  const dadosAPI = await buscarOpenFarm(
    planta.nomeCientifico || planta.nomePopular
  );
  if (dadosAPI.length > 0) {
    const api = dadosAPI[0];
    if (api.main_image_path) img.src = api.main_image_path;
    if (api.description && (!planta.descricao || planta.descricao === ""))
      planta.descricao = api.description;
  }

  const desc = document.createElement("p");
  desc.classList.add("card__description");
  desc.textContent = planta.descricao || "Sem descrição disponível.";
  card.appendChild(desc);

  // Linha final com SVGs
  const bottom = document.createElement("div");
  bottom.classList.add("card__info");

  const origemWrapper = document.createElement("div");
  origemWrapper.classList.add("card__info-item");
  origemWrapper.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-4 w-4 text-primary"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
    <span class="card__origin">Origem: ${planta.localColeta}</span>
  `;

  const familiaWrapper = document.createElement("div");
  familiaWrapper.classList.add("card__info-item");
  familiaWrapper.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card__icon">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 16v-4"></path>
      <path d="M12 8h.01"></path>
    </svg>
    <span class="card__family">Família: ${
      planta.familia ? planta.familia : "Não informado"
    }</span>
  `;

  bottom.appendChild(origemWrapper);
  bottom.appendChild(familiaWrapper);
  card.appendChild(bottom);

  container.appendChild(card);
}

/* Cria card direto com dados só da API (quando não tem no JSON) */
function criarCardDiretoAPI(plantaAPI, container) {
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

  // Linha final vazia (origem/família)
  const bottom = document.createElement("div");
  bottom.classList.add("card__info");

  bottom.innerHTML = `
    <div class="card__info-item">
      <span class="card__origin">Origem: Não disponível</span>
    </div>
    <div class="card__info-item">
      <span class="card__family">Família: Não informado</span>
    </div>
  `;

  card.appendChild(bottom);

  container.appendChild(card);
}
