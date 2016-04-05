/**
 * Created by abuddenberg on 3/28/16.
 */
Drupal = {};

// Request Facebook credentials for the user
//
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Drupal.requestCredential = function (options, credentialRequestCompleteCallback) {
    // support both (options, callback) and (callback).
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({service: 'drupal'});
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(
            new ServiceConfiguration.ConfigError());
        return;
    }

    var credentialToken = Random.secret();

    var scope = "basic";
    if (options && options.requestPermissions)
        scope = options.requestPermissions.join(',');

    var loginStyle = OAuth._loginStyle('drupal', config, options);

    var loginUrl =
        config.drupal_url + '/oauth2/authorize?' +
        'response_type=code' +
        '&client_id=' + config.clientId +
        '&redirect_uri=' + OAuth._redirectUri('drupal', config) +
        '&scope=' + scope +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl);

    OAuth.launchLogin({
        loginService: "drupal",
        loginStyle: loginStyle,
        popupOptions: {width: 868, height: 671},
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken
    });
};