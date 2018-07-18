
(function () {
    'use strict';

    function headersService($http, $log) {
        var _this = this;

      _this.defaultHeader = function (name, email) {
          return {
            name: name,
            position: 'Position name',
            age: '<your age>',
            skills: '<need your real skills (for example: css, html etc.)>',
            creator_email: email
          };
      };
        
    }

    angular
        .module('header')
        .service('headersService', headersService);

})();