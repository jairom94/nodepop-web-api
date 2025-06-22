export function inputController(container, type, name, placeholder) {
  const input = document.createElement("input");
  input.type = type;
  input.name = name
  input.autocomplete = "off";
  input.classList.add(
    "focus:[&+span]:text-xs",
    "focus:[&+span]:top-1",
    "outline-none",
    "focus:text-gray-700"
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
  input.addEventListener('keyup',()=>{
    if(input.value){
      input.classList.add(
        '[&+span]:text-xs',
        '[&+span]:top-1'
      )
    }else{
      input.classList.remove(
        '[&+span]:text-xs',
        '[&+span]:top-1'
      )
    }
    
  })
  return {
    getInput(){
        return input
    }
  }
}
