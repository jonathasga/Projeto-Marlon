let listas = JSON.parse(localStorage.getItem("listas")) || ["Minhas Músicas", "Rock Clássico", "Pop Hits", "Relaxante", "Academia"];
let playlistMusicas = JSON.parse(localStorage.getItem("playlistMusicas")) || {};

document.addEventListener("DOMContentLoaded", () => {
  atualizarListas();

  const toggleBtn = document.querySelector(".sidebar-toggle");
  if (toggleBtn) toggleBtn.addEventListener("click", toggleSidebar);

  // Modal de criação de playlist
  const abrirModalCriarEl = document.getElementById("abrir-modal-criar");
  const fecharModalCriarEl = document.getElementById("fechar-modal-criar");
  const modalCriarEl = document.getElementById("modal-criar");
  const inputNomePlaylistEl = document.getElementById("input-nome-playlist");
  const criarPlaylistBtnEl = document.getElementById("criar-playlist");

  if (abrirModalCriarEl) {
    abrirModalCriarEl.addEventListener("click", () => {
      if (modalCriarEl) modalCriarEl.classList.remove("hidden");
      if (inputNomePlaylistEl) {
        inputNomePlaylistEl.value = "";
        inputNomePlaylistEl.focus();
      }
    });
  }

  if (fecharModalCriarEl) {
    fecharModalCriarEl.addEventListener("click", () => {
      if (modalCriarEl) modalCriarEl.classList.add("hidden");
    });
  }

  if (criarPlaylistBtnEl) {
    criarPlaylistBtnEl.addEventListener("click", () => {
      if (inputNomePlaylistEl) {
        const nome = inputNomePlaylistEl.value.trim();
        if (nome && !listas.includes(nome)) {
          listas.push(nome);
          // Inicializa a lista de músicas para a nova playlist
          playlistMusicas[nome] = []; 
          localStorage.setItem("playlistMusicas", JSON.stringify(playlistMusicas));
          atualizarListas();
          if (modalCriarEl) modalCriarEl.classList.add("hidden");
        } else if (listas.includes(nome)) {
          alert("Uma playlist com este nome já existe.");
        } else if (!nome) {
          alert("Por favor, insira um nome para a playlist.");
        }
      }
    });
  }
});

function atualizarListas() {
  localStorage.setItem("listas", JSON.stringify(listas));
  // playlistMusicas é salvo quando modificado (criação, adição/remoção de músicas, renomeação)

  const lateral = document.getElementById("listas-lateral");
  const central = document.getElementById("listas-centrais");

  if (lateral) lateral.innerHTML = "";
  if (central) central.innerHTML = "";

  listas.forEach((nome, index) => {
    // Item da Sidebar
    if (lateral) {
      const itemLateral = document.createElement("div");
      itemLateral.className = "lista"; // Classe para estilo do card na sidebar
      itemLateral.innerHTML = `<span>${nome}</span>`;
      itemLateral.addEventListener("click", () => abrirModalDetalhesPlaylist(nome, index));
      lateral.appendChild(itemLateral);
    }

    // Card Central
    if (central) {
      const card = document.createElement("div");
      card.className = "card"; // Classe para estilo do card no conteúdo principal
      card.innerHTML = `<span>${nome}</span>`;
      card.addEventListener("click", () => abrirModalDetalhesPlaylist(nome, index));
      central.appendChild(card);
    }
  });
}

function abrirModalDetalhesPlaylist(nomeLista, index) {
  // Remover modal existente, se houver, para evitar duplicatas
  const modalExistente = document.querySelector(".modal-detalhes-playlist");
  if (modalExistente) modalExistente.remove();

  const modal = document.createElement("div");
  modal.className = "modal modal-detalhes-playlist"; // Adicionada classe específica

  const conteudo = document.createElement("div");
  conteudo.className = "modal-content";

  const fechar = document.createElement("span");
  fechar.className = "close-btn";
  fechar.textContent = "×";
  fechar.addEventListener("click", () => modal.remove());

  const titulo = document.createElement("h2");
  titulo.id = "modal-nome"; // Usado no seu CSS
  titulo.contentEditable = "true";
  titulo.textContent = nomeLista; // Emoji será adicionado após para não interferir na edição

  const listaUl = document.createElement("ul");

  const musicasDaPlaylistAtual = playlistMusicas[nomeLista] || [];

  if (musicasDaPlaylistAtual.length === 0) {
    const li = document.createElement("li");
    li.textContent = "nenhuma musica na playlist";
    li.style.textAlign = "center";
    li.style.fontStyle = "italic";
    li.style.color = "#a0aec0";
    listaUl.appendChild(li);
  } else {
    musicasDaPlaylistAtual.forEach(musica => {
      const li = document.createElement("li");
      li.textContent = `🎵 ${musica.title} - ${musica.artist.name}`;
      // Poderia adicionar um botão de remover música da playlist aqui também
      listaUl.appendChild(li);
    });
  }

  const salvarNomeBtn = document.createElement("button");
  salvarNomeBtn.className = "save-btn";
  salvarNomeBtn.textContent = "Salvar Nome";
  salvarNomeBtn.addEventListener("click", () => {
    const novoNome = titulo.textContent.replace("✏️", "").trim();
    if (novoNome && novoNome !== listas[index]) {
      if (listas.includes(novoNome)) {
        alert("Uma playlist com este novo nome já existe!");
        titulo.textContent = listas[index]; // Reverte para o nome original
        titulo.innerHTML += " <span style='font-size: 0.8em; cursor: default;'>✏️</span>";
        return;
      }
      // Renomear em playlistMusicas
      if (playlistMusicas.hasOwnProperty(listas[index])) {
        playlistMusicas[novoNome] = playlistMusicas[listas[index]];
        delete playlistMusicas[listas[index]];
        localStorage.setItem("playlistMusicas", JSON.stringify(playlistMusicas));
      }
      listas[index] = novoNome;
      atualizarListas(); // Re-renderiza as listas com o novo nome
      modal.remove(); // Fecha o modal após salvar
    } else if (novoNome === listas[index]) {
      modal.remove(); // Se o nome não mudou, apenas fecha
    } else if (!novoNome) {
        alert("O nome da playlist não pode ser vazio.");
        titulo.textContent = listas[index]; // Reverte
        titulo.innerHTML += " <span style='font-size: 0.8em; cursor: default;'>✏️</span>";
    }
  });

  const adicionarMusicasBtn = document.createElement("button");
  adicionarMusicasBtn.className = "adicionar-btn";
  adicionarMusicasBtn.textContent = "Adicionar Músicas";
  adicionarMusicasBtn.style.marginTop = "15px";
  adicionarMusicasBtn.addEventListener("click", () => {
    window.location.href = `pesquisa.html?playlist=${encodeURIComponent(listas[index])}`; // Usa o nome atual da lista
    modal.remove();
  });

  const excluirListaBtn = document.createElement("button");
  excluirListaBtn.className = "delete-btn"; // Use uma classe genérica ou crie .delete-btn no CSS
  excluirListaBtn.textContent = "Excluir Lista";
  excluirListaBtn.style.backgroundColor = "#ef4444";
  excluirListaBtn.style.color = "white";
  excluirListaBtn.style.marginTop = "15px"; // Ou adicione ao CSS
  excluirListaBtn.addEventListener("click", () => {
    if (confirm(`Tem certeza que deseja excluir a playlist "${listas[index]}"? Esta ação não pode ser desfeita.`)) {
      if (playlistMusicas.hasOwnProperty(listas[index])) {
        delete playlistMusicas[listas[index]];
        localStorage.setItem("playlistMusicas", JSON.stringify(playlistMusicas));
      }
      listas.splice(index, 1);
      atualizarListas();
      modal.remove();
    }
  });

  conteudo.append(fechar, titulo, listaUl, salvarNomeBtn, adicionarMusicasBtn, excluirListaBtn);
  modal.appendChild(conteudo);
  document.body.appendChild(modal);
  
  // Adicionar emoji de edição após definir o texto e os event listeners
  titulo.innerHTML += " <span style='font-size: 0.8em; cursor: default;'>✏️</span>";
  titulo.focus(); // Foca no título para edição
}

function toggleSidebar() {
  const body = document.body;
  const toggleBtn = document.querySelector(".sidebar-toggle");
  body.classList.toggle("sidebar-hidden");

  if (toggleBtn) {
    toggleBtn.innerHTML = body.classList.contains("sidebar-hidden") ? "❯" : "❮";
  }
}