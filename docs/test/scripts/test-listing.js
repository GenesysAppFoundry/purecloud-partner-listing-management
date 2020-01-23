const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

const organizationId = 'ee84d286-aa0f-4426-b0a2-0bfef5b4cbe1';
const deploymentId = '372b02c8-fdfe-4bf5-8b5c-5cc4a40fe8ea';

let sample = {
"name": "Listing Name",

"platforms": [
    "purecloud", 
    "pureconnect.premise",
    "pureconnect.cloud",
    "pureengage.premise",
    "pureengage.cloud"
],

"vendorName": "My Company",
"vendorWebSite": "http://www.mycompany.com",
"vendorEmail": "JackBauer@mycompany.com",

"tagLine": "100 Characters Max",
"shortDescription": "250 Characters Max",
"fullDescription": "2500 characters max. MarkDown format.",

"videoURL": "Vimeo or YouTube ONLY",
"helpDocumentation": "http://www.mycompany.com/help",

"appLanguages": [
    "English",
    "Dutch",
    "Spanish",
    "Chinese",
    "French Canadian",
    "French",
    "Australian English",
    "UK Eglish",
    "Hebrew",
    "Hungarian",
    "Mexican Spanish",
    "Norwegian",
    "Romanian",
    "Swedish",
    "Portuguese",
    "Danish",
    "New Zealand English",
    "Euro English"
],
// CHECKBOX
"industries": [
    "healthcare",
    "retail",
    "telco",
    "hospitality",
    "airlines",
    "automotive",
    "high tech",
    "banking"
], // Note: More than 3 will be universal

// RADIO
"sellingParty": "Geneys AppFoundry",

// CHECKBOX
"licensingClassifications": [
    "SIP EP Connector",
    "Agent Connector",
    "3rd Party Media",
    "Advanced Integration",
    "IVR Connector",
    "Enterprise",
    "WFM Connector",
    "Wallboard Connector",
    "Recording Connector"
],

// ARRAY OF STRINGS. DYNAMIC
"appPermissions": [],

//CHECKBOX
"attestations": [
    "HIPPA",
    "GDPR",
    "PCI",
    "SOC 2",
    "HITRUST",
    "ISO 27001",
    "FedRAMP"
],

// CHECKBOX
"appType": [
    "Premium Client",
    "PureCloud Embeddable Framework",
    "Bot",
    "Data Action",
    "IVR Flow"
],

"hardwareAddons": {
    // CHECKBOX
    "regions": [
        "useast",
        "uswest",
        "frankfurt",
        "ireland",
        "japan",
        "australia",
    ],
    // DYNAMIC BASED ON SELECTED REGIONS
    "URLs": {
        "useast": {
            "purchase": "link",
            "firmware": "link"
        },
        "uswast": {
            "purchase": "link",
            "firmware": "link"
        },
        "frankfurt": {
            "purchase": "link",
            "firmware": "link"
        },
        "ireland": {
            "purchase": "link",
            "fir,mware": "link"
        },
        "japan": {
            "purchase": "link",
            "firmware": "link"
        },
        "australia": {
            "purchase": "link",
            "firmware": "link"
        }
    }
},

"pricing": "Pricing here",

// DYNAMIC
"useCases": [
    {
        "title": "Use Case 1",
        "useCaseSummary": "MarkDown Format",
        "businessBenefits": "MarkDown Format"
    },
    {
        "title": "Use Case 2",
        "useCaseSummary": "MarkDown Format",
        "businessBenefits": "MarkDown Format"
    }
],

"appLogoUrl": "link",
"companyLogoUrl": "link",
"screenshots": [
    "link1", "link2", "link3", "link4"
],
"marketingBrochure": "link",

// Attachments
// 1. App or Company Logo (min 144x144 PNG)
// 2. Screenshots (max 4 images) (ration 4:3 min 1024x768 PNG)

/**
 * PREMIUM APP ADDITIONAL FIELDS
 * Installation Card Fields
 */
"premiumApp": {
    "appName": "",
    "appDescription": "",
    "helpUrl": "required",

    // ATTACHMENT
    // Installation App Icon (Admin UI)
    // - SVG Only
    // - Ratio MUST be 1:1 (Ex. 96px x 96px)
    // - Must be transparent background
    "appIcon": "appiconurl",

    "applicationSettings": {
    "defaultApplicationURL":  "link",

    // DYNAMIC up to 3
    "permissions": ["admin", "agent"],

    // RADIO
    "applicationLocation": [
        "Directory menu",
        "Performance menu",
        "Apps menu",
        "Sidecar (aka Widget Panel)"
    ],

    // ATTACHMENT
    "hostedAppIcon": "hostedAppIcon",

    // RADIO
    "grantType": "Code Authorization",

    "TOS_URL": "link",

    // OPTIONAL FIELDS
    "faq": "url",
    "privacyPolicy": "url",
    "supportContact": "url or URI",
    "salesContact": "url or uri",
    "additionalHelp": "url",
    }
}
};

client.loginImplicitGrant('e7de8a75-62bb-43eb-9063-38509f8c21af', 
                        'http://localhost:8080/test.html')
.then(() => {
    assignButtonListener();
})
.catch((e) => console.error(e));

function assignButtonListener(){
    let listingDetails = JSON.stringify(sample);
    console.log(listingDetails);
    console.log(listingDetails.length);

    // Divide the long info into parts
    const cutSize = 999;
    let listingDetailsArr = [];
    let numOfSections = Math.ceil(listingDetails.length / cutSize);
    for(let i = 0; i < numOfSections; i++){
        let str = listingDetails.substr(i * (cutSize - 1), cutSize);
        listingDetailsArr.push(str);
    }

    // Template
    let requestBody = {
        organizationId: organizationId,
        deploymentId: deploymentId,
        memberInfo: { 
          displayName: 'List Man',
          customFields: {
            purpose: 'submit',
          }
        }
    }

    // Add the parts as custom fields
    listingDetailsArr.forEach((part, i) => {
        requestBody.memberInfo
        .customFields[`listingDetails_${i + 1}`] = part;
    })

    console.log(requestBody);

    // Send the thing
    document.getElementById('btn-send-info')
    .addEventListener('click', function(){
        $.ajax({
            url: 'https://api.mypurecloud.com/api/v2/webchat/guest/conversations',
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache"
            },
            data: JSON.stringify(requestBody)
        })
        .done((x) => {
            let websocket = new WebSocket(x.eventStreamUri)
            websocket.onmessage = function(event){
                let data = JSON.parse(event.data);
                console.log(data);
            };
            console.log('sent');
        })
        .fail((e) => console.error(e));
    });
}