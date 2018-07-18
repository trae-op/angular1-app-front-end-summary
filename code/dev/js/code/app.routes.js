(function () {

    'use strict';

    function mainRoute($routeProvider, FacebookProvider, GoogleSigninProvider) {

        FacebookProvider.init('184315939079210');

        GoogleSigninProvider.init({
            client_id: '292952671581-2auml32hp866cn11v30e5ncvesvp4hi7.apps.googleusercontent.com',
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
