/* App Controller File
 * @Author: Himanshu
 */
var appActions = {
    sharedCtrl: function () {
        angular.module('zenatixApp').controller('sharedCtrl', ['$rootScope', '$scope', '$state', '$location', function ($rootscope, $scope, $state, $location) {
            console.log('Welcome to Socially ONE');
            $scope.$watch('$location.path()', function (value) {});
            $scope.logout = function(){
                $state.go('login');
                localStorage.clear();
                sessionStorage.clear();
            };
        }]);
    },
};
appActions.sharedCtrl();