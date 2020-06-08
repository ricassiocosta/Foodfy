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