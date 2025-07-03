document.addEventListener("DOMContentLoaded", () => {
  const stepsSlider = document.querySelector("#steps-slider");
  const input0 = document.querySelector("#price-min");
  const input1 = document.querySelector("#price-max");
  const inputs = [input0, input1];  
  const priceRange = document.querySelector('.price-range')  
  const minPrice = parseInt(priceRange.dataset.minPrice);
  const maxPrice = parseInt(priceRange.dataset.maxPrice);
  const queryPrice = document.querySelector('.query-price')
  const min = queryPrice.dataset.min
  const max = queryPrice.dataset.max
//   console.log(min,max)
//   console.log(minPrice,maxPrice)
const btnFilter = document.querySelector('.btn-show-filter')

  noUiSlider.create(stepsSlider, {
    start: [min || minPrice, max || maxPrice],
    connect: true,
    step:1,
    range: {
      min: [minPrice],
      max: [maxPrice],
    },
    tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })]
  });
  stepsSlider.noUiSlider.on("update", function (values, handle) {
    inputs[handle].value = values[handle];
  });
  inputs.forEach(function (input, handle) {
    input.addEventListener("change", function () {
      stepsSlider.noUiSlider.setHandle(handle, this.value);
    });

    input.addEventListener("keydown", function (e) {
      var values = stepsSlider.noUiSlider.get();
      var value = Number(values[handle]);

      // [[handle0_down, handle0_up], [handle1_down, handle1_up]]
      var steps = stepsSlider.noUiSlider.steps();

      // [down, up]
      var step = steps[handle];

      var position;
      // 13 is enter,
      // 38 is key up,
      // 40 is key down.
      switch (e.which) {
        case 13:
          stepsSlider.noUiSlider.setHandle(handle, this.value);
          break;

        case 38:
          // Get step to go increase slider value (up)
          position = step[1];

          // false = no step is set
          if (position === false) {
            position = 1;
          }

          // null = edge of slider
          if (position !== null) {
            stepsSlider.noUiSlider.setHandle(handle, value + position);
          }

          break;

        case 40:
          position = step[0];

          if (position === false) {
            position = 1;
          }

          if (position !== null) {
            stepsSlider.noUiSlider.setHandle(handle, value - position);
          }

          break;
      }
    });
  });
});
