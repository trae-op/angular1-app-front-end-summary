
(function () {
    'use strict';

    function popupsService($uibModal, $log) {

        this.forms = function (data, callback) {
            var modal = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'parts/popups/form.html',
                controller: function($uibModalInstance, items) {
                    var $ctrl = this;
                    var fields = {};
                    $ctrl.title = items.title;
                    $ctrl.fields = items.fields;
                    $ctrl.additionalButtons = items.additionalButtons;

                    $ctrl.validationCustom = function(form) {
                      var result = true;
                      fields.filled = true;
                      for (var i = 0; i <  $ctrl.fields.length; i = i + 1) {
                        var field = $ctrl.fields[i];
                        fields[field.name] = field.text;
                      }
                      if (fields.confirm_password) {
                        if (fields.password === fields.confirm_password && form.$valid) {
                          result = false;
                        }
                      } else {
                        result = !form.$valid;
                      }
                      return result;
                    };                    

                    $ctrl.send = function (fieldsFilled) {
                        $uibModalInstance.close(fieldsFilled);
                    };

                    $ctrl.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                controllerAs: '$ctrl',
                size: 'md',
                resolve: {
                    items: function () {
                        return data;
                    }
                }
            });

            modal.result.then(function (selectedItem) {
                callback(selectedItem);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        this.messages = function (type, data) {
          var modal = $uibModal.open({
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: 'parts/popups/messages.html',
              controller: function($uibModalInstance, options) {
                  var $ctrl = this;
                  
                  $ctrl.title = _.capitalize(type);
                  $ctrl.data = options.data.message;
                  $ctrl.classes = type;

                  $ctrl.close = function () {
                      $uibModalInstance.dismiss('cancel');
                  };
              },
              controllerAs: '$ctrl',
              size: 'md',
              resolve: {
                  options: function () {
                      return data;
                  }
              }
          });
        };

    }

    angular
        .module('shared')
        .service('popupsService', popupsService);

})();