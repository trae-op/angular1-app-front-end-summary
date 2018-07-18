
(function () {
    'use strict';

    function frontService($log) {
      var _this = this;
      
      _this.filledData = function (data) {
        var getProp = function(prop) {
          return _.find(data, {name: prop});
        };

        return {
          position: getProp('position').text,
          age: getProp('age').text
        };
      };

    }

    angular
        .module('front')
        .service('frontService', frontService);

})();