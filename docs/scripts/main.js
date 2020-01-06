import view from './view.js';
import config from '../config/config.js';

//Load purecloud and create the ApiClient Instance
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

// Create API instances
const contentManagementApi = new platformClient.ContentManagementApi();
const groupsApi = new platformClient.GroupsApi();

// Globals
let managerGroup = null;

// Authenticate
// TODO: regional authentication
client.loginImplicitGrant('e7de8a75-62bb-43eb-9063-38509f8c21af', 
                        'http://localhost:8080/index.html')

// Get the id of the managers group and assign 
.then(() => {
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
})
.then((result) => {
    if(result.total > 0){
        managerGroup = result.results[0];
    } else {
        throw new Error('Manager group not found');
    }
    
    return contentManagementApi.getContentmanagementWorkspaces({
        'pageSize': 100,
        'access': ['content']
    });
})
.then((workspaces) => {
    // Display workspaces that are listings
    let listings = workspaces.entities
                    .filter(ws => ws.name.startsWith(config.prefix));
    view.showListings('listing-cards-container', listings);

    // Additional elements to DOM
    view.addModalsToDocument();
})
.catch((e) => {
    console.error(e);
});

/**
 * Create a new listing workspace
 * @param {String} listingName 
 */
function createNewListing(listingName){
    // Create the workspace for the listing
    contentManagementApi.postContentmanagementWorkspaces({
        name: config.prefix + listingName
    })
    // Add group as member of workspace
    .then((workspace) => {
        return contentManagementApi.putContentmanagementWorkspaceMember(
            workspace.id,
            managerGroup.id,
            {
                "memberType": "GROUP"
            }
        );
    })
    .then(() => {
        console.log("Assigned group to workspace.");
    })
    .catch(e => console.error(e));
}

function showListingDeletionModal(id){
    view.showYesNoModal('Delete Listing', 
    'Are you sure you want  to delete this listing?',
    function(){
        contentManagementApi.deleteContentmanagementWorkspace(id)
        .then(() => {
            console.log('Deleted workspace.');
            view.hideYesNoModal();
        })
        .catch(e => console.error(e));
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

