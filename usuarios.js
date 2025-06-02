const btnVoltar = document.querySelector('#btnVoltar');
const btnEditarUsuarios = document.querySelector('#btnEditarUsuarios');
const btnSalvarUsuarios = document.querySelector('#btnSalvarUsuarios');
const tabelaUsuarios = document.querySelector('#tabelaUsuarios');

let listauser = [];

btnVoltar.addEventListener('click', () => {
    window.history.back();
});

function carregarUsuarios(modoEdicao = false) {
    listauser = JSON.parse(localStorage.getItem('listauser')) || [];

    tabelaUsuarios.innerHTML = '';

    if (listauser.length === 0) {
        tabelaUsuarios.innerHTML = '<tr><td colspan="3">Nenhum usuário cadastrado.</td></tr>';
        return;
    }

    listauser.forEach((user, index) => {
        const tr = document.createElement('tr');

        const tdNome = document.createElement('td');
        tdNome.textContent = user.nomecad || 'Sem nome';
        tdNome.dataset.index = index;
        tdNome.dataset.tipo = 'nome';
        if (modoEdicao) tdNome.setAttribute('contenteditable', 'true');

        const tdEmail = document.createElement('td');
        tdEmail.textContent = user.emailcad || 'Sem email';
        tdEmail.dataset.index = index;
        tdEmail.dataset.tipo = 'email';
        if (modoEdicao) tdEmail.setAttribute('contenteditable', 'true');

        tr.appendChild(tdNome);
        tr.appendChild(tdEmail);

        const tdAcoes = document.createElement('td');
        if (modoEdicao) {
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = '✖';
            btnExcluir.classList.add('btnExcluir');
            btnExcluir.title = 'Excluir usuário';

           btnExcluir.addEventListener('click', () => {
    listauser.splice(index, 1);
    localStorage.setItem('listauser', JSON.stringify(listauser));
    carregarUsuarios(true); // recarrega mantendo modo edição
});

            tdAcoes.appendChild(btnExcluir);
        }

        tr.appendChild(tdAcoes);
        tabelaUsuarios.appendChild(tr);
    });
}

btnEditarUsuarios.addEventListener('click', () => {
    btnSalvarUsuarios.style.display = 'inline-block';
    btnEditarUsuarios.style.display = 'none';
    carregarUsuarios(true); // ativa modo edição
});

btnSalvarUsuarios.addEventListener('click', () => {
    const tds = tabelaUsuarios.querySelectorAll('td');

    tds.forEach(td => {
        const index = td.dataset.index;
        const tipo = td.dataset.tipo;

        if (tipo === 'nome') {
            listauser[index].nomecad = td.textContent.trim();
        } else if (tipo === 'email') {
            const email = td.textContent.trim();
            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!emailValido) {
                alert(`Email inválido no usuário ${listauser[index].nomecad}`);
                return;
            }
            listauser[index].emailcad = email;
        }
    });

    localStorage.setItem('listauser', JSON.stringify(listauser));

    btnSalvarUsuarios.style.display = 'none';
    btnEditarUsuarios.style.display = 'inline-block';

    carregarUsuarios(false); // volta ao modo visualização

    alert('Alterações salvas com sucesso!');
});

carregarUsuarios();
