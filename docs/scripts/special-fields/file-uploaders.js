/**
 * Everything about the uploading of attachments
 */

import validators from '../../config/validators.js'

/**
 * Validate 
 * @param {File} file file that's 'uploaded'
 * @param {String} fileType file extension(s) in REGEX format 
 * @returns {Boolean} if the file type is correct
 */
function validateFileType(file, fileType){
    let valid = true;
    
    // File type
    if(fileType){
        const regex = new RegExp(`^image\/(${fileType})$`);
        if (!(regex).test(file.type) ){
            valid = false;
        }
    }

    return valid;
}

/**
 * Validate images that are uploaded.
 * @param {Image} img img that is uploaded
 * @param {Object} rule rules for that img field as defined in config validators
 * @returns {Boolean} if the met the rule requiremenets
 */
function validateImage(img, rule){
    let valid = true;
    console.log('----')
    console.log(valid);
    if(rule.minWidth){
        if(img.width < rule.minWidth) valid = false;
        console.log(valid);
    }
    if(rule.minHeight){
        if(img.height < rule.minHeight) valid = false;
        console.log(img.height);
        console.log(valid);
    }
    if(rule.maxWidth){
        if(img.width > rule.maxWidth) valid = false;
        console.log(valid);
    }
    if(rule.maxHeight){
        if(img.height > rule.maxHeight) valid = false;
        console.log(valid);
    }
    if(rule.ratio){
        let ratio = rule.ratio.split('x');
        let ratio_w = ratio[0];
        let ratio_h = ratio[1];

        if(img.width % ratio_w > 0) valid = false;
        if(img.height % ratio_h > 0) valid = false;
        if(img.width / ratio_w != img.height / ratio_h) valid = false;
        console.log(valid);

    }
    return valid;
}


/**
 * When an image is uploaded
 * @param {File} file the File
 * @param {Object} rule defined in the config validators
 */
function readImage(file, rule){
    // Get elements
    let el_field = document.getElementById(rule.fieldId);
    let el_previewContainer = el_field.querySelectorAll('.preview-image')[0];
    let el_errorMessge = el_field.querySelectorAll('p.help')[0];

    // Empty error msg
    el_errorMessge.innerText = '';
    el_previewContainer.style.display = 'none';

    // Validat file type
    if(!validateFileType(file, rule.fileType)){
        el_errorMessge.innerText = rule.message;
        return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
        const img  = new Image();
        img.addEventListener('load', () => {
            // Validate the image itself
            if(!validateImage(img, rule)){
                el_errorMessge.innerText = rule.message;
            } else {
                el_previewContainer.style.display = 'block';
            }

            el_previewContainer.appendChild(img);
        });
        img.src = reader.result;        
    });
    reader.readAsDataURL(file);
}

function readDocument(){

}

function readFile(file, rule){
    switch(rule.type){
        case 'image':
            readImage(file, rule);
            break;
        case 'document':
            readDocument(file, rule);
            break;
    }
}

export default {
    /**
     * Setup for the attachment fields. 
     */
    setup(){
        Object.keys(validators.attachments).forEach(field => {
            let rule = validators.attachments[field];

            // Get important child elements
            let el_field = document.getElementById(rule.fieldId);
            let el_input = el_field.querySelectorAll('input')[0];
            let el_previewContainer = el_field
                                    .querySelectorAll('.preview-image')[0];
            let el_errorMessge = el_field.querySelectorAll('p.help')[0];


            // Callback function when file is 'uploaded'
            el_input.addEventListener('change', function(ev){
                let files = ev.target.files;
                // If no file is chosen or cancelled is clicked 
                if(files.length <= 0) return;

                // Remove the preview img from the contianer
                while (el_previewContainer.firstChild) {
                    el_previewContainer.removeChild(el_previewContainer.firstChild);
                }

                if(el_input.multiple){
                    // If multiple files loop through them to read
                    for(let i = 0; i < files.length; i++){
                        // Consider only the first files up till the maxFiles rule
                        if(rule.maxFiles && i >= rule.maxFiles) break;

                        readFile(files[i], rule);
                    }
                } else {
                    // If only one file then read it
                    let file = files[0];
                    readFile(file, rule);
                }                
            });
        })
    },

    /**
     * Validate the files that are uploaded.
     * Called from edit-listing as the pre and final validation of the listing
     * (opening and saving)
     * NOTE: Important. we're basically coupling the error message in HTML
     * as the basis for this validation. Unlike basic fields where the validator functions are
     * actually rerun, were doing the easy way here of jusst checking the
     * error messages if they are present or not.
     * TL;DR: No error message displayed = all files are valid.
     * Exception is the "required" property for the rule.
     */
    validateFields(){
        let valid = true;
        
        Object.keys(validators.attachments).forEach(key => {
            let rule = validators.attachments[key];
            if(!rule.fieldId) return;

            let el_container = document.getElementById(rule.fieldId);

            // TODO: Required property

            // Check the error messages if they exist as basis for validation
            let errorMsg = el_container.querySelectorAll('p.help')[0].innerText;
            if(errorMsg.length > 0) valid = false;
        });

        return valid;
    }
}