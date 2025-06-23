
/**
 * @typedef {Object} SliderData
 * @property {string} name
 * @property {string} image
 * @property {boolean} expand
 * @property {string} bg
 * @property {string} message
 * @property {{ to: string, text: string }} link
 */

/**
 * @param {SliderData} slider
 */
export function heroDisplay(slider) {
  return `
  <div id="${slider.name}" class="cursor-pointer grid h-full grid-cols-2 md:grid-cols-[450px_1fr] overflow-hidden transition-all duration-500 ease-linear ${slider.bg} ${slider.expand ? "w-full" : "w-[50px] [&>div:first-child]:hidden [&>figure]:col-span-2 [&>figure]:brightness-50"}">
        <div class="title flex flex-col justify-between px-4 py-8">
            <h3 class="line-clamp-4 text-4xl md:text-5xl font-extralight text-white [&>strong]:font-bold">
                ${slider.message}
            </h3>
            <div>
                <a class="text-md flex justify-center items-center gap-3 text-center rounded-2xl bg-teal-500 shadow-md shadow-gray-500 px-8 py-2 font-medium tracking-wide whitespace-nowrap hover:bg-teal-600 hover:text-gray-50 transition-colors duration-300" href='${slider.link.to}'>
                    <div class="flex justify-center items-center">
                        <iconify-icon icon="octicon:plus-circle-24"></iconify-icon>
                    </div>
                    <span>
                        ${slider.link.text}
                    </span>
                </a>
            </div>
        </div>
        <figure>
            <img class="h-full w-full object-cover object-center" src="${slider.image}" alt="${slider.name}">
        </figure>
    </div>
  `;
}
