import { expect } from 'chai'
import { LANDRegistry } from '../src/contracts/LANDRegistry'

describe('LANDRegistry', function() {
  describe('Version 0', function() {
    const version = 0
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
        ).to.equal(`${version},"${name}","${description}",${ipns}`)
      })

      it('should work with empty name/description', function() {
        expect(
          LANDRegistry.encodeLandData({
            version,
            name: '',
            description: '',
            ipns
          })
        ).to.equal('0,,,ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY')
      })

      it('should escape quotes', function() {
        expect(
          LANDRegistry.encodeLandData({
            version,
            name: 'This name has "quotes"',
            description: 'This description has "quotes"',
            ipns
          })
        ).to.equal(
          '0,"This name has \\"quotes\\"","This description has \\"quotes\\"",ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        )
      })

      it('should work with commas', function() {
        expect(
          LANDRegistry.encodeLandData({
            version,
            name: 'This name, has a comma',
            description: 'This description, has a comma',
            ipns
          })
        ).to.equal(
          '0,"This name, has a comma","This description, has a comma",ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        )
      })

      it('should throw if name is too long', function() {
        const name = 'This is a very long name. '
        expect(() => {
          LANDRegistry.encodeLandData({
            version,
            name: name + name + name + name + name + name,
            description,
            ipns
          })
        }).to.throw('name')
      })

      it('should throw if description is too long', function() {
        const description = 'This is a very long description. '
        expect(() => {
          LANDRegistry.encodeLandData({
            version,
            name,
            description:
              description +
              description +
              description +
              description +
              description +
              description +
              description,
            ipns
          })
        }).to.throw('description')
      })
    })
    describe('.decodeLandData', function() {
      it('should return a object with { version, name, description, ipns }', function() {
        expect(
          LANDRegistry.decodeLandData(
            `${version},"${name}","${description}",${ipns}`
          )
        ).to.deep.equal({
          version,
          name,
          description,
          ipns
        })
      })

      it('should work with nothing in between commas', function() {
        expect(
          LANDRegistry.decodeLandData(`${version},,,${ipns}`)
        ).to.deep.equal({
          version,
          name: '',
          description: '',
          ipns
        })
      })

      it('should work with empty values between quotes', function() {
        expect(
          LANDRegistry.decodeLandData(`${version},"","",${ipns}`)
        ).to.deep.equal({
          version,
          name: '',
          description: '',
          ipns
        })
      })

      it('should work with escaped quotes', function() {
        expect(
          LANDRegistry.decodeLandData(
            `${version},"This name has \\"quotes\\"","This description has \\"quotes\\"","${ipns}"`
          )
        ).to.deep.equal({
          version,
          name: 'This name has "quotes"',
          description: 'This description has "quotes"',
          ipns
        })
      })

      it('should work with commas', function() {
        expect(
          LANDRegistry.decodeLandData(
            `${version},"This name, has a comma","This description, has a comma",${ipns}`
          )
        ).to.deep.equal({
          version,
          name: 'This name, has a comma',
          description: 'This description, has a comma',
          ipns
        })
      })
    })
  })
})
