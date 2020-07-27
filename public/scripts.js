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
if(ingredientList) {
  document.querySelector(".add-ingredient").addEventListener('click', () => {
    let clonedField = document.querySelector(".ingredient-item").cloneNode()
    clonedField.value = ""
    ingredientList.appendChild(clonedField)
  })
}

const preparationList = document.querySelector("#preparation-list")
if(preparationList) {
  document.querySelector(".add-preparation").addEventListener('click', () => {
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

const PhotosUpload = {
  input: "",
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 5,
  files: [],
  handlePhotoInput(event) {
    const { files: fileList } = event.target
    PhotosUpload.input = event.target
    
    if(PhotosUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      PhotosUpload.files.push(file)
      const reader = new FileReader()

      reader.onload = () => {
        const image = new Image()
        image.src = String(reader.result)

        const container = PhotosUpload.getContainer(image)
        PhotosUpload.preview.appendChild(container)
      }
      reader.readAsDataURL(file)
    })

    PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },

  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload
    const { files: fileList } = input

    if(fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }

    const photosContainer = []
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == 'photo') {
        photosContainer.push(item)
      }
    })

    const totalPhotos = fileList.length + photosContainer.length
    if(totalPhotos > uploadLimit) {
      alert('Você excedeu o limite máximo de fotos!')
      event.preventDefault()
      return true
    }

    return false
  },

  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
    return dataTransfer.files
  },

  getContainer(image) {
    const container = document.createElement('div')
    container.classList.add('photo')
    container.onclick = PhotosUpload.removePhoto
    container.appendChild(image)
    container.appendChild(PhotosUpload.getRemoveButton())

    return container
  },

  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = 'close'
    return button
  },

  removePhoto(event) {
    const photoContainer = event.target.parentNode
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoContainer)
    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()

    photoContainer.remove()
  },

  removeOldPhoto(event) {
    const photoContainer = event.target.parentNode

    if(photoContainer.id) {
      const removedFiles = document.querySelector('input[name="removed_files"')
      if(removedFiles){
        removedFiles.value += `${photoContainer.id},`
      }
    }

    photoContainer.remove()
  },

  previewAvatar(event) {
    const span = document.querySelector('.avatar_input').firstElementChild
    span.innerHTML = ""
    
    const chefAvatar = document.querySelector('#chef_avatar')
    chefAvatar.src = URL.createObjectURL(event.target.files[0])
    chefAvatar.classList.remove('hidden')
  }
}

const ImageGallery = {
  highlight: document.querySelector('.recipe-detail .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(event) {
    const { target } = event

    ImageGallery.previews.forEach(preview => preview.classList.remove('highlighted', 'selected'))
    target.classList.add('selected')

    ImageGallery.highlight.src = target.src
  }
}