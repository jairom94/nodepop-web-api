export function registerController(form,fields){
    if(form instanceof HTMLFormElement){
        form.addEventListener('submit',(e)=>{
            const fieldValues = fields.map(field => field.value)
            const validation = fieldValues.some(value => value === '')
            if (validation) {
                alert('fields required')
                e.preventDefault()
            }            
        })
    }
}