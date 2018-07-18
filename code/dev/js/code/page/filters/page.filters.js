(function() {
  
  'use strict';

  angular.module('page')
    .filter('htmlCode', function($sce) {
      return function(text) {
        return $sce.trustAsHtml(text);
      };
  });
  
})();