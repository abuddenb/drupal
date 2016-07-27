/**
 * Created by abuddenberg on 3/28/16.
 */

Drupal = {};

OAuth.registerService('drupal', 2, null, function(query) {

    var response = getTokenResponse(query);
    
    // var whitelisted = ['uid', 'name', 'mail', 'timezone', 'language', 'picture', 'roles', 'og_user_node'];
    var whitelisted = ['uid', 'name', 'mail', 'timezone', 'language', 'picture', 'groups'];

    var identity = getUserProfile(response.accessToken);

    var serviceData = {
        id: identity.uid,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: (+new Date) + (1000 * response.expiresIn)
    };

    _.extend(serviceData, _.pick(identity, whitelisted));

    return {
        serviceData: serviceData,
        options: {
            profile: {
                name: identity.name
            }
        }
    };
});

var getTokenResponse = function (query) {
    var config = ServiceConfiguration.configurations.findOne({service: 'drupal'});
    if (!config)
        throw new ServiceConfiguration.ConfigError();

    var responseContent;
    try {
        // Request an access token
        responseContent = HTTP.post(
            config.drupal_url + "/oauth2/token", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Base64.encode(config.clientId + ':' + config.secret)
                },
                data: {
                    grant_type: 'authorization_code',
                    code: query.code,
                    redirect_uri: OAuth._redirectUri('drupal', config)
                }
            }).data;
    } catch (err) {
        console.log(config.drupal_url + "/oauth2/token");
        throw _.extend(new Error("Failed to complete OAuth handshake with Drupal. " + err.message),
            {response: err.response});
    }

    if(!responseContent || !responseContent.access_token) {
        throw new Error("Failed to complete OAuth handshake with Drupal " +
            "-- can't find access token in HTTP response. " + responseContent);
    }

    return {
        accessToken: responseContent.access_token,
        refreshToken: responseContent.refresh_token,
        expiresIn: responseContent.expires_in
    };
};

var getUserProfile = function (accessToken) {
    var config = ServiceConfiguration.configurations.findOne({service: 'drupal'});
    if (!config)
        throw new ServiceConfiguration.ConfigError();

    var userProfile;
    try {
        // var userId = HTTP.get(config.drupal_url + "/oauth2/tokens/" + accessToken).data.user_id;
        //
        // userProfile = HTTP.get(config.drupal_url + "/" + config.drupal_endpoint + "/user/" + userId, {
        //     params: {
        //         access_token: accessToken
        //     }
        // }).data;
        userProfile = HTTP.get(config.drupal_url + "/oauth2/tokens/" + accessToken).data.user;

    } catch (err) {
        throw _.extend(new Error("Failed to fetch user profile from Drupal. " + err.message),
            {response: err.response});
    }

    //If uid is missing, Meteor does unpredictable / bad things.
    if(!userProfile || !userProfile.uid) {
        throw new Error("Failed to fetch user profile from Drupal. " + userProfile);
    }

    return userProfile;
};

Drupal.retrieveCredential = function(credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};