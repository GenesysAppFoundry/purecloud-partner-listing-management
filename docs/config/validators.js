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
        vendorName: {
            fieldId: "app-vendorName",
            type: "input", 
            required: true,
            message: "Required Field."
        }
    }
}