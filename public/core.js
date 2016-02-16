// public/core.js
var contactApp = angular.module('contactApp', []);

// IE browser caches get requests, this needs to be disabled so application
// will behave as it should, commented out because it may have been introducing
// other bugs
//contactApp.config(['$httpProvider', function($httpProvider) {
//    $httpProvider.defaults.cache = false;
//    if (!$httpProvider.defaults.headers.get) {
//        $httpProvider.defaults.headers.get = {};
//    }
//    // disable IE ajax request caching
//    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
//}]);


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
        return $http.put(urlBase + '/' + contact._id, contact);
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

    // Get all Contacts
    function getContacts() {
        dataFactory.getContacts().success(function(data) {
            $scope.contacts = data;
            var contactString = "contact list: ";
            for(var i = 0; i < $scope.contacts.length ; i++) { 
                contactString += " " + $scope.contacts[i].name;
            }
            console.log(contactString);
        })
        .error(function(error) {
            //$scope.status = 'unable to load contacts data: ' + error.message;
            console.log('unable to load contact list');
        });
    }
    getContacts(); // so it is called automatically

    // Add/Update Contact
    $scope.addContact = function addContact() {
        if (!isEmpty($scope.selected)) {  // 
            console.log("selected id:: " + $scope.selected._id);
            if ($scope.selected._id == null) {
                dataFactory.addContact($scope.selected).success(function(data) {
                    console.log("new contact created " + data.name);
                })
                .error(function(error) {
                    console.log('unable to create new contact');
                });
                getContacts();
                formClear();
            } else {
                //update contact
                dataFactory.updateContact($scope.selected).success(function(data) {
                    console.log("contact updated " + $scope.selected.name);
                    formClear();
                })
                .error(function(error) {
                    console.log("contact not updated !!!");
                    formClear();
                });
            }
        }
    }

    // Delete Contact
    $scope.deleteContact = function deleteContact() {
        var tempContact = $scope.selected;
        dataFactory.deleteContact($scope.selected._id).success(function(data) {
            console.log("contact deleted " + tempContact.name);
        })
        .error(function(error) {
            $scope.status = 'unable to delete contact: ' + error.message;
        });
        getContacts();
        formClear();
    }

    $scope.setSelected = function(contact) {
        $scope.selected = this.contact;
        console.log("row name selected: " + $scope.selected.name + " id: " + $scope.selected._id);
    }

    $scope.formClear = function() {
        formClear();
    }

    function formClear() {
        $scope.selected = {};
        console.log("Form cleared " + $scope.selected.name);
        console.log($scope.selected._id);
    }

    // test if object is empty
    function isEmpty(obj) {
        if (Object.keys(obj).length === 0) {
            console.log("object is empty!!");
        } else {
            console.log("object is not empty");
        }
        return (Object.keys(obj).length === 0);
    }
}]);
