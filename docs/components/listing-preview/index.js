import validators from '../../config/validators.js';
import carousel from './util/carousel.js';
import testData from './test/listing-data.js';
import util from './util/util.js';

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
    console.log('Filling page...');

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

                fieldEl.innerHTML = util.arrayToDivList(listingDetails[key]);
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
                    fieldEl.innerText = listingDetails[key];
                }
            }
        });
    });

    // EYO, A SPECIAL CASE:
    // Video(if existing) and add it to last part of carousel
    // TODO: Use Youtube and Vimeo SDKs to detect playing so 
    // autoplay of carousel will stop.
    if(listingDetails.videoURL){
        let videoUrlString = listingDetails.videoURL;
        let carouselContainer = document.getElementById('carousel');
        let newCarouselDiv = document.createElement('div');
        let embedEl = document.createElement('iframe');
        newCarouselDiv.classList.add('carousel-item');
        embedEl.style.width = '100%';
        embedEl.style.height = '424px';

        // Make it a valid URL if not (add http(s))
        if(videoUrlString.search('http') == -1){
            videoUrlString = `https://${videoUrlString}`;
        }

        // Check if Youtube or Vimeo
        let videoUrl = new URL(videoUrlString);
        if(videoUrl.host.search('youtube') > -1){
            let videoId = videoUrl.searchParams.get('v');
            embedEl.src = `https://www.youtube.com/embed/${videoId}`;
        }

        if(videoUrl.host.search('vimeo') > -1){
            let videoId = videoUrl.pathname.substr(1);  
            embedEl.src = `https://player.vimeo.com/video/${videoId}?color=ff0179`;
        }

        newCarouselDiv.appendChild(embedEl);
        carouselContainer.appendChild(newCarouselDiv);

        // Re-Init the carousel
        carousel.initCarousel();
    }
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

    // Languages Right Side
    if(listingDetails.appLanguages.length <= 0){
        document.getElementById('right-languages-container')
            .style.display = 'none';
    }else{
        document.getElementById('right-languages-container')
            .style.display = '';
    }

    // TOS Right Side
    if(premiumAppDetails.tosURL.length <= 0){
        document.getElementById('right-TOS-container')
            .style.display = 'none';
    }else{
        document.getElementById('right-TOS-container')
            .style.display = '';
    }

    // Help Documentation Right Side
    if(listingDetails.helpDocumentation.length <= 0){
        document.getElementById('right-helpDocumentation-container')
            .style.display = 'none';
    }else{
        document.getElementById('right-helpDocumentation-container')
            .style.display = '';
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

// Initialize Carousel
carousel.initCarousel();

// Setup showdown converter
let converter = new showdown.Converter({
    noHeaderId: true,
    strikethrough: true
});

// Load test if page is not laoded in na iframe
if (window.location == window.parent.location) {
    fillPage(testData);
}