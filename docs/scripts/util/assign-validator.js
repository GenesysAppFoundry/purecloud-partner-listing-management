/**
 * Will assign the validator functions to the different fields.
 * Validation rules is in the config folder for each property in the 
 * listing details.
 * @param {Object} rule info about te field as defined in config/validators.js
 */
export default function(rule){
    let field = document.getElementById(rule.fieldId);

    if(rule.type == 'input' || rule.tpye == 'textarea'){
        field.querySelectorAll(rule.type)[0]
        .addEventListener(rule.type, function(){
            let valid = true;

            // Required Field
            if(rule.required){
                if((this.value.length) <= 0){
                    this.classList.add('is-danger');
                    valid = false;
                }
            }

            // Maximum Character Count
            if(rule.maxChar){
                if((this.value.length) > rule.maxChar){
                    this.classList.add('is-danger');
                    valid = false;
                }
            }

            // If invalid color that field
            if(valid) this.classList.remove('is-danger');

            // Message show if invalid
            field.querySelectorAll('p.help')[0].innerText = 
            valid ? '' : rule.message;
        });
    }
    
}
