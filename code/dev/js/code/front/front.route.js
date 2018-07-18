(function () {

    'use strict';

    function frontRoute($routeProvider) {
        $routeProvider
            .when("/resume/:id", {
                templateUrl : "parts/front/front.html",
                controller: "frontController",
                controllerAs: '$ctrl'
            });
    }

    angular.module('front')
        .config(frontRoute);

})();
