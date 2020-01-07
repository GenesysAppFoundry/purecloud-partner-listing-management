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

// Authenticate
// TODO: regional authentication
client.loginImplicitGrant('e7de8a75-62bb-43eb-9063-38509f8c21af', 
                        'http://localhost:8080/index.html')
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
