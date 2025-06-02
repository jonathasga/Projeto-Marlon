let listas = JSON.parse(localStorage.getItem("listas")) 
let playlistToDelete = null;

document.addEventListener("DOMContentLoaded", () => {
  atualizarListas();

  const toggleBtn = document.querySelector(".sidebar-toggle");
  if (toggleBtn) toggleBtn.addEventListener("click", toggleSidebar);

  // Modal criação de playlist
  const abrirModal = document.getElementById("abrir-modal-criar");
  const fecharModal = document.getElementById("fechar-modal-criar");
  const modal = document.getElementById("modal-criar");
  const input = document.getElementById("input-nome-playlist");
  const criarBtn = document.getElementById("criar-playlist");

  abrirModal.addEventListener("click", () => {
    modal.classList.remove("hidden");
    input.value = "";
    input.focus();
  });

  fecharModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  criarBtn.addEventListener("click", () => {
    const nome = input.value.trim();
    if (nome && !listas.includes(nome)) {
      listas.push(nome);
      atualizarListas();
      modal.classList.add("hidden");
    }
  });
});

function atualizarListas() {
  localStorage.setItem("listas", JSON.stringify(listas));

  const lateral = document.getElementById("listas-lateral");
  const central = document.getElementById("listas-centrais");

  if (lateral) lateral.innerHTML = "";
  if (central) central.innerHTML = "";

  listas.forEach((nome, index) => {
    const itemLateral = document.createElement("div");
    itemLateral.className = "lista";
    itemLateral.innerHTML = `<span>${nome}</span>`;
    itemLateral.addEventListener("click", () => abrirModal(nome, index));
    lateral.appendChild(itemLateral);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<span>${nome}</span>`;
    card.addEventListener("click", () => abrirModal(nome, index));
    central.appendChild(card);
  });
}

function abrirModal(nomeLista, index) {
  const modal = document.createElement("div");
  modal.className = "modal";

  const conteudo = document.createElement("div");
  conteudo.className = "modal-content";

  const fechar = document.createElement("span");
  fechar.className = "close-btn";
  fechar.textContent = "×";
  fechar.addEventListener("click", () => modal.remove());

  const titulo = document.createElement("h2");
  titulo.id = "modal-nome";
  titulo.contentEditable = "true";
  titulo.textContent = `${nomeLista} ✏️`;

  const lista = document.createElement("ul");
  ["Música 1", "Música 2", "Música 3"].forEach(musica => {
    const li = document.createElement("li");
    li.textContent = `🎵 ${musica}`;
    lista.appendChild(li);
  });

  const salvar = document.createElement("button");
  salvar.className = "save-btn";
  salvar.textContent = "Salvar Nome";
  salvar.addEventListener("click", () => {
    const novoNome = titulo.textContent.replace("✏️", "").trim();
    if (novoNome && novoNome !== listas[index]) {
      listas[index] = novoNome;
      atualizarListas();
    }
    modal.remove();
  });

  const excluir = document.createElement("button");
  excluir.className = "delete-btn";
  excluir.style.marginTop = "15px";
  excluir.textContent = "Excluir Lista";
  excluir.addEventListener("click", () => {
    listas.splice(index, 1);
    atualizarListas();
    modal.remove();
  });

  conteudo.append(fechar, titulo, lista, salvar, excluir);
  modal.appendChild(conteudo);
  document.body.appendChild(modal);
}

function toggleSidebar() {
  const body = document.body;
  const toggleBtn = document.querySelector(".sidebar-toggle");
  body.classList.toggle("sidebar-hidden");

  if (toggleBtn) {
    toggleBtn.innerHTML = body.classList.contains("sidebar-hidden") ? "❯" : "❮";
  }
}
