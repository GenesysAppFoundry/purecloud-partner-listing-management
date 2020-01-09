export default {
    clientIDs: {        
        'mypurecloud.com': 'e7de8a75-62bb-43eb-9063-38509f8c21af'
    },
    //"redirectUriBase": "https://mypurecloud.github.io/purecloud-premium-app/",
    "redirectUriBase": "http://localhost:8080/",

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
        "oauth": [],
        "dataTables": [
            {
                "name": "Listings",
                "description": "Contains the details of your app listings.",
                "referenceKey": "id",
                "customFields": [
                    {
                        "name": "listingDetails",
                        "type": "string"
                    },
                    {
                        "name": "premiumAppDetails",
                        "type": "string"
                    },
                    {
                        "name": "workspaceId",
                        "type": "string"
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
                    }
                ]
            }
        ] 
    }
};