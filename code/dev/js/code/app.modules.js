(function () {
    'use strict';

    angular.module('app', [
        'ngRoute',
        'ngSanitize',
        'ui.select',
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
