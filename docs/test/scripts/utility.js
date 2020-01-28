const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;
console.log(client);
let token = '';

let contentManagementApi = new platformClient.ContentManagementApi();

client.loginImplicitGrant('e7de8a75-62bb-43eb-9063-38509f8c21af', 
                        'http://localhost:8080/test/utility.html')
.then(() => {
    token = client.authData.accessToken;
    addButtonListeners();
})
.catch((e) => console.error(e));

function addButtonListeners(){
    let btnDelete = document.getElementById('btn-delete');
    let workspaceId = 'd86d10ec-5c6e-4ad4-9563-de071fbad46e';

    // Delete all documents in the workspace. for testing purposes
    btnDelete.addEventListener('click', function(ev){
        contentManagementApi.getContentmanagementWorkspaceDocuments(workspaceId,{
            pageSize: 100
        })
        .then((result) => {
            let promises = [];

            result.entities.forEach((doc) => {
                promises.push(
                    contentManagementApi.deleteContentmanagementDocument(doc.id, {
                        override: true
                    })
                )
            })
            
            return Promise.all(promises);
        })
        .then(() => {
            console.log('deleted all');
        });
    });
}