/* Socially One App Config File
 * @Author: Himanshu
 */ 
var zenatixApp = {
    bootstrap : function(){
        angular.module('zenatixApp',['ui.router', 'ngResource', 'ngAnimate','ngSanitize','login','dashboard']);
    },
    routerConfig : function(){
        angular.module('zenatixApp').config(['$urlRouterProvider', '$stateProvider','$provide',  function (urlRouterProvider, stateProvider,$provide) {

            urlRouterProvider.otherwise('login');
            
            stateProvider.state('login', {
                url: '/login',
                templateUrl: 'app/login-component/login.html',
                controller: 'loginCtrl'
            })
            .state('home', {
                url: '/home',
                templateUrl: 'app/shared-component/app-container.html',
                controller: 'sharedCtrl'
            });
        }]);
    },
    locationChange: function(){
        angular.module('zenatixApp').run(function($rootScope,$state,$location) {
            $rootScope.$on("$locationChangeStart", function(event, next, current) { 
                // handle route changes 
                console.log(current);
                if(current.indexOf('access_token') > -1){
                    sessionStorage.instagramAccessToken = current.split('=')[1];
                    // event.preventDefault();
                    $state.go('home.dashboard');
                }    
            });
        });
    }
}
zenatixApp.bootstrap();
zenatixApp.routerConfig();
zenatixApp.locationChange();