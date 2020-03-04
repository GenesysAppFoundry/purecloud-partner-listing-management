import validators from '../../config/validators.js';

window.addEventListener('message', receiveMessage, false);

function receiveMessage(event){
    let data = event.data;
    fillPage(data);
}

function fillPage(data){
    let listingDetails = data.listingDetails;
    let premiumAppDetails = data.premiumAppDetails;

    Object.keys(validators.listingDetail).forEach(key => {
        let val = validators.listingDetail[key];

        let fieldEls = document.querySelectorAll('.' + val.fieldId);
        if(!fieldEls || fieldEls.length <= 0) return;

        fieldEls.forEach((fieldEl) => {
            fieldEl.innerText = listingDetails[key];
        });
    });
}