/*
*
* The Controller of activation page after get message by email about account activation. In progress.
*
* */

(function () {
  'use strict';

  function activationUserController($scope, $log, $routeParams, mainHttpService, $localStorage, mainAuthorizationService, headersService) {
    var $ctrl = this;

    //$ctrl.routeParams = $routeParams;

    if ($localStorage.temporaryDataUser) {
      var filledUser = {
        name: $localStorage.temporaryDataUser.name,
        email: $localStorage.temporaryDataUser.email,
        password: $localStorage.temporaryDataUser.password,
        uuid: $localStorage.temporaryDataUser.uuid,
        hash: $localStorage.temporaryDataUser.hash
      };

      var filledLogin = {
        email: $localStorage.temporaryDataUser.email,
        password: $localStorage.temporaryDataUser.password,
        rememberMe: true
      };


      mainHttpService.accountActivationUser('activation', filledUser, function (response) {
        $localStorage.temporaryDataUser = false;
        mainHttpService.login('users/login', filledLogin, function (responseLogin) {
          mainHttpService.add('headers', headersService.defaultHeader(getUser().name, getUser().email), function (responseHeaders) {
            $log.info('$localStorage', $localStorage);
            $ctrl.message = 'Your account successfully activated!!!';
          });
        });
      });
    }

    function getUser() {
      return mainAuthorizationService.getUser();
    }

  }

  angular.module('activation')
    .controller('activationUserController', activationUserController);

})();
