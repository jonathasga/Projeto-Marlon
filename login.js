let btn = document.querySelector('.fa-eye')
btn.addEventListener('click', ()=>{
    let inputsenha = document.querySelector('#senha')

    if(inputsenha.getAttribute('type') == 'password'){
        inputsenha.setAttribute('type', 'text')
    } else {
        inputsenha.setAttribute('type', 'password')
    }
})

function entrar(){
    let email = document.querySelector('#email')
    let emaillabel = document.querySelector('#labelemail')

    let senha = document.querySelector('#senha')
    let senhalabel = document.querySelector('#labelsenha')

    let msgerro = document.querySelector('#msgerro')

    let listauser = []

    let uservalid = {
        email: ' ',
        senha: ' ',
    }
    listauser = JSON.parse(localStorage.getItem('listauser'))
    
    listauser.foreach((item) => {
        if(email.value == item.emailcad && senha.value == item.senhacad){
            uservalid
        }
    })
}