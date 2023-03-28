const myMSALObj = new msal.PublicClientApplication(msalConfig);

let accountId = "";
let username = "";
let accessToken = null;

myMSALObj.handleRedirectPromise()
    .then(response => {
        if (response){
            if (response.idTokenClaims['tfp'].toUpperCase() === "B2C_1A_progressive_signup_signin".toUpperCase()){
                handleResponse(response);
            }
        }
    })
    .catch(error => {
        console.log(error);
    });

function setAccount(account){
    accountId = account.homeAccountId;
    username = account.username
}

function selectAccount(){

    const currentAccounts = myMSALObj.getAllAccounts();

    if (currentAccounts.length < 1){
        return;
    } else if (currentAccounts.length > 1){

        const accounts = currentAccounts.filter(account =>
            account.homeAccountId.toUpperCase().includes("B2C_1A_progressive_signup_signin".toUpperCase())
            &&
            account.idTokenClaims.iss.toUpperCase().includes("51dr8kB2C.b2clogin.com".toUpperCase())
            &&
            account.idTokenClaims.aud === msalConfig.auth.clientId
            );
        
        if (accounts.length > 1){ 
            if(accounts.every(account => account.localAccountId === accounts[0].localAccountId )){
                setAccount(accounts[0]);
            } else {
                signOut();
            };
        } else if (accounts.length === 1){
            setAccount(accounts[0]);
        }
    } else if (currentAccounts.length === 1){
        setAccount(currentAccounts[0]);
    }
    
}

selectAccount();

async function handleResponse(response) {
    
    if (response !== null) {
        setAccount(response.account);
    } else {
        selectAccount();
    }
}

function signIn() {

    myMSALObj.loginRedirect(loginRequest);

}

function signOut() {

    const logoutRequest = {
        postLogoutRedirectUri: msalConfig.auth.redirectUri,
    };

    myMSALObj.logoutRedirect()
}

function getTokenRedirect(request){
    
    request.account = myMSALObj.getAccountByHomeId(accountId);

    return myMSALObj.acquireTokenSilent(request)
        .then((response) => {

            if(!response.accessToken || response.accessToken === ""){
                throw new msal.InteractionRequiredAuthError;
            } else {
                console.log("access_token acquired at: " + new Date().toString());
                accessToken = response.accessToken;
                passTokenToApi();
            }
        }).catch(error => {
            console.log("Silent token acquisition fails. Acquiring token using popup. \n", error);
            if (error instanceof msal.InteractionRequiredAuthError) {
                return myMSALObj.acquireTokenRedirect(request);
            } else {
                console.log(error);
            }
        });
}

function passTokenToApi() {
    if (!accessToken){
        getTokenRedirect(tokenRequest)
    }else {
        try {
            callApi(apiConfig.webApi, accessToken);
        } catch(error) {
            console.log(error);
        }
    }
}


