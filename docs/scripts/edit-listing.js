import view from './view.js';
import config from '../config/config.js';
import validators from '../config/validators.js';
import assignValidator from './util/assign-validator.js';

//Load purecloud and create the ApiClient Instance
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

// Create API instances
const contentManagementApi = new platformClient.ContentManagementApi();
const groupsApi = new platformClient.GroupsApi();
const usersApi = new platformClient.UsersApi();
const architectApi = new platformClient.ArchitectApi();

// Globals
let managerGroup = null;
// Id will be taken from query param but will be saved as state after 
// PC Auth
var urlParams = new URLSearchParams(window.location.search);

// Globals
let listingId = urlParams.get('id');
let listingDataTable = null

// Authenticate
// TODO: regional authentication
client.loginImplicitGrant('e7de8a75-62bb-43eb-9063-38509f8c21af', 
                    window.location.href.split('?')[0],
                    {state: listingId})
.then((data) => {
    listingId = client.authData.state;
    console.log('PureCloud Auth successful.');
    history.pushState({}, '', window.location.href + '?id=' + listingId);

    // Add modals to DOM
    view.addModalsToDocument();

    view.showLoader('Loading Listing...');
    return setUp(); 
})
.then(() => {
    view.hideLoader();
})    
.catch((e) => {
    console.error(e);
});

/**
 * Initial Setup for the page
 */
function setUp(){
    return getListingDataTable()
    .then(() => {
        return loadListing();
    })
    .then(() => {
        assignValidators();
    });
}

/**
 * Open the listing document and put info on the fields
 */
function loadListing(){
    let listingDetails = {};

    return architectApi.getFlowsDatatableRow(listingDataTable.id, listingId, {
        showbrief: false
    })
    .then((listingRow) => {
        console.log(listingRow);
        listingDetails = JSON.parse(listingRow.listingDetails);

        view.fillEditListingFields(listingDetails);
    })
}

function saveListing(){
    // TODO:
}

/**
 * Get and store the reference to the data table for listings
 */
function getListingDataTable(){
    return architectApi.getFlowsDatatables({
        pageSize: 100
    })
    .then((results) => {
        listingDataTable = results.entities.find(
                        (dt) => dt.name.startsWith(config.prefix));

        if(listingDataTable){
            console.log('Data table detected.');
        } else {
            throw new Error('Data Table not found');
        }
    })
}

/**
 * Loop through the rules defined in config/validators.js
 * and attach the event listeners that will respond to the validation.
 */
function assignValidators(){
    console.log('asd')
    // Listing Details
    let listingDetails = validators.listingDetail;
    Object.keys(listingDetails).forEach((key) => {
        assignValidator(listingDetails[key]);
    });

    // Premium App
    // TODO:
}