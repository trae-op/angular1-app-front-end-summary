(function () {

    'use strict';

    function pageRoute($routeProvider) {
        $routeProvider
            .when("/page/:id/:pageName/:pageNumber", {
                templateUrl : "parts/page/page.html",
                controller: "pageController",
                controllerAs: '$ctrl'
            });
    }

    angular.module('page')
        .config(pageRoute);

})();
