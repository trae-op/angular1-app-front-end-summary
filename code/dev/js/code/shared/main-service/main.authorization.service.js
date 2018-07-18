
(function () {
    'use strict';

    function mainAuthorizationService($http, $log, $localStorage, Facebook, GoogleSignin) {
      var _this = this;

      _this.firstOnlyLocalStorage = {
        Authorization: undefined,
        user: undefined
      };

      _this.checkRememberMe = function(rememberMe) {
        $localStorage.checkRememberMe = rememberMe;
      };
      _this.checkAuthorization = function() {
        var checkRememberMe = (!$localStorage.checkRememberMe);
        var authFirstOnly = _this.firstOnlyLocalStorage.Authorization;
        var auth = $localStorage.Authorization;
        var checkLocalStorage = checkRememberMe ? authFirstOnly : auth;
        return checkLocalStorage ? true : false;
      };

      _this.addAuthHeaderForAPI = function(token) {
        $localStorage.Authorization = 'Bearer ' + token;
        _this.firstOnlyLocalStorage.Authorization = 'Bearer ' + token;
        $http.defaults.headers.common.Authorization = 'Bearer ' + token;
        $http.defaults.headers.common['Content-Type'] = 'application/json';
      };

      _this.clearAuthHeaderForAPI = function() {
          $localStorage.Authorization = undefined;
          _this.firstOnlyLocalStorage.Authorization = undefined;
          delete $http.defaults.headers.common.Authorization;
      };

      _this.setToken = function(token) {
        if (!token) {
          return;
        }
        $localStorage.Authorization = token;
        _this.firstOnlyLocalStorage.Authorization = token;
      };

      _this.clearUserMyself = function() {
        _this.firstOnlyLocalStorage.user = undefined;
        $localStorage.user = undefined;
      };

      _this.getUser = function() {
         return !$localStorage.checkRememberMe ? _this.firstOnlyLocalStorage.user : $localStorage.user;
      };

      _this.setUserMyself = function(user) {
        delete user.password;
        $localStorage.user = user;
        _this.firstOnlyLocalStorage.user = user;
      };

      _this.authFacebook = function (cb) {
        Facebook.login(function(loginResponse) {
          if (loginResponse.status == 'connected') {
            // For "email, name" fields access is allowed
            Facebook.api('/me', { fields: 'email, name' }, cb);
          } else {
            $log.info('Facebook. User cancelled login or did not fully authorize.');
          }
        }, {scope: 'email'});
      };


      _this.authGoogle = function (cb) {
        GoogleSignin.signIn().then(cb, function (err) {
          $log.info('Google. User cancelled login or did not fully authorize.', err);
        });
      };

    }

    angular
        .module('shared')
        .service('mainAuthorizationService', mainAuthorizationService);

})();
