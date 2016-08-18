/**
 * Created by zppro on 16-8-15.
 *
 * angular-box-input —— This repo is the angular input usage for some of the scenes.
 *
 * Author: @zppro
 * Website: https://github.com/zppro
 * License: GPL-2.0
 *
*/
(function() {
    'use strict';
    var jq = angular.element;
    angular
        .module('app',['zp.uiModule'])
        .directive('activeChecker',activeChecker)
        .controller('SidebarController', SidebarController)
        .controller('DemoBoxInputController', DemoBoxInputController)
    ;


    activeChecker.$inject = ['$window'];
    function activeChecker($window){
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs, ngModel) { 
            console.log($window.location.href);
            console.log(attrs.href);
            if((new RegExp(attrs.href+'$')).test($window.location.href)){
                jq(element).addClass('active');
            }
            else{
                jq(element).removeClass('active');
            }
        }
    }

    SidebarController.$inject = ['$scope','$location'];
    function SidebarController($scope,$location) {
         

    }

    DemoBoxInputController.$inject = ['$scope','ViewUtils'];
    function DemoBoxInputController($scope, ViewUtils) {
        $scope.utils = ViewUtils;

        var vm = $scope.vm = {};

        init();

        function init() {
            vm.sexes = [{name: '男', value: 'M'}, {name: '女', value: 'F'}, {name: '未知', value: 'N'}];
            vm.sex = 'N';
        }
    }

})();
