/**
 * View module for the listing-review page
 */
import validators from '../../config/validators.js';

let useCaseTemplate = document.createElement('template');
useCaseTemplate.innerHTML = 
`
<div class="use-case">
    <div>
        <p class="listing-key">Title</p>
        <p class="use-case-title"></p>
    </div>
    <div>
        <p class="listing-key">Summary</p>
        <p class="use-case-summary"></p>
    </div>
    <div>
        <p class="listing-key">Business Benefits</p>
        <p class="use-case-benefits"></p>
    </div>
</div>
`;

function fillBasicFields(listingDetails){
    // Fill the basic normal boring fields
    Object.keys(validators.listingDetail).forEach((key) => {
        let rule = validators.listingDetail[key];

        let elLabel = document.querySelectorAll(`#${rule.fieldId}`);

        // Only fill fields that are actually availble in the card
        if(elLabel.length > 0){
            elLabel[0].innerText = listingDetails[key];
        }
    })
}

function fillHardwareAddons(listingDetails){
    // Fill the hardware special field
    let hardwareAddons = listingDetails.hardwareAddons;
    let elHardwareAddonsContainer = document.getElementById('hardware-addons-container');

    // Hide if no hardware add-ons
    if(hardwareAddons.regions.length <= 0){
        elHardwareAddonsContainer.style.display = none;
    }

    // Fill all region values
    hardwareAddons.regions.forEach(hw => {
        let elHWContainer = elHardwareAddonsContainer
                            .querySelectorAll(`#${hw}-hardware-addon`)[0];
        // Show field
        elHWContainer.style.display = 'block';

        // Fill the URLs
        let elPurchaseURL = 
            elHWContainer.querySelectorAll(`#${hw}-purchase-url`)[0];
        let elFirmwareURL = 
            elHWContainer.querySelectorAll(`#${hw}-firmware-url`)[0];

        elPurchaseURL.innerText = hardwareAddons.URLs[hw].purchase;
        elFirmwareURL.innerText = hardwareAddons.URLs[hw].firmware;
    })
}

function fillUseCases(listingDetails){
    let useCases = listingDetails.useCases;
    let elContainer = document.getElementById('use-cases-container');
    if(useCases.length <= 0){
        elContainer.style.display = 'none';
    }

    useCases.forEach(uc => {
        let elUseCase = document.importNode(useCaseTemplate.content, true);
        let elTitle = elUseCase.querySelectorAll('.use-case-title')[0];
        let elSummary = elUseCase.querySelectorAll('.use-case-summary')[0];
        let elBenefits = elUseCase.querySelectorAll('.use-case-benefits')[0];

        elTitle.innerText = uc.title;
        elSummary.innerText = uc.useCaseSummary;
        elBenefits.innerText = uc.businessBenefits;


        elContainer.appendChild(elUseCase);
    })
}

function fillAttachments(attachments){
    // Company Logo
    let elCompanyLogo = document.getElementById('companyLogo-attachment');
    let elCompanyLogoLink = elCompanyLogo.querySelectorAll('a')[0];
    elCompanyLogoLink.href = attachments.companyLogo.sharingUri;
    elCompanyLogoLink.innerText = attachments.companyLogo.sharingUri;

    // Screenshots
    let elScreenshots = document.getElementById('screenshots-attachment');
    Object.keys(attachments).forEach(key => {
        if(key.startsWith('screenshots')){
            let containerDiv = document.createElement('div');
            let newLink = document.createElement('a');

            newLink.href = attachments[key].sharingUri;
            newLink.innerText = attachments[key].sharingUri;
            newLink.target = '_blank';

            containerDiv.appendChild(newLink);
            elScreenshots.appendChild(containerDiv);
        }
    });

    // Brochure
    let elBrochure= document.getElementById('brochure-attachment');
    let elBrochureLink = elBrochure.querySelectorAll('a')[0];
    elBrochureLink.href = attachments.brochure.sharingUri;
    elBrochureLink.innerText = attachments.brochure.sharingUri;
}

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

        fillBasicFields(listingDetails);
        fillHardwareAddons(listingDetails);
        fillUseCases(listingDetails);
        fillAttachments(attachments);
    }
}