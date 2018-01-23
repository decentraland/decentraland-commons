import { expect } from 'chai'
import { LANDRegistry } from '../src/contracts/LANDRegistry'

describe('LANDRegistry', function() {
  describe('Version 0', function() {
    const version = '0'
    const name = 'My Parcel'
    const description = 'This is my awesome parcel'
    const ipns = 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
    describe('.encodeLandData', function() {
      it('should return a CSV with version,name,description,ipns', function() {
        expect(
          LANDRegistry.encodeLandData({
            version,
            name,
            description,
            ipns
          })
        ).to.equal(`${version},${name},${description},${ipns}`)
      })
    })
    describe('.decodeLandData', function() {
      it('should return a object with { version, name, description, ipns }', function() {
        expect(
          LANDRegistry.decodeLandData(
            `${version},${name},${description},${ipns}`
          )
        ).to.deep.equal({
          version,
          name,
          description,
          ipns
        })
      })
    })
  })
})
