(function () {

    'use strict';

    function homeRoute($routeProvider) {
        $routeProvider
            .when("/:pageNumber", {
                templateUrl : "parts/home/home.html",
                controller: "homeController",
                controllerAs: '$ctrl'
            });
    }

    angular.module('home')
        .config(homeRoute);

})();
