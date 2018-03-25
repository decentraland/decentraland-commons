import { expect } from 'chai'
import { LANDRegistry } from '../dist/contracts/LANDRegistry'

describe('LANDRegistry', function() {
  describe('Version 0', function() {
    describe('.encodeLandData', function() {
      it('should return a CSV with version,name,description,ipns', function() {
        const data = {
          version: 0,
          name: 'My Parcel',
          description: 'This is my awesome parcel',
          ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        }
        const expected =
          '0,"My Parcel","This is my awesome parcel","ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY"'
        expect(LANDRegistry.encodeLandData(data)).to.equal(expected)
      })

      it('should work with empty name/description', function() {
        const data = {
          version: 0,
          name: '',
          description: '',
          ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        }
        const expected = '0,"","","ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY"'
        expect(LANDRegistry.encodeLandData(data)).to.equal(expected)
      })

      it('should escape quotes', function() {
        const data = {
          version: 0,
          name: 'This name has "quotes"',
          description: 'This description has "quotes"',
          ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        }
        const expected =
          '0,"This name has ""quotes""","This description has ""quotes""","ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY"'
        expect(LANDRegistry.encodeLandData(data)).to.equal(expected)
      })

      it('should support commas', function() {
        const data = {
          version: 0,
          name: 'This name, has a comma',
          description: 'This description, has a comma',
          ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        }
        const expected =
          '0,"This name, has a comma","This description, has a comma","ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY"'
        expect(LANDRegistry.encodeLandData(data)).to.equal(expected)
      })

      it('should support line breaks', function() {
        const data = {
          version: 0,
          name: 'My Parcel',
          description: `This description
has a line break`,
          ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        }
        const expected = `0,"My Parcel","This description
has a line break","ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY"`
        expect(LANDRegistry.encodeLandData(data)).to.equal(expected)
      })

      it('should throw if name is too long', function() {
        const data = {
          version: 0,
          name:
            'This name is very very very very very very very very very very very very very very very very very very very very very very long',
          description: 'This is my awesome parcel',
          ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        }
        expect(() => LANDRegistry.encodeLandData(data)).to.throw('name')
      })

      it('should throw if description is too long', function() {
        const data = {
          version: 0,
          name: 'My Parcel',
          description:
            'This description is very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long',
          ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        }
        expect(() => LANDRegistry.encodeLandData(data)).to.throw('description')
      })
    })
    describe('.decodeLandData', function() {
      it('should return an object with { version, name, description, ipns }', function() {
        const data = '0,"My Parcel","This is my awesome parcel","ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY"'
        const expected = {
          version: 0,
          name: 'My Parcel',
          description: 'This is my awesome parcel',
          ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        }
        expect(LANDRegistry.decodeLandData(data)).to.deep.equal(expected)
      })

      it('should unescape quotes', function() {
        const data =
          '0,"This name has ""quotes""","This description has ""quotes""","ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY"'
        const expected = {
          version: 0,
          name: 'This name has "quotes"',
          description: 'This description has "quotes"',
          ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        }
        expect(LANDRegistry.decodeLandData(data)).to.deep.equal(expected)
      })

      it('should support commas', function() {
        const data =
          '0,"This name, has a comma","This description, has a comma","ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY"'
        const expected = {
          version: 0,
          name: 'This name, has a comma',
          description: 'This description, has a comma',
          ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        }
        expect(LANDRegistry.decodeLandData(data)).to.deep.equal(expected)
      })

      it('should support line breaks', function() {
        const data = `0,"My Parcel","This description
has a line break","ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY"`
        const expected = {
          version: 0,
          name: 'My Parcel',
          description: `This description
has a line break`,
          ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        }
        expect(LANDRegistry.decodeLandData(data)).to.deep.equal(expected)
      })

      it('should work with nothing in between commas for name/description', function() {
        const data = '0,,,"ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY"'
        const expected = {
          version: 0,
          name: '',
          description: '',
          ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        }
        expect(LANDRegistry.decodeLandData(data)).to.deep.equal(expected)
      })

      it('should work if ipns link is not surrounded by quotes', function() {
        const data = '0,"My Parcel","This is my awesome parcel",ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        const expected = {
          version: 0,
          name: 'My Parcel',
          description: 'This is my awesome parcel',
          ipns: 'ipns:QmVP3WAkJRcc9AkS83r5fwaWAxpgtP7cpDupVWRos9qStY'
        }
        expect(LANDRegistry.decodeLandData(data)).to.deep.equal(expected)
      })

      it('should work with a blank ipns link', function() {
        const data = '0,"My Parcel","This is my awesome parcel",'
        const expected = {
          version: 0,
          name: 'My Parcel',
          description: 'This is my awesome parcel',
          ipns: ''
        }
        expect(LANDRegistry.decodeLandData(data)).to.deep.equal(expected)
      })
    })
  })
})
