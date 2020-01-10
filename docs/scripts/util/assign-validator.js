/**
 * Will assign the validator functions to the different fields.
 * Validation rules is in the config folder for each property in the 
 * listing details.
 *
 */

/**
 * Assign the validator
 * @param {Object} rule rule as defined in the config file
 */
export default function(rule){
    let field = document.getElementById(rule.fieldId);

    // For text realted input
    if(rule.type == 'input' || rule.type == 'textarea'){
        field.querySelectorAll(rule.type)[0]
        .addEventListener('input', function(){
            let valid = true;

            // Required Field
            if(rule.required){
                if((this.value.length) <= 0){
                    valid = false;
                }
            }

            // Maximum Character Count
            if(rule.maxChar){
                if((this.value.length) > rule.maxChar){
                    valid = false;
                }
            }

            // Formatting
            if(this.value.length > 0){
                switch(rule.format){
                    case 'email':
                        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if(!re.test(String(this.value).toLowerCase())) valid=false;
                        break;
                    case 'website':
                        let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
                        if(!pattern.test(this.value)) valid=false;
                        break;
                    default: break;
                }
            }

            if(valid){
                this.classList.remove('is-danger');
                field.querySelectorAll('p.help')[0].innerText = '';
            }else{
                this.classList.add('is-danger');
                field.querySelectorAll('p.help')[0].innerText = rule.message;
            }
        });
    }
    
    // For checkbox groups
    if(rule.type == 'checkbox'){
        let checkboxes = field.querySelectorAll('input');      

        field.addEventListener('click', function(){
            let valid = true;
            let currentValues = [];

            for(let i = 0; i < checkboxes.length; i++){
                let cb = checkboxes.item(i); 
                if(cb.checked){
                    currentValues.push(cb.value);
                }
            }

            // Minimum Value
            if(currentValues.length < rule.min){
                valid = false;
            }

            // If invalid color that field
            if(valid) this.classList.remove('is-danger');

            // Message show if invalid
            field.querySelectorAll('p.help')[0].innerText = 
            valid ? '' : rule.message;
        });
    }
}
