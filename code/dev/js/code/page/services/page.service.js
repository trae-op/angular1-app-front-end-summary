
(function () {
    'use strict';

    function pageService ($http, $log, $routeParams, $uibModal) {
        var _this = this;

        _this.creatorEmail = '';

        _this.filledData = function (data) {

          var getProp = function(prop) {
            return _.find(data, {placeholder: prop});
          };

          var projectsAndCompanies = function () {
            return {
              title: getProp('title').text,
              link: getProp('link').text,
              description: getProp('description').text,
              creator_email: _this.creatorEmail
            };
          };
          switch($routeParams.pageName) {
            case 'abouts':
              return {
                description: getProp('description').text,
                creator_email: _this.creatorEmail
              };
            case 'scripts':
              return {
                title: getProp('title').text,
                link: getProp('link').text,
                description: getProp('description').text,
                css: getProp('css').text,
                html: getProp('html').text,
                creator_email: _this.creatorEmail
              };
            case 'projects':
              return projectsAndCompanies();
            case 'companies':
              return projectsAndCompanies();
            default: 
              return {};

          }
        };

        _this.getFields = function (currentData) {
          var checkData = function(prop) {
            return currentData ? currentData[prop] : '';
          };
          var projectsAndCompanies = [
            {
                type: 'text',
                placeholder: 'title',
                text: checkData('title'),
                required: true
            },
            {
                type: 'text',
                placeholder: 'link',
                text: checkData('link'),
                required: true
            },
            {
                type: 'textarea',
                placeholder: 'description',
                text: checkData('description'),
                required: true
            }
          ];
          switch($routeParams.pageName) {
            case 'scripts':
              return [
                  {
                      type: 'text',
                      placeholder: 'title',
                      text: checkData('title'),
                      required: true
                  },
                  {
                      type: 'textarea',
                      placeholder: 'description',
                      text: checkData('description'),
                      required: true
                  },
                  {
                      type: 'textarea',
                      placeholder: 'css',
                      text: checkData('css'),
                      required: true
                  },
                  {
                      type: 'textarea',
                      placeholder: 'link',
                      text: checkData('link'),
                      required: true
                  },
                  {
                      type: 'textarea',
                      placeholder: 'html',
                      text: checkData('html'),
                      required: true
                  }
              ];
            case 'abouts':
              return [
                {
                    type: 'textarea',
                    placeholder: 'description',
                    text: checkData('description'),
                    required: true
                }
              ];
            case 'projects':
              return projectsAndCompanies;
            case 'companies':
              return projectsAndCompanies;
            default:
              return [];
          }
        };


        _this.loadScript = function (data) {
          var modal = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'parts/load-script/load.script.html',
            controller: function($uibModalInstance, items) {
                var $ctrl = this;
                $ctrl.title = items.title;
                $ctrl.script = {
                  css: items.data.css,
                  html: items.data.html,
                  js: items.data.link
                };

                $ctrl.close = function () {
                    $uibModalInstance.dismiss('close');
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
        };


    }

    angular
        .module('page')
        .service('pageService', pageService);

})();