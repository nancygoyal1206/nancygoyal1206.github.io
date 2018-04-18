/* Dashboard Controller File
 * @Author: Himanshu
 */ 
var dashboardActions = {
    dashboardCtrl : function(){
        angular.module('dashboard').controller('dashboardCtrl',['$rootScope','$scope', '$state','$window','$http','$sce','dashboardService','constants',function($rootScope, $scope, $state, $window, $http, $sce, dashboardService,constants){
            
            var getTwitterFeeds = dashboardService.getTwitterFeeds();
            var getInstaTimelineFromJson = dashboardService.getInstaFeedsFromJson();
            $scope.requestToken = {};
            $scope.getUserTimelineRequest = {};
            $scope.getInstaTimelineRequest = {};
            $scope.currentTab = '';
            $scope.requestToken.oauth_callback = "http://127.0.0.1:5500/index.html#!/home/dashboard";
            $scope.linkedProfileObj = {};
            $scope.linkedProfileObj.twitter = false;
            $scope.linkedProfileObj.instagram = false;
            $scope.linkedProfileObj.twitterFeedsList = [];
            $scope.linkedProfileObj.instagramFeedsList = [];
            $scope.loadingScreen = false;
            $scope.openConfigureAppModal = function(){
                $('#configureAppModal').modal('show');
            };
            $scope.switchTab = function(tab){
                $scope.currentTab = tab;
            };
            $scope.generateTwitterAuthorizationHeader = function(){
                $scope.oAuth = {};
                $scope.oAuth.oauth_timestamp = Math.round(Date.now() / 1000);
                $scope.oAuth.oauth_consumer_key = constants.TWITTER.CONSUMER_KEY;
                $scope.oAuth.oauth_nonce = btoa($scope.oAuth.oauth_consumer_key + ':' + $scope.oAuth.oauth_timestamp);
                $scope.oAuth.oauth_signature_method = 'HMAC-SHA1';
                $scope.oAuth.oauth_token = constants.TWITTER.API_ACCESS_TOKEN;
                $scope.oAuth.oauth_version = 1.0;
                $scope.oAuth.oauth_signature = oauthSignature.generate('GET', constants.TWITTER.API_URL+'1.1/statuses/home_timeline.json', $scope.oAuth, constants.TWITTER.CONSUMER__SECRET, constants.TWITTER.API_ACCESS_TOKEN_SECRET,{encodeSignature: false});
                $scope.oAuth.oauth_timestamp = $scope.oAuth.oauth_timestamp.toString();
                $scope.authHeader = 'OAuth ' +
                'oauth_consumer_key="'  + $scope.oAuth.oauth_consumer_key       + '", ' +
                'oauth_nonce="'         + $scope.oAuth.oauth_nonce             + '", ' +
                'oauth_signature="'     + $scope.oAuth.oauth_signature         + '", ' +
                'oauth_signature_method="HMAC-SHA1", '              +
                'oauth_timestamp="'     + $scope.oAuth.oauth_timestamp         + '", ' +
                'oauth_token="'         + $scope.oAuth.oauth_token       + '", ' +
                'oauth_version="1.0"'                               ;
            };

            $scope.getRequestToken = function(){
                $scope.generateTwitterAuthorizationHeader();
                var authorize = dashboardService.twitterHomeTimeline($scope.authHeader);
                userTimeline.getdata({},$scope.getUserTimelineRequest).$promise.then(function(data) {
                    if(data != undefined && data != null){
							alert(JSON.stringify(data)); 
                    }
                    else{
                        console.log('failure');
                    }
                },
                function(error) {
                    console.log('Rejected');
                });
            };	
            
            $scope.getTwitterFeeds = function(){
                $scope.loadingScreen = true;
                getTwitterFeeds.getdata({},{}).$promise.then(function(data) {
                    if(data != undefined && data != null){
                            // alert(JSON.stringify(data)); 
                            $scope.linkedProfileObj.twitterFeedsList = data;
                            $('#configureAppModal').modal('hide');
                            $scope.linkedProfileObj.twitter = true;
                            $scope.currentTab = 'T';
                            sessionStorage.twitterAccessToken = true;
                            $scope.loadingScreen = false;
                    }
                    else{
                        console.log('failure');
                        $scope.loadingScreen = false;
                    }
                },
                function(error) {
                    console.log('Rejected');
                    $scope.loadingScreen = false;
                });
            };

            $scope.authorizeInstagram = function(){
                $('#configureAppModal').modal('hide');
                $window.location.href = constants.INSTAGRAM.API_URL+'oauth/authorize?client_id='+constants.INSTAGRAM.CLIENT_ID+'&redirect_uri='+constants.INSTAGRAM.REDIRECT_URI+'&response_type=token&scope=public_content'; 
            };

            $scope.getInstaFeeds = function(){
                $scope.loadingScreen = true;
                $scope.getInstaTimelineRequest.count = 5;
                $scope.getInstaTimelineRequest.access_token = sessionStorage.instagramAccessToken;
                var getInstaTimeline = dashboardService.getInstaFeeds($scope.getInstaTimelineRequest);
                getInstaTimeline.getdata({},$scope.getInstaTimelineRequest).$promise.then(function(data) {
                    if(data != undefined && data != null){
                            // alert(JSON.stringify(data)); 
                            $scope.linkedProfileObj.instagramFeedsList = data.data;
                            $scope.linkedProfileObj.instagram = true;
                            $scope.currentTab = 'I';
                            if(sessionStorage.length == 2){
                                $scope.currentTab = 'T';
                            }
                            $scope.loadingScreen = false;
                    }
                    else{
                        console.log('failure');
                        $scope.getInstaFeedsFromJson();
                        $scope.loadingScreen = false;
                    }
                },
                function(error) {
                    console.log('Rejected');
                    $scope.getInstaFeedsFromJson();
                    $scope.loadingScreen = false;
                });
            };
            $scope.getInstaFeedsFromJson = function(){
                $scope.loadingScreen = true;
                getInstaTimelineFromJson.getdata({},{}).$promise.then(function(data) {
                    if(data != undefined && data != null){
                            $scope.linkedProfileObj.instagramFeedsList = data.data;
                            $scope.linkedProfileObj.instagram = true;
                            $scope.currentTab = 'I';
                            if(sessionStorage.instagramAccessToken == undefined || sessionStorage.instagramAccessToken == null || sessionStorage.instagramAccessToken == ''){
                                sessionStorage.instagramAccessToken = true;
                            }
                            if(sessionStorage.length == 2){
                                $scope.currentTab = 'T';
                            }
                            $scope.loadingScreen = false;
                    }
                    else{
                        console.log('failure');
                        $scope.loadingScreen = false;
                    }
                },
                function(error) {
                    console.log('Rejected');
                    $scope.loadingScreen = false;
                });
            };
            if(sessionStorage.instagramAccessToken){
                $scope.getInstaFeeds();
                $scope.linkedProfileObj.instagram = true;
                $scope.currentTab = 'I';
            }
            if(sessionStorage.twitterAccessToken){
                $scope.getTwitterFeeds ();
                $scope.linkedProfileObj.twitter = true;
                $scope.currentTab = 'T';
            }
            if($scope.linkedProfileObj.instagram == false && $scope.linkedProfileObj.twitter == false){
                $scope.openConfigureAppModal();
            }
            if(sessionStorage.length == 2){
                $scope.currentTab = 'T';
            }
            
        }]);
    },
};
dashboardActions.dashboardCtrl();