import { msalInstance } from "../auth_config"

// Helpers
const rest_request_base = async (url, options, returnResponse = false) => {
    return fetch(url, options).then(async response => {
        if (response.ok) {
            // by default return json data, optionally return full response object
            return returnResponse ? response : await response.json();
        } else {
            // if fetch resolves but with an unsuccessful status code
            throw response;
        }
    }).catch(error => {
        error.json().then(body => {
            // if error is well-formed, display here
            console.log(body);
        }).catch(err => {
            console.log(`status: ${error.status}, empty error message`)
        })
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
        const url = "https://localhost:5001/Article" + (verbose ? "Detailed" : "");
        const data = await get_request_base(url,
        {
            'X-MS-API-ROLE': 'anonymous',
            'Authorization': `Bearer ${accessToken}`
            //'X-MS-CLIENT-PRINCIPAL': 'eyJhdXRoX3R5cCI6ImFhZCIsImNsYWltcyI6W3sidHlwIjoiYXVkIiwidmFsIjoiYmJmZjhmZGItYzA3My00NDY2LTk0NjMtMTcwNzQ0Y2JkMmUyIn0seyJ0eXAiOiJpc3MiLCJ2YWwiOiJodHRwczpcL1wvbG9naW4ubWljcm9zb2Z0b25saW5lLmNvbVwvMjkxYmYyNzUtZWE3OC00Y2RlLTg0ZWEtMjEzMDlhNDNhNTY3XC92Mi4wIn0seyJ0eXAiOiJpYXQiLCJ2YWwiOiIxNjM3MDQzMjA5In0seyJ0eXAiOiJuYmYiLCJ2YWwiOiIxNjM3MDQzMjA5In0seyJ0eXAiOiJleHAiLCJ2YWwiOiIxNjM3MDQ4MTkzIn0seyJ0eXAiOiJhaW8iLCJ2YWwiOiJBVFFBeVwvOFRBQUFBR2ZcL1cwSTdzdE1yM1lINWlIRnZFU2llMzgrSU5QVCtaZlwvcCtCeVlqVEU1VHNmZVp1ZFwvNWdxcnBCcEMxcVVzRCJ9LHsidHlwIjoiYXpwIiwidmFsIjoiYTkwM2UyZTYtZmQxMy00NTAyLThjYWUtOWUwOWY4NmI3YTZjIn0seyJ0eXAiOiJhenBhY3IiLCJ2YWwiOiIxIn0seyJ0eXAiOiJuYW1lIiwidmFsIjoiU2VhbiJ9LHsidHlwIjoiaHR0cDpcL1wvc2NoZW1hcy5taWNyb3NvZnQuY29tXC9pZGVudGl0eVwvY2xhaW1zXC9vYmplY3RpZGVudGlmaWVyIiwidmFsIjoiOTg3ZmNiZDgtZjA1ZS00MWFiLWFmYzEtN2M2MzRmMTMzZGQ4In0seyJ0eXAiOiJwcmVmZXJyZWRfdXNlcm5hbWUiLCJ2YWwiOiJzZWFuQGxlb25hcmRzZWFubWUub25taWNyb3NvZnQuY29tIn0seyJ0eXAiOiJyaCIsInZhbCI6IjAuQVRZQWRmSWJLWGpxM2t5RTZpRXdta09sWi1iaUE2a1RfUUpGaks2ZUNmaHJlbXcyQUdBLiJ9LHsidHlwIjoiaHR0cDpcL1wvc2NoZW1hcy5taWNyb3NvZnQuY29tXC9pZGVudGl0eVwvY2xhaW1zXC9zY29wZSIsInZhbCI6IkdyYXBoUUwuUmVhZFdyaXRlIn0seyJ0eXAiOiJodHRwOlwvXC9zY2hlbWFzLnhtbHNvYXAub3JnXC93c1wvMjAwNVwvMDVcL2lkZW50aXR5XC9jbGFpbXNcL25hbWVpZGVudGlmaWVyIiwidmFsIjoiQWNfMlZJU1F3bUctZ2lTMkhiMWhFS1F2TEtCQWk5MjNrSzhpSHFKWlVaUSJ9LHsidHlwIjoiaHR0cDpcL1wvc2NoZW1hcy5taWNyb3NvZnQuY29tXC9pZGVudGl0eVwvY2xhaW1zXC90ZW5hbnRpZCIsInZhbCI6IjI5MWJmMjc1LWVhNzgtNGNkZS04NGVhLTIxMzA5YTQzYTU2NyJ9LHsidHlwIjoidXRpIiwidmFsIjoiX3NTUDNBd0JZMFN1Y3VxcUp5akVBQSJ9LHsidHlwIjoidmVyIiwidmFsIjoiMi4wIn1dLCJuYW1lX3R5cCI6Imh0dHA6XC9cL3NjaGVtYXMueG1sc29hcC5vcmdcL3dzXC8yMDA1XC8wNVwvaWRlbnRpdHlcL2NsYWltc1wvbmFtZSIsInJvbGVfdHlwIjoiaHR0cDpcL1wvc2NoZW1hcy5taWNyb3NvZnQuY29tXC93c1wvMjAwOFwvMDZcL2lkZW50aXR5XC9jbGFpbXNcL3JvbGUifQ'
        });
        return data != null && data != undefined ? data.value : data;
    },
    get_my_articles: async (accessToken, verbose) => {
        const url = "https://localhost:5001/Article" + (verbose ? "Detailed" : "");
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
    delete_article: async (accessToken, articleID) => {
        const data = await delete_request_base(`https://localhost:5001/Article/id/${articleID}`,
            {
                'X-MS-API-ROLE': accessToken == null ? 'anonymous' : 'authenticated',
                'Authorization': accessToken == null ? null : `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            });
        return data != null && data != undefined ? data.value : data;
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


