/**
 * View module for the listing-review page
 */
import validators from '../../config/validators.js';
import headerTemplate from './templates/header.js';

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

function fillBasicFields(listingDetails, premiumAppDetails){
    // Fill the basic normal boring fields
    Object.keys(validators.listingDetail).forEach((key) => {
        let rule = validators.listingDetail[key];

        let elLabelQ = document.querySelectorAll(`#${rule.fieldId}`);

        // Only fill fields that are actually in the DOM
        if(elLabelQ.length > 0){
            let elLabel = elLabelQ[0];

            elLabel.innerText = listingDetails[key];

            // If link also assign the href
            if(elLabel.tagName == 'A'){
                elLabel.href = listingDetails[key];
            }
        }
    });

    // Fill the basic normal boring fields of premium app
    Object.keys(validators.premiumAppDetails).forEach((key) => {
        let rule = validators.premiumAppDetails[key];

        let elLabelQ = document.querySelectorAll(`#${rule.fieldId}`);

        // Only fill fields that are actually in the DOM
        if(elLabelQ.length > 0){
            let elLabel = elLabelQ[0];

            elLabel.innerText = premiumAppDetails[key];

            // If link also assign the href
            if(elLabel.tagName == 'A'){
                elLabel.href = premiumAppDetails[key];
            }
        }
    });
}

function fillHardwareAddons(listingDetails){
    // Fill the hardware special field
    let hardwareAddons = listingDetails.hardwareAddons;
    let elHardwareAddonsContainer = document.getElementById('hardware-addons-container');

    // Hide if no hardware add-ons
    if(hardwareAddons.regions.length <= 0){
        elHardwareAddonsContainer.style.display = 'none';
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
    if(!attachments.brochure) {
        elBrochure.style.display = 'none';
    } else{
        let elBrochureLink = elBrochure.querySelectorAll('a')[0];
        elBrochureLink.href = attachments.brochure.sharingUri;
        elBrochureLink.innerText = attachments.brochure.sharingUri;
    }

    // Premium App icon
    let elPAppIcon = document.getElementById('premiumAppIcon-attachment');
    if(!attachments.premiumAppIcon){
        elPAppIcon.style.display = 'none';
    }else{
        let elPAppIconLink = elPAppIcon.querySelectorAll('a')[0];
        elPAppIconLink.href = attachments.premiumAppIcon.sharingUri;
        elPAppIconLink.innerText = attachments.premiumAppIcon.sharingUri;
    }
}

export default {
    setupPreviewWindow(data, origin){
        let previewEl = document.getElementById('preview-listing-iframe');
        let previewWindow = previewEl.contentWindow;

        previewEl.onload = () => {
            previewWindow.postMessage(data, origin);
        }
    },

    fillAppDetails(listingInfo){
        console.log(listingInfo);
        let listingDetails = listingInfo.listingDetails;
        let attachments = listingInfo.attachments;
        let premiumAppDetails = listingInfo.premiumAppDetails;

        // Fill genesys info details
        let elGenDetails = document.querySelectorAll('#genesys-details')[0];
        elGenDetails.innerText = 
                `${listingInfo.orgName} (${listingInfo.environment})`; 

        // Fill the fields. aka "Fill"ds
        fillBasicFields(listingDetails, premiumAppDetails);
        fillHardwareAddons(listingDetails);
        fillUseCases(listingDetails);
        fillAttachments(attachments);
    },

    showListingDetailsTab(){
        let elForm = document.getElementById('core-listing-section');
        let elPaForm = document.getElementById('premium-app-section');
        let elPLDiv = document.getElementById('preview-listing-section');
        let elListingTab = document.getElementById('listing-details-tab');
        let elPATab = document.getElementById('premium-app-details-tab');
        let elPreviewTab = document.getElementById('preview-listing-tab');

        elListingTab.parentElement.classList.add('is-active');
        elPATab.parentElement.classList.remove('is-active');
        elPreviewTab.parentElement.classList.remove('is-active');

        elForm.style.display = '';
        elPaForm.style.display = 'none';
        elPLDiv.style.display = 'none';
    },

    showPremiumAppDetailsTab(){
        let elForm = document.getElementById('core-listing-section');
        let elPaForm = document.getElementById('premium-app-section');
        let elPLDiv = document.getElementById('preview-listing-section');
        let elListingTab = document.getElementById('listing-details-tab');
        let elPATab = document.getElementById('premium-app-details-tab');
        let elPreviewTab = document.getElementById('preview-listing-tab');

        elListingTab.parentElement.classList.remove('is-active');
        elPATab.parentElement.classList.add('is-active');
        elPreviewTab.parentElement.classList.remove('is-active');

        elForm.style.display = 'none';
        elPaForm.style.display = '';
        elPLDiv.style.display = 'none';
    },

    showPreviewListingTab(){
        let elForm = document.getElementById('core-listing-section');
        let elPaForm = document.getElementById('premium-app-section');
        let elPLDiv = document.getElementById('preview-listing-section');
        let elListingTab = document.getElementById('listing-details-tab');
        let elPATab = document.getElementById('premium-app-details-tab');
        let elPreviewTab = document.getElementById('preview-listing-tab');

        elListingTab.parentElement.classList.remove('is-active');
        elPATab.parentElement.classList.remove('is-active');
        elPreviewTab.parentElement.classList.add('is-active');

        elForm.style.display = 'none';
        elPaForm.style.display = 'none';
        elPLDiv.style.display = '';
   },

    /**
     * Hide the tabs that switch between core and premium app details
     */
    hidePremiumAppTab(){
        let tabControl = document.getElementById('premium-app-detail');
        tabControl.style.display = 'none';
    },

    /**
     * Shows the tabs that switch between core and premium app details
     * by default the tabs are shown anyway, but you  know
     */
    showPremiumAppTab(){
        let tabControl = document.getElementById('premium-app-detail');
        tabControl.style.display = '';
    },

    addHeader(){
        let hero = document.getElementById('hero');
        hero.appendChild(headerTemplate.new());
    }
}