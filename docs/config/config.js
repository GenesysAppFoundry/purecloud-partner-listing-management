// const root = "https://genesysappfoundry.github.io/purecloud-partner-listing-management";
const root = "http://localhost:8080";

export default {    
    clientIDs: {        
        'mypurecloud.com': 'e7de8a75-62bb-43eb-9063-38509f8c21af'
    },

    "root": root,
    "redirectUriBase": `${root}/partner-side/`,
    "globalAssetsURL": `${root}/assets/`,

    // PureCloud assigned name for the premium app
    // This should match the integration type name of the Premium App
    // TODO:
    "appName": "premium-app-example",

    // Default Values for fail-safe/testing. Shouldn't have to be changed since the app
    // must be able to determine the environment from the query parameter 
    // of the integration's URL
    "defaultPcEnv": "mypurecloud.com",
    "defaultLangTag": "en-us",

    // Permissions required for running the Wizard App
    "setupPermissionsRequired": ['admin'],

    // To be added to names of PureCloud objects created by the wizard
    "prefix": "APPFOUNDRY_LISTING_MGMT_",
    //"prefix": "APPFOUNDRY_LISTING_MGMT_",

    // These are the PureCloud items that will be added and provisioned by the wizard
    "provisioningInfo": {
        "roles": [
            {
                "name": "manager",
                "description": "Generated role for access to the app.",
                "permissionPolicies": [
                    {
                        "domain": "integration",
                        "entityName": "examplePremiumApp",
                        "actionSet": ["*"],
                        "allowConditions": false
                    },
                    {
                        "domain": "architect",
                        "entityName": "datatable",
                        "actionSet": ["*"]
                    }
                ]
            }
        ],
        "groups": [
            {
                "name": "managers",
                "description": "People that will have acess to the Listing Info Workspce.",
            }
        ],
        "appInstances": [],
        "oauth": [
            {
                "name": "manager",
                "description": "Generated Client",
                "roles": ["manager"],
                "authorizedGrantType": "CLIENT_CREDENTIALS"
            }
        ],
        "dataTables": [
            {
                "name": "Listings",
                "description": "Contains the details of your app listings.",
                "referenceKey": "id",
                "customFields": [
                    {
                        "name": "status",
                        "type": "string",
                        "default": "IN_PROGRESS"
                    },
                    {
                        "name": "businessInformation",
                        "type": "string",
                        "default": "{}"
                    },
                    {
                        "name": "listingDetails",
                        "type": "string",
                        "default": "{}"
                    },
                    {
                        "name": "premiumAppDetails",
                        "type": "string",
                        "default": "{}"
                    },
                    {
                        "name": "workspaceId",
                        "type": "string"
                    },
                    {
                        "name": "attachments",
                        "type": "string",
                        "default": "{}"
                    },
                    {
                        "name": "devFoundryNotes",
                        "type": "string",
                        "default": "[]"
                    },
                    {
                        "name": "placeholder1",
                        "type": "string"
                    },
                    {
                        "name": "placeholder2",
                        "type": "string"
                    },
                    {
                        "name": "placeholder3",
                        "type": "string"
                    },
                ]
            }
        ] 
    },

    // For the Cheat Chat API
    "cheatChat": {
        "organizationId": "1f86c618-0d8d-4f10-9893-aeacc5a158b0",
        "deploymentId": "7102e7b2-2b12-4bb0-b90b-2aaf70b52831"
    },

    "agent": {
        // Redirect Uri
        "redirectUriBase": `${root}/agent-side/`,

        // Implicit Grant Client Id
        "clientId": "73be3dbd-183f-48d2-a7f6-34bb30f65f56",

        // Data Table where the org credentials are
        "dataTableId": "dbf3ce0b-89f1-42c9-87fd-94b873340710",

        // Queue for the cherry picking
        "queueId": "ace341f9-3a5e-4753-883f-8360e30081f2",

        // WRAP UP CODES
        "wrapup": {
            "approve": "b225be2f-11da-4b87-8cea-04a094d27f12",
            "reject": "dbff2cf8-d7f2-44c4-80ea-90a3c3974368"
        },

        // DATA ACTIONS
        "dataActions": {
            // The Data Action that requests token via Client Credentials Grant
            "authentication": "custom_-_f0a8629e-5500-4873-b8c2-655c45ecf65e",
            "getListing": "custom_-_842677c3-cebf-4248-9fa9-1ab66337135a",
            "updateListing": "custom_-_364f11ca-27a0-46bb-8ba4-13d70dee80f4"
        }
    }
};