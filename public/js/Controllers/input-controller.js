/**
 * Crea y controla un input text,number o email.
 * @param {HTMLDivElement} container - El elemento contenedor para el input y el label.
 * @param {string} type
 * @param {string} name
 * @param {string} placeholder
 * @param {string} value
 */
export function inputController(
  container,
  type,
  name,
  placeholder,
  value = ""
) {
  const input = document.createElement("input");
  input.type = type;
  input.name = name;
  input.autocomplete = "off";
  input.value = value;
  input.classList.add(
    "focus:[&+span]:text-xs",
    "focus:[&+span]:top-1",
    "outline-none",
    "text-gray-600",
    "font-medium",
    "focus:text-gray-700",
    "group-focus:border-2"
  );
  container.appendChild(input);
  const span = document.createElement("span");
  span.textContent = placeholder;
  span.classList.add(
    "transition-all",
    "duration-300",
    "absolute",
    "left-3",
    "top-4",
    "pointer-events-none"
  );
  container.appendChild(span);
  
  buildInput(input)

  input.addEventListener("keyup", () => {
    buildInput(input)
  });

  return {
    getInput() {
      return input;
    },
  };
}

/**
 * Estilos de input.
 * @param {HTMLInputElement} input
 */
function buildInput(input) {
  if (input.value) {
    input.classList.add("[&+span]:text-xs", "[&+span]:top-1");
  } else {
    input.classList.remove("[&+span]:text-xs", "[&+span]:top-1");
  }
}
