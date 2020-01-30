import fieldInterface from './util/field-interface.js';
import listingCardTemplate from './templates/listing-card.js';
import addNewListing from './templates/add-new-listing.js';
import newListingModal from './templates/new-listing-modal.js';
import yesNoModal from './templates/yes-no-modal.js';
import loadingModal from './templates/loading-modal.js';
import hardwareAddons from './special-fields/hardware-addons.js';
import useCases from './special-fields/use-cases.js';
import infoModal from './templates/info-modal.js';

export default {
    addModalsToDocument(){
        const newListingModalEl = newListingModal.new();
        const newYesNoModalEl = yesNoModal.new();
        const loadingModalEl = loadingModal.new();
        const infoModalEl = infoModal.new();

        document.body.appendChild(newListingModalEl);
        document.body.appendChild(newYesNoModalEl);
        document.body.appendChild(loadingModalEl);
        document.body.appendChild(infoModalEl);
    },

    /**
     * 
     * @param {String} containerId css id of container of listings
     * @param {Object} listings rows from the data table describing listings
     */
    showListings(containerId, listings){
        const containerEl = document.getElementById(containerId);

        // Remove existing listing first
        while (containerEl.firstChild) {
            containerEl.removeChild(containerEl.firstChild);
        }

        // Add curent listings
        listings.forEach(row => {
            containerEl.appendChild(listingCardTemplate.new(row));
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
        fieldInterface.inputTextFill('app-name', listingDetails.name);

        // Platform checkboxes
        fieldInterface.checkBoxesFill('cb-app-platform', listingDetails.platforms);
        
        // Vendor Name 
        fieldInterface.inputTextFill('app-vendorName', listingDetails.vendorName);

        // Vendor Website 
        fieldInterface.inputTextFill('app-vendorWebSite', listingDetails.vendorWebSite);    

        // Vendor Email 
        fieldInterface.inputTextFill('app-vendorEmail', listingDetails.vendorEmail);    

        // TagLine
        fieldInterface.inputTextFill('app-tagLine', listingDetails.tagLine);    

        // Short Description
        fieldInterface.textAreaFill('app-shortDescription', listingDetails.shortDescription);    

        // Full Description
        fieldInterface.textAreaFill('app-fullDescription', listingDetails.fullDescription);    

        // Video URL
        fieldInterface.inputTextFill('app-videoURL', listingDetails.videoURL);    

        // Help Documentation
        fieldInterface.inputTextFill('app-helpDocumentation', listingDetails.helpDocumentation);    

        // App Languages
        fieldInterface.checkBoxesFill('cb-appLanguages', listingDetails.appLanguages);

        // Industries
        fieldInterface.checkBoxesFill('cb-app-industries', listingDetails.industries);

        // Selling Party
        fieldInterface.radioFill('rdo-app-sellingParty', listingDetails.sellingParty);

        // Licensing
        fieldInterface.checkBoxesFill('cb-app-licensing', listingDetails.licensingClassifications);

        // App Permissions
        fieldInterface.inputTextFill('app-appPermissions', listingDetails.appPermissions);    

        // Attestations
        fieldInterface.checkBoxesFill('cb-app-attestations', listingDetails.attestations);

        // App Type
        fieldInterface.checkBoxesFill('cb-app-appType', listingDetails.appType);

        // Hardware Add-ons 
        hardwareAddons.fillInnerFields(listingDetails.hardwareAddons);

        // Use Cases
        useCases.showUseCases(listingDetails.useCases);

        // Pricing
        fieldInterface.textAreaFill('app-pricing', listingDetails.pricing);    
    },

    showInfoModal(title, message, cb){
        infoModal.show(title, message, cb);
    },

    hideInfoModal(){
        infoModal.hide();
    }
}