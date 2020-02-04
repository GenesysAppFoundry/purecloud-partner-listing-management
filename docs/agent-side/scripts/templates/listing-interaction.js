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
      <button class="button" id="btn-approve">Assign to Me</button>
    </div>
    <br>
  </div>      
</div>
</div>
`;

export default {
    new(serializedData){
        let listingInfo = serializedData.listingData;

        // If conversation is already displayed don't do anything anymore.
        let Ellistings = document.getElementsByClassName['listing-info'];
        console.log(Ellistings);
        if(Ellistings){
            for(let i = 0; i < Ellistings.length; i++){
                if(Ellistings.item(i).id == serializedData.conversationId){
                    return null;
                }
            }
        }
        

        // Create the element
        let el = document.importNode(t.content, true);
        let elFirstChild = el.querySelectorAll('.listing-info')[0];
        console.log(serializedData);
        elFirstChild.id = serializedData.conversationId;

        // Add the org name + listing name
        let headerEl = el.querySelectorAll('.applisting-name')[0];
        headerEl.innerText = 
            `${listingInfo.orgName} - ${listingInfo.listingDetails.name}`;
        

        // Use validators to fill info
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
    }
};