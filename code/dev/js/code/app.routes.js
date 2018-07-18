(function () {

    'use strict';

    function mainRoute($routeProvider, FacebookProvider, GoogleSigninProvider) {

        // connect with facebook
        FacebookProvider.init('184315939079210');

        // connect with google
        GoogleSigninProvider.init({
            client_id: '607355219083-p7ven3qhii2kijmd1utei3h260ph8dk7.apps.googleusercontent.com',
        });

        $routeProvider
            .otherwise({
              redirectTo: '/1'
                //template : "<h1>None</h1><p>Nothing has been selected</p>"
            });
    }

    angular.
        module('app')
            .config(mainRoute);

})();
