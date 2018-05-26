import { expect } from 'chai'
import { omit, pick } from '../src/utils'

describe('utils', function() {
  describe('#omit', function() {
    it('should return a new object without the supplied keys', function() {
      const obj = { a: 1, b: 2, c: 3, d: { e: 4 } }
      const newObj = omit(obj, ['a', 'd'])

      expect(newObj).to.deep.equal({
        b: 2,
        c: 3
      })
    })
  })

  describe('#pick', function() {
    it('should return a new object with only the asked keys', function() {
      const obj = { a: 1, b: 2, c: 3, d: { e: 4 } }
      const newObj = pick(obj, ['a', 'b'])

      expect(newObj).to.deep.equal({
        a: 1,
        b: 2
      })
    })

    it('should not add undefined supplied properties', function() {
      const obj = { a: 1, b: 2 }
      const newObj = pick(obj, ['a', 'nonsense'])

      expect(newObj).to.deep.equal({ a: 1 })
    })
  })
})
