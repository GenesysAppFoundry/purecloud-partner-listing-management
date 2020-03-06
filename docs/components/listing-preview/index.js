import validators from '../../config/validators.js';
import util from './util.js';

// Get reference to showdownjs library
const showdown = window.showdown;
let converter = new showdown.Converter({
    noHeaderId: true,
    strikethrough: true
});

// Contains the container and btn elements of the page of the listings.
const pageMap = {
    description: {
        container: 'nav-description-container',
        btn: 'description-nav-btn'
    },
    useCases: {
        container: 'nav-useCases-container',
        btn: 'useCases-nav-btn'
    },
    pricing: {
        container: 'nav-pricing-container',
        btn: 'pricing-nav-btn'
    },
    productDetails: {
        container: 'nav-productDetails-container',
        btn: 'productDetails-nav-btn'
    }
}

// Globals
let listing = null;

/**
 * When another window posts a message to this window.
 * @param {Event} event event that's sent
 */
function receiveMessage(event){
    let data = event.data;
    fillPage(data);
}

/**
 * Fill the page with the listing details
 * @param {Object} data the listing info from the parent iframe
 */
function fillPage(data){
    listing = data;
    determineFieldVisibility();

    let listingDetails = data.listingDetails;
    let premiumAppDetails = data.premiumAppDetails;

    // Get the fields from the validators file
    Object.keys(validators.listingDetail).forEach(key => {
        let val = validators.listingDetail[key];

        let fieldEls = document.querySelectorAll('.' + val.fieldId);
        if(!fieldEls || fieldEls.length <= 0) return;

        // Fill up the element with the detail
        fieldEls.forEach((fieldEl) => {
            // Checkboxes should be enlisted instead
            if(val.type == 'checkbox'){
                // SPECIAL CASE for industries. ie 3 or mroe and it's universal instead.
                if(key == 'industries' && listingDetails[key].length >= 3){
                    fieldEl.innerText = 'Universal';
                    return;
                }

                // Check if has value
                if(listingDetails[key].length > 0){
                    fieldEl.innerHTML = util.arrayToDivList(listingDetails[key]);
                }else{
                    fieldEl.parentElement.hidden = true;
                }
                return;
            }

            // Text or Radio Fields
            if(val.markdown){
                // For markdown formats
                fieldEl.innerHTML = converter.makeHtml(listingDetails[key]);
            }else{
                if(fieldEl.tagName.toLowerCase() == 'a'){
                    fieldEl.href = listingDetails[key];
                }else{
                    // Check if has value
                    if(listingDetails[key] !== ''){
                        fieldEl.innerText = listingDetails[key];
                    }else{
                        fieldEl.parentElement.hidden = true;
                    }
                }
            }
        });
    });
}

/**
 * Go to a specific subpage in the listing details.
 * @param {Object} page Contains element references
 */
function showPage(page){
    // Hide all sections first
    Object.keys(pageMap).forEach((key) => {
        let elId = pageMap[key].container;
        document.getElementById(elId).style.display = 'none';
    })

    // Disable the tab elements active look
    document.getElementById('page-navigation').querySelectorAll('li')
        .forEach(el => {
            console.log('que');
            el.classList.remove('is-active');
        });

    // Show the selected page
    document.getElementById(page.container).style.display = 'block';

    // Activate the tab btn
    document.getElementById(page.btn).parentElement.classList.add('is-active');
}

/**
 * If some fields are not field up in the listing form, then some sections
 * will also not show in the preview.
 */
function determineFieldVisibility(){
    let listingDetails = listing.listingDetails;
    let premiumAppDetails = listing.premiumAppDetails;

    // Navigation Items
    if(listingDetails.useCases.length <= 0){
        document.getElementById(pageMap.useCases.btn).style.display = 'none';
    }else{
        document.getElementById(pageMap.useCases.btn).style.display = '';
    }
    if(listingDetails.pricing.length <= 0){
        document.getElementById(pageMap.pricing.btn).style.display = 'none';
    }else{
        document.getElementById(pageMap.pricing.btn).style.display = '';
    }
}

/**
 * Set event handlers for the page
 */
function setEventHandlers(){
    // Window for post messaging
    window.addEventListener('message', receiveMessage, false);

    // Navigation Buttons
    Object.keys(pageMap).forEach(key => {
        let val = pageMap[key];
        document.getElementById(val.btn)
        .addEventListener('click', () => showPage(val));
    });
}


// ======================================
setEventHandlers();
showPage(pageMap.description);