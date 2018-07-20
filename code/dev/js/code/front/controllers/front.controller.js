

(function () {
    'use strict';

    function frontController($scope, $routeParams, $log, mainHttpService, frontService, popupsService, mainAuthorizationService, mainOtherService) {
        var $ctrl = this;

        $ctrl.routeParams = $routeParams;

        mainHttpService.getById('headers', $ctrl.routeParams.id, function (response) {
            $ctrl.header = response[0];
        });

        $ctrl.Authorization = function() {
          return mainAuthorizationService.checkAuthorization();
        };

        $ctrl.getUser = function() {
          return mainAuthorizationService.getUser();
        };

        $ctrl.loaderCheck = function () {
          return mainOtherService.loader.activateLoader;
        };

        $ctrl.update = function() {
          popupsService.forms({
              title: 'Update',
              fields: [
                {
                    type: 'text',
                    placeholder: 'position',
                    name: 'position',
                    text: $ctrl.header.position,
                    required: true
                },
                {
                    type: 'text',
                    placeholder: 'age',
                    name: 'age',
                    text: $ctrl.header.age,
                    required: true
                },
                {
                  type: 'multiple-selection',
                  placeholder: 'Select skill...',
                  name: 'multiple_selection',
                  text: $ctrl.header.skills,
                  availableSkills: [
                    'JavaScript','Css','Html5', 'Node.js', 'Angular', 'Es6', 'TypeScript', 'MongoDB', 'Hapi.js'
                  ],
                  required: true
                }
              ]
          }, function (data) {
            var newData = frontService.filledData(data);
            newData.name = $ctrl.getUser().name;
            newData._id = $ctrl.header._id;
            newData.creator_email = $ctrl.header.creator_email;
            mainHttpService.update('headers', newData, function(response) {
              $ctrl.header = response;
            });
          });
        };

    }

    angular.module('front')
        .controller('frontController', frontController);

})();
