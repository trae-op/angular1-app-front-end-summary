

(function () {
    'use strict';

    function homeController($scope, $log, $routeParams, mainHttpService, popupsService, homeService, mainAuthorizationService, mainOtherService) {
        var $ctrl = this;

        // This is necessary for pagination menu because 'hash' can be different
        $scope.getHash = '#';

      $ctrl.items = [];

        // for the correct "reverse"
        mainHttpService.cacheData = {};

        mainHttpService.get('headers', function (response) {
            $ctrl.items = _.reverse(response);
            $scope.prevItems = $ctrl.items;
        });

        $ctrl.availableityItems = function () {
          return $ctrl.items && $ctrl.items.length ? true : false;
        };

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


      $ctrl.availableSkills = [
        'JavaScript','Css','Html5', 'Node.js', 'Angular', 'Es6', 'TypeScript', 'MongoDB', 'Hapi.js', ''
      ];

      $ctrl.skillsSelected = [];

      $ctrl.disabled = false;
       
    }

    angular.module('home')
        .controller('homeController', homeController);

})();
