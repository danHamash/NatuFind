let plantas = [];

const carregarPlantas = async () => {
  const salvas = localStorage.getItem("plantas");
  if (salvas) {
    plantas = JSON.parse(salvas);
  } else {
    try {
      const response = await fetch("/plantas.json");
      const json = await response.json();
      plantas = json;
      salvarPlantas(); // salva no localStorage para uso posterior
    } catch (error) {
      console.error("Erro ao carregar plantas.json:", error);
    }
  }
};

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

// Iniciar carregamento
carregarPlantas();
