angular.module('zmApp.controllers').controller('zmApp.LoginCtrl', function ($scope, $rootScope, $ionicModal, ZMDataModel, $ionicSideMenuDelegate, $ionicPopup, $http, $q, $ionicLoading) {
    $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    }

    $scope.loginData = ZMDataModel.getLogin();



    // Perform the login action when the user submits the login form
    $scope.login = function () {
        console.log('Saving login');

        if (parseInt($scope.loginData.maxMontage) > 10) {
            $ionicPopup.alert({
                title: 'Note',
                template: 'You have selected to view more than 10 monitors in the Montage screen. Note that this is very resource intensive and may load the server or cause issues in the application. If you are not sure, please consider limiting this value to 10'
            });
        }

        // lets so some basic sanitization of the data
        // I am already adding "/" so lets remove spurious ones
        // though webkit has no problems. Even so, this is to avoid
        // a deluge of folks who look at the error logs and say
        // the reason the login data is not working is because
        // the app is adding multiple "/" characters

        $scope.loginData.url = $scope.loginData.url.trim();
        $scope.loginData.apiurl = $scope.loginData.apiurl.trim();
        $scope.loginData.username = $scope.loginData.username.trim();
        $scope.loginData.alias = $scope.loginData.alias.trim();

        if ($scope.loginData.url.slice(-1) == '/')
        {
            $scope.loginData.url = $scope.loginData.url.slice(0,-1);

        }

        if ($scope.loginData.apiurl.slice(-1) == '/')
        {
            $scope.loginData.apiurl = $scope.loginData.apiurl.slice(0,-1);

        }


         if ($scope.loginData.alias.slice(-1) == '/')
        {
            $scope.loginData.alias = $scope.loginData.alias.slice(0,-1);

        }
        // take off leading "/" in alias too
         if ($scope.loginData.alias[0] == '/')
        {
            $scope.loginData.alias = $scope.loginData.alias.substring(1);

        }

        // FIXME:: Do a login id check too

        var apiurl = $scope.loginData.apiurl + '/host/getVersion.json';
        var portalurl = $scope.loginData.url + '/' + $scope.loginData.alias + '/index.php';
        console.log("API: " + apiurl + " PORTAL: " + portalurl);


        // Let's do a sanity check to see if the URLs are ok

        $ionicLoading.show({
                template: 'Checking data...',
                animation: 'fade-in',
                showBackdrop: true,
                duration: 15000,
                maxWidth: 200,
                showDelay: 0
            });


        $q.all([
    $http.get(apiurl),
    $http.get(portalurl)
  ]).then(
            function (results) {
                $ionicLoading.hide();
                //alert("All good");
            },
            function (error) {
                $ionicLoading.hide();
                //alert("Error string" + JSON.stringify(error));

                $ionicPopup.show({
                    title: 'Please Check your settings',
                    template: 'I tried reaching out using the data you provided and failed. This may also be because ZoneMinder is currently not reachable.',
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-positive'
                        },
                        {
                            text: 'Details...',
                            onTap: function (e)
                            {
                                $ionicPopup.alert({
                                    title: 'Error Details',
                                    template: JSON.stringify(error)})
                            }
                        }
                    ]
                })

            }

        );
        ZMDataModel.setLogin($scope.loginData);
    };


})
