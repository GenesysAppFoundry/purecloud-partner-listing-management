import listingCardTemplate from './templates/listing-card.js';
import addNewListing from './templates/add-new-listing.js';
import newListingModal from './templates/new-listing-modal.js';

export default {
    addModalsToDocument(){
        const newListingModalEl = newListingModal.new();
        document.body.appendChild(newListingModalEl);
    },

    showListings(containerId){
        const containerEl = document.getElementById(containerId);
        // TODO: Add Existing Listings
       
        const addNewEl = addNewListing.new();
        containerEl.appendChild(addNewEl);
    },

    showListingCard(listingInfo){

    },

    showCreationModal(){
        const modal = document.getElementById('listing-creation-modal');
        modal.classList.add('is-active');
    }, 

    hideCreationModal(){
        const modal = document.getElementById('listing-creation-modal');
        modal.classList.remove('is-active')
    }, 
}