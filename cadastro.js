let btn = document.querySelector('#versenha')
let btnConfirm = document.querySelector('#verconfirmsenha')

let nome = document.querySelector('#nome')
let labelnome = document.querySelector('#labelnome')
let validnome = false

let email = document.querySelector('#email')
let labelemail = document.querySelector('#labelemail')
let validemail = false

let cpf = document.querySelector('#cpf')
let labelcpf = document.querySelector('#labelcpf')
let validcpf = false

let data = document.querySelector('#data')
let labeldata = document.querySelector('#labeldata')
let validdata = false

let senha = document.querySelector('#senha')
let labelsenha = document.querySelector('#labelsenha')
let validsenha = false

let confirmsenha = document.querySelector('#confirmsenha')
let labelconfirmsenha = document.querySelector('#labelconfirmsenha')
let validconfirmsenha = false

let msgerro = document.querySelector('#msgerro')
let msgok = document.querySelector('#msgok')

//validação de numero minimo de letras para o "nome completo", ent dps ver qual a melhor quantidade pra colocar, por enqt, 5
nome.addEventListener('keyup', ()=>{
    if(nome.value.length <=4){
labelnome.setAttribute('style', 'color: red')
labelnome.innerHTML = 'Nome Completo *insira no minimo 5 caracteres'
nome.setAttribute('style','border-color: red' )
validnome = false
    } else {
labelnome.setAttribute('style', 'color: green')
labelnome.innerHTML = 'Nome Completo'
nome.setAttribute('style','border-color: green' )
validnome = true
    }
})

// verificação do email, n ta aceitando qualquer coisa escrita no campo de email
email.addEventListener('keyup', () => {
    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email.value)) {
        labelemail.setAttribute('style', 'color: red')
        labelemail.innerHTML = '*Insira um e-mail válido'
        email.setAttribute('style', 'border-color: red')
        validemail = false
    } else {
        labelemail.setAttribute('style', 'color: green')
        labelemail.innerHTML = 'E-mail'
        email.setAttribute('style', 'border-color: green')
        validemail = true
    }
})

// verificação do cpf, ta funcional, ent so aceita cpf valido
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // remove tudo que não for número

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let dig1 = 11 - (soma % 11);
    if (dig1 >= 10) dig1 = 0;

    if (dig1 !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let dig2 = 11 - (soma % 11);
    if (dig2 >= 10) dig2 = 0;

    if (dig2 !== parseInt(cpf.charAt(10))) return false;

    return true;
}

cpf.addEventListener('keyup', () => {
    let cpfLimpo = cpf.value.replace(/[^\d]+/g, '');

    if (!validarCPF(cpfLimpo)) {
        labelcpf.setAttribute('style', 'color: red');
        labelcpf.innerHTML = '*Insira um CPF válido (apenas números)';
        cpf.setAttribute('style', 'border-color: red');
        validcpf = false
    } else {
        labelcpf.setAttribute('style', 'color: green');
        labelcpf.innerHTML = 'CPF';
        cpf.setAttribute('style', 'border-color: green');
        validcpf = true
    }
});

//coloquei a idade maxima de 125 anos pra ngm chegar colocando q tem 270 anos, mas posso mudar o maximo depois
data.addEventListener('change', () => {
    let valor = data.value;

    if (!valor) {
        labeldata.setAttribute('style', 'color: red');
        labeldata.innerHTML = '*Insira uma data válida';
        data.setAttribute('style', 'border-color: red');
        return;
    }

    let dataNascimento = new Date(valor);
    let hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    let m = hoje.getMonth() - dataNascimento.getMonth();

    // corrigir idade se o aniversário ainda não aconteceu este ano
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }

    if (idade < 0 || idade > 125) { //basta mudar aqui o maximo da idade
        labeldata.setAttribute('style', 'color: red');
        labeldata.innerHTML = '*Idade inválida.';
        data.setAttribute('style', 'border-color: red');
        validdata = false
    } else {
        labeldata.setAttribute('style', 'color: green');
        labeldata.innerHTML = 'Data de Nascimento';
        data.setAttribute('style', 'border-color: green');
        validdata = true
    }
});

//verificação da senha, minimo de 8 caracteres de senha
senha.addEventListener('keyup', ()=>{
    if(senha.value.length <=7){ //so mudar o minimo aqui
labelsenha.setAttribute('style', 'color: red')
labelsenha.innerHTML = '*insira no minimo 8 caracteres' //e lembrar de mudar o texto que aparece
senha.setAttribute('style','border-color: red' )
validsenha = false
    } else {
labelsenha.setAttribute('style', 'color: green')
labelsenha.innerHTML = 'Senha'
senha.setAttribute('style','border-color: green' )
validsenha = true
    }
})

//verifica se a senha esta igual
confirmsenha.addEventListener('keyup', ()=>{
    if(senha.value != confirmsenha.value){ 
labelconfirmsenha.setAttribute('style', 'color: red')
labelconfirmsenha.innerHTML = '*A senha está incorreta, insira a mesma senha' 
confirmsenha.setAttribute('style','border-color: red' )
validconfirmsenha = false
    } else {
labelconfirmsenha.setAttribute('style', 'color: green')
labelconfirmsenha.innerHTML = 'Confirmar Senha'
confirmsenha.setAttribute('style','border-color: green' )
validconfirmsenha = true
    }
})



function cadastrar(){
    if(validnome && validemail && validcpf && validdata && validsenha && validconfirmsenha){
        let listauser = JSON.parse (localStorage.getItem('listauser') || '[]')
//colocoando no localstorage
        listauser.push(
            {
                nomecad: nome.value,
                emailcad: email.value,
                cpfcad: cpf.value,
                datacad: data.value,
                senhacad: senha.value
            }
        )
        localStorage.setItem('listauser', JSON.stringify(listauser))


        msgok.setAttribute('style', 'display: block')
        msgok.innerHTML = '<strong>Cadastrando usuário... </strong>'
        msgerro.setAttribute('style', "display: none")
        msgerro.innerHTML = ''

        setTimeout(() => {
            window.location.href = 'login.html' //depois mudar para o link certo
        }, 2000);

        

    } else {
        msgerro.setAttribute('style', "display: block")
        msgerro.innerHTML = '<strong>Preencha todos os campos corretamente</strong>'
        msgok.setAttribute('style', 'display: none')
        msgok.innerHTML = ''
    }
}

btn.addEventListener('click', ()=>{
    let inputsenha = document.querySelector('#senha')

    if(inputsenha.getAttribute('type') == 'password'){
        inputsenha.setAttribute('type', 'text')
    } else {
        inputsenha.setAttribute('type', 'password')
    }
})


btnConfirm.addEventListener('click', ()=>{
    let inputconfirmsenha = document.querySelector('#confirmsenha')

    if(inputconfirmsenha.getAttribute('type') == 'password'){
        inputconfirmsenha.setAttribute('type', 'text')
    } else {
        inputconfirmsenha.setAttribute('type', 'password')
    }
})