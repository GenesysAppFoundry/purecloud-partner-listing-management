import view from './view.js';
import config from '../config/config.js';
import validators from '../config/validators.js';
import assignValidator from './util/assign-validator.js';
import fieldInterface from './util/field-interface.js';
import hardwareAddons from './special-fields/hardware-addons.js';

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
let listingRow = {};
let listingObject = {};
let listingDataTable = null;
let validatorFunctions = [];

// Add modals to DOM
view.addModalsToDocument();
view.showLoader('Loading Listing...');

// Authenticate
// TODO: regional authentication
client.loginImplicitGrant('e7de8a75-62bb-43eb-9063-38509f8c21af', 
                    window.location.href.split('?')[0],
                    {state: listingId})
.then((data) => {
    listingId = client.authData.state;
    console.log('PureCloud Auth successful.');
    history.pushState({}, '', window.location.href + '?id=' + listingId);
    
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
    // Setup some functionalities of the 'special' fields
    hardwareAddons.setup();

    return getListingDataTable()
    .then(() => {
        return loadListing();
    })
    .then(() => {
        assignValidators();
        assignButtonEventHandlers();
        validateAllFields();
    });
}

/**
 * Open the listing document and put info on the fields
 */
function loadListing(){
    return architectApi.getFlowsDatatableRow(listingDataTable.id, listingId, {
        showbrief: false
    })
    .then((row) => {
        listingRow = row;
        listingObject = JSON.parse(listingRow.listingDetails);

        view.fillEditListingFields(listingObject);
    })
}

/**
 * Validate and then save the listing back to the data table 
 */
function saveListing(){
    // Validate fields first
    if(!validateAllFields()){
        alert('Some fields are incorrenct. Please review.')
        return;
    }

    view.showLoader('Saving Listing...');

    // Build the "normal" fields
    let listingDetails = validators.listingDetail;
    Object.keys(listingDetails).forEach((key) => {
        listingObject[key] = fieldInterface.getFieldValue(
                                    listingDetails[key].type, 
                                    listingDetails[key].fieldId);
    });

    // Build the Hardware Addons Field
    listingObject.hardwareAddons = hardwareAddons.buildField();

    // Turn the entire thing to string
    listingRow.listingDetails = JSON.stringify(listingObject);
    console.log(listingRow);

    // Save to Data Table
    architectApi.putFlowsDatatableRow(listingDataTable.id, listingRow.key, {
        body: listingRow
    })
    .then(() => {
        console.log("Successfully Saved!");
        view.hideLoader();
    })
    .catch((e) => console.error(e));
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
    // Listing Details
    let listingDetails = validators.listingDetail;
    Object.keys(listingDetails).forEach((key) => {
        validatorFunctions.push(assignValidator(listingDetails[key]));
    });

    // Premium App
    // TODO:
}

/**
 * Assign event handlers to the static buttons
 */
function assignButtonEventHandlers(){
    // Save
    document.getElementById('btn-save')
            .addEventListener('click', function(e){
                e.preventDefault(); // Prevent submitting form
                saveListing();
            });
    
    // Cancel
    document.getElementById('btn-cancel')
            .addEventListener('click', function(e){
                e.preventDefault(); // Prevent submitting form
                window.location.href = config.redirectUriBase;
            });
}

/**
 * Run the validators of all fields, happens at start ofpage
 * and before saving
 */
function validateAllFields(){
    let allValid = true;

    validatorFunctions.forEach((validator) => {
        if(!validator.func.apply(validator.context)){
            allValid = false;
        }
    });

    return allValid;
}