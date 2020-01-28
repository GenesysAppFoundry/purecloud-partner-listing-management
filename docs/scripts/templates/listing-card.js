import config from '../../config/config.js';
import listingStatus from  '../../config/listing-status.js';

let t = document.createElement('template');
t.innerHTML =
`
<div class="box">
    <article class="media">
    <div class="media-content">
        <div class="content">
        <p>
            Name: <strong><span class="listing-name">
                Listing Name</span></strong> 
            <br>
            Description: <span class="listing-description">
                Description of Listing
            </span>
            <br>
            Status: <span class="listing-status">
                ---
            </span>
        </p>
        </div>
        <div>
            <a class="button is-dark btn-assign btn-edit-listing">
                Edit
            </a>
            <a class="button is-dark btn-assign btn-delete-listing">
                Delete
            </a>
        </div>
    </div>
    </article>
</div>
`;

export default {
    new(dataTableRow, status){
        let el = document.importNode(t.content, true);

        let appDetails = JSON.parse(dataTableRow.listingDetails);

        // Name
        let listingNameEl = el.querySelectorAll('.listing-name')[0];
        listingNameEl.innerText = appDetails.name;

        // Description
        let listingDescEl = el.querySelectorAll('.listing-description')[0];
        listingDescEl.innerText = 
            appDetails.shortDescription ? appDetails.shortDescription : '';

        // Status
        let listingStatusEl = el.querySelectorAll('.listing-status')[0];
        listingStatusEl.innerText = listingStatus[status];

        // Delete Button
        let btnDelete = el.querySelectorAll('.btn-delete-listing')[0];
        // Hide delete button if status is no longer 'in progress'
        if(status != 1){
            btnDelete.style.visibility = 'hidden';
        }else{
            btnDelete.onclick = function(){
                showListingDeletionModal(dataTableRow.key);
            };
        }
        

        // Edit Button
        let btnEdit = el.querySelectorAll('.btn-edit-listing')[0];
        btnEdit.onclick = function(){
            window.location.href = 
                config.redirectUriBase + 
                'edit-listing.html' +
                '?id=' + dataTableRow.key;
        };

        return el;
    }
};;