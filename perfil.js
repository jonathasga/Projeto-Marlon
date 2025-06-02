const btnEditar = document.querySelector('#btnEditar');
const btnSalvar = document.querySelector('#btnSalvar');
const btnVoltar = document.querySelector('#btnVoltar');
const msgsuceso = document.querySelector('#msgsuceso');

const inputs = [
    document.querySelector('#nome'),
    document.querySelector('#email'),
    document.querySelector('#senha')
];


function carregarDados() {
    const userLogado = JSON.parse(localStorage.getItem('userlogado'));

    if (userLogado) {
        inputs[0].value = userLogado.nomecad || '';
        inputs[1].value = userLogado.email || userLogado.emailcad || '';
        inputs[2].value = userLogado.senha || userLogado.senhacad || '';
    }
}


function inicializar() {
    inputs.forEach(input => input.setAttribute('readonly', true));
    inputs[2].type = 'password'; 
    btnSalvar.style.display = 'none';
    btnEditar.style.display = 'inline-block';
    btnVoltar.style.display = 'inline-block';
}

btnEditar.addEventListener('click', () => {
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.add('editavel'); 
    });
    inputs[0].focus()
    inputs[2].type = 'text'; 
    btnSalvar.style.display = 'inline-block';
    btnEditar.style.display = 'none';
    btnVoltar.style.display = 'none';
});

btnSalvar.addEventListener('click', () => {
    const nome = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const senha = inputs[2].value.trim();

    let listauser = JSON.parse(localStorage.getItem('listauser')) || [];
    let userLogado = JSON.parse(localStorage.getItem('userlogado'));

    if (!userLogado) {
        alert('Erro: Nenhum usuário logado encontrado.');
        return;
    }

    const index = listauser.findIndex(u => u.emailcad === (userLogado.email || userLogado.emailcad));

    if (index !== -1) {
        listauser[index].nomecad = nome;
        listauser[index].emailcad = email;
        listauser[index].senhacad = senha;

        localStorage.setItem('listauser', JSON.stringify(listauser));
        localStorage.setItem('userlogado', JSON.stringify({
            nomecad: nome,
            email: email,
            senha: senha
        }));

        inputs.forEach(input => input.setAttribute('readonly', true));
        inputs.forEach(input => input.classList.remove('editavel'));
        inputs[2].type = 'password';
        btnSalvar.style.display = 'none';
        btnEditar.style.display = 'inline-block';
        btnVoltar.style.display = 'inline-block';

        msgsuceso.innerHTML = 'Dados atualizados com sucesso!' 
        msgsuceso.style.display = 'block';
        setTimeout(() => {
    msgsuceso.style.display = 'none';
}, 5000); 
    } else {
        alert('Erro: Usuário não encontrado na lista.');
    }
});

btnVoltar.addEventListener('click', () => {
    window.location.href = 'index.html'
});



carregarDados();
inicializar();
