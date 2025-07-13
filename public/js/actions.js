document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.querySelector(".products");  
  //modal update
  const btnsUpdate = document.querySelectorAll(".update");
  ModalUpdateController(productsContainer,btnsUpdate)
  //modal delele
  const btnsDelete = document.querySelectorAll(".delete");
  ModalDeleteController(productsContainer,btnsDelete)  
});


/**
 * 
 * @param {HTMLDivElement} container 
 * @param {NodeListOf<HTMLButtonElement>} buttonsToShow 
 * @returns 
 */
function ModalDeleteController(container, buttonsToShow){
  const ModalDelete = document.createElement("dialog");
  ModalDelete.classList.add("modal");  
  ModalDelete.innerHTML = `
        <div class=''>
        <h2 class='flex bg-red-500 px-7 py-5 text-white'>
            <div class='flex justify-center items-center'>
                <iconify-icon icon="ic:baseline-railway-alert"></iconify-icon>
            </div>
            <span>Alert</span>
        </h2>
        <form 
        class='form-delete px-7 py-4 flex flex-col gap-4' method="post">
            <p class='message-delete text-xs text-gray-600'>                
            </p>
            <input type="hidden" name="allow" value="true">
            <div>
                <button 
                class='text-white cursor-pointer bg-sky-600 transition-colors duration-300 hover:bg-sky-400 px-3 py-2 rounded-md'
                type="submit" id="allow-delete">Aceptar</button>
                <button 
                class='btn-close-modal text-white cursor-pointer bg-red-500 transition-colors duration-300 hover:bg-red-300 px-3 py-2 rounded-md'
                type="button">Cancelar</button>
            </div>
        </form>
        </div>
    `;
  container.appendChild(ModalDelete); 
  const btnCloseModal = ModalDelete.querySelector('.btn-close-modal')
  btnCloseModal.addEventListener('click',()=>{
    ModalDelete.close()
  })
  buttonsToShow.forEach(btnDelete => {
    btnDelete.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    const form = document.querySelector('.form-delete')
    const message = document.querySelector('.message-delete')
    const productId = btnDelete.dataset.productid;
    const productName = btnDelete.dataset.productname;
    if(form instanceof HTMLFormElement){
        form.action = `/products/delete/${productId}`
    }
    message.innerHTML = `
    ¿Estás seguro de borrar <span class='font-medium text-gray-800'>${productName}</span>?
    `
      ModalDelete.showModal();      
    });
  }) 
  // return {
  //   showModal(){
  //     ModalDelete.showModal()
  //   },
  //   closeModal(){
  //     ModalDelete.close()
  //   }
  // }
}

/**
 * 
 * @param {HTMLDivElement} container 
 * @param {NodeListOf<HTMLButtonElement>} buttonsToShow 
 */
function ModalUpdateController(container, buttonsToShow){
  const stateProduct = ProductState()
  const ModalUpdate = document.createElement("dialog");
  ModalUpdate.classList.add("modal");      
  ModalUpdate.innerHTML = `
        <div class='px-4 py-3 min-w-[50vw] md:min-w-[400px]'>
        <div>
            <h2 class="text-emerald-700 text-shadow-md text-shadow-emerald-200 text-2xl font-medium pb-3">EDIT PRODUCT</h2>
        </div>
        <form class='form-update flex flex-col gap-3 md:grid md:grid-cols-2'>
        <input type="hidden" name="productId" id="product-id" value="" >
        <div class="flex flex-col gap-2">
            <label for="name" class="text-emerald-700 text-lg font-medium">Nombre</label>
            <input 
            class="border border-emerald-500 outline-emerald-600 rounded-md px-3 py-2" 
            type="text" 
            name="name" 
            id="name-edit" 
            autocomplete="off"
            placeholder=" ">        
        </div>
        <div class="flex flex-col gap-2">
            <label for="price" class="text-emerald-700 text-lg font-medium">Precio</label>
            <input type="number" name="price" id="price-edit" autocomplete="off"
            class="border border-emerald-500 outline-emerald-600 rounded-md px-3 py-2"
            placeholder="0.00"
            pattern="^\d+\.\d{2}$"
            value="" 
            >        
        </div>
       
        <div class="flex flex-col gap-2">
            <label
              class="block cursor-pointer rounded-md border border-dashed py-7 text-center"
            >
              <span class="text-sm">
                Drag your image or press click to select
              </span>
              <input
                type="file"
                accept="image/*"
                name="image"                
                class="image-edit hidden"
              />
            </label>
            <figure class="container-image-preview">
                
            </figure>            
        </div>
        <div class="flex flex-col gap-2">
            <span  class="text-emerald-700 text-lg font-medium">Categories</span>
            <div
              class="dropdown-cont flex"
            >            
              <select
                class="tags-edit focus:outline-none overflow-hidden px-2 py-1 border rounded-md flex-1"
                name="tags"
                id="categories-edit"
                multiple
              >                
                
              </select>
            </div>
          </div>
        <div class="flex gap-4 [&>button]:cursor-pointer [&>button]:transition-colors [&>button]:duration-300">
            <button class="bg-sky-600 px-4 py-2 rounded-md text-gray-50 hover:bg-sky-700" type="submit">Aceptar</button>
            <button id="edit-cancel" type="button" class="btn-close-modal bg-red-500 px-4 hover:bg-red-600 text-gray-50 py-2 rounded-md">
                Cancelar
            </button>         
        </div>
    </form>
        </div>
    `;
  container.appendChild(ModalUpdate); 
  const formUpdate = ModalUpdate.querySelector('.form-update')
  
  const btnCloseModal = ModalUpdate.querySelector('.btn-close-modal')
  btnCloseModal.addEventListener('click',()=>{
    ModalUpdate.close()    
    formUpdate.reset()
  })
  
  if(formUpdate instanceof HTMLFormElement){
    formUpdate.addEventListener('submit',async function(e){
      e.preventDefault();
      const frmData = new FormData(this)
      const tagsSelected = frmData.getAll('tags')
      const image = frmData.getAll('image')
      const frmDataObj = Object.fromEntries(frmData)
      let formClean = {...frmDataObj,tags:tagsSelected}      
      if(!image[0].name){
        delete formClean.image
      }
      try {
        const productId = this.querySelector('#product-id').value || ''
        let oldProduct; //= await getProductToUpdate(productId)        
        if(stateProduct.hasData()){
          oldProduct = stateProduct.getValue()
        }else{
          const { result } = await getProductToUpdate(productId)
          oldProduct = result
        }        
        
        delete formClean.productId

        const compare = Object.entries(formClean).every(([key,value]) => {          
          // console.log(key,value);          
          if(Array.isArray(oldProduct[key])){            
            return compareTo(value,oldProduct[key].map(el => el._id))
          }          
          return value === oldProduct[key].toString()
        })
        if(compare){
          formUpdate.reset()                    
          ModalUpdate.close()
          return
        }

        if (formClean.name === oldProduct.name) {
          delete formClean.name
        }
        if (formClean.price === oldProduct.price.toString()) {
          delete formClean.price
        }else{
          formClean.price = Number(formClean.price)
        }
        if(compareTo(formClean.tags,oldProduct.tags.map(el => el._id))){
          delete formClean.tags
        }

        formClean.id = productId
        
        const formToSend = new FormData()
        Object.entries(formClean).forEach(([key,value])=>{
          console.log(key,value)
          if(Array.isArray(value)){
            value.forEach(item => formToSend.append(`${key}[]`,item))
          }else{
            formToSend.append(key,value)
          }
        })
        // return
        await updateProduct(formToSend,productId)
        // formUpdate.reset()
        ModalUpdate.close()
        window.location.reload()        
      } catch (error) {
        alert('Error:',error)
      }
      
    })
  }
  buttonsToShow.forEach(btnUpdate => {
    btnUpdate.addEventListener('click',async (e)=>{
      e.preventDefault()
      e.stopPropagation()
      // const formUpdate = ModalUpdate.querySelector('.form-update')  
      const productId = btnUpdate.dataset.productid;  
      try {
        const productIdInput = ModalUpdate.querySelector('#product-id')
        if(productIdInput instanceof HTMLInputElement){
          productIdInput.value = productId
        }
        const { result } = await getProductToUpdate(productId)
        stateProduct.setValue(result)
        const nameEdit = ModalUpdate.querySelector('#name-edit')
        nameEdit.value = result.name
        const priceEdit = ModalUpdate.querySelector('#price-edit')
        priceEdit.value = result.price

        const tagsResource = await getTags()          
              
        if(tagsResource.tags.length > 0){
          const tagsContainer = ModalUpdate.querySelector('.tags-edit')
          tagsContainer.innerHTML = tagsResource.tags.map(tag => (
            `<option value="${tag._id}" ${result.tags.map(t=>t.name).includes(tag.name) ? 'selected' : ''}>${tag.name}</option>`
          )).join('')
          
        }
        const containerImage = ModalUpdate.querySelector('.container-image-preview')
        containerImage.innerHTML = '';
        const imageEdit = document.createElement('img')
        imageEdit.classList.add('h-[100px]','md:h-auto','object-center','object-contain','rounded-md')
        if(result.image.startsWith('http')){
          imageEdit.src = result.image
        }else{
          imageEdit.src = `/products/${result.image}`
        }
        imageEdit.alt = `${result.name}`
        containerImage.appendChild(imageEdit)
        //Mostrar preview image
        const fileImage = ModalUpdate.querySelector('.image-edit')
        if(fileImage instanceof HTMLInputElement){
          fileImage.addEventListener('change',()=>{
            const urlImage = URL.createObjectURL(fileImage.files[0])
            imageEdit.src = urlImage
          })
        }
        ModalUpdate.showModal()
      } catch (error) {        
        alert('Error:',error)
      }          
    })
    
  }) 
  
}

/**
 * 
 * @param {string} productId 
 */
async function getProductToUpdate(productId) {
  const url = '/api/products'
  const response = await fetch(`${url}/${productId}`)
  const product = await response.json()
  return product
}

async function getTags() {
  const url = '/api/resources'
  const response = await fetch(`${url}/tags`)
  const tags = await response.json()
  return tags
}

/**
 * 
 * @param {Array} arr1 
 * @param {Array} arr2 
 */
function compareTo(arr1,arr2){
  if(arr1.length !== arr2.length) return false
  const arr1Sort = [...arr1].sort()
  const arr2Sort = [...arr2].sort()
  return arr1Sort.every((el,index) => el === arr2Sort[index])
}


/**
 * 
 * @param {FormData} formToUpdate 
 * @param {string} id 
 */
async function updateProduct(formToUpdate,id){  
  const url = `/api/products/${id}`
  const response = await fetch(url,{
    method: 'PATCH',
    body: formToUpdate
  })
  const productUpdated = await response.json()
  return productUpdated 
}

function ProductState(){
  let product;
  return {
    hasData(){
      return product !== undefined || product !== null
    },    
    setValue(value){
      product = value
    },
    getValue(){
      return product
    }
  }
}