let btn = document.querySelector('.fa-eye')
btn.addEventListener('click', () => {
    let inputsenha = document.querySelector('#senha')

    if (inputsenha.getAttribute('type') == 'password') {
        inputsenha.setAttribute('type', 'text')
    } else {
        inputsenha.setAttribute('type', 'password')
    }
})

function entrar() {
    let email = document.querySelector('#email')
    let emaillabel = document.querySelector('#emaillabel')

    let senha = document.querySelector('#senha')
    let senhalabel = document.querySelector('#senhalabel')

    let msgerro = document.querySelector('#msgerro')

    let listauser = JSON.parse(localStorage.getItem('listauser')) || []

     let uservalid = {
        nomecad: '',
        email: '',
        senha: ''
    }

    listauser.forEach((item) => {
        if (email.value == item.emailcad && senha.value == item.senhacad) {
            uservalid = {
                nomecad: item.nomecad,  // pega o nome do cadastro
                email: item.emailcad,
                senha: item.senhacad
            }
        }
    })

    if (email.value == uservalid.email && senha.value == uservalid.senha) {
        window.location.href = 'usuarios.html' //colocar aqui a pagina home

        let token = Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2)
        localStorage.setItem('token', token)
        localStorage.setItem('userlogado', JSON.stringify(uservalid)) //é o que vai fazer aparecer o nome na proxima pagina
    } else {
        emaillabel.setAttribute('style', 'color: red')
        email.setAttribute('style', 'border-color: red')
        senhalabel.setAttribute('style', 'color: red')
        senha.setAttribute('style', 'border-color: red')
        msgerro.setAttribute('style', 'display: block')
        msgerro.innerHTML = 'Usuário ou senha incorretos'
        btn.setAttribute('style', 'color: red')
        email.focus()
    }
}