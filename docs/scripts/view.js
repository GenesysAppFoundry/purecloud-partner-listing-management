import fieldFiller from './util/field-filler.js';
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
    },

    fillEditListingFields(listingDetails){
        // Name
        fieldFiller.inputTextFill('app-name', listingDetails.name);

        // Platform checkboxes
        fieldFiller.checkBoxesFill('cb-app-platform', listingDetails.platforms);
        
        // Vendor Name 
        fieldFiller.inputTextFill('app-vendorName', listingDetails.vendorName);

        // Vendor Website 
        fieldFiller.inputTextFill('app-vendorWebSite', listingDetails.vendorWebSite);    

        // Vendor Email 
        fieldFiller.inputTextFill('app-vendorEmail', listingDetails.vendorEmail);    

        // TagLine
        fieldFiller.inputTextFill('app-tagLine', listingDetails.tagLine);    

        // Short Description
        fieldFiller.textAreaFill('app-shortDescription', listingDetails.shortDescription);    

        // Full Description
        fieldFiller.textAreaFill('app-fullDescription', listingDetails.fullDescription);    

        // Video URL
        fieldFiller.inputTextFill('app-videoURL', listingDetails.videoURL);    

        // Help Documentation
        fieldFiller.inputTextFill('app-helpDocumentation', listingDetails.helpDocumentation);    

        // App Languages
        fieldFiller.checkBoxesFill('cb-appLanguages', listingDetails.appLanguages);

        // Industries
        fieldFiller.checkBoxesFill('cb-app-industries', listingDetails.industries);

        // Selling Party
        fieldFiller.radioFill('rdo-app-sellingParty', listingDetails.sellingParty);

        // Licensing
        fieldFiller.checkBoxesFill('cb-app-licensing', listingDetails.licensingClassifications);

        // App Permissions
        fieldFiller.inputTextFill('app-appPermissions', listingDetails.appPermissions);    

        // Attestations
        fieldFiller.checkBoxesFill('cb-app-attestations', listingDetails.attestations);

        // App Type
        fieldFiller.checkBoxesFill('cb-app-appType', listingDetails.appType);

        // TODO: Hardware Add-ons 

        // TODO: Use Cases

        // Pricing
        fieldFiller.textAreaFill('app-pricing', listingDetails.pricing);    
    }
}