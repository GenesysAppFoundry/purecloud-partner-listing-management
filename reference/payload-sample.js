let sample = {
    "name": "Listing Name",

    // CHECKBOX
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

    // CHECKBOX
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
    "sellingParty": "Geneys AppFoundry, Genesys Reseller, AppFoundry Vendor, Genesys Professional Services",

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
            }
        }
    },

    "pricing": "Pricing here",

    // DYNAMIC
    "useCases": [
        {
            "title": "",
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
        "appIcon": null,

        "applicationSettings": {
            "defaultApplicationURL":  "link",

            // DYNAMIC up to 3
            "permissions": [],

            // RADIO
            "applicationLocation": [
                "Directory menu",
                "Performance menu",
                "Apps menu",
                "Sidecar (aka Widget Panel)"
            ],

            // ATTACHMENT
            "hostedAppIcon": null,

            // RADIO
            "grantType": "Code Authorization OR Implicit Grant",

            "TOS_URL": "link",

            // OPTIONAL FIELDS
            "faq": "url",
            "privacyPolicy": "url",
            "supportContact": "url or URI",
            "salesContact": "url or uri",
            "additionalHelp": "url",
        }
    }
}