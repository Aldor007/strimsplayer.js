var DateUtils = require('../../lib/DateUtils').DateUtils;

describe('DateUtils', function () {

    describe('DateUtils.parseDate', function () {
        it('should parse 1 sierpnia 2013', function() {
            var given = '1 sierpnia 2013 20:00';
            var result = DateUtils.parseDate(given);
            expect(result).toBe('1-AUG-2013 20:00');

        });
        it('should parse 1 pażdziernika 2013', function() {
            var given = '1 pażdziernika 2013 20:00';
            var result = DateUtils.parseDate(given);
            expect(result).toBe('1-OCT-2013 20:00');

        });
    });
    describe('DateUtils.dateFromString', function () {
        it('should give date form 1-08-20013 20:00',function () {
            var given = '1-AUG-2013 20:00';
            var expected =new  Date(2013, 7, 1, 20, 0);
            var result = DateUtils.dateFromString(given);
            expect(result).toEqual(expected);
        });
        it('should parse date from parseDate', function () {
            var given = '1 pażdziernika 2013 20:00';
            given = DateUtils.parseDate(given);
            var expected =new  Date(2013, 9, 1, 20, 0);
            var result = DateUtils.dateFromString(given);
            expect(result).toEqual(expected);

        });
        it('should parse date from parseDate#2', function () {
            var given = '13 lipca 2014 18:01';
            given = DateUtils.parseDate(given);
            var expected =new  Date(2014, 6, 13, 18, 1);
            var result = DateUtils.dateFromString(given);
            expect(result).toEqual(expected);

        });
    });
});
