import listingCardTemplate from './templates/listing-card.js';
import addNewListing from './templates/add-new-listing.js';
import newListingModal from './templates/new-listing-modal.js';
import yesNoModal from './templates/yes-no-modal.js';
import loadingModal from './templates/loading-modal.js';

export default {
    addModalsToDocument(){
        const newListingModalEl = newListingModal.new();
        const newYesNoModalEl = yesNoModal.new();
        const loadingModalEl = loadingModal.new();

        document.body.appendChild(newListingModalEl);
        document.body.appendChild(newYesNoModalEl);
        document.body.appendChild(loadingModalEl);
    },

    showListings(containerId, listings){
        const containerEl = document.getElementById(containerId);

        // Remove existing listing first
        while (containerEl.firstChild) {
            containerEl.removeChild(containerEl.firstChild);
        }

        // Add curent listings
        listings.forEach(ws => {
            containerEl.appendChild(listingCardTemplate.new(ws));
        });
        
        const addNewEl = addNewListing.new();
        containerEl.appendChild(addNewEl);
    },

    showCreationModal(){
        const modal = document.getElementById('listing-creation-modal');
        modal.classList.add('is-active');
    }, 

    hideCreationModal(){
        const modal = document.getElementById('listing-creation-modal');
        modal.classList.remove('is-active')
    }, 

    showYesNoModal(title, question, yesCb, noCb){
        yesNoModal.show(title, question, yesCb, noCb);
    },

    hideYesNoModal(){
        yesNoModal.hide();
    },

    showLoader(message){
        loadingModal.show(message);
    },

    hideLoader(){
        loadingModal.hide();
    }
}