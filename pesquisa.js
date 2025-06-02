let playlist = [];
let nomePlaylistAtual = '';
let todasAsMusicasDasPlaylists = {};
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

  const playlistTitleElement = document.querySelector(".playlist h2");
  const playlistDivElement = document.querySelector(".playlist");
  const playlistContentElement = document.getElementById("playlist");
  const buscaInputElement = document.getElementById("busca");
  const resultadosContainer = document.querySelector(".contener");

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
    if (resultadosContainer) resultadosContainer.classList.add("hidden");
  }

  const backButton = document.createElement('a');
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
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(termo)}&limit=5&output=jsonp`;
  jsonp(url, 'mostrarResultados');
}

function debouncedBuscarMusicas() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(buscarMusicas, 400);
}

function jsonp(url, callbackName) {
  const scriptId = 'deezer-jsonp';
  const existingScript = document.getElementById(scriptId);
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement("script");
  script.id = scriptId;
  script.src = `${url}&callback=${callbackName}`;

  script.onerror = () => {
    console.error("Erro ao carregar script JSONP:", script.src);
    document.getElementById("resultado").innerHTML = '<p style="text-align:center; color:red;">Erro ao buscar músicas. Tente novamente.</p>';
    script.remove();
  };
  document.body.appendChild(script);
}

window.mostrarResultados = function(data) {
  const container = document.getElementById("resultado");
  container.innerHTML = '';

  if (!data || !data.data || data.data.length === 0) {
    container.innerHTML = '<p style="text-align:center; color: #ccc;">Nenhum resultado encontrado para sua busca.</p>';
    return;
  }

  data.data.forEach(musica => {
    const div = document.createElement("div");
    div.className = "track";
    const capa = musica.album?.cover_medium || 'img/default_cover.png';
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

window.adicionarMusica = function(musicaObj) {
  if (!nomePlaylistAtual) {
    return;
  }
  if (playlist.find(m => m.id === musicaObj.id)) {
    return;
  }

  playlist.push(musicaObj);
  salvarMusicasDaPlaylistAtual();
  atualizarExibicaoPlaylist();
};

window.removerMusica = function(idMusica) {
  if (!nomePlaylistAtual) return;

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