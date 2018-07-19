
(function () {

  'use strict';

  function activationUserRouter($routeProvider) {
    $routeProvider
      .when("/account_activation", {
        templateUrl : "parts/activation-user/activation.user.html",
        controller: "activationUserController",
        controllerAs: '$ctrl'
      });
  }

  angular.module('activation')
    .config(activationUserRouter);

})();
