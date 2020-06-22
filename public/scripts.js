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

document.querySelector(".add-ingredient").addEventListener('click', () => {
  let clonedField = document.querySelector(".ingredient-item").cloneNode()
  clonedField.value = ""
  ingredientList.appendChild(clonedField)
})

const preparationList = document.querySelector("#preparation-list")

document.querySelector(".add-preparation").addEventListener('click', () => {
  let clonedField = document.querySelector(".preparation-step").cloneNode()
  clonedField.value = ""
  preparationList.appendChild(clonedField)
})