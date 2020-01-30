import validators from '../../../config/validators.js';

let t = document.createElement('template');
t.innerHTML =
`
<div class="listing-info">
  <button type="button" class="collapsible applisting-name"></button>
  <div class="listing-container">
    <label class="listing-key">
        Name: 
    </label> 
    <label class="app-name"></label>
    <br>
    <label class="listing-key">
        Platforms: 
    </label>
    <label class="app-platforms"></label>
    <br>
    <label class="listing-key">
        Vendor Name: 
    </label>
    <label class="app-vendorName"></label>
    <br>
    <label class="listing-key">
        Vendor Website:
    </label>
    <label class="app-vendorWebSite"></label>
    <br>
    <label class="listing-key">
        Vendor Email:
    </label>
    <label class="app-vendorEmail"></label>
    <br>
    <label class="listing-key">
        Tagline:
    </label>
    <label class="app-tagLine"></label>
    <br>
    <label class="listing-key">
        Short Description:
    </label>
    <label class="app-shortDescription"></label>
    <br>
    <label class="listing-key">
        Full Description:
    </label>
    <label class="app-fullDescription"></label>
    <br>
    <label class="listing-key">
        Video URL:
    </label>
    <a href class="app-videoURL"></a>
    <br>
    <label class="listing-key">
        Help Documentation:
    </label>
    <a href class="app-helpDocumentation"></a>
    <br>
    <label class="listing-key">
        App Languages:
    </label>
    <label class="app-appLanguages"></label>
    <br>
    <label class="listing-key">
        Industries:
    </label>
    <label class="app-industries"></label>
    <br>
    <label class="listing-key">
        Selling Party:
    </label>
    <label class="app-sellingParty"></label>
    <br>
    <label class="listing-key">
        Licensing Classifications: 
    </label>
    <label class="app-licensingClassifications"></label>
    <br>
    <label class="listing-key">
        App Permissions:
    </label>
    <label class="app-appPermissions"></label>
    <br>
    <label class="listing-key">
        Attestations:
    </label>
    <label class="app-attestations"></label>
    <br>
    <label class="listing-key">
        App Type:
    </label>
    <label class="app-appType"></label>
    <br>

    <div class="button-container">
      <button class="button" id="btn-approve">Approve!</button>
    </div>
  </div>      
</div>
</div>
`;

export default {
    new(listingInfo){
        let el = document.importNode(t.content, true);

        // Add the org name + listing name
        let headerEl = el.querySelectorAll('.applisting-name')[0];
        headerEl.innerText = 
            `${listingInfo.orgName} - ${listingInfo.listingDetails.name}`;

        // Use validators info to fill the information to make it automated
        // and easier in the future - as we won't have to modify this
        // file if there would be changes to the fields 
        // (ie automated code = less manual work = less potential bugs)
        Object.keys(validators.listingDetail).forEach((key) => {
            let rule = validators.listingDetail[key];

            // We're using the fieldId as class instead.
            let elLabel = el.querySelectorAll(`.${rule.fieldId}`);

            // Only fill fields that are actually availble in the card
            if(elLabel.length > 0){
                elLabel[0].innerText = listingInfo.listingDetails[key];
            }
        })


        // Handle the collapsible behavior
        let elListingInfo = el.querySelectorAll('.listing-info')[0];

        let coll = el.querySelectorAll('.collapsible')[0];
        coll.addEventListener('click', function(){
            this.classList.toggle('active');
            let content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });

        return el;
    },

    /**
     * Add an email box to the document
     * @param {Object} emailData contains the email information
     */
    addEmailBox(emailData){
        // Add the email box to the DOM
        let emailView = document.importNode(emailBoxTemplate.content, true);
        let emailViewElement = emailView.firstChild;
        emailViewElement.id = emailData.conversationId;
        emailContainer.appendChild(emailView);

        // Get references to dynamic elements
        let senderName = emailViewElement.getElementsByClassName('sender-name')[0];
        let senderEmail = emailViewElement.getElementsByClassName('sender-email')[0];
        let emailDuration = emailViewElement.getElementsByClassName('email-duration')[0];
        let emailSubject = emailViewElement.getElementsByClassName('email-subject')[0];
        let emailBody = emailViewElement.getElementsByClassName('email-body')[0];
        let btnAssign = emailViewElement.getElementsByClassName('btn-assign')[0];
        
        // Assign values
        senderName.textContent = emailData.senderName ? emailData.senderName : null;
        senderEmail.textContent = emailData.senderEmail ? emailData.senderEmail : null;
        emailDuration.textContent = emailData.emailDuration ? emailData.emailDuration : null;
        emailSubject.textContent = emailData.emailSubject ? emailData.emailSubject : null;
        emailBody.textContent = emailData.emailBody ? emailData.emailBody : null;

        // Assign onlcick action to button
        btnAssign.setAttribute('onclick', 
            'assignEmailToAgent(' + 
                `"${emailData.conversationId}",` +
                `"${emailData.acdParticipant}",` +
            ')'); 
    },

    /**
     * Hide an email box when user assigns it to agent
     * @param {String} id 
     */
    hideEmailBox(id){
        document.getElementById(id).style.display = 'none';
    },

    /**
     * Shows the loader/spinner in the page
     * @param {String} text Loading Text
     */
    showLoader(text){
        loader.style.display = 'block';
        emailContainer.style.display = 'none';

        loaderText.textContent = text ? text : 'Loading...';
    },

    /**
     * Hide the loader/spinner
     */
    hideLoader(){
        loader.style.display = 'none';
        emailContainer.style.display = 'block';

    },

    /**
     * Removes all Email panels from the container
     */
    clearEmailContainer(){
        while(emailContainer.firstChild) {
            emailContainer.firstChild.remove();
        }
    },
    
    /**
     * Show message that informs that there are no available emails
     */
    showBlankEmails(){
        noEmailText.style.display = 'block';
    },

    /**
     * Hide message that informs that there are no available emails
     */
    hideBlankEmails(){
        noEmailText.style.display = 'none';
    },
};