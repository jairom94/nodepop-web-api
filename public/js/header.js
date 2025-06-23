document.addEventListener("DOMContentLoaded", () => {
  const showMenuBurger = document.querySelector("#menu-burger");
  if (showMenuBurger instanceof HTMLInputElement) {
    handlerMenuBurger(showMenuBurger, "menu-vertical");
  }
  const tagsContainer = document.querySelector(".tags");
  const tags = tagsContainer.dataset.tags.split(",");
  let index = 1;
  createAndPushSpan(tagsContainer,tags[0])
  setInterval(() => {
    createAndPushSpan(tagsContainer,tags[index])
    index += 1;    
    if (index === tags.length) {
      index = 0;
    }
  }, 3000);

  const iconSearch = document.querySelector('.icon-search')
  const placeholderSearch = document.querySelector('.placeholder')
  const inputSearch = document.querySelector('.input-search')
  if(inputSearch instanceof HTMLInputElement){
    inputSearch.addEventListener('keyup',()=>{
        if(inputSearch.value){
            iconSearch.classList.add('hidden')
            placeholderSearch.classList.add('hidden')
            tagsContainer.classList.add('hidden')
        }else{
            iconSearch.classList.remove('hidden')
            placeholderSearch.classList.remove('hidden')
            tagsContainer.classList.remove('hidden')
        }
    })
  }
});

/**
 * Controla el menu burger
 * @param {HTMLInputElement} btnShowMenu
 * @param {string} menuVerticalClassCss
 */
function handlerMenuBurger(btnShowMenu, menuVerticalClassCss) {
  btnShowMenu.addEventListener("change", () => {
    const menuVertical = document.querySelector(`.${menuVerticalClassCss}`);
    if (btnShowMenu.checked) {
      menuVertical.classList.remove("w-0");
      menuVertical.classList.add("w-full");
    } else {
      menuVertical.classList.remove("w-full");
      menuVertical.classList.add("w-0");
    }
  });
}

/**
 * 
 * @param {HTMLDivElement} container 
 * @param {string} text 
 */
function createAndPushSpan(container,text) {
    container.innerHTML = "";
    const newTag = document.createElement("span");
    newTag.textContent = text;
    newTag.classList.add("animate-fade-in");
    container.appendChild(newTag);
}
