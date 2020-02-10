import validators from '../../../config/validators.js';
import config from '../../../config/config.js';

let t = document.createElement('template');
t.innerHTML =
`
<div class="box">
	<article class="media">
		<div class="media-content">
			<div class="content">
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
                    App Type:
                </label>
                <label class="app-appType"></label>
                <br>

                <div class="button-container">
                    <button class="button btn-approve">Assign to Me</button>
                </div>
			</div>
		</div>
	</article>
</div>
`;

export default {
    new(serializedData, assignToAgent){
        let listingInfo = serializedData.listingData;

        // If conversation is already displayed don't do anything anymore.
        let Ellistings = document.getElementsByClassName('box');
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
        let elFirstChild = el.querySelectorAll('.box')[0];
        console.log(serializedData);
        elFirstChild.id = serializedData.conversationId;        

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

        // Assign to Agent
        let elAssignButton = el.querySelectorAll('.btn-approve')[0];
        elAssignButton.addEventListener('click', function(){
            assignToAgent(serializedData)
            .then(() => {
                window.location.href = config.agent.redirectUriBase +
                                        'listing-review.html';
            })
        });

        return el;
    }
};