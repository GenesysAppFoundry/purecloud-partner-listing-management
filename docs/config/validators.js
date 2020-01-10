/**
 * This will contain all the validation rules for the fields
 */
export default {
    listingDetail: {
        name: {
            fieldId: "app-name",
            type: "input",
            maxChar: 20, 
            required: true,
            message: "Required Field. App name should be 20 characters or less."
        },
        platforms: {
            fieldId: "app-platforms",
            type: "checkbox", 
            min: 1,
            message: "Please select at least 1."
        },
        vendorName: {
            fieldId: "app-vendorName",
            type: "input", 
            required: true,
            message: "Required Field."
        },
        vendorWebSite: {
            fieldId: "app-vendorWebSite",
            type: "input", 
            required: true,
            format: 'website',
            message: "Invalid website."
        },
        vendorEmail: {
            fieldId: "app-vendorEmail",
            type: "input", 
            required: true,
            format: 'email',
            message: "Invalid email."
        },
        tagLine: {
            fieldId: "app-tagLine",
            type: "input", 
            required: true,
            maxChar: 100,
            message: "Required. 100 characters or less."
        },
        shortDescription: {
            fieldId: "app-shortDescription",
            type: "textarea", 
            required: true,
            maxChar: 250,
            message: "Required. 250 characters or less."
        },
        fullDescription: {
            fieldId: "app-fullDescription",
            type: "textarea", 
            required: true,
            maxChar: 2500,
            message: "Required. 2500 characters or less."
        },
        videoURL: {
            fieldId: "app-videoURL",
            type: "input", 
            format: 'website',
            message: "Invalid URL."
        },
        helpDocumentation: {
            fieldId: "app-helpDocumentation",
            type: "input", 
            format: 'website',
            message: "Invalid URL."
        },
        languages: {
            fieldId: "app-appLanguages",
            type: "checkbox", 
            min: 1,
            message: "Select at least 1."
        },
        industries: {
            fieldId: "app-industries",
            type: "checkbox", 
            min: 1,
            message: "Select at least 1."
        },
        // TODO: sellingParty
        licensingClassifications: {
            fieldId: "app-licensingClassifications",
            type: "checkbox", 
            min: 1,
            message: "Select at least 1."
        },
        appPermissions: {
            fieldId: "app-appPermissions",
            type: "input", 
            message: ""
        },
        attestations: {
            fieldId: "app-attestations",
            type: "checkbox", 
            message: "Select at least 1."
        },
        appType: {
            fieldId: "app-appType",
            type: "checkbox", 
            min: 1,
            message: "Select at least 1."
        },
        pricing: {
            fieldId: "app-pricing",
            type: "textarea", 
            required: true,
            message: "Required."
        },
    }
}