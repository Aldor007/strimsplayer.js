var StrimController = require('../../../../api/controllers/StrimController.js');
var Strim = require('../../../../api/models/Strim.js');
var rewire = require('rewire');

describe('StrimsController', function() {
    var request;
    var response;
    beforeEach(function() {
        GLOBAL.Song = jasmine.createSpy('Song');
        GLOBAL.sails = jasmine.createSpy('sails');
        GLOBAL.sails.log = jasmine.createSpy('sails');
        ['info', 'error', 'warn'].forEach(function (name) {
            GLOBAL.sails.log[name] = jasmine.createSpy('sails' + name);
        });
        GLOBAL.Strim = jasmine.createSpy('Strim');
        request = jasmine.createSpy('request');
        response = jasmine.createSpy('response');
        response.json = jasmine.createSpy('response.json');
        response.send = jasmine.createSpy('response.send');
        response.notFound = jasmine.createSpy('response.notFound');
        request.param = jasmine.createSpy('request.param');
        GLOBAL.Strim.find = jasmine.createSpy('Strim.find');
        GLOBAL.Strim.find.sort = jasmine.createSpy('Strim.find.sort');
        GLOBAL.Strim.find.exec = jasmine.createSpy('Strim.find.exec');
    });
    describe('StrimController.get', function() {
        beforeEach(function () {
            response.redirect = jasmine.createSpy('response.redirect');
        })
        it('should redirect to /#s/', function() {
            request.param.andReturn('Soundtrack');
            StrimController.get(request, response);
            expect(response.redirect).toHaveBeenCalledWith('/#!s/Soundtrack');
        })
        it('should redirect to /', function() {
            request.param.andReturn(null);
            StrimController.get(request, response);
            expect(response.redirect).toHaveBeenCalledWith('/');
        });
    describe('StrimController.list', function () {

        it('should return  erri if db error', function() {
            [ 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Strim.find[method].andReturn(GLOBAL.Strim.find);
            });
            GLOBAL.Strim.find.exec.andCallFake( function(cb) {
                cb({status: 500});
            });
            GLOBAL.Strim.find.andReturn(GLOBAL.Strim.find);
            StrimController.list(request, response);
            expect(response.json).toHaveBeenCalledWith({message: 'DB error'}, 500);
        });

        it('should return list of strims', function() {
            [ 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Strim.find[method].andReturn(GLOBAL.Strim.find);
            });
            GLOBAL.Strim.find.exec.andCallFake( function(cb) {
                cb(null, [{name:'test'}, {name: 'test2'}]);
            });
            GLOBAL.Strim.find.andReturn(GLOBAL.Strim.find);
            StrimController.list(request, response);
            expect(response.json).toHaveBeenCalledWith([{name: 'test'}, {name: 'test2'}]);
        });
    });
    describe('StrimController.add', function() {
        var strimControllerRewire = rewire('../../../../api/controllers/StrimController.js');
        var requestMock;
        var StrimControllerR;
        beforeEach(function() {
            requestMock = jasmine.createSpy('request');
            strimControllerRewire.__set__('request', requestMock);
            StrimControllerR = strimControllerRewire;//.StrimController;

        });
        it('should return 404 if strim not found on strims.pl', function () {
            requestMock.andCallFake(function (options, callback) {
                expect(options.followRedirect).toBe(false);
                callback(null, true);
            });
            request.param.andReturn('niema');
            StrimControllerR.add(request, response);
            expect(response.json).toHaveBeenCalledWith({message: 'Nie znaleziono strimu o nazwie niema na strims.pl', status: 404}, 404);

        });
        it('should return 504 if strim.pl not respond in time', function () {
            requestMock.andCallFake(function (options, callback) {
                expect(options.followRedirect).toBe(false);
                callback(true);
            });
            request.param.andReturn('niema');
            StrimControllerR.add(request, response);
            expect(response.json).toHaveBeenCalledWith({message: 'Strims.pl nie odpowiedział w czasie.', status: 504}, 504);

        });
        it('should return 404 if on strim not found video', function () {
            requestMock.andCallFake(function (options, callback) {
                expect(options.followRedirect).toBe(false);
                callback(null,{statusCode: 200}, '<p>Nie znaleziono treści.</p>');
            });
            request.param.andReturn('niema');
            StrimControllerR.add(request, response);
            expect(response.json).toHaveBeenCalledWith({message: 'Nie znaleziono filmów na niema' }, 404);

        });
        it('should return 500 if error adding strim to DB', function () {
            requestMock.andCallFake(function (options, callback) {
                expect(options.followRedirect).toBe(false);
                callback(null,{statusCode: 200}, 'Mamy treść');
            });
            request.param.andReturn('jest');
            GLOBAL.Strim.exec = jasmine.createSpy('Strim.exec').andCallFake(function( callback) {
                callback({status: 500});
            });
            GLOBAL.Strim.create = jasmine.createSpy('Strim.create').andCallFake(function(options) {
                expect(options.name).toEqual('jest');
            }).andReturn(GLOBAL.Strim);

            StrimControllerR.add(request, response);
            expect(response.json).toHaveBeenCalledWith({status: 500, message: 'Strim istnieje!'}, 500);

        });
        it('should return 200  if ok', function () {
            requestMock.andCallFake(function (options, callback) {
                callback(null,{statusCode: 200}, 'Mamy treść');
            });
            request.param.andReturn('jest');
            GLOBAL.sails.config = {
                cliapi: {
                    HostAndPORT: 8011
                }
            };
            GLOBAL.Strim.exec = jasmine.createSpy('Strim.exec').andCallFake(function( callback) {
                callback(null, 'jest');
            });
            GLOBAL.Strim.create = jasmine.createSpy('Strim.create').andCallFake(function(options) {
                expect(options.name).toEqual('jest');
            }).andReturn(GLOBAL.Strim);

            StrimControllerR.add(request, response);
            expect(response.json).toHaveBeenCalledWith({status: 200, message: 'Strim ' + 'jest' + 'dodany'}, 200);
        });


    });

    });
});
