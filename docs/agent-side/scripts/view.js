import listingInteractionTemplate from './templates/listing-interaction.js';
import headerTemplate from './templates/header.js';

const elLoader = document.getElementById('interactions-loader');
const elLoaderText = elLoader.querySelectorAll('.loader-text');
const elListingContainer = 
    document.getElementById('listing-interactions-container');
const elNoInteractionsText = document.getElementById('no-interactions-notif');

let funcs = {
    /**
     * Add an listing interaction box to the document
     * @param {Object} serializedData serialized info contains the info 
     * about the converstaion and listing
     * @param {Function} assignToAgentCb callback when assign to me is pressed
     */
    addInteractionBox(serializedData, assignToAgentCb){
        // If an interaction has invalid details and the partner 
        // data table and lsitings can't be reach, just ignore it.
        // Interaction is still in queue but uh, let's take care of that later.
        // TODO:
        if(!serializedData) return;

        funcs.hideBlankInteractionsMsg();

        let elContainer = document.getElementById('listing-interactions-container');
        let newBox = listingInteractionTemplate.new(serializedData, assignToAgentCb);
        
        if(newBox){
            elContainer.appendChild(newBox);
        }
    },

    /**
     * Hide an interaction box when user assigns it to agent
     * @param {String} id 
     */
    hideInteractionBox(id){
        document.getElementById(id).style.display = 'none';
    },

    /**
     * Shows the loader/spinner in the page
     * @param {String} text Loading Text
     */
    showListingLoader(text){
        elLoader.style.display = 'block';
        elListingContainer.style.display = 'none';

        elLoaderText.textContent = text ? text : 'Loading...';
    },

    /**
     * Hide the loader/spinner
     */
    hideListingLoader(){
        elLoader.style.display = 'none';
        elListingContainer.style.display = 'block';
    },

    /**
     * Removes all Email panels from the container
     */
    clearEmailContainer(){
        while(elListingContainer.firstChild) {
            elListingContainer.firstChild.remove();
        }
    },
    
    /**
     * Show message that informs that there are no available emails
     */
    showBlankInteractionsMsg(){
        elNoInteractionsText.style.display = 'block';
    },

    /**
     * Hide message that informs that there are no available emails
     */
    hideBlankInteractionsMsg(){
        elNoInteractionsText.style.display = 'none';
    },

    addHeader(){
        let hero = document.getElementById('hero');
        hero.appendChild(headerTemplate.new());
    }
}

export default funcs