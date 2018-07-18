
(function () {

  'use strict';

  function activationUserRouter($routeProvider) {
    $routeProvider
      .when("/activation/:hash", {
        templateUrl : "parts/activation-user/activation.user.html",
        controller: "activationUserController",
        controllerAs: '$ctrl'
      });
  }

  angular.module('activation')
    .config(activationUserRouter);

})();
