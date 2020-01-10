import view from './view.js';
import config from '../config/config.js';
import blankCoreListingJSON from '../config/core-listing-blank.js';

//Load purecloud and create the ApiClient Instance
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

// Create API instances
const contentManagementApi = new platformClient.ContentManagementApi();
const groupsApi = new platformClient.GroupsApi();
const usersApi = new platformClient.UsersApi();
const notificationsApi = new platformClient.NotificationsApi();
const architectApi = new platformClient.ArchitectApi();

// Globals
let managerGroup = null;
let listingDataTable = null;

// Authenticate
// TODO: regional authentication
client.loginImplicitGrant('e7de8a75-62bb-43eb-9063-38509f8c21af', 
                        window.location.href.split('?')[0])
.then(() => {
    console.log('PureCloud Auth successful.');

    // Add modals to DOM
    view.addModalsToDocument();

    view.showLoader('Please wait...');
    return setUp(); 
})
.then(() => {
    view.hideLoader();
})    
.catch((e) => {
    console.error(e);
});

/**
 * Setup the the page and all authentication and data required
 */
function setUp(){
    // Get the id of the managers group and assign 
    return groupsApi.postGroupsSearch({
        "query": [
            {
                "fields": ["name"],
                "value": config.prefix,
                "operator": "AND",
                "type": "STARTS_WITH"
            }
        ]
    })
    .then((result) => {
        if(result.total > 0){
            console.log('Group detected.');
            managerGroup = result.results[0];
        } else {
            throw new Error('Manager group not found');
        }
        
        return checkUserAccess();
    })
    .then(userHasAccess => {
        if(!userHasAccess) alert('You don\'t have access to the group.');
        // TODO: Page that will provide access to the group workspace

        console.log('User has access to group.');

        // Check and store a reference to the data table for listings
        return architectApi.getFlowsDatatables({
            pageSize: 100
        });
    })
    .then((results) => {
        listingDataTable = results.entities.find(
                        (dt) => dt.name.startsWith(config.prefix));

        if(listingDataTable){
            console.log('Data table detected.');
        } else {
            throw new Error('Data Table not found');
        }

        // Display workspaces that are listings
        return reloadListings();
    })
    .catch((e) => {
        console.error(e);
    });
}

/**
 * Check if user is part of the group for workspace access.
 */
function checkUserAccess(){
    return usersApi.getUsersMe({
        'expand': ['groups']
    })
    // Check if user is included in app group
    .then((user) => user.groups.map(g => g.id).indexOf(managerGroup.id) >= 0)
    .catch(e => console.error(e));
}

/**
 * Get current listing workspaces to display to page
 */
function reloadListings(){
    view.showLoader('Loading listings...');

    return architectApi.getFlowsDatatableRows(listingDataTable.id, {
        pageSize: 100,
        showbrief: false
    })
    .then((rows) => {
        let listings = rows.entities;
        view.showListings('listing-cards-container', listings);

        console.log('Listed all listings');

        view.hideLoader();
    })
    .catch((e) => {
        console.error(e);
    });
}

/**
 * Create a new listing workspace
 * @param {String} listingName 
 */
function createNewListing(listingName){
    view.hideCreationModal();
    view.showLoader('Creating listing...')

    let newWorkspaceId = null;

    // Create the workspace for the listing
    contentManagementApi.postContentmanagementWorkspaces({
        name: config.prefix + listingName
    })
    .then((workspace) => {
        newWorkspaceId = workspace.id;

        // Add group as member of workspace
        return contentManagementApi.putContentmanagementWorkspaceMember(
            newWorkspaceId,
            managerGroup.id,
            {
                "memberType": "GROUP"
            }
        );
    })
    .then((document) => {   
        console.log('Added group as member of workspace.');

        // Determine the last id of the latest listing
        return architectApi.getFlowsDatatableRows(listingDataTable.id, {
            pageSize: 100,
            showbrief: true
        })
    })
    .then((results) => {
        // NOTE: If all listings are deleted id'ing will restart to 1.
        // Will fix when it actually arrives, too edge case.
        let version = 1;

        // Get the highest id value then use the next one for the new listing
        if(results.entities.length > 0){
            let maxId = results.entities.reduce((max, current) => {
                let currentId = parseInt(current.key); 
                return (currentId > max) ? currentId : max;
            }, 1);

            version = maxId + 1;
        } 

        // Create the JSON for the app listing details
        let jsonInfo = blankCoreListingJSON;
        jsonInfo.name = listingName;

        // Create the new row for the new listing
        return architectApi.postFlowsDatatableRows(listingDataTable.id, {
            key: version.toString(),
            listingDetails: JSON.stringify(jsonInfo),
            premiumAppDetails: '',
            workspaceId: newWorkspaceId
        });
    })
    .then(() => {
        console.log('Listing created.')

        view.hideLoader();
        return reloadListings();
    })
    .catch(e => console.error(e));
}

/**
 * Delete the listing - it's entry on the data table and the
 * assosciated workspae
 * @param {String} id data table id of the listing
 */
function deleteListing(id){
    view.showLoader('Deleting listing...');

    // Get the workspace info
    architectApi.getFlowsDatatableRow(listingDataTable.id, id, {
        showbrief: false
    })
    .then((row) => {
        let workspaceId = row.workspaceId;

        // Delete the workspace
        return contentManagementApi.deleteContentmanagementWorkspace(workspaceId);
    })
    .then(() => {
        console.log('Deleted workspace.');

        // Delete the row from the dat table
        return architectApi.deleteFlowsDatatableRow(listingDataTable.id, id)
    })
    .then(() => {
        console.log('Deleted the listing row.');

        view.hideYesNoModal();
        view.hideLoader();
        
        return reloadListings();
    })
    .catch(e => console.error(e));
}

/**
 * Set up a channel to listen to workspace events.
 * Will be used to know if a document has finished uploading.
 * @param {String} workspaceId 
 * @param {Function} onmessage callback function for each event
 */
function setupWorkspaceNotifications(workspaceId, onmessage){
    notificationsApi.postNotificationsChannels()
    .then((channel) => {
        let webSocket = new WebSocket(channel.connectUri);
        webSocket.onmessage = onmessage;

        let topic = `contentmanagement.workspaces.${workspaceId}.documents`;
        let body = [{id: topic}];
        return notificationsApi.putNotificationsChannelSubscriptions(channel.id, body);
    })
}

/**
 * Display the modal confirmation for deleting a listing
 * @param {String} id workspaceId 
 */
function showListingDeletionModal(id){
    view.showYesNoModal('Delete Listing', 
    'Are you sure you want  to delete this listing?',
    function(){
        deleteListing(id);
    },
    function(){
        view.hideYesNoModal();
    })
}


// Global exposition
window.createNewListing = createNewListing;
window.showListingDeletionModal = showListingDeletionModal;

window.showCreationModal = view.showCreationModal;
window.hideCreationModal = view.hideCreationModal;

