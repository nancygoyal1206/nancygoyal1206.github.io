/* Login Controller File
 * @Author: Himanshu
 */ 
var loginActions = {
    loginCtrl : function(){
        angular.module('login').controller('loginCtrl',['$rootScope','$scope', '$state',function($rootscope, $scope, $state){
            $scope.user = {};
            $scope.user.email = 'admin@zenatix.com';
            $scope.user.password = 'system123#';
            $scope.login = function(){
                $state.go('home.dashboard');
            };
            $scope.checkActiveSession = function(){
                if(sessionStorage.length > 0){
                    $scope.login();
                }
            };
            $scope.checkActiveSession();
        }]);
    },
};
loginActions.loginCtrl();