/**
 * This module is the controller for all things that agent needs to
 * read/do in the partner orgs
 */

import agentConfig from './config.js';

let pcClient = null;
let platformClient = null;
let architectApi = null;
let integrationsApi = null;

export default {
    setup(client, platform){
        pcClient = client;
        platformClient = platform;

        architectApi = new platformClient.ArchitectApi();
        integrationsApi = new platformClient.IntegrationsApi();
    },

    /**
     * Request a token to to access the partner org. Note that this requests
     * a new token everytime it's called.
     * TODO: Optimization to store valid token.
     * @param {String} orgName thirdpartname of pc org
     * @param {String} environment eg mypurecloud.com
     */
    getAccessToken(orgName, environment){
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
}