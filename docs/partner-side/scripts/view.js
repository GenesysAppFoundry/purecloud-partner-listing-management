import fieldInterface from './util/field-interface.js';
import listingCardTemplate from './templates/listing-card.js';
import devfoundryNoteTemplate from './templates/devfoundry-note.js';
import headerTemplate from './templates/header.js';
import addNewListing from './templates/add-new-listing.js';
import hardwareAddons from './special-fields/hardware-addons.js';
import useCases from './special-fields/use-cases.js';
import validators from '../../config/validators.js';

export default {
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

    fillEditListingFields(listingDetails, premiumAppDetails){
        // Basic Fields
        let listingDetailRule = validators.listingDetail;
        Object.keys(listingDetailRule).forEach((key) => {
            let rule = listingDetailRule[key];
            switch(rule.type){
                case 'input':
                    fieldInterface.inputTextFill(
                        rule.fieldId, listingDetails[key]);
                    break;
                case 'textarea':
                    fieldInterface.textAreaFill(
                        rule.fieldId, listingDetails[key]);
                    break;
                case 'checkbox':
                    fieldInterface.checkBoxesFill(
                        rule.checkboxClass, listingDetails[key]);
                    break;
                case 'radio':
                    fieldInterface.radioFill(
                        rule.radioName, listingDetails[key]);
                    break;
            }
        });
        // Premium App Basic Fields
        let premiumAppRule = validators.premiumAppDetails;
        Object.keys(premiumAppRule).forEach((key) => {
            let rule = premiumAppRule[key];
            switch(rule.type){
                case 'input':
                    fieldInterface.inputTextFill(
                        rule.fieldId, premiumAppDetails[key]);
                    break;
                case 'textarea':
                    fieldInterface.textAreaFill(
                        rule.fieldId, premiumAppDetails[key]);
                    break;
                case 'checkbox':
                    fieldInterface.checkBoxesFill(
                        rule.checkboxClass, premiumAppDetails[key]);
                    break;
                case 'radio':
                    fieldInterface.radioFill(
                        rule.radioName, premiumAppDetails[key]);
                    break;
            }
        });

        // Hardware Add-ons 
        hardwareAddons.fillInnerFields(listingDetails.hardwareAddons);

        // Use Cases
        useCases.showUseCases(listingDetails.useCases); 
    },

    setReadOnlyListing(){
        console.log('Listing is read only');
        let inputs = document.querySelectorAll('input');
        for(let i = 0; i < inputs.length; i++){
            inputs.item(i).disabled = true;
        }

        let textareas = document.querySelectorAll('textarea');
        for(let i = 0; i < textareas.length; i++){
            textareas.item(i).disabled = true;
        }

        let buttons = document.querySelectorAll('button');
        for(let i = 0; i < buttons.length; i++){
            buttons.item(i).disabled = true;
        }

        let fileButtons = document.querySelectorAll('.file-label');
        for(let i = 0; i < fileButtons.length; i++){
            fileButtons.item(i).style.display = 'none';
        }

        let elListingControls = document.getElementById('edit-listing-controls');
        elListingControls.style.display = 'none';
    },

    showDevFoundryNotes(notes){
        let elContainer = document.getElementById('devfoundry-notes-container');

        notes.forEach(note => {
            let newNote = devfoundryNoteTemplate.new(note);
            elContainer.appendChild(newNote);
        });
    },
    
    showListingDetailsTab(){
        // Content
        let elForm = document.getElementById('edit-listing-form');
        let elPaForm = document.getElementById('edit-listing-pa-form');
        let elPLDiv = document.getElementById('preview-listing-div');

        // Tab elements
        let elListingTab = document.getElementById('listing-details-tab');
        let elPATab = document.getElementById('premium-app-details-tab');
        let elPLTab = document.getElementById('preview-listing-tab');

        // Switch tab highlighting
        elListingTab.parentElement.classList.add('is-active');
        elPATab.parentElement.classList.remove('is-active');
        elPLTab.parentElement.classList.remove('is-active');
        

        // Show/Hide sections
        elForm.style.display = '';
        elPaForm.style.display = 'none';
        elPLDiv.style.display = 'none';
    },

    showPremiumAppDetailsTab(){
         // Content
         let elForm = document.getElementById('edit-listing-form');
         let elPaForm = document.getElementById('edit-listing-pa-form');
         let elPLDiv = document.getElementById('preview-listing-div');
 
         // Tab elements
         let elListingTab = document.getElementById('listing-details-tab');
         let elPATab = document.getElementById('premium-app-details-tab');
         let elPLTab = document.getElementById('preview-listing-tab');
 
         // Switch tab highlighting
         elListingTab.parentElement.classList.remove('is-active');
         elPATab.parentElement.classList.add('is-active');
         elPLTab.parentElement.classList.remove('is-active');
         
 
         // Show/Hide sections
         elForm.style.display = 'none';
         elPaForm.style.display = '';
         elPLDiv.style.display = 'none';
    },

    showPreviewListingTab(){
         // Content
         let elForm = document.getElementById('edit-listing-form');
         let elPaForm = document.getElementById('edit-listing-pa-form');
         let elPLDiv = document.getElementById('preview-listing-div');
 
         // Tab elements
         let elListingTab = document.getElementById('listing-details-tab');
         let elPATab = document.getElementById('premium-app-details-tab');
         let elPLTab = document.getElementById('preview-listing-tab');
 
         // Switch tab highlighting
         elListingTab.parentElement.classList.remove('is-active');
         elPATab.parentElement.classList.remove('is-active');
         elPLTab.parentElement.classList.add('is-active');
         
 
         // Show/Hide sections
         elForm.style.display = 'none';
         elPaForm.style.display = 'none';
         elPLDiv.style.display = '';
    },

    showPremiumAppFields(){
        let container = document.getElementById('p-app-premiumAppFields');
        let cb = document.getElementById('cb-p-app-isPremiumApp');
        cb.checked = true;
        container.style.display = '';
    },

    hidePremiumAppFields(){
        let container = document.getElementById('p-app-premiumAppFields');
        let cb = document.getElementById('cb-p-app-isPremiumApp');
        cb.checked = false;
        container.style.display = 'none';
    },

    addHeader(){
        let hero = document.getElementById('hero');
        hero.appendChild(headerTemplate.new());
    },

    setupPreviewWindow(data, origin){
        let previewEl = document.getElementById('preview-listing-iframe');
        let previewWindow = previewEl.contentWindow;

        previewEl.onload = () => {
            previewWindow.postMessage(data, origin);
        }
    },

    reloadPreviewWindow(){
        let previewWindow = document.getElementById('preview-listing-iframe')
                                .contentWindow;
        previewWindow.location.reload();
    }
}