/**
 * This module is the controller for all things that agent needs to
 * read/do in the partner orgs
 */

import agentConfig from './config/config.js';

let pcClient = null;
let platformClient = null;
let architectApi = null;
let integrationsApi = null;

/**
 * Request a token to to access the partner org. Note that this requests
 * a new token everytime it's called.
 * TODO: Optimization to store valid token.
 * @param {String} orgName thirdpartname of pc org
 * @param {String} environment eg mypurecloud.com
 */
function getAccessToken(orgName, environment){
    return new Promise((resolve, reject) => {
        // Get the row where the org creds are
        architectApi.getFlowsDatatableRow(
            agentConfig.dataTableId,
            orgName[0],
            { showbrief: false }
        )
        .then((row) => {
            let cellData = JSON.parse(row[environment]);
            let credentials = cellData[orgName];
            let authHeader = btoa(`${credentials.id}:${credentials.secret}`);
    
            // Run the data action to acquire an access token to partner's org
            return integrationsApi.postIntegrationsActionExecute(
                agentConfig.authenticationActionId,
                {
                    encodedCreds: authHeader
                }
            )
        })
        .then((result) => {
            resolve(result.token);
        })
        .catch(e => reject(e));
    })        
}

export default {
    setup(client, platform){
        pcClient = client;
        platformClient = platform;

        architectApi = new platformClient.ArchitectApi();
        integrationsApi = new platformClient.IntegrationsApi();
    },


    /**
     * Get details of the listing by authenticating with the org
     * and acquiring and processing datatable row details 
     * @param {String} orgName PureCloud thirdpartyorgname 
     * @param {String} environment eg mypurecloud.com 
     * @param {String} dataTableId partner datatable Id
     * @param {String} listingId key of the partner data table for listings 
     */
    getListingDetails(orgName, environment, dataTableId, listingId){
        return new Promise((resolve, reject) => {
            getAccessToken(orgName, environment)
            .then((token) => {
                $.ajax({
                    url: `https://api.mypurecloud.com/api/v2/flows/datatables/${dataTableId}/rows/${listingId}?showbrief=false`,
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "cache-control": "no-cache",
                        "Authorization": `Bearer ${token}`
                    }
                })
                .done((x) => {
                    resolve(x);
                })
                .fail((e) => reject(e));
            })
            .catch(e => reject(e));
        })
    }
}