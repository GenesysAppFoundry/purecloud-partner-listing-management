import view from './view.js';
import config from '../config/config.js';

//Load purecloud and create the ApiClient Instance
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

// Create API instances
const contentManagementApi = new platformClient.ContentManagementApi();
const groupsApi = new platformClient.GroupsApi();
const usersApi = new platformClient.UsersApi();

// Globals
let managerGroup = null;
// Id will be taken from query param but will be saved as state after 
// PC Auth
var urlParams = new URLSearchParams(window.location.search);
let workspaceId = urlParams.get('workspaceId');

// Authenticate
// TODO: regional authentication
client.loginImplicitGrant('e7de8a75-62bb-43eb-9063-38509f8c21af', 
                    window.location.href.split('?')[0],
                    {state: workspaceId})
.then((data) => {
    workspaceId = client.authData.state;
    console.log('PureCloud Auth successful.');
    history.pushState({}, '', window.location.href + '?workspaceId=' + workspaceId);

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
 * Initial Setup for the page
 */
function setUp(){
    loadListing();
    view.hideLoader();
}

/**
 * Open the listing document and put info on the fields
 * @param {String} version published version #. If blank open the current saved. 
 */
function loadListing(version){
    contentManagementApi.getContentmanagementWorkspaceDocuments(workspaceId)
    .then((results) => {
        // FIXME: Issue with getting document file. :(

        // TODO: Open version psecific

        console.log(results);
        // Get the document of the curent saved version
        let currentVer = results.entities.find(doc => doc.name == 'current');
        if(!currentVer) throw new Error('Missing the current listing version');

        // Load JSON listing
        // TODO: REGION shiz
        let downloadUri = 'https://api.mypurecloud.com' + 
                        currentVer.downloadSharingUri;
        
        // contentManagementApi.getContentmanagementDocumentContent(currentVer.id, {
        //     disposition: 'inline'
        // })
        // .then((response) => {
        //     console.log(response);
        //     fetch(response.contentLocationUri);
        // })
        // .then((response) => {
        //     console.log(response);
        // });

    })
    .catch(e => console.error(e));
}