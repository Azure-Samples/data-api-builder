import * as msal from "@azure/msal-browser";

const msalConfig = {
    auth: {
        clientId: 'e98794ab-cdaa-4ed3-ad08-0552c47254e2',
    }
};

export const msalInstance = new msal.PublicClientApplication(msalConfig);


export async function acquireToken(setUser, router) {
    msalInstance.acquireTokenSilent({}).then(tokenResponse => {
        console.log(tokenResponse);
        setUser(tokenResponse.account.username);
        router.push("/");
    }).catch(async (error) => {
        if (error.errorCode === "no_account_error") {
            console.log("No active account set, initiate interactive login")
        }
        // fallback to interaction when silent call fails
        msalInstance.acquireTokenPopup({}).then(tokenResponse => {
            console.log(tokenResponse);
            setUser(tokenResponse.account.username);
            msalInstance.setActiveAccount(tokenResponse.account);
            router.push("/");
        }).catch(error => {
            console.log(error);
        });
    });
}