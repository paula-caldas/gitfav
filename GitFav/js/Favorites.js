import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@git-fav:')) || []
     

  }
  
  save() {
    localStorage.setItem('@git-fav:', JSON.stringify(this.entries)) 
  }
  
  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists){
        throw new Error('Usuário já cadastrado')
      }


      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries =[user, ...this.entries]
      this.update()
      this.save()
    


    } catch(error) {
      alert(error.message)
    }

  } 


}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    
    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button')
    
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)

      this.root.querySelector('.search input').value = ''
    }
  }
  
  update() {
    this.removeAllTr()
    
    this.entries.forEach( user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.name a').href = `https://github.com/${user.login}`
      row.querySelector('.name p').textContent = user.name
      row.querySelector('.name span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar esse usuário?')
        if(isOk){
          this.delete(user)
        }
      }

      this.tbody.append(row)

    })

  
  }
  
  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
          <td class="user">
          <img src="https://github.com/maykbrito.png" alt="Imagem do Mayk">
          <div class="name">
            <a href="https://github.com/maykbrito" target="blank">
              <p>Mayk Brito</p>
              <span>/maykbrito</span>
            </a>
          </div>
        </td>
        <td class="repositories">123</td>
        <td class="followers">1234</td>
        <td>
        <button class="remove">Remover</button>
        </td>
    `
    return tr
  }
  
  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }

}