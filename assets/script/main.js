// Carregar plantas do localStorage ou usar as padrão
let plantas = JSON.parse(localStorage.getItem("plantas")) || [
  {
    nomePopular: "Espada-de-São-Jorge",
    nomeCientifico: "Sansevieria trifasciata",
    localColeta: "Região Sudeste",
    imagem: "./assets/image/espada-são-jorge.webp",
  },
  {
    nomePopular: "Jasmim",
    nomeCientifico: "Jasminum sambac",
    localColeta: "Região Nordeste",
    imagem:
      "https://upload.wikimedia.org/wikipedia/commons/4/49/Jasminum_sambac_01.JPG",
  },
  {
    nomePopular: "Samambaia",
    nomeCientifico: "Nephrolepis exaltata",
    localColeta: "Região Sul",
    imagem:
      "https://upload.wikimedia.org/wikipedia/commons/0/0b/Nephrolepis_exaltata1.jpg",
  },
  {
    nomePopular: "Alecrim",
    nomeCientifico: "Rosmarinus officinalis",
    localColeta: "Região Centro-Oeste",
    imagem:
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Rosmarinus_officinalis_-_Herb.jpg",
  },
  {
    nomePopular: "Manjericão",
    nomeCientifico: "Ocimum basilicum",
    localColeta: "Região Norte",
    imagem: "./assets/image/manjericão-santo.webp",
  },
];

// Elementos da página
const listaEl = document.getElementById("lista");
const searchEl = document.getElementById("search");
const infoEl = document.getElementById("info");

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");
const modalNomePopular = document.getElementById("modalNomePopular");
const modalNomeCientifico = document.getElementById("modalNomeCientifico");
const modalLocal = document.getElementById("modalLocal");

const btnAdicionar = document.getElementById("btnAdicionar");
const btnRemover = document.getElementById("btnRemover");

// Modais dos formulários
const modalAdd = document.getElementById("modalAdd");
const modalAddClose = document.getElementById("modalAddClose");
const formAdd = document.getElementById("formAdd");

const modalRemove = document.getElementById("modalRemove");
const modalRemoveClose = document.getElementById("modalRemoveClose");
const formRemove = document.getElementById("formRemove");

// Função para salvar no localStorage
function salvarPlantas() {
  localStorage.setItem("plantas", JSON.stringify(plantas));
}

// Mostrar planta encontrada com animação
function mostrarPlanta(planta) {
  listaEl.innerHTML = "";

  if (!planta) {
    listaEl.style.display = "none";
    infoEl.textContent = "";
    return;
  }

  const li = document.createElement("li");
  li.setAttribute("data-aos", "fade-up");
  li.setAttribute("data-aos-delay", "100");

  li.innerHTML = `
    <div class="nome-popular">${planta.nomePopular}</div>
    <div class="nome-cientifico">${planta.nomeCientifico}</div>
    <div class="local">Local de coleta: ${planta.localColeta}</div>
  `;

  li.addEventListener("click", () => abrirModal(planta));
  listaEl.appendChild(li);

  listaEl.style.display = "block";
  infoEl.textContent = `1 planta encontrada.`;

  AOS.refresh();
}

// Filtra planta pelo texto no input
function filtrarPlanta(texto) {
  texto = texto.toLowerCase();
  return plantas.find(
    (p) =>
      p.nomePopular.toLowerCase().includes(texto) ||
      p.nomeCientifico.toLowerCase().includes(texto) ||
      p.localColeta.toLowerCase().includes(texto)
  );
}

// Evento input busca
searchEl.addEventListener("input", () => {
  const texto = searchEl.value.trim();

  if (texto === "") {
    listaEl.style.display = "none";
    infoEl.textContent = "";
    return;
  }

  const planta = filtrarPlanta(texto);
  mostrarPlanta(planta);
});

// Abrir modal com detalhes da planta
function abrirModal(planta) {
  modalImg.src = planta.imagem || "./assets/image/placeholder.jpg";
  modalImg.alt = `Imagem da planta ${planta.nomePopular}`;
  modalNomePopular.textContent = planta.nomePopular;
  modalNomeCientifico.textContent = planta.nomeCientifico;
  modalLocal.textContent = "Local de coleta: " + planta.localColeta;
  modal.style.display = "flex";
}

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// --- MODAL ADICIONAR ---

btnAdicionar.addEventListener("click", () => {
  modalAdd.style.display = "flex";
});

modalAddClose.addEventListener("click", () => {
  modalAdd.style.display = "none";
});

modalAdd.addEventListener("click", (e) => {
  if (e.target === modalAdd) {
    modalAdd.style.display = "none";
  }
});

formAdd.addEventListener("submit", (e) => {
  e.preventDefault();

  const nomePopular = formAdd.nomePopular.value.trim();
  const nomeCientifico = formAdd.nomeCientifico.value.trim();
  const localColeta = formAdd.localColeta.value.trim();
  const imagem = formAdd.imagem.value.trim() || "./assets/image/placeholder.jpg";

  if (!nomePopular || !nomeCientifico || !localColeta) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  plantas.push({ nomePopular, nomeCientifico, localColeta, imagem });
  salvarPlantas();

  alert(`Planta "${nomePopular}" adicionada com sucesso!`);

  formAdd.reset();
  modalAdd.style.display = "none";

  searchEl.value = "";
  listaEl.style.display = "none";
  infoEl.textContent = "";
});

// --- MODAL REMOVER ---

btnRemover.addEventListener("click", () => {
  modalRemove.style.display = "flex";
});

modalRemoveClose.addEventListener("click", () => {
  modalRemove.style.display = "none";
});

modalRemove.addEventListener("click", (e) => {
  if (e.target === modalRemove) {
    modalRemove.style.display = "none";
  }
});

formRemove.addEventListener("submit", (e) => {
  e.preventDefault();

  const nomeRemover = formRemove.nomeRemover.value.trim();
  if (!nomeRemover) {
    alert("Por favor, digite o nome da planta que deseja remover.");
    return;
  }

  const index = plantas.findIndex(
    (p) => p.nomePopular.toLowerCase() === nomeRemover.toLowerCase()
  );

  if (index === -1) {
    alert(`Planta "${nomeRemover}" não encontrada.`);
    return;
  }

  if (!confirm(`Confirma remover "${plantas[index].nomePopular}"?`)) return;

  plantas.splice(index, 1);
  salvarPlantas();

  alert(`Planta "${nomeRemover}" removida com sucesso!`);

  formRemove.reset();
  modalRemove.style.display = "none";

  searchEl.value = "";
  listaEl.style.display = "none";
  infoEl.textContent = "";
});
