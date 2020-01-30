import infoModal from './modals/info-modal.js';
import newListingModal from './modals/new-listing-modal.js';
import yesNoModal from './modals/yes-no-modal.js';
import loadingModal from './modals/loading-modal.js';

export default {
    setup(){
        const newListingModalEl = newListingModal.new();
        const newYesNoModalEl = yesNoModal.new();
        const loadingModalEl = loadingModal.new();
        const infoModalEl = infoModal.new();

        document.body.appendChild(newListingModalEl);
        document.body.appendChild(newYesNoModalEl);
        document.body.appendChild(loadingModalEl);
        document.body.appendChild(infoModalEl);
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

    showInfoModal(title, message, cb){
        infoModal.show(title, message, cb);
    },

    hideInfoModal(){
        infoModal.hide();
    }
}