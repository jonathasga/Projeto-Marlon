const listas = ["Playlist", "Rock", "Pop", "Jazz", "Disco"];

let playlistToDelete = null;

document.addEventListener("DOMContentLoaded", () => {
  atualizarListas();

  const toggleBtn = document.querySelector(".sidebar-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleSidebar);
  }

  const confirmBtn = document.getElementById('confirmDeleteBtn');
  const cancelBtn = document.getElementById('cancelDeleteBtn');

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (playlistToDelete && typeof playlistToDelete.callback === 'function') {
        playlistToDelete.callback();
      }
      closeDeleteModal();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeDeleteModal);
  }
});

function atualizarListas() {
  const lateral = document.getElementById("listas-lateral");
  const central = document.getElementById("listas-centrais");
  const principal = document.getElementById("listasContainer");

  if (lateral) lateral.innerHTML = "";
  if (central) central.innerHTML = "";
  if (principal) principal.innerHTML = "";

  listas.forEach((nome, index) => {
    const itemLateral = criarElementoLista(nome, index);
    const cardCentral = criarElementoCard(nome, index);
    const itemPrincipal = criarElementoPrincipal(nome, index);

    if (lateral) lateral.appendChild(itemLateral);
    if (central) central.appendChild(cardCentral);
    if (principal) principal.appendChild(itemPrincipal);
  });
}

function criarElementoLista(nome, index) {
  const div = document.createElement("div");
  div.className = "lista";
  div.innerHTML = `<span>${nome}</span>`;
  div.onclick = () => abrirModalPorNome(nome);
  return div;
}

function criarElementoCard(nome, index) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<span>${nome}</span>`;
  card.onclick = () => abrirModalPorNome(nome);
  return card;
}

function criarElementoPrincipal(nome, index) {
  const div = document.createElement("div");
  div.className = "lista";
  div.textContent = nome;
  div.onclick = () => abrirModalPorNome(nome);
  return div;
}

function abrirModalPorNome(nomeLista) {
  const index = listas.findIndex(nome => nome === nomeLista);
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <span class="close-btn" role="button" tabindex="0" aria-label="Fechar modal">&times;</span>
      <h2 contenteditable="true" id="modal-nome" tabindex="0">${nomeLista} ✏️</h2>
      <ul>
        <li>🎵 Música 1</li>
        <li>🎵 Música 2</li>
        <li>🎵 Música 3</li>
      </ul>
      <button class="save-btn">Salvar Nome</button>
      <button class="delete-btn" style="margin-top: 15px;">Excluir Lista</button>
    </div>
  `;
  document.body.appendChild(modal);

  // Fechar modal
  modal.querySelector(".close-btn").onclick = () => modal.remove();

  // Salvar nome da lista
  modal.querySelector(".save-btn").onclick = () => {
    const novoNome = modal.querySelector("#modal-nome").innerText.replace("✏️", "").trim();
    if (novoNome && index !== -1 && novoNome !== listas[index]) {
      listas[index] = novoNome;
      atualizarListas();
    }
    modal.remove();
  };

  // Excluir com confirmação
  modal.querySelector(".delete-btn").onclick = () => {
    openDeleteModal(nomeLista, () => {
      if (index !== -1) {
        listas.splice(index, 1);
        atualizarListas();
      }
    });
    modal.remove();
  };
}

function criarLista() {
  const nomeNova = prompt("Nome da nova lista:");
  if (nomeNova) {
    listas.push(nomeNova);
    atualizarListas();
  }
}

function toggleSidebar() {
  const body = document.body;
  const toggleBtn = document.querySelector(".sidebar-toggle");
  body.classList.toggle("sidebar-hidden");

  if (toggleBtn) {
    toggleBtn.innerHTML = body.classList.contains("sidebar-hidden") ? "❯" : "❮";
  }
}

function openDeleteModal(playlistName, callback) {
  const confirmModal = document.getElementById('confirmDeleteModal');
  const deleteMsg = document.getElementById('deleteMessage');
  if (!confirmModal || !deleteMsg) return;

};
{
  
}


function closeDeleteModal() {
  const confirmModal = document.getElementById('confirmDeleteModal');
  if (confirmModal) confirmModal.classList.add('hidden');
  playlistToDelete = null;
}
