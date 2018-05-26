"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var utils_1 = require("../src/utils");
describe('utils', function () {
    describe('#omit', function () {
        it('should return a new object without the supplied keys', function () {
            var obj = { a: 1, b: 2, c: 3, d: { e: 4 } };
            var newObj = utils_1.omit(obj, ['a', 'd']);
            chai_1.expect(newObj).to.deep.equal({
                b: 2,
                c: 3
            });
        });
    });
    describe('#pick', function () {
        it('should return a new object with only the asked keys', function () {
            var obj = { a: 1, b: 2, c: 3, d: { e: 4 } };
            var newObj = utils_1.pick(obj, ['a', 'b']);
            chai_1.expect(newObj).to.deep.equal({
                a: 1,
                b: 2
            });
        });
        it('should not add undefined supplied properties', function () {
            var obj = { a: 1, b: 2 };
            var newObj = utils_1.pick(obj, ['a', 'nonsense']);
            chai_1.expect(newObj).to.deep.equal({ a: 1 });
        });
    });
});
//# sourceMappingURL=utils.spec.js.map