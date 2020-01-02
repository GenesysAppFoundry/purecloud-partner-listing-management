//Load purecloud and create the ApiClient Instance
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;
// Create API instance
var authorizationApi = new platformClient.AuthorizationApi();

// Authenticate
client.loginImplicitGrant('e7de8a75-62bb-43eb-9063-38509f8c21af', 
                        'http://localhost:8080/index.html')
.then(function(){
// Make request to GET /api/v2/authorization/permissions
    console.log('asd');
    return authorizationApi.getAuthorizationPermissions();
})
.catch(function(response) {
    // Handle failure response
    console.log(`${response.status} - ${response.error.message}`);
    console.log(response.error);
});