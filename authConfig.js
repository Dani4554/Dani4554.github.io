const msalConfig = {
    auth:{
        clientId: "3732a3de-1d8f-4e87-bb2c-48fb1f3f0226",

        authority: "https://51dr8kB2C.b2clogin.com/51dr8kB2C.onmicrosoft.com/B2C_1A_progressive_signup_signin",

        knownAuthorities: "51dr8kB2C.b2clogin.com",
        
        redirectUri: "http://localhost:6420"
    },
    cache: {
        cacheLocation: "sessionStorage",

        storeAuthStateInCookie: false
    },
    system: {
        loggerOptions: {
          loggerCallback: (level, message, containsPii) => {
            if (containsPii) {
              return;
            }
            switch (level) {
              case msal.LogLevel.Error:
                console.error(message);
                return;
              case msal.LogLevel.Info:
                console.info(message);
                return;
              case msal.LogLevel.Verbose:
                console.debug(message);
                return;
              case msal.LogLevel.Warning:
                console.warn(message);
                return;
            }
          }
        }
      }
};

const loginRequest = {
    scopes: ["openid", ...apiConfig.b2cScopes],
  };
  

  const tokenRequest = {
    scopes: [...apiConfig.b2cScopes],  // e.g. ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"]
    forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
  };