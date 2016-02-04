// public/core.js
var contactApp = angular.module('contactApp', []);

contactApp.factory('dataFactory', ['$http', function($http) {
    var urlBase = '/api/contacts'
    var dataFactory = {};

    dataFactory.getContacts = function() {
        return $http.get(urlBase);
    };

    dataFactory.getContactById = function(id) {
        return $http.get(urlBase + '/' + id);
    };

    dataFactory.addContact = function(contact) {
        return $http.post(urlBase, contact);
    };
    // need others update delete ect.
    dataFactory.updateContact = function(contact) {
        console.log("factory contact_id:: " + contact._id);
        return $http.put(urlBase + '/' + contact._id);
    };
    dataFactory.deleteContact = function(id) {
        return $http.delete(urlBase + '/' + id);
    };
    return dataFactory;
}]);

contactApp.controller('mainController', ['$scope', 'dataFactory',
    function($scope, dataFactory) {
    $scope.status;
    $scope.contacts = [];

    function getContacts() {
        dataFactory.getContacts().success(function(data) {
            $scope.contacts = data;
            console.log("contact list: " + $scope.contacts);
        })
        .error(function(error) {
            //$scope.status = 'unable to load contacts data: ' + error.message;
            console.log('unable to load contact list');
        });
    }
    getContacts(); // so it is called automatically

    $scope.addContact = function addContact() {
        if (!isEmpty($scope.selected)) { 
            //console.log("selected id:: " + $scope.selected._id);
            if ($scope.selected._id == null) {
                dataFactory.addContact($scope.selected).success(function(data) {
            
                    console.log("new contact created " + data.name);
                })
                .error(function(error) {
                    //$scope.status = 'unable to creat new contact: ' + error.message;
                    console.log('unable to create new contact');
                });
                getContacts();
                formClear();
            } else {
                dataFactory.updateContact($scope.selected).success(function(data) {
                    console.log("contact updated " + data.name);
                })
                .error(function(error) {
                    console.log("contact not updated !!!");
                    //$scope.status = 'unable to update contact: ' + error.message;
                });
                //getContacts();
                formClear();
            }
        }
    }

    $scope.deleteContact = function deleteContact() {
        dataFactory.deleteContact($scope.selected._id).success(function(data) {
            console.log("contact deleted " + $scope.selected.name);
        })
        .error(function(error) {
            $scope.status = 'unable to delete contact: ' + error.message;
        });
        getContacts();
        formClear();
    }

    $scope.setSelected = function(contact) {
        $scope.selected = this.contact;
        console.log("row name selected: " + $scope.selected.name + $scope.selected.number);
    }

    $scope.formClear = function() {
        formClear();
    }

    function formClear() {
        $scope.selected = {};
        console.log("Form cleared");
    }

    // test if object is empty
    function isEmpty(obj) {
            return Object.keys(obj).length === 0;
    }

}]);
