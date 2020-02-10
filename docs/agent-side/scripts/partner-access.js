/**
 * This module is the controller for all things that agent needs to
 * read/do in the partner orgs
 */

import config from '../../config/config.js';

let pcClient = null;
let platformClient = null;
let architectApi = null;
let integrationsApi = null;
let userMe = '';

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
            config.agent.dataTableId,
            orgName[0],
            { showbrief: false }
        )
        .then((row) => {
            let cellData = JSON.parse(row[environment]);
            let credentials = cellData[orgName];
            let authHeader = btoa(`${credentials.id}:${credentials.secret}`);
    
            // Run the data action to acquire an access token to partner's org
            return integrationsApi.postIntegrationsActionExecute(
                config.agent.dataActions.authentication,
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
    setup(client, platform, user){
        pcClient = client;
        platformClient = platform;
        userMe = user;

        architectApi = new platformClient.ArchitectApi();
        integrationsApi = new platformClient.IntegrationsApi();
    },


    /**
     * Get details of the listing by authenticating with the org
     * and acquiring and processing datatable row details.
     * NOTE: The column values are all parsed to JSON
     * @param {String} orgName PureCloud thirdpartyorgname 
     * @param {String} environment eg mypurecloud.com 
     * @param {String} dataTableId partner datatable Id
     * @param {String} listingId key of the partner data table for listings 
     * @return {Promise} serialized listing details
     */
    getListingDetails(orgName, environment, dataTableId, listingId){
        return new Promise((resolve, reject) => {
            getAccessToken(orgName, environment)
            .then((token) => {             
                return integrationsApi.postIntegrationsActionExecute(
                    config.agent.dataActions.getListing,
                    {
                        token: token,
                        dataTableId: dataTableId,
                        listingId: listingId
                    }
                )
            })
            .then((raw) => {
                let serialized = raw;
                // Serialize so all 'JSON' cells will be parsed as JSON
                Object.keys(serialized).forEach(key => {
                    let val = serialized[key];
                    try {
                        serialized[key] = JSON.parse(val);
                    } catch (e) {
                        serialized[key] = val;
                    }
                });

                // Additional properties to identify listing
                serialized.id = serialized.key;
                serialized.orgName = orgName;
                serialized.environment = environment;

                resolve(serialized);
            })
            .catch(e => reject(e));
        })
    },

    /**
     * Update the Listing Status of a listing
     * @param {String} orgName PureCloud thirdpartyorgname 
     * @param {String} environment eg mypurecloud.com 
     * @param {String} dataTableId partner datatable Id
     * @param {String} listingId key of the partner data table for listings 
     * @param {String} newStatus new status of the listing
     * @param {String} comment additional dev comment for the partner
     */
    updateListingStatus(orgName, environment, dataTableId, listingId, 
                        newStatus, comment){
        let token = '';
        return new Promise((resolve, reject) => {
            getAccessToken(orgName, environment)
            .then((tkn) => {
                token = tkn;

                return integrationsApi.postIntegrationsActionExecute(
                    config.agent.dataActions.getListing,
                    {
                        token: token,
                        dataTableId: dataTableId,
                        listingId: listingId
                    }
                )
            })
            .then((raw) => {
                let updated = raw;
                updated.status = newStatus;
                
                // Add comment if there's one
                if(comment){
                    let dfNotes = JSON.parse(updated.devFoundryNotes);
                    let rightNow = new Date();

                    dfNotes.push({
                        user: userMe.name,
                        timestamp: rightNow.toISOString(),
                        message: comment
                    });

                    updated.devFoundryNotes = JSON.stringify(dfNotes);
                }

                // Build the request body for input to data action
                let requestBody = {
                    token: token,
                    dataTableId: dataTableId,
                    listingId: listingId,
                }
                // Add the listing columns to the request body
                Object.keys(updated).forEach(key => {
                    requestBody[key] = updated[key];
                });

                return integrationsApi.postIntegrationsActionExecute(
                    config.agent.dataActions.updateListing,
                    requestBody
                )
            })
            .then(() => {
                resolve();
            })
            .catch(e => reject(e));
        });
    }
}