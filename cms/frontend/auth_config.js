import * as msal from "@azure/msal-browser";

const msalConfig = {
    auth: {
        clientId: '024a0cba-83d6-4c22-95bf-b64075b4db6d',
        authority: 'https://login.microsoftonline.com/291bf275-ea78-4cde-84ea-21309a43a567',
        redirectUri: 'http://localhost:3000/auth'
    }
};

export const msalInstance = new msal.PublicClientApplication(msalConfig);

export const scopes = ['api://bbff8fdb-c073-4466-9463-170744cbd2e2/REST.EndpointAccess',
    'api://bbff8fdb-c073-4466-9463-170744cbd2e2/GraphQL.ReadWrite']

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
            console.log(tokenResponse);
            msalInstance.setActiveAccount(tokenResponse.account);
            return tokenResponse;
        }).catch(error => {
            return error;
        });
    });
}