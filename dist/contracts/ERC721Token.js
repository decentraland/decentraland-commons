'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ERC721Token = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ERC721Token = require('./artifacts/ERC721Token.json');

var _ethereum = require('../ethereum');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** ERC721Token contract class */
var ERC721Token = exports.ERC721Token = function (_Contract) {
  _inherits(ERC721Token, _Contract);

  function ERC721Token() {
    _classCallCheck(this, ERC721Token);

    return _possibleConstructorReturn(this, (ERC721Token.__proto__ || Object.getPrototypeOf(ERC721Token)).apply(this, arguments));
  }

  _createClass(ERC721Token, null, [{
    key: 'getContractName',
    value: function getContractName() {
      return 'ERC721Token';
    }
  }, {
    key: 'getDefaultAbi',
    value: function getDefaultAbi() {
      return _ERC721Token.abi;
    }
  }, {
    key: 'getDefaultAddress',
    value: function getDefaultAddress() {
      return '';
    }
  }]);

  return ERC721Token;
}(_ethereum.Contract);