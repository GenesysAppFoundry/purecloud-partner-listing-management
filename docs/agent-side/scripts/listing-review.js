import modal from '../../components/main.js';
import config from '../../config/config.js';
import partnerAccess from './partner-access.js';
import view from './view-listing-review.js';

//Load purecloud and create the ApiClient Instance
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;
client.setPersistSettings(true, 'listing_management');

// Create API instances
const usersApi = new platformClient.UsersApi();
const notificationsApi = new platformClient.NotificationsApi();
const architectApi = new platformClient.ArchitectApi();
const analyticsApi = new platformClient.AnalyticsApi();
const conversationsApi = new platformClient.ConversationsApi();

// Global
let user = {};
let listingAttributes = {};
let listingInteraction = null;

function setUp(){    
    partnerAccess.setup(client, platformClient, user);

    return verifyInteractionHandling()
    .then((attrs) => {
        listingAttributes = attrs;

        return partnerAccess.getListingDetails(
            listingAttributes.org,
            listingAttributes.environment,
            listingAttributes.dataTableId,
            listingAttributes.listingId
        );
    })
    .then((listingInfo) => {
        view.setupPreviewWindow({
            listingDetails: listingInfo.listingDetails,
            premiumAppDetails: listingInfo.premiumAppDetails,
            listingRowAttachments: listingInfo.attachments
        }, config.root);

        view.fillAppDetails(listingInfo);
        view.showListingDetailsTab();

        // If not premium app don't show the tabs at all
        let isPremiumApp = listingInfo.premiumAppDetails._isPremiumApp;
        if(isPremiumApp){
            view.showPremiumAppTab();
        }else{
            view.hidePremiumAppTab();
        }

        setupEventHandlers();
    })
    .catch((e) => console.error(e));
}

function verifyInteractionHandling(){
    return conversationsApi.getConversations()
    .then((result) => {
        let conversations = result.entities;
        console.log(conversations);

        // Get the listing interaction
        listingInteraction = conversations.find((conversation) => {
            try{
                let participants = conversation.participants;
                if(participants[0].purpose == 'customer' &&
                        participants[0].attributes.listingId){
                    return true;
                }
            }catch(e){
                console.error(e);
                return false;
            }
        });
        
        if(!listingInteraction){
            modal.showInfoModal(
                'Hmm',
                'You don\'t have any listing requests assigned to you.',
                () => {
                    window.location.href = config.agent.redirectUriBase;
                }
            )
        }

        let participants = listingInteraction.participants;
        let agentParticipant = participants.find(p => p.purpose == 'agent');
        let state = agentParticipant.emails[0].state;

        // Make sure that agent actulaly accepted the email interaction
        if(state == 'alerting'){
            modal.showInfoModal(
                'Please Accept',
                'Please answer the interaction before proceeding. \n' +
                'Press Ok after you\'ve accepted',
                () => {
                    location.reload();
                }
            )
        }

        // Promise to block the flow when it's not actually connected
        return new Promise((resolve, reject) => {
            if(state == 'connected'){
                resolve(participants[0].attributes);
            }
        });
    })
}

function approveListing(){
    modal.showLoader('Approving this Request...');

    partnerAccess.updateListingStatus(
        listingAttributes.org,
        listingAttributes.environment,
        listingAttributes.dataTableId,
        listingAttributes.listingId,
        'APPROVED'
    )
    .then(() => {
        let agentParticipant = listingInteraction.participants
                                .find(p => p.purpose == 'agent');

        // Disconnect the interaction
        return conversationsApi.patchConversationParticipant(
            listingInteraction.id,
            agentParticipant.id,
            {
                "wrapup": {
                   "code": config.agent.wrapup.approve
                },
                "state": "disconnected"
            }
        )
    })
    .then(() => {
        modal.hideLoader();
        modal.showInfoModal(
            'Success',
            'You approval was successful!',
            () => {
                window.location.href = config.agent.redirectUriBase;
            }
        );
    })
    .catch(e => console.error(e));
}

function rejectListing(){
    modal.showLoader('Rejecting this Request...');
    let comments = document.getElementById('devfoundry-comment');
    partnerAccess.updateListingStatus(
        listingAttributes.org,
        listingAttributes.environment,
        listingAttributes.dataTableId,
        listingAttributes.listingId,
        'FOR_REVISION',
        comments.value
    )
    .then(() => {
        let agentParticipant = listingInteraction.participants
                                .find(p => p.purpose == 'agent');

        // Disconnect the interaction
        return conversationsApi.patchConversationParticipant(
            listingInteraction.id,
            agentParticipant.id,
            {
                "wrapup": {
                   "code": config.agent.wrapup.reject
                },
                "state": "disconnected"
            }
        )
    })
    .then(() => {
        modal.hideLoader();
        modal.showInfoModal(
            'Success',
            'Sending of rejection and comments successful!',
            () => {
                window.location.href = config.agent.redirectUriBase;
            }
        );
    })
    .catch(e => console.error(e));
}

function setupEventHandlers(){
    // Preview Listing Iframe load the src
    document.getElementById('preview-listing-iframe').src = 
        config.root + '/components/listing-preview/index.html';

    // Tabs
    document.getElementById('listing-details-tab')
        .addEventListener('click', function(){
            view.showListingDetailsTab();
        });

    document.getElementById('premium-app-details-tab')
        .addEventListener('click', function(){
            view.showPremiumAppDetailsTab();
        });
    
    document.getElementById('preview-listing-tab')
        .addEventListener('click', function(){
            view.showPreviewListingTab();
        });

    // Final Decision
    let btnApprove = document.getElementById('btn-approve-listing');
    let btnReject = document.getElementById('btn-reject-listing');

    btnApprove.addEventListener('click', function(){
        approveListing();
    });

    btnReject.addEventListener('click', function(){
        rejectListing();
    });
}

view.addHeader();
// Authenticate
client.loginImplicitGrant(config.agent.clientId, window.location.href)
// Login
.then(() => {
    modal.setup();
    console.log('PureCloud Auth successful.');

    modal.showLoader('Setting you up');
    return usersApi.getUsersMe();
})    
// Get User
.then((me) => {
    user = me;

    return setUp();
})
.then(() => {
    modal.hideLoader();
})
.catch((e) => {
    console.error(e);
});