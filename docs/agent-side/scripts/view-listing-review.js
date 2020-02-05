/**
 * View module for the listing-review page
 */
import validators from '../../config/validators.js';

export default {
    fillAppDetails(listingInfo){
        console.log(listingInfo);
        let listingDetails = listingInfo.listingDetails;
        let attachments = listingInfo.attachments;
        let premiumAppDetails = listingInfo.premiumAppDetails;

        // Fill genesys info details
        let elGenDetails = document.querySelectorAll('#genesys-details')[0];
        elGenDetails.innerText = 
                    `${listingInfo.orgName} (${listingInfo.environment})`; 

        // Fill the basic normal boring fields
        Object.keys(validators.listingDetail).forEach((key) => {
            let rule = validators.listingDetail[key];

            let elLabel = document.querySelectorAll(`#${rule.fieldId}`);

            // Only fill fields that are actually availble in the card
            if(elLabel.length > 0){
                elLabel[0].innerText = listingInfo.listingDetails[key];
            }
        })

        // Fill the hardware special field
    }
}