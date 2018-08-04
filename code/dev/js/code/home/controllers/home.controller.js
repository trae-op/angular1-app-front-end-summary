

(function () {
    'use strict';

    function homeController($scope, $log, $routeParams, mainHttpService, popupsService, homeService, mainAuthorizationService, mainOtherService) {
        var $ctrl = this;

        // This is necessary for pagination menu because 'hash' can be different
        $scope.getHash = '#';

      $ctrl.items = [];
      $ctrl.showMessage = false;

        // for the correct "reverse"
        mainHttpService.cacheData = {};

        $ctrl.availableityItems = function () {
          return $ctrl.items && $ctrl.items.length ? true : false;
        };

        mainHttpService.get('headers', function (response) {
            $ctrl.items = _.reverse(response);
            $scope.prevItems = $ctrl.items;

            if (!$ctrl.availableityItems()) {
              $ctrl.showMessage = true;
            }
        });

        $ctrl.loaderCheck = function () {
          return mainOtherService.loader.activateLoader;
        };

        $ctrl.Authorization = function() {
            return mainAuthorizationService.checkAuthorization();
        };

        $ctrl.findMe = function() {
          $ctrl.items = [_.find(mainHttpService.cacheData.headers, { 'creator_email': $ctrl.getUser().email })];
          $scope.prevItems = $ctrl.items;
        };

        $ctrl.getUser = function() {
          return mainAuthorizationService.getUser();
        };

      // Remove User Completely
      $ctrl.removeCompletely = function (header) {
        var dataAvailability = [];
        var message = function (value) {
          if (value) {
            popupsService.messages('Message', {
              data: {
                message: 'User deleted!!!'
              }
            });
          } else {
            popupsService.messages('Message', {
              data: {
                message: 'You can\'t delete a user because the following data is available: "' + dataAvailability.join(', ') +
                '". At first you should be removed the available data then to retry delete user.'
              }
            });
          }
        };
        mainHttpService.get('companies', function (companiesResponse) {
          if (_.filter(companiesResponse, {creator_email: header.creator_email}).length) {
            dataAvailability.push('companies');
          }
          mainHttpService.get('projects', function (projectsResponse) {

            if (_.filter(projectsResponse, {creator_email: header.creator_email}).length) {
              dataAvailability.push('projects');
            }

            mainHttpService.get('scripts', function (scriptsResponse) {
              if (_.filter(scriptsResponse, {creator_email: header.creator_email}).length) {
                dataAvailability.push('scripts');
              }

              mainHttpService.get('abouts', function (aboutsResponse) {
                if (_.filter(aboutsResponse, {creator_email: header.creator_email}).length) {
                  dataAvailability.push('abouts');
                }

                if (dataAvailability.length) {
                  message();
                } else {
                  mainHttpService.deleteById('headers', header._id, function() {
                    mainHttpService.getByEmail('users', header.creator_email, function (userFound) {
                      if (userFound.length) {
                        mainHttpService.deleteById('users', userFound[0]._id, function() {
                          message(true);
                        });
                      } else {
                        message(true);
                      }
                    });

                  });
                }

              });
            });
          });
        });

      };

       
    }

    angular.module('home')
        .controller('homeController', homeController);

})();
