import { heroDisplay } from "../Views/hero-view.js";

function Sliders(){
    let sliders = [
    {
      name: "slider-1",
      image: "../../imgs/hero/hero1.avif",
      expand: true,
      bg: "bg-emerald-400",
      message: "<strong>Compra y vende artículos</strong><br> de segunda mano.",
      link: { to: "/adverts/new", text: "Vender ahora" },
    },
    {
      name: "slider-2",
      image: "../../imgs/hero/hero2.avif",
      expand: false,
      bg: "bg-emerald-600",
      message:
        "<strong>¿Quién necesita trastero,</strong><br> teniendo Wallapop?",
      link: { to: "/adverts/new", text: "Vende lo que no usas" },
    },
    {
      name: "slider-3",
      image: "../../imgs/hero/hero3.avif",
      expand: false,
      bg: "bg-emerald-800",
      message:
        "<strong>Potencia tu negocio online</strong><br> con Wallapop PRO.",
      link: { to: "/aderts/new", text: "Saber más" },
    },
    ];


}


export function heroController() {
  let sliders = [
    {
      name: "slider-1",
      image: "../../imgs/hero/hero1.avif",
      expand: true,
      bg: "bg-emerald-400",
      message: "<strong>Compra y vende artículos</strong><br> de segunda mano.",
      link: { to: "/adverts/new", text: "Vender ahora" },
    },
    {
      name: "slider-2",
      image: "../../imgs/hero/hero2.avif",
      expand: false,
      bg: "bg-emerald-600",
      message:
        "<strong>¿Quién necesita trastero,</strong><br> teniendo Wallapop?",
      link: { to: "/adverts/new", text: "Vende lo que no usas" },
    },
    {
      name: "slider-3",
      image: "../../imgs/hero/hero3.avif",
      expand: false,
      bg: "bg-emerald-800",
      message:
        "<strong>Potencia tu negocio online</strong><br> con Wallapop PRO.",
      link: { to: "/aderts/new", text: "Saber más" },
    },
  ];
  const hero = document.querySelector(".hero");
  hero.innerHTML = sliders.map(slider => heroDisplay(slider)).join('');
  let index = 1;
  setInterval(() => {
    sliders = sliders.map((slider,i) => {
        if(index === i){
            return { ...slider,expand:true }
        }
        return { ...slider,expand:false }
    })
    hero.innerHTML = sliders.map(slider => heroDisplay(slider)).join('');
    index += 1
    if (index === sliders.length) {
      index = 0;
    }
  }, 3000);
}
