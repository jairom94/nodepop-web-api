document.addEventListener('DOMContentLoaded',()=>{
    const showMenuBurger = document.querySelector('#menu-burger')
    if (showMenuBurger instanceof HTMLInputElement) {
        showMenuBurger.addEventListener('change',()=>{
            const menuVertical = document.querySelector('.menu-vertical')
            if (showMenuBurger.checked) {
                menuVertical.classList.remove('w-0')
                menuVertical.classList.add('w-full')
            }else{
                menuVertical.classList.remove('w-full')
                menuVertical.classList.add('w-0')
            }
        })
    }
})