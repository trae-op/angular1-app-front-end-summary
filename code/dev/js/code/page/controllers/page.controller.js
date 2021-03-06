

(function () {
    'use strict';

    function pageController($scope, $routeParams, $log, mainHttpService, popupsService, pageService, paginationService, mainAuthorizationService, mainOtherService) {
        var $ctrl = this;

        $ctrl.routeParams = $routeParams;

        $ctrl.showMessage = false;

        $ctrl.items = [];

        // This need for pagination menu because 'hash' can be different
        $scope.getHash = '#/page/' + $ctrl.routeParams.id + '/' + $ctrl.routeParams.pageName;

        $ctrl.availableityItems = function () {
          return $ctrl.items && $ctrl.items.length ? true : false;
        };

        mainHttpService.getById('headers', $ctrl.routeParams.id, function(responseHeader) {
          pageService.creatorEmail = responseHeader[0].creator_email;
          mainHttpService.getByEmail($ctrl.routeParams.pageName, responseHeader[0].creator_email, function(responsePage) {
              $ctrl.items = _.reverse(responsePage);
              $scope.prevItems = $ctrl.items;

              if (!$ctrl.availableityItems()) {
                $ctrl.showMessage = true;
              }
          });
        });

        $ctrl.loaderCheck = function () {
          return mainOtherService.loader.activateLoader;
        };

        $ctrl.getCreatorEmailByHeader = function() {
          return pageService.creatorEmail;
        };

        $ctrl.Authorization = function() {
          return mainAuthorizationService.checkAuthorization();
        };

        $ctrl.getUser = function() {
          return mainAuthorizationService.getUser();
        };

        $ctrl.add = function() {
          if (!$ctrl.items) {
            $ctrl.items = [];
          }

          popupsService.forms({
              title: $ctrl.routeParams.pageName !== 'abouts' ? 'Add' : 'Create',
              fields: pageService.getFields()
          }, function (data) {
              mainHttpService.add($ctrl.routeParams.pageName, pageService.filledData(data), function(response) {
                  $ctrl.items.unshift(response);
                  $scope.prevItems.unshift(response);
                  $ctrl.showMessage = false;
              });
          });
        };

        $ctrl.update = function(currentData, index) {
          popupsService.forms({
              title: 'Update',
              fields: pageService.getFields(currentData)
          }, function (data) {
            var newData = pageService.filledData(data);
            newData._id = currentData._id;
            mainHttpService.update($ctrl.routeParams.pageName, newData, function(response) {
                $ctrl.items[index] = response;
            });
          });
        };

        $ctrl.delete = function(id, index) {
          mainHttpService.deleteById($ctrl.routeParams.pageName, id, function(response) {
              $ctrl.items.splice(index, 1);
              $scope.prevItems.splice(index, 1);
              if (!$ctrl.availableityItems()) {
                $ctrl.showMessage = true;
              }
          });
        };

        $ctrl.changeTitle = function () {
          return {
            allSymbols: function() {
              return _.capitalize($ctrl.routeParams.pageName);
            },
            cutLastSymbol: function() {
              return this.allSymbols().substr(0, this.allSymbols().length - 1);
            }
          };
        };

        $ctrl.loadScript = function (item) {
          pageService.loadScript({
            title: 'Load Script',
            data: item
          });
        };
        

    }

    angular.module('page')
        .controller('pageController', pageController);

})();
