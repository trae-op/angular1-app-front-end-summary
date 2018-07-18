(function () {
    'use strict';

    angular.module('app', [
        'ngRoute',
        'ngSanitize',
        'ngStorage',
        'facebook',
        'google-signin',
        'activation',
        'header',
        'home',
        'front',
        'page',
        'shared'
    ]).run(authRun);


  function authRun($http, $log, $localStorage, mainAuthorizationService) {

    // Dirty check for already loggined user.
    if (mainAuthorizationService.checkAuthorization()) {
      $http.defaults.headers.common.Authorization = $localStorage.Authorization;
    }

  }


})();
