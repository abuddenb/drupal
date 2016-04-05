/**
 * Created by abuddenberg on 3/28/16.
 */

Package.describe({
    name: "abuddenberg:drupal",
    summary: "Drupal OAuth2 flow",
    version: "0.0.1"
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');

    api.use('oauth2', ['client', 'server']);
    api.use('oauth', ['client', 'server']);
    api.use('http', ['server']);
    api.use('templating', 'client');
    api.use('underscore', 'server');
    api.use('random', 'client');
    api.use('service-configuration', ['client', 'server']);

    api.export('Drupal');

    api.addFiles('drupal_server.js', 'server');
    api.addFiles('drupal_client.js', 'client');
});