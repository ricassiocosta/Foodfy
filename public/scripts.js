const toggleVisibilityButton = document.querySelectorAll('.show-subtitle-content')
const subContent = document.querySelectorAll('.sub-content')

for(let i = 0; i < toggleVisibilityButton.length; i ++) {
  toggleVisibilityButton[i].addEventListener('click', () => {

    if (toggleVisibilityButton[i].innerHTML == 'MOSTRAR:') {
      toggleVisibilityButton[i].innerHTML = 'ESCONDER:'
      subContent[i].classList.remove('hidden')
    } else {
      toggleVisibilityButton[i].innerHTML = 'MOSTRAR:'
      subContent[i].classList.add('hidden')
    }
  })
}


const ingredientList = document.querySelector("#ingredient-list")

const addIngredientBtn = document.querySelector(".add-ingredient")
if(addIngredientBtn) {
  addIngredientBtn.addEventListener('click', () => {
    let clonedField = document.querySelector(".ingredient-item").cloneNode()
    clonedField.value = ""
    ingredientList.appendChild(clonedField)
  })
}

const preparationList = document.querySelector("#preparation-list")

const addPreparationBtn = document.querySelector(".add-preparation")
if(addPreparationBtn) {
  addIngredientBtn.addEventListener('click', () => {
    let clonedField = document.querySelector(".preparation-step").cloneNode()
    clonedField.value = ""
    preparationList.appendChild(clonedField)
  })
}

// PAGINATION

function paginate(selectedPage, totalPages) {
  let pages = [],
      oldPage
  
  for(let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPages = currentPage == 1 || currentPage == totalPages
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

    if(firstAndLastPages || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
      if(oldPage && currentPage - oldPage > 2) {
        pages.push('...')
      }
      if(oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1)
      }

      pages.push(currentPage)

      oldPage = currentPage
    }
  }

  return pages
}

function createPagination(pagination) {
  const page = Number(pagination.dataset.page)
  const total = Number(pagination.dataset.total)
  const filter = pagination.dataset.filter
  const pages = paginate(page, total)

  let elements = ''

  for(let page of pages) {
    if(String(page).includes('...')) {
      elements += `<span>${page}</span>`
    } else {
      if(filter) { 
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
      } else {
        elements += `<a href="?page=${page}">${page}</a>`
      }
    }
  }

  pagination.innerHTML = elements
}

const pagination = document.querySelector('.pagination')

if(pagination) {
  createPagination(pagination)
}