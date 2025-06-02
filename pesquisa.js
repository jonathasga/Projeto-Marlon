let playlist = []; // Músicas da playlist ATUALMENTE SENDO EDITADA
let nomePlaylistAtual = ''; // Nome da playlist atualmente sendo editada
let todasAsMusicasDasPlaylists = {}; // Objeto com todas as playlists e suas músicas
let debounceTimer;

document.addEventListener("DOMContentLoaded", () => {
  const todasSalvas = localStorage.getItem("playlistMusicas");
  if (todasSalvas) {
    try {
      todasAsMusicasDasPlaylists = JSON.parse(todasSalvas);
    } catch (e) {
      console.error("Erro ao carregar todasAsMusicasDasPlaylists do localStorage:", e);
      todasAsMusicasDasPlaylists = {};
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  nomePlaylistAtual = urlParams.get('playlist');

  const playlistTitleElement = document.querySelector(".playlist h2"); // O h2 dentro da div.playlist
  const playlistDivElement = document.querySelector(".playlist"); // A div.playlist inteira
  const playlistContentElement = document.getElementById("playlist"); // Onde as músicas são listadas
  const buscaInputElement = document.getElementById("busca");
  const resultadosContainer = document.querySelector(".contener"); // Onde os resultados da busca aparecem

  if (nomePlaylistAtual) {
    if (playlistTitleElement) {
      playlistTitleElement.textContent = `Playlist: ${decodeURIComponent(nomePlaylistAtual)}`;
    }
    playlist = todasAsMusicasDasPlaylists[nomePlaylistAtual] || [];
    atualizarExibicaoPlaylist();
    if (playlistDivElement) playlistDivElement.classList.remove("hidden");
    if (resultadosContainer) resultadosContainer.classList.remove("hidden");


  } else {
    if (playlistTitleElement) playlistTitleElement.textContent = "Nenhuma playlist selecionada";
    if (playlistContentElement) playlistContentElement.innerHTML = "<p style='text-align:center; color:#ccc; padding:20px;'>Para adicionar músicas, por favor, selecione ou crie uma playlist na página inicial e clique em 'Adicionar Músicas'.</p>";
    if (buscaInputElement) {
        buscaInputElement.placeholder = "Selecione uma playlist primeiro";
        buscaInputElement.disabled = true;
    }
    if (resultadosContainer) resultadosContainer.classList.add("hidden"); // Ocultar resultados da busca
  }

  const backButton = document.createElement('a'); // Usar 'a' para navegação padrão
  backButton.href = 'index.html';
  backButton.textContent = '❮ Voltar para Minhas Listas';
  backButton.style.position = 'fixed';
  backButton.style.top = '20px';
  backButton.style.left = '20px';
  backButton.style.zIndex = '1001';
  backButton.style.padding = '10px 15px';
  backButton.style.backgroundColor = '#60a5fa';
  backButton.style.color = '#121829';
  backButton.style.textDecoration = 'none';
  backButton.style.borderRadius = '8px';
  backButton.style.fontWeight = 'bold';
  backButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  document.body.insertBefore(backButton, document.body.firstChild);

  // Associar evento ao input de busca
  if (buscaInputElement && !buscaInputElement.disabled) {
    buscaInputElement.addEventListener('keyup', debouncedBuscarMusicas);
  }
});

function buscarMusicas() {
  const termo = document.getElementById("busca").value.trim();
  if (!termo) {
    document.getElementById("resultado").innerHTML = '';
    return;
  }
  // Usar HTTPS para a API
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(termo)}&limit=5&output=jsonp`;
  jsonp(url, 'mostrarResultados');
}

function debouncedBuscarMusicas() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(buscarMusicas, 400); // Reduzido para 400ms
}

function jsonp(url, callbackName) {
  const scriptId = 'deezer-jsonp';
  const existingScript = document.getElementById(scriptId);
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement("script");
  script.id = scriptId;
  script.src = `${url}&callback=${callbackName}`; // Deezer espera 'callback' como nome do parâmetro
  
  script.onerror = () => {
    console.error("Erro ao carregar script JSONP:", script.src);
    document.getElementById("resultado").innerHTML = '<p style="text-align:center; color:red;">Erro ao buscar músicas. Tente novamente.</p>';
    script.remove();
  };
  // A limpeza do script é feita no início da próxima chamada ou não é estritamente necessária se a API não criar globais problemáticos
  document.body.appendChild(script);
}

// Definir mostrarResultados no escopo global para o JSONP
window.mostrarResultados = function(data) {
  const container = document.getElementById("resultado");
  container.innerHTML = ''; // Limpa resultados anteriores

  if (!data || !data.data || data.data.length === 0) {
    container.innerHTML = '<p style="text-align:center; color: #ccc;">Nenhum resultado encontrado para sua busca.</p>';
    return;
  }

  data.data.forEach(musica => {
    const div = document.createElement("div");
    div.className = "track"; // Reutiliza a classe de estilo
    const capa = musica.album?.cover_medium || 'img/default_cover.png'; // Tenha uma imagem placeholder

    // Prepara o objeto musica para ser passado como string no atributo onclick
    // Escapa aspas simples e duplas para evitar quebrar o HTML/JS
    const musicaString = JSON.stringify(musica)
                           .replace(/'/g, "\\'")
                           .replace(/"/g, "&quot;");

    div.innerHTML = `
      <img src="${capa}" alt="Capa de ${musica.album?.title || 'álbum'}" class="album-cover">
      <div class="track-info">
        <strong>${musica.title_short || musica.title}</strong> - ${musica.artist.name}
        <div class="track-buttons">
          <button onclick='adicionarMusica(${musicaString})' class="bnt">Adicionar</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
};

// Definir adicionarMusica no escopo global ou garantir que seja acessível
window.adicionarMusica = function(musicaObj) {
  if (!nomePlaylistAtual) {
    alert("Erro: Nenhuma playlist está selecionada para adicionar a música.");
    return;
  }
  if (playlist.find(m => m.id === musicaObj.id)) {
    alert(`A música "${musicaObj.title_short || musicaObj.title}" já está na playlist "${decodeURIComponent(nomePlaylistAtual)}".`);
    return;
  }

  playlist.push(musicaObj);
  salvarMusicasDaPlaylistAtual();
  atualizarExibicaoPlaylist();
};

// Definir removerMusica no escopo global ou garantir que seja acessível
window.removerMusica = function(idMusica) {
  if (!nomePlaylistAtual) return;
  
  const musicaParaRemover = playlist.find(m => m.id === idMusica);
  if (musicaParaRemover && !confirm(`Tem certeza que deseja remover "${musicaParaRemover.title_short || musicaParaRemover.title}" da playlist?`)) {
      return;
  }

  playlist = playlist.filter(m => m.id !== idMusica);
  salvarMusicasDaPlaylistAtual();
  atualizarExibicaoPlaylist();
};

function salvarMusicasDaPlaylistAtual() {
  if (!nomePlaylistAtual) return;
  todasAsMusicasDasPlaylists[nomePlaylistAtual] = playlist;
  localStorage.setItem("playlistMusicas", JSON.stringify(todasAsMusicasDasPlaylists));
}

function atualizarExibicaoPlaylist() {
  const container = document.getElementById("playlist");
  container.innerHTML = '';

  if (!nomePlaylistAtual) {
    if (document.querySelector(".playlist")) document.querySelector(".playlist").classList.add("hidden");
    return;
  }
  if (document.querySelector(".playlist")) document.querySelector(".playlist").classList.remove("hidden");

  if (playlist.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: #ccc; padding: 20px 0;">Nenhuma música adicionada a esta playlist ainda. Busque acima e adicione suas favoritas!</p>`;
  } else {
    playlist.forEach(musica => {
      const capa = musica.album?.cover_medium || 'img/default_cover.png';
      const div = document.createElement("div");
      div.className = "track";

      // Para o onclick, o ID é suficiente se for numérico. Se for string, precisa de aspas.
      const musicaIdParam = typeof musica.id === 'string' ? `'${musica.id.replace("'", "\\'")}'` : musica.id;

      div.innerHTML = `
        <img src="${capa}" alt="Capa de ${musica.album?.title || 'álbum'}" class="album-cover">
        <div class="track-info">
          <strong>${musica.title_short || musica.title}</strong> - ${musica.artist.name}
          <div class="track-buttons">
            <button class="remove-btn" onclick="removerMusica(${musicaIdParam})">Remover</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  }
}