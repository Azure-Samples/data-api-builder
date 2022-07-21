import { msalInstance } from "../auth_config"

// Helpers
const rest_request_base = async (url, options, returnResponse = false) => {
    return fetch(url, options).then(async response => {
        if (response.ok) {
            // by default return json data, optionally return full response object
            try {
                return returnResponse ? response : await response.json();
            } catch (err) {
                console.log('No response content to parse - remember to pass returnResponse option.');
                return response;
            }
        } else {
            // fetch resolves but with an unsuccessful status code
            throw response;
        }
    }).catch(error => {
        try {
            error.json().then(body => {
                // if error is well-formed, display here
                console.log(body);
            }).catch(err => {
                console.log(`status: ${error.status}, empty error message`)
            })
        } catch (err) {
            console.log(`Could not fetch url: ${url}. Check if Hawaii is running.`);
        }
    });
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
        headers: headers,
        body: JSON.stringify(body)
    }, returnResponse);
}

const patch_request_base = async (url, headers, body, returnResponse = false) => {
    return await rest_request_base(url, {
        method: 'PATCH',
        headers: headers,
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
    get_all_articles: async (accessToken, verbose) => {
        // Conditionally query the article table or a view of article, author, and status tables combined
        const url = "https://localhost:5001/Article" + (verbose ? "Detailed" : "") + "?$orderby=published";
        const data = await get_request_base(url,
        {
            'X-MS-API-ROLE': 'anonymous',
            'Authorization': `Bearer ${accessToken}`
        });
        return data != null && data != undefined ? data.value : data;
    },
    get_my_articles: async (accessToken, verbose) => {
        const url = "https://localhost:5001/Article" + (verbose ? "Detailed" : "") + "?$orderby=published";
        const data = await get_request_base(url, {
            'X-MS-API-ROLE': 'authenticated',
            'Authorization': `Bearer ${accessToken}`
        });
        return data != null && data != undefined ? data.value : data;
    },
    create_article: async (accessToken, titleInput, bodyInput, status = 1) => {
        const activeAccount = await msalInstance.getActiveAccount();
        const data = await post_request_base("https://localhost:5001/Article",
            {
                'X-MS-API-ROLE': accessToken == null ? 'anonymous' : 'authenticated',
                'Authorization': accessToken == null ? null : `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            {
                "title": titleInput,
                "body": bodyInput,
                "status": status,
                "author_id": activeAccount.idTokenClaims.oid
            });
        return data != null && data != undefined ? data.value : data;
    },
    update_article: async (accessToken, articleID, newTitle, newBody, newStatus) => {
        const data = await patch_request_base(`https://localhost:5001/Article/id/${articleID}`,
            {
                'X-MS-API-ROLE': accessToken == null ? 'anonymous' : 'authenticated',
                'Authorization': accessToken == null ? null : `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            {
                "title": newTitle,
                "body": newBody,
                "status": newStatus,
            });
        return data != null && data != undefined ? data.value : data;
    },
    update_article_status: async (accessToken, articleID, newStatus) => {
        const response = await patch_request_base(`https://localhost:5001/Article/id/${articleID}`,
        {
            'X-MS-API-ROLE': accessToken == null ? 'anonymous' : 'authenticated',
            'Authorization': accessToken == null ? null : `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        {
            "status": newStatus,
            "published": new Date().toISOString().slice(0, -1)
        }, true);
        return response.ok ? response : new Error();
    },
    delete_article: async (accessToken, articleID) => {
        const response = await delete_request_base(`https://localhost:5001/Article/id/${articleID}`,
            {
                'X-MS-API-ROLE': accessToken == null ? 'anonymous' : 'authenticated',
                'Authorization': accessToken == null ? null : `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }, true);
        return response.ok ? response : new Error();
    },
    // User utilities
    get_or_create_user: async (accessToken) => {
        // check if user already exists (is guid in users table)
        const user_data = await get_request_base("https://localhost:5001/User", {
            'X-MS-API-ROLE': accessToken == null ? 'anonymous' : 'authenticated',
            'Authorization': accessToken == null ? null : `Bearer ${accessToken}`
        });
        console.log(user_data);

        // if empty/user not yet in db, return post request response object
        if (user_data == undefined || user_data == null || (Array.isArray(user_data.value) && user_data.value.length == 0)) {
            const activeAccount = await msalInstance.getActiveAccount();
            return await post_request_base("https://localhost:5001/User",
                {
                    'X-MS-API-ROLE': accessToken == null ? 'anonymous' : 'authenticated',
                    'Authorization': accessToken == null ? null : `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
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
    update_user: async (accessToken, userID, fname, lname, email) => {
        const data = await patch_request_base(`https://localhost:5001/User/guid/${userID}`,
            {
                'X-MS-API-ROLE': accessToken == null ? 'anonymous' : 'authenticated',
                'Authorization': accessToken == null ? null : `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            {
                "fname": fname,
                "lname": lname,
                "email": email
            });
        return data != null && data != undefined ? data.value : data;
    },
    delete_user: async (accessToken, userID) => {
        const data = await delete_request_base(`https://localhost:5001/User/guid/${userID}`,
            {
                'X-MS-API-ROLE': accessToken == null ? 'anonymous' : 'authenticated',
                'Authorization': accessToken == null ? null : `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            });
        return data != null && data != undefined ? data.value : data;
    }

}


