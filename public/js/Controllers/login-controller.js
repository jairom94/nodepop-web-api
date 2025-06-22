export function loginController(form,fields){
    if(form instanceof HTMLFormElement){
        form.addEventListener('submit',(e)=>{
            const fieldValues = fields.map(field => field.value)
            const validation = fieldValues.some(value => value === '')
            if (validation) {
                const event = new CustomEvent('error-login',{
                    detail:'email and password are required'
                })
                form.dispatchEvent(event)
                e.preventDefault()
            }            
        })
    }
}