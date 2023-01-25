'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields() //limpa campos form
    document.getElementById('modal').classList.remove('active')
}
//CRUD - cread read update delete
/*const tempClient = {
    nome: "nicole",
    email: "nicole@email.com",
    cidade: "passo fundo",
    estado: "RS",
    telefone: "99887766",
    categoria: "funcionaria"
}*/

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [] // le localstore e converte em string o obj
const setLocalStorage = (dbUser) => localStorage.setItem("db_client", JSON.stringify(dbUser)) //converte em string o obj e envia p localstor, db_client eh a key do db

const deleteUser = (index) => {
    const dbUser = readUser()
    dbUser.splice(index, 1)
    setLocalStorage(dbUser) //atualiza db
}

const updateUser = (index, user) => {
    const dbUser = readUser()
    dbUser[index] = user
    setLocalStorage(dbUser)
}

const readUser = () => getLocalStorage() //le o db, apenas

const createUser = (user) => { //cria tabela db e usuarios
    const dbUser = getLocalStorage()
    //console.log(dbClient)
    dbUser.push(user)
    setLocalStorage(dbUser)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity() //retorna true quando os requisitos do html foram atendidos
}

//interracao c layout
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "") //limpa campo por campo
}

const saveUser = () => {
    //console.log("chamou saveClient")
    if (isValidFields()) {
        const user = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            telefone: document.getElementById('telefone').value,
            categoria: document.getElementById('categoria').value,
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createUser(user) //cadastra client
            //console.log("cadastrando cliente...")
            updateTable() //aatualiza table após cadastro
            closeModal() //fecha form
        } else {
            //console.log("editando user...")
            updateClient(index, user)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (user, index) => { //cria linha com os dados o usuario q vieram do db
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${user.nome}</td>
        <td>${user.email}</td>
        <td>${user.cidade}</td>
        <td>${user.estado}</td>
        <td>${user.telefone}</td>
        <td>${user.categoria}</td>
        <td>
            <button type="button" class="button green" id='edit-${index}'>Editar</button>
            <button type="button" class="button red" id='delete-${index}'>Excluir</button>
        </td>
    `
    document.querySelector('#tableUser>tbody').appendChild(newRow) //insere os dados em memoria na table da homepage
}

const clearTable = () => { //limpa linhas p não gerar duplicatas
    const rows = document.querySelectorAll('#tableUser>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row)) //remove linha a partir do pai 'tbody'
}

const updateTable = () => { //atualiza tabela homepage
    const dbUser = readUser()
    clearTable()
    dbUser.forEach(createRow) //interage com cada elemento db e cria a linha correpondente
}

const fillFields = (user) => {
    document.getElementById('nome').value = user.nome
    document.getElementById('email').value = user.email
    document.getElementById('cidade').value = user.cidade
    document.getElementById('estado').value = user.estado
    document.getElementById('telefone').value = user.telefone
    document.getElementById('categoria').value = user.categoria
    document.getElementById('nome').dataset.index = user.index
}

const editUser = (index) => {
    const user = readUser()[index]
    user.index = index
    fillFields(user) //reenche os campos do form
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')
        //console.log(action, index)
        if (action == 'edit') {
            editUser(index)
        } else {
            const user = readUser()[index]
            const response = confirm(`Deseja excluir o usuario: ${user.nome}`)
            if (response) {
                deleteUser(index)
                updateTable()
            }
        }
    }
}

updateTable()

//eventos
document.getElementById('cadastrarUser')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveUser)

document.querySelector('#tableUser>tbody')
    .addEventListener('click', editDelete)