/**
 * This will contain all the validation rules for the fields
 */

 // TODO: Probably rename the file as it will be generified(?) (used by save listing to build
 // the JSON) and not jsut used for validation
export default {
    listingDetail: {
        name: {
            fieldId: "app-name",
            type: "input",
            maxChar: 20, 
            required: true,
            message: "Required. Maximum of 20 characters."
        },
        platforms: {
            fieldId: "app-platforms",
            type: "checkbox", 
            min: 1,
            message: "Select at least 1."
        },
        vendorName: {
            fieldId: "app-vendorName",
            type: "input", 
            required: true,
            message: "Required."
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
            message: "Required. Maximum of 100 characters."
        },
        shortDescription: {
            fieldId: "app-shortDescription",
            type: "textarea", 
            required: true,
            maxChar: 250,
            message: "Required. Maximum of 250 characters."
        },
        fullDescription: {
            fieldId: "app-fullDescription",
            type: "textarea", 
            required: true,
            maxChar: 2500,
            message: "Required. Maximum of 2500 characters."
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
        appLanguages: {
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
        sellingParty: {
            fieldId: "app-sellingParty",
            type: "radio",
            required: true,
            message: "Required."
        },
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