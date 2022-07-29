import { msalInstance, scopes } from "../auth_config"

// Hawaii's REST endpoint. Replace if running as hosted through AppService/SWA
const REST_ENDPOINT = "https://localhost:5001";

// Helpers
const rest_request_base = async (url, options, returnResponse = false) => {
    // Acquire token on a per request basis
    const activeAccount = await msalInstance.getActiveAccount();
    try {
        // Try to acquire a token and add it to the Authorization header
        const tokenResponse = await msalInstance.acquireTokenSilent({ account: activeAccount, scopes: scopes });
        options.headers = { ...options.headers, "Authorization": `Bearer ${tokenResponse.accessToken}` };
    } catch (error) {
        // No active account/user is not logged in
    }
    
    try {
        const response = await fetch(url, options);
        if (returnResponse) {
            return response;
        } else {
            if (response.ok) {
                // if valid response, try to return json response data
                try {
                    return await response.json()
                } catch (err) { // response.json() errors on empty result
                    return response;
                }
            } else {
            // otherwise, unauthorized response or a server error
                console.log(`error response. status: ${response.status}`);
                throw response;
            }
        }
    } catch (fetchError) {
        if (fetchError instanceof TypeError) {
            // can't fetch the resource, usually due to a network error
            console.log(`Could not fetch url: ${url}. Check if Hawaii is running.`);
        }
        throw fetchError;
    }
}

const get_request_base = async (url, headers, returnResponse = false) => {
    return await rest_request_base(url, {
        method: 'GET',
        headers: headers
    }, returnResponse);
}

const post_request_base = async (url, headers, body, returnResponse = false) => {
    return await rest_request_base(url, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }, returnResponse);
}

const patch_request_base = async (url, headers, body, returnResponse = false) => {
    return await rest_request_base(url, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }, returnResponse);
}

const delete_request_base = async (url, headers, returnResponse = false) => {
    return await rest_request_base(url, {
        method: 'DELETE',
        headers: headers
    }, returnResponse);
}


export const rest_functions = {
    // Article utilities
    get_all_articles: async (verbose) => {
        // Conditionally query the article table or a view of article, author, and status tables combined
        const url = `${REST_ENDPOINT}/Article` + (verbose ? "Detailed" : "") + "?$orderby=published";
        const data = await get_request_base(url,
        {
        'X-MS-API-ROLE': 'anonymous'
        });
        return data != null && data != undefined ? data.value : data;
    },
    get_my_articles: async (verbose) => {
        const url = `${REST_ENDPOINT}/Article` + (verbose ? "Detailed" : "") + "?$orderby=published";
        const data = await get_request_base(url,
            {
            'X-MS-API-ROLE': 'authenticated',
        });
        return data != null && data != undefined ? data.value : data;
    },
    create_article: async (titleInput, bodyInput, status = 1) => {
        const activeAccount = await msalInstance.getActiveAccount();
        const data = await post_request_base(`${REST_ENDPOINT}/Article`, {},
            {
                "title": titleInput,
                "body": bodyInput,
                "status": status,
                "author_id": activeAccount.idTokenClaims.oid
            });
        return data != null && data != undefined ? data.value : data;
    },
    update_article: async (articleID, newTitle, newBody, newStatus) => {
        const data = await patch_request_base(`${REST_ENDPOINT}/Article/id/${articleID}`, {},
            {
                "title": newTitle,
                "body": newBody,
                "status": newStatus,
                "published": new Date().toISOString()
            });
        return data != null && data != undefined ? data.value : data;
    },
    update_article_status: async (articleID, newStatus) => {
        const response = await patch_request_base(`${REST_ENDPOINT}/Article/id/${articleID}`, {},
            {
                "status": newStatus,
                "published": new Date().toISOString()
            });
        return response;
    },
    delete_article: async (articleID) => {
        return await delete_request_base(`${REST_ENDPOINT}/Article/id/${articleID}`);
    },
    // User utilities
    get_or_create_user: async () => {
        // check if user already exists (is guid in users table)
        const user_data = await get_request_base(`${REST_ENDPOINT}/User`);

        // if empty/user not yet in db, return post request response object
        if (user_data == undefined || user_data == null || (Array.isArray(user_data.value) && user_data.value.length == 0)) {
            const activeAccount = await msalInstance.getActiveAccount();
            return await post_request_base(`${REST_ENDPOINT}/User`, {},
                {
                    "guid": activeAccount.idTokenClaims.oid,
                    "fname": activeAccount.name.split(' ')[0],
                    "lname": activeAccount.name.split(' ')[1],
                    "email": activeAccount.username
                }, true);
        } else {
            // else return user info that's already in db
            return user_data;
        }
    },
    get_user: async () => {
        const data = await get_request_base(`${REST_ENDPOINT}/User`);
        return data != null && data != undefined ? data.value[0] : {};
    },
    update_user: async (userID, fname, lname, email) => {
        // conditionally add update fields if non-null
        const fnameField = { "fname": fname }
        const lnameField = { "lname": lname }
        const emailField = { "email": email }
        const body = {
            ...(fname != null && fnameField),
            ...(lname != null && lnameField),
            ...(email != null && emailField)
        };
        const data = await patch_request_base(`${REST_ENDPOINT}/User/guid/${userID}`, {}, body);
        return data != null && data != undefined ? data.value : data;
    },
    delete_user: async (userID) => {
        return await delete_request_base(`${REST_ENDPOINT}/User/guid/${userID}`);
    }

}


