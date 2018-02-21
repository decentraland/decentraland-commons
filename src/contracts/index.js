// This is auto-generated code
// Changes here will be lost

import { DecentralandVesting } from './DecentralandVesting'
import { LANDRegistry } from './LANDRegistry'
import { MANAToken } from './MANAToken'
import { Marketplace } from './Marketplace'
import { ReturnMANA } from './ReturnMANA'
import { TerraformReserve } from './TerraformReserve'

Object.assign(
  DecentralandVesting.prototype,
  {
    duration: function(...args) {
      return this.call('duration', ...args)
    },
    cliff: function(...args) {
      return this.call('cliff', ...args)
    },
    beneficiary: function(...args) {
      return this.call('beneficiary', ...args)
    },
    terraformReserve: function(...args) {
      return this.call('terraformReserve', ...args)
    },
    returnVesting: function(...args) {
      return this.call('returnVesting', ...args)
    },
    vestedAmount: function(...args) {
      return this.call('vestedAmount', ...args)
    },
    releasableAmount: function(...args) {
      return this.call('releasableAmount', ...args)
    },
    revoked: function(...args) {
      return this.call('revoked', ...args)
    },
    release: function(...args) {
      return this.transaction('release', ...args)
    },
    revocable: function(...args) {
      return this.call('revocable', ...args)
    },
    owner: function(...args) {
      return this.call('owner', ...args)
    },
    released: function(...args) {
      return this.call('released', ...args)
    },
    releaseForeignToken: function(_token, amount, ...args) {
      return this.transaction('releaseForeignToken', _token, amount, ...args)
    },
    revoke: function(...args) {
      return this.transaction('revoke', ...args)
    },
    start: function(...args) {
      return this.call('start', ...args)
    },
    lockMana: function(amount, ...args) {
      return this.transaction('lockMana', amount, ...args)
    },
    releaseTo: function(target, ...args) {
      return this.transaction('releaseTo', target, ...args)
    },
    changeBeneficiary: function(target, ...args) {
      return this.transaction('changeBeneficiary', target, ...args)
    },
    transferOwnership: function(newOwner, ...args) {
      return this.transaction('transferOwnership', newOwner, ...args)
    },
    token: function(...args) {
      return this.call('token', ...args)
    }
  },
  DecentralandVesting.prototype
)

Object.assign(
  LANDRegistry.prototype,
  {
    proxyOwner: function(...args) {
      return this.call('proxyOwner', ...args)
    },
    name: function(...args) {
      return this.call('name', ...args)
    },
    totalSupply: function(...args) {
      return this.call('totalSupply', ...args)
    },
    assetsOf: function(holder, ...args) {
      return this.call('assetsOf', holder, ...args)
    },
    safeHolderOf: function(assetId, ...args) {
      return this.call('safeHolderOf', assetId, ...args)
    },
    isOperatorAuthorizedFor: function(operator, assetHolder, ...args) {
      return this.call(
        'isOperatorAuthorizedFor',
        operator,
        assetHolder,
        ...args
      )
    },
    currentContract: function(...args) {
      return this.call('currentContract', ...args)
    },
    description: function(...args) {
      return this.call('description', ...args)
    },
    owner: function(...args) {
      return this.call('owner', ...args)
    },
    symbol: function(...args) {
      return this.call('symbol', ...args)
    },
    transfer: function(to, assetId, userData, operatorData, ...args) {
      return this.transaction(
        'transfer',
        to,
        assetId,
        userData,
        operatorData,
        ...args
      )
    },
    assetData: function(assetId, ...args) {
      return this.call('assetData', assetId, ...args)
    },
    authorizeOperator: function(operator, authorized, ...args) {
      return this.transaction(
        'authorizeOperator',
        operator,
        authorized,
        ...args
      )
    },
    safeAssetData: function(assetId, ...args) {
      return this.call('safeAssetData', assetId, ...args)
    },
    assetCount: function(holder, ...args) {
      return this.call('assetCount', holder, ...args)
    },
    assetByIndex: function(holder, index, ...args) {
      return this.call('assetByIndex', holder, index, ...args)
    },
    holderOf: function(assetId, ...args) {
      return this.call('holderOf', assetId, ...args)
    },
    transferOwnership: function(_newOwner, ...args) {
      return this.transaction('transferOwnership', _newOwner, ...args)
    },
    initialize: function(data, ...args) {
      return this.transaction('initialize', data, ...args)
    },
    authorizeDeploy: function(beneficiary, ...args) {
      return this.transaction('authorizeDeploy', beneficiary, ...args)
    },
    forbidDeploy: function(beneficiary, ...args) {
      return this.transaction('forbidDeploy', beneficiary, ...args)
    },
    assignNewParcel: function(x, y, beneficiary, ...args) {
      return this.transaction('assignNewParcel', x, y, beneficiary, ...args)
    },
    assignMultipleParcels: function(x, y, beneficiary, ...args) {
      return this.transaction(
        'assignMultipleParcels',
        x,
        y,
        beneficiary,
        ...args
      )
    },
    destroy: function(assetId, ...args) {
      return this.transaction('destroy', assetId, ...args)
    },
    ping: function(...args) {
      return this.transaction('ping', ...args)
    },
    setLatestToNow: function(user, ...args) {
      return this.transaction('setLatestToNow', user, ...args)
    },
    clearLand: function(x, y, ...args) {
      return this.transaction('clearLand', x, y, ...args)
    },
    encodeTokenId: function(x, y, ...args) {
      return this.call('encodeTokenId', x, y, ...args)
    },
    decodeTokenId: function(value, ...args) {
      return this.call('decodeTokenId', value, ...args)
    },
    exists: function(assetId, ...args) {
      return this.call('exists', assetId, ...args)
    },
    ownerOfLand: function(x, y, ...args) {
      return this.call('ownerOfLand', x, y, ...args)
    },
    ownerOfLandMany: function(x, y, ...args) {
      return this.call('ownerOfLandMany', x, y, ...args)
    },
    landOf: function(owner, ...args) {
      return this.call('landOf', owner, ...args)
    },
    landData: function(x, y, ...args) {
      return this.call('landData', x, y, ...args)
    },
    transferLand: function(x, y, to, ...args) {
      return this.transaction('transferLand', x, y, to, ...args)
    },
    transferManyLand: function(x, y, to, ...args) {
      return this.transaction('transferManyLand', x, y, to, ...args)
    },
    updateLandData: function(x, y, data, ...args) {
      return this.transaction('updateLandData', x, y, data, ...args)
    },
    updateManyLandData: function(x, y, data, ...args) {
      return this.transaction('updateManyLandData', x, y, data, ...args)
    }
  },
  LANDRegistry.prototype
)

Object.assign(
  MANAToken.prototype,
  {
    mintingFinished: function(...args) {
      return this.call('mintingFinished', ...args)
    },
    name: function(...args) {
      return this.call('name', ...args)
    },
    approve: function(_spender, _value, ...args) {
      return this.transaction('approve', _spender, _value, ...args)
    },
    totalSupply: function(...args) {
      return this.call('totalSupply', ...args)
    },
    transferFrom: function(_from, _to, _value, ...args) {
      return this.transaction('transferFrom', _from, _to, _value, ...args)
    },
    decimals: function(...args) {
      return this.call('decimals', ...args)
    },
    unpause: function(...args) {
      return this.transaction('unpause', ...args)
    },
    mint: function(_to, _amount, ...args) {
      return this.transaction('mint', _to, _amount, ...args)
    },
    burn: function(_value, ...args) {
      return this.transaction('burn', _value, ...args)
    },
    paused: function(...args) {
      return this.call('paused', ...args)
    },
    finishMinting: function(...args) {
      return this.transaction('finishMinting', ...args)
    },
    pause: function(...args) {
      return this.transaction('pause', ...args)
    },
    owner: function(...args) {
      return this.call('owner', ...args)
    },
    symbol: function(...args) {
      return this.call('symbol', ...args)
    },
    allowance: function(_owner, _spender, ...args) {
      return this.call('allowance', _owner, _spender, ...args)
    },
    transferOwnership: function(newOwner, ...args) {
      return this.transaction('transferOwnership', newOwner, ...args)
    },
    balanceOf: function(_owner, ...args) {
      return this.call('balanceOf', _owner, ...args)
    },
    transfer: function(_to, _value, ...args) {
      return this.transaction('transfer', _to, _value, ...args)
    }
  },
  MANAToken.prototype
)

Object.assign(Marketplace.prototype, {}, Marketplace.prototype)

Object.assign(
  ReturnMANA.prototype,
  {
    transferBackMANAMany: function(_addresses, _amounts, ...args) {
      return this.transaction(
        'transferBackMANAMany',
        _addresses,
        _amounts,
        ...args
      )
    },
    terraformReserve: function(...args) {
      return this.call('terraformReserve', ...args)
    },
    returnVesting: function(...args) {
      return this.call('returnVesting', ...args)
    },
    burnMana: function(_amount, ...args) {
      return this.transaction('burnMana', _amount, ...args)
    },
    owner: function(...args) {
      return this.call('owner', ...args)
    },
    transferBackMANA: function(_address, _amount, ...args) {
      return this.transaction('transferBackMANA', _address, _amount, ...args)
    },
    transferOwnership: function(newOwner, ...args) {
      return this.transaction('transferOwnership', newOwner, ...args)
    },
    token: function(...args) {
      return this.call('token', ...args)
    }
  },
  ReturnMANA.prototype
)

Object.assign(
  TerraformReserve.prototype,
  {
    setTargetContract: function(target, ...args) {
      return this.transaction('setTargetContract', target, ...args)
    },
    totalLocked: function(...args) {
      return this.call('totalLocked', ...args)
    },
    changeContractState: function(_acceptingDeposits, ...args) {
      return this.transaction(
        'changeContractState',
        _acceptingDeposits,
        ...args
      )
    },
    lockMana: function(_from, mana, ...args) {
      return this.transaction('lockMana', _from, mana, ...args)
    },
    manaToken: function(...args) {
      return this.call('manaToken', ...args)
    },
    owner: function(...args) {
      return this.call('owner', ...args)
    },
    landClaim: function(...args) {
      return this.call('landClaim', ...args)
    },
    lockedBalance: function(input0, ...args) {
      return this.call('lockedBalance', input0, ...args)
    },
    acceptingDeposits: function(...args) {
      return this.call('acceptingDeposits', ...args)
    },
    transferOwnership: function(newOwner, ...args) {
      return this.transaction('transferOwnership', newOwner, ...args)
    }
  },
  TerraformReserve.prototype
)

export {
  DecentralandVesting,
  LANDRegistry,
  MANAToken,
  Marketplace,
  ReturnMANA,
  TerraformReserve
}
