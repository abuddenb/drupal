# abuddenb:drupal

An implementation of the Drupal OAuth2 flow largely derived from [facebook](https://github.com/meteor/meteor/tree/devel/packages/facebook).
Not at all affiliated with MDG and provided with no warranty.

This is not production-quality software and should only be used for reference. At some point in the future, we should
publish a Drupal module to ease deployment on the PHP side. 

## Drupal configuration

You'll need to install and correctly configure the following Drupal modules:

* REST Server
* Services
    - Add -> Server: REST; Path to endpoint: rest; Click "OAuth2 authentication".  
    - Edit Resources -> user -> CRUD operations -> Click "retrieve"; Click "Require authentication". **WARNING!** This will allow **ANY** user with a valid access_token to query **EVERY** user profile in Drupal. We couldn't find a way around this without writing our own module.
* OAuth2
    - Follow directions [here](https://www.drupal.org/node/1938218).


## Meteor configuration

You'll need to create a ServiceConfiguration object:
    
    ServiceConfiguration.configurations.remove({
        service: "drupal"
    });
    
    ServiceConfiguration.configurations.insert({
        service: "drupal",
        clientId: "Your client Id here",
        secret: "Your client secret here",
        drupal_url: https://where.drupal.is,
        drupal_endpoint: rest 
    });
    




