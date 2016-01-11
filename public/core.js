// public/core.js
// need to make this a modern version 
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
            $scope.status = 'unable to load contacts data: ' + error.message;
        });
    }

    getContacts(); // so it is called automatically

/*
    function getSpecificContact() {
        dataFactory.getContactById(id).success(function(data) {
            console.log("returning one contact");

        })
        .error(function(error) {
            $scope.status = 'unable to retrieve contact';
        });
    } */

    function addContact() {
        dataFactory.addContact().success(function(data) {
            console.log("new contact created");
        })
        .error(function(error) {
            $scope.status = 'unable to creat new contact: ' + error.message;
        });
        getContacts();
    }

}]);
        


