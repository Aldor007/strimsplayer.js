var SongController = require('../../../api/controllers/SongController.js');
var Song = require('../../../api/models/Song.js');

describe('SongsController', function() {
    var request;
    var response;
    beforeEach(function() {
        GLOBAL.Song = jasmine.createSpy('Strm');
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
    });
    describe('SongController.add', function() {
        it('should return 400 if no params', function() {
            request.param.andReturn(null);
            SongController.add(request, response);
            expect(response.json).toHaveBeenCalled();
        });
        it('should return if 404 strim not found', function() {
            var given =  {
                strim: 'test',
                date: '1-JAN-2014 17:00',
            };
            request.param.andReturn(JSON.stringify(given));
            GLOBAL.Strim.findOneBySlug = jasmine.createSpy('Strim.findOneBySlug').andCallFake(function (slug, callback) {
                expect(slug).toBe(given.strim);
                callback(null, null);
            });
            SongController.add(request, response);
            expect(response.json).not.toHaveBeenCalled();
            expect(response.notFound).toHaveBeenCalled();
        });
        it('should return 500 if db error', function() {
            var given =  {
                strim: 'test',
                date: '1-JAN-2014 17:00',
            };
            var error = {error: 'error'};
            request.param.andReturn(JSON.stringify(given));
            GLOBAL.Strim.findOneBySlug = jasmine.createSpy('Strim.findOneBySlug').andCallFake(function (slug, callback) {
                expect(slug).toBe(given.strim);
                callback(error, null);
            });
            SongController.add(request, response);
            expect(response.json).toHaveBeenCalledWith(error, 500);
            expect(response.notFound).not.toHaveBeenCalled();
        });
        it('should return 500 if error creating song', function() {
            var given =  {
                strim: 'test',
                date: '1-JAN-2014 17:00',
            };
            var error = {error: 'error'};
            var strim = given;
            strim.strim = {id: 10};
            request.param.andReturn(JSON.stringify(given));

            GLOBAL.Strim.findOneBySlug = jasmine.createSpy('Strim.findOneBySlug').andCallFake(function (slug, callback) {
                expect(slug).toEqual(given.strim);
                callback(null, strim);
            });
            GLOBAL.Song.create = jasmine.createSpy('Song.create');
            GLOBAL.Song.create.exec = jasmine.createSpy('Song.create.exec').andCallFake(function (callback) {
                callback(error, null);
            });
            GLOBAL.Song.create.andReturn(GLOBAL.Song.create);

            SongController.add(request, response);
            expect(GLOBAL.Song.create).toHaveBeenCalled();
            expect(response.json).toHaveBeenCalledWith(error, 500);
            expect(response.notFound).not.toHaveBeenCalled();
        });
        it('should return ok if no error creating song', function() {
            var given =  {
                strim: 'test',
                date: '1-JAN-2014 17:00',
            };
            var error = {error: 'error'};
            var strim = given;
            strim.strim = {id: 10};

            request.param.andReturn(JSON.stringify(given));
            GLOBAL.Strim.findOneBySlug = jasmine.createSpy('Strim.findOneBySlug').andCallFake(function (slug, callback) {
                expect(slug).toEqual(given.strim);
                callback(null, {id: 10});
            });

            GLOBAL.Song.create = jasmine.createSpy('Song.create');
            GLOBAL.Song.create.exec = jasmine.createSpy('Song.create.exec').andCallFake(function (callback) {
                callback(null, {test: 'a'});
            });
            GLOBAL.Song.create.andReturn(GLOBAL.Song.create);
            var result = strim;
            result.date = new Date(2014, 0, 1, 17,0);

            SongController.add(request, response);
            expect(GLOBAL.Song.create).toHaveBeenCalledWith(result);
            expect(response.json).toHaveBeenCalledWith('ok');
            expect(response.notFound).not.toHaveBeenCalled();
        });

    });

    describe('SongController.addArray', function() {
        it('should return  400 if no params', function() {
            request.param.andReturn(null);
            SongController.addArray(request, response);
            expect(response.json).toHaveBeenCalledWith({message: 'Bad request'}, 400);
            expect(response.notFound).not.toHaveBeenCalled();
        });
        it('should return  400 if empty array', function() {
            request.param.andReturn([]);
            SongController.addArray(request, response);
            expect(response.json).toHaveBeenCalledWith({message: 'Empty array'}, 400);
            expect(response.notFound).not.toHaveBeenCalled();
        });
        it('should return  404 if strim not found', function() {
            var strims = {
                soundtrack: [
                    {
                        id: 2,
                        domain: 'youtube',
                        title: 'Test'
                    },
                    {
                        id: 2,
                        domain: 'youtube',
                        title: 'Test'
                    }
                ],
                test: [
                    {
                        id: 2,
                        domain: 'youtube',
                        title: 'Test'
                    }
            
            ]};

            GLOBAL.Strim.findOneBySlug = jasmine.createSpy('Strim.findOneBySlug').andCallFake(function (slug, callback) {
                callback({ id: 10});
            });
            request.param.andReturn(strims);
            SongController.addArray(request, response);
            expect(response.json).toHaveBeenCalledWith({message: 'Strim not found!'}, 404);
        });
        it('should return  propert count of error inserting', function() {
            var strims = {
                soundtrack: [
                    {
                        id: 2,
                        domain: 'youtube.com',
                        title: 'Test'
                    },
                    {
                        id: 2,
                        domain: 'youtube.com',
                        title: 'Test'
                    }
                ],
                test: [
                    {
                        id: 2,
                        domain: 'youtube.com',
                        title: 'Test'
                    }
            
            ]};
            var expected = {soundtrack: {added: 0, error: 2, incorectDomain: 0}, test: {added: 0, error: 1, incorectDomain: 0}}
            GLOBAL.Strim.findOneBySlug = jasmine.createSpy('Strim.findOneBySlug').andCallFake(function (slug, callback) {
                callback(null, { id: 10});
            });
            request.param.andReturn(strims);
            GLOBAL.Song.create = jasmine.createSpy('Song.create');
            GLOBAL.Song.create.exec = jasmine.createSpy('Song.create.exec').andCallFake(function (callback) {
                callback({test: 'a'});
            });
            GLOBAL.Song.create.andReturn(GLOBAL.Song.create);
            SongController.addArray(request, response);
            expect(response.json).toHaveBeenCalledWith(expected);
        });
        it('should return  propert count of song  inserted', function() {
            var strims = {
                soundtrack: [
                    {
                        id: 2,
                        domain: 'youtube.com',
                        title: 'Test'
                    },
                    {
                        id: 2,
                        domain: 'vimeo.com',
                        title: 'Test'
                    }
                ],
                test: [
                    {
                        id: 2,
                        domain: 'soundcloud.com',
                        title: 'Test'
                    }
            
            ]};
            var expected = {soundtrack: {added: 2, incorectDomain: 0, error: 0}, test: {added: 1, incorectDomain: 0, error: 0}}
            GLOBAL.Strim.findOneBySlug = jasmine.createSpy('Strim.findOneBySlug').andCallFake(function (slug, callback) {
                callback(null, { id: 10});
            });
            request.param.andReturn(strims);
            GLOBAL.Song.create = jasmine.createSpy('Song.create');
            GLOBAL.Song.create.exec = jasmine.createSpy('Song.create.exec').andCallFake(function (callback) {
                callback(null, {test: 'a'});
            });
            GLOBAL.Song.create.andReturn(GLOBAL.Song.create);
            SongController.addArray(request, response);
            expect(response.json).toHaveBeenCalledWith(expected);
        });
        it('should return  propert count of song  inserted and incorectDomain', function() {
            var strims = {
                soundtrack: [
                    {
                        id: 2,
                        domain: 'youtube.com',
                        title: 'Test'
                    },
                    {
                        id: 2,
                        domain: 'aavimeo.com',
                        title: 'Test'
                    }
                ],
                test: [
                    {
                        id: 2,
                        domain: 'soundcloud.com',
                        title: 'Test'
                    }
            
            ]};
            var expected = {soundtrack: {added: 1, error: 0, incorectDomain: 1}, test: {added: 1, error:0, incorectDomain: 0}};
            GLOBAL.Strim.findOneBySlug = jasmine.createSpy('Strim.findOneBySlug').andCallFake(function (slug, callback) {
                callback(null, { id: 10});
            });
            request.param.andReturn(strims);
            GLOBAL.Song.create = jasmine.createSpy('Song.create');
            GLOBAL.Song.create.exec = jasmine.createSpy('Song.create.exec').andCallFake(function (callback) {
                callback(null, {test: 'a'});
            });
            GLOBAL.Song.create.andReturn(GLOBAL.Song.create);
            SongController.addArray(request, response);
            expect(response.json).toHaveBeenCalledWith(expected);
        });
    });
    describe('SongController.listByName', function() {
        it('all songs path, should return error if DB has have error', function() {
            request.param.andReturn(null);
            GLOBAL.Song.find = jasmine.createSpy('Song.find');
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method] = jasmine.createSpy('Song.find' + method);
            });
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method].andReturn(GLOBAL.Song.find);
            });
            GLOBAL.Song.find.andReturn(GLOBAL.Song.find);

            GLOBAL.Song.find.exec.andCallFake(function(callback) {
                callback({status: 404, message: 'Notfound'});
            });
            SongController.listByName(request, response);
            expect(response.json).toHaveBeenCalledWith({message: 'Notfound'}, 404);

        });
        it('all songs path, should return songs if no  error', function() {
            request.param.andReturn(null);
            GLOBAL.Song.find = jasmine.createSpy('Song.find');
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method] = jasmine.createSpy('Song.find' + method);
            });
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method].andReturn(GLOBAL.Song.find);
            });
            GLOBAL.Song.find.andReturn(GLOBAL.Song.find);

            GLOBAL.Song.find.exec.andCallFake(function(callback) {
                callback(null, []);
            });
            SongController.listByName(request, response);
            expect(response.json).toHaveBeenCalledWith([]);

        });
        it('one strim path, should return error if no strim', function() {
            request.param.andCallFake(function (name) {
                if (name == 'id') {
                    return 'soundtrack'
                } else {
                    return null;
                }
            });
            GLOBAL.Strim.find = jasmine.createSpy('Strim.find');
            GLOBAL.Strim.find.exec = jasmine.createSpy('Strim.find.exec').andCallFake(function(callback) {
                callback(true);
            });
            GLOBAL.Strim.find.andReturn(GLOBAL.Strim.find);

            SongController.listByName(request, response);
            expect(response.json).toHaveBeenCalledWith( {message: 'Strimow nie znaleziono'}, 404);

        });
        it('one strim path, should return error if song error', function() {
            request.param.andCallFake(function (name) {
                if (name == 'id') {
                    return 'soundtrack'
                } else {
                    return null;
                }
            });
            GLOBAL.Strim.find = jasmine.createSpy('Strim.find');
            GLOBAL.Strim.find.exec = jasmine.createSpy('Strim.find.exec').andCallFake(function(callback) {
                callback(null, [{id: 1}]);
            });
            GLOBAL.Song.find = jasmine.createSpy('Song.find');
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method] = jasmine.createSpy('Song.find' + method);
            });
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method].andReturn(GLOBAL.Song.find);
            });
            GLOBAL.Song.find.andReturn(GLOBAL.Song.find);
            var songError = {status: 500, message: "Cos"};
            GLOBAL.Song.find.exec.andCallFake(function(callback) {
                callback(songError);
            });
            GLOBAL.Strim.find.andReturn(GLOBAL.Strim.find);

            SongController.listByName(request, response);
            expect(response.json).toHaveBeenCalledWith({message: songError.message}, songError.status);

        });
        it('one strim path, should return songs if no error', function() {
            request.param.andCallFake(function (name) {
                if (name == 'id') {
                    return 'soundtrack'
                } else {
                    return null;
                }
            });
            GLOBAL.Strim.find = jasmine.createSpy('Strim.find');
            GLOBAL.Strim.find.exec = jasmine.createSpy('Strim.find.exec').andCallFake(function(callback) {
                callback(null, [{id: 1}]);
            });
            GLOBAL.Song.find = jasmine.createSpy('Song.find');
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method] = jasmine.createSpy('Song.find' + method);
            });
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method].andReturn(GLOBAL.Song.find);
            });
            GLOBAL.Song.find.andReturn(GLOBAL.Song.find);
            var songError = {status: 500, message: "Cos"};
            GLOBAL.Song.find.exec.andCallFake(function(callback) {
                callback(null, [{id: 13}]);
            });
            GLOBAL.Strim.find.andReturn(GLOBAL.Strim.find);

            SongController.listByName(request, response);
            expect(response.json).toHaveBeenCalledWith([{id: 13}]);

        });
        it('one strim path, should return [] if no songs', function() {
            request.param.andCallFake(function (name) {
                if (name == 'id') {
                    return 'soundtrack'
                } else {
                    return null;
                }
            });
            GLOBAL.Strim.find = jasmine.createSpy('Strim.find');
            GLOBAL.Strim.find.exec = jasmine.createSpy('Strim.find.exec').andCallFake(function(callback) {
                callback(null, [{id: 1}]);
            });
            GLOBAL.Song.find = jasmine.createSpy('Song.find');
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method] = jasmine.createSpy('Song.find' + method);
            });
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method].andReturn(GLOBAL.Song.find);
            });
            GLOBAL.Song.find.andReturn(GLOBAL.Song.find);
            var songError = {status: 500, message: "Cos"};
            GLOBAL.Song.find.exec.andCallFake(function(callback) {
                callback(null, []);
            });
            GLOBAL.Strim.find.andReturn(GLOBAL.Strim.find);

            SongController.listByName(request, response);
            expect(response.json).toHaveBeenCalledWith([]);

        });
        it('multi strim path, should return songs  if  songs no after', function() {
            request.param.andCallFake(function (name) {
                if (name == 'id') {
                    return 'soundtrack+rock'
                } else {
                    return null;
                }
            });
            var whereExp = {
                // id: {
                //     '>': 0
                // },
                or: [
                {strim: 1},
                {strim: 3}
                ]
            };
            GLOBAL.Strim.find = jasmine.createSpy('Strim.find');
            GLOBAL.Strim.find.exec = jasmine.createSpy('Strim.find.exec').andCallFake(function(callback) {
                callback(null, [{id: 1}, {id: 3}]);
            });
            GLOBAL.Song.find = jasmine.createSpy('Song.find');
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method] = jasmine.createSpy('Song.find' + method);
            });
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method].andReturn(GLOBAL.Song.find);
            });
            GLOBAL.Song.find.andReturn(GLOBAL.Song.find);
            var songError = {status: 500, message: "Cos"};
            GLOBAL.Song.find.exec.andCallFake(function(callback) {
                callback(null, [{id:5}, {id: 6}]);
            });
            GLOBAL.Strim.find.andReturn(GLOBAL.Strim.find);

            SongController.listByName(request, response);
            expect(GLOBAL.Song.find.where).toHaveBeenCalledWith(whereExp)
            expect(response.json).toHaveBeenCalledWith([{id: 5}, {id: 6}]);

        });
        it('multi strim path, should return songs  if no error with after', function() {
            request.param.andCallFake(function (name) {
                if (name == 'id') {
                    return 'soundtrack+rock'

                } else if (name == 'after') {
                    return 10
                }     else {
                    return null;
                }
            });
            var whereExp = {
                id: {
                    '>': 10
                },
                or: [
                {strim: 1},
                {strim: 3}
                ]
            };
            GLOBAL.Strim.find = jasmine.createSpy('Strim.find');
            GLOBAL.Strim.find.exec = jasmine.createSpy('Strim.find.exec').andCallFake(function(callback) {
                callback(null, [{id: 1}, {id: 3}]);
            });
            GLOBAL.Song.find = jasmine.createSpy('Song.find');
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method] = jasmine.createSpy('Song.find' + method);
            });
            ['where', 'limit', 'sort', 'exec'].forEach(function(method) {
                GLOBAL.Song.find[method].andReturn(GLOBAL.Song.find);
            });
            GLOBAL.Song.find.andReturn(GLOBAL.Song.find);
            var songError = {status: 500, message: "Cos"};
            GLOBAL.Song.find.exec.andCallFake(function(callback) {
                callback(null, [{id:5}, {id: 6}]);
            });
            GLOBAL.Strim.find.andReturn(GLOBAL.Strim.find);

            SongController.listByName(request, response);
            expect(GLOBAL.Song.find.where).toHaveBeenCalledWith(whereExp)
            expect(response.json).toHaveBeenCalledWith([{id: 5}, {id: 6}]);

        });
        
    });

});
