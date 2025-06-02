let playlist = [];
let debounceTimer;

function buscarMusicas() {
  const termo = document.getElementById("busca").value.trim();

  if (!termo) {
    document.getElementById("resultado").innerHTML = '';
    document.querySelector(".contener").style.backgroundColor = "none";
    return;
  }

  const url = `https://api.deezer.com/search?q=${encodeURIComponent(termo)}&limit=4&output=jsonp`;
  jsonp(url, 'mostrarResultados');
}

function debouncedBuscarMusicas() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(buscarMusicas, 500);
}

function jsonp(url, callback) {
  const script = document.createElement("script");
  script.src = `${url}&callback=${callback}`;
  document.body.appendChild(script);
}

function mostrarResultados(data) {
  const container = document.getElementById("resultado");
  container.innerHTML = '';

  data.data.forEach(musica => {
    const div = document.createElement("div");
    div.className = "track";

    const capa = musica.album?.cover_medium || '';

    div.innerHTML = `
      <img src="${capa}" alt="Capa do álbum" class="album-cover">
      <div class="track-info">
        <strong>${musica.title}</strong> - ${musica.artist.name}
        <div class="track-buttons">
          <button onclick='adicionarMusica(${JSON.stringify(musica).replace(/'/g, "\\'")})' class="bnt">Adicionar</button>
        </div>
      </div>
    `;

    container.appendChild(div);
  });
}

function adicionarMusica(musica) {
  if (playlist.find(m => m.id === musica.id)) return;

  playlist.push(musica);
  atualizarPlaylist();
}

function removerMusica(id) {
  playlist = playlist.filter(m => m.id !== id);
  atualizarPlaylist();
}

function atualizarPlaylist() {
  const container = document.getElementById("playlist");
  container.innerHTML = '';

  playlist.forEach(musica => {
    const capa = musica.album?.cover_medium || '';

    const div = document.createElement("div");
    div.className = "track";

    div.innerHTML = `
      <img src="${capa}" alt="Capa do álbum" class="album-cover">
      <div class="track-info">
        <strong>${musica.title}</strong> - ${musica.artist.name}
        <div class="track-buttons">
          <button class="remove-btn" onclick="removerMusica(${musica.id})">Remover</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}
