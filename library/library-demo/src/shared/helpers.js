export function getXMSClientTokenFromCookie(){
    return document.cookie.split(';').find(c => c.trim().startsWith('StaticWebAppsAuthCookie=')).slice('StaticWebAppsAuthCookie='.length+1, );
}

