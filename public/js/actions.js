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
  const ModalUpdate = document.createElement("dialog");
  ModalUpdate.classList.add("modal");  
  ModalUpdate.innerHTML = `
        <div class=''>
        <form class='form-update' method="post">
        <div>
            <h2>EDIT PRODUCT</h2>
        </div>
        <div>
            <label for="name" class="headding-5">Nombre</label>
            <input type="text" name="name" id="name-edit" autocomplete="off"
            placeholder="Nombre del producto..." value="">        
        </div>
        <div>
            <label for="price" class="headding-5">Precio</label>
            <input type="number" name="price" id="price-edit" autocomplete="off"
            placeholder="0.00"
            pattern="^\d+\.\d{2}$"
            value="" 
            >        
        </div>
       
        <div>
            <figure class="cont-image">
                <div>
                    <img id="image-product" alt="Imagen Generada"
                    src=""
                    >
                </div>
            </figure>
            <button id="show-image-edit" type="button">Cambiar Imagen</button>
        </div>
        <div>        
            <fieldset>
                <legend class="headding-5">Tags</legend>
                <div id="tags-edit>">
                         
                </div>
            </fieldset>
        </div>
        <div class="cont-btns">
            <button class="btn btn-primary" type="submit">Editar</button>
            <button id="edit-cancel" type="button" class="btn btn-danger">
                Cancelar
            </button>         
        </div>
    </form>
        </div>
    `;
  container.appendChild(ModalUpdate); 
  
  buttonsToShow.forEach(btnUpdate => {
    btnUpdate.addEventListener('click',(e)=>{
      e.preventDefault()
      e.stopPropagation()
      const formUpdate = ModalUpdate.querySelector('.form-update')  
      const productId = btnUpdate.dataset.productid;
      const productName = btnUpdate.dataset.productname;
      if(formUpdate instanceof HTMLFormElement){
        formUpdate.action = `action="/products/update/${productId}`
      }
      ModalUpdate.showModal()
    })
    
  }) 
  
}

/**
 * 
 * @param {string} productId 
 */
async function getProduct(productId){
  try {
    const url = `/api/products/${productId}`
    const response = await fetch(url)
    const productToUpdate = await response.json()
    return productToUpdate
  } catch (error) {
    alert(error)
  }
}