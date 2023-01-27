import * as msal from "@azure/msal-browser";

const msalConfig = {
    auth: {
        clientId: 'e98794ab-cdaa-4ed3-ad08-0552c47254e2',
        authority: 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47',
        redirectUri: '/auth'
    }
};

export const msalInstance = new msal.PublicClientApplication(msalConfig);

export const scopes = [`${msalConfig.auth.clientId}/.default`]

export async function acquireToken() {
    return msalInstance.acquireTokenSilent({ scopes: scopes }).then(tokenResponse => {
        console.log(tokenResponse);
        return tokenResponse;
    }).catch(async (error) => {
        if (error.errorCode === "no_account_error") {
            console.log("No active account set, initiate interactive login")
        } else {
            return error;
        }
        // fallback to interaction when silent call fails
        return msalInstance.acquireTokenPopup({ scopes: scopes }).then(tokenResponse => {
            msalInstance.setActiveAccount(tokenResponse.account);
            return tokenResponse;
        }).catch(error => {
            return error;
        });
    });
}