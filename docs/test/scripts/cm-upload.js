const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;
console.log(client);
let token = '';

let contentManagementApi = new platformClient.ContentManagementApi();

client.loginImplicitGrant('e7de8a75-62bb-43eb-9063-38509f8c21af', 
                        'http://localhost:8080/test/cm-upload.html')
.then(() => {
    token = client.authData.accessToken;
    addButtonListeners();
})
.catch((e) => console.error(e));

function addButtonListeners(){
    let btnUpload = document.getElementById('btn-upload');
    let inputUpload = document.getElementById('input-upload'); 

    btnUpload.addEventListener('click', function(ev){
        contentManagementApi.postContentmanagementDocuments({
            name: 'hmm',
            workspace: {
                id: 'd86d10ec-5c6e-4ad4-9563-de071fbad46e'
            }
        })
        .then((result) => {
            let url = result.uploadDestinationUri;
            let file = inputUpload.files[0];
            console.log(file);
    
            var formData = new FormData();
            formData.append("file", file);
    
            return fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `bearer ${token}`
                },
                body: formData
            })
        })
        .then(() => console.log('Success'));
    });
}