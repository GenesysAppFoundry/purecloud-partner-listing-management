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
// HTML related calls
    showListings();
    view.addModalsToDocument();
})
.catch((e) => {
    console.error(e);
});

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

function showListings(){
    const containerId = 'listing-cards-container';
    view.showListings(containerId);
}

function showCreationModal(){
    view.showCreationModal();
}

function hideCreationModal(){
    view.hideCreationModal();
}

// Global Assignment
window.createNewListing = createNewListing;
window.showCreationModal = showCreationModal;
window.hideCreationModal = hideCreationModal;
window.showListings = showListings;