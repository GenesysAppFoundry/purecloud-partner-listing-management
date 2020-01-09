import config from '../../config/config.js';

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
            <div class="listing-description">
                Description of Listing
            </div>
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
    new(dataTableRow){
        let el = document.importNode(t.content, true);

        let appDetails = JSON.parse(dataTableRow.listingDetails);

        // Name
        let listingNameEl = el.querySelectorAll('.listing-name')[0];
        listingNameEl.innerText = appDetails.name;

        // Description
        let listingDescEl = el.querySelectorAll('.listing-description')[0];
        listingDescEl.innerText = 
            appDetails.shortDescription ? appDetails.shortDescription : '';

        // Delete Button
        let btnDelete = el.querySelectorAll('.btn-delete-listing')[0];
        btnDelete.onclick = function(){
            showListingDeletionModal(dataTableRow.key);
        };

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