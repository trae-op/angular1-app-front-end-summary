
(function () {
    'use strict';

    function mainHttpService($http, $log, $localStorage, popupsService, mainAuthorizationService) {
      var _this = this;
      var cacheDataFirstOnly = false;
      _this.cacheData = {};

      _this.get = function (nameRequest, successCallback) {
        if (!_this.cacheData[nameRequest]) {
          mainRequest('get', [mainUrl() + nameRequest], function (response) {
            _this.cacheData[nameRequest] = response.data;
            successCallback(response.data);
          });       
        } else {
          successCallback(_this.cacheData[nameRequest]);
        } 
      };

      _this.add = function (nameRequest, data, successCallback) {
          mainRequest('post', [mainUrl() + nameRequest, data], function (response) {
            if (nameRequest !== 'users' && _this.cacheData[nameRequest]) {
              _this.cacheData[nameRequest].push(response.data);
            }
            successCallback(response.data);
          });     
      };


      // --->> Registration by email. In progress!!! <<---
      _this.authorization = function (nameRequest, data, successCallback) {
        $localStorage.temporaryDataUser = false;
        mainRequest('post', [mainUrl() + nameRequest, data], function (response) {
          $localStorage.temporaryDataUser = response.data;
          successCallback(response.data);
        });
      };

      // --->> Activation by email. In progress!!! <<---
      _this.accountActivationUser = function (nameRequest, data, successCallback) {
        mainRequest('post', [mainUrl() + nameRequest, data], function (response) {
          successCallback(response.data);
        });
      };

      _this.login = function (nameRequest, data, successCallback) { 

          if (cacheDataFirstOnly) {
            _this.cacheData = cacheDataFirstOnly;
          }

          mainAuthorizationService.checkRememberMe(data.rememberMe);
          delete data.rememberMe;

          mainRequest('post', [mainUrl() + nameRequest, data], function (response) {
            mainAuthorizationService.setToken(response.data.token);
            mainAuthorizationService.addAuthHeaderForAPI(response.data.token);
            mainAuthorizationService.setUserMyself(response.data.user);
            successCallback(response);
          });     
      };

      _this.logout = function () {
        cacheDataFirstOnly = _this.cacheData;
        _this.cacheData = {};
        mainAuthorizationService.clearUserMyself();
        mainAuthorizationService.setToken();
        mainAuthorizationService.clearAuthHeaderForAPI();
        window.location.hash = '/';
      };

      _this.update = function (nameRequest, data, successCallback) {
        mainRequest('put', [mainUrl() + nameRequest, data], function (response) {
          _this.cacheData[nameRequest][cacheIndex(nameRequest, { _id: response.data._id })] = response.data;
          successCallback(response.data);
        });  
      };

      _this.deleteById = function (nameRequest, id, successCallback) {
        mainRequest('delete', [mainUrl() + nameRequest + '/' + id], function (response) {
          _this.cacheData[nameRequest].splice(cacheIndex(nameRequest, { _id: id }), 1);
          successCallback(response.data);
        });  
      };

      _this.getById = function (nameRequest, id, successCallback) {
        _this.get(nameRequest, function (response) {
          successCallback(findByValue(id, '_id', response));
        });
      };

      _this.getByEmail = function (nameRequest, email, successCallback) {
        _this.get(nameRequest, function (response) {
          successCallback(findByValue(email, 'creator_email', response));
        });        
      };

      function cacheIndex(name, data) {
        return _.findIndex(_this.cacheData[name], data);
      }     

      function findByValue(value, prop, collection) {
        return _.filter(collection, JSON.parse('{"' + prop + '":"' + value + '"}'));
      }

      function mainUrl () {
        return window.API_URL + '/';
      }

      function mainRequest(typeRequest, options, successCallback) {
        $http[typeRequest].apply(this, options).then(successCallback).catch(errorCallback);
      }      

      function errorCallback(error) {
          if (error.data) {
              popupsService.messages('error', error.data.message ? error : {
                data: { message: 'status: ' + error.data.statusCode + ', message: ' + error.data.error }
              });
          } else {
              popupsService.messages('error', {data: {message: 'status: ' + error.status}});
          }
      }
    }

    angular
        .module('shared')
        .service('mainHttpService', mainHttpService);

})();
