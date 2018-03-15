import CSV from 'comma-separated-values'
import { abi } from './artifacts/LANDRegistry.json'
import { Contract } from '../ethereum'
import { env } from '../env'

const MAX_NAME_LENGTH = 50
const MAX_DESCRIPTION_LENGTH = 140

/** LANDToken contract class */
export class LANDRegistry extends Contract {
  static DataError = DataError

  static decodeLandData(data = '') {
    const version = data.charAt(0)
    switch (version) {
      case '0': {
        const [version, name, description, ipns] = CSV.parse(data)[0]

        return {
          version,
          // when a value is blank, csv.parse returns 0, so we fallback to empty string
          // to support stuff like `0,,,ipns:link`
          name: name || '',
          description: description || '',
          ipns: ipns || ''
        }
      }
      default:
        throw new DataError(
          `Unknown version when trying to decode land data: "${data}" (see https://github.com/decentraland/commons/blob/master/docs/land-data.md)`
        )
    }
  }

  static encodeLandData(data = {}) {
    switch (data.version.toString()) {
      case '0': {
        const { version, name, description, ipns } = data
        if (name.length > MAX_NAME_LENGTH) {
          throw new DataError(
            `The name is too long, max length allowed is ${MAX_NAME_LENGTH} chars`
          )
        }
        if (description.length > MAX_DESCRIPTION_LENGTH) {
          throw new DataError(
            `The description is too long, max length allowed is ${MAX_DESCRIPTION_LENGTH} chars`
          )
        }
        return CSV.encode([[version, name, description, ipns]])
      }
      default:
        throw new DataError(
          `Unknown version when trying to encode land data: "${JSON.stringify(
            data
          )}"
          (see https://github.com/decentraland/commons/blob/master/docs/land-data.md)`
        )
    }
  }

  static getContractName() {
    return 'LANDRegistry'
  }

  static getDefaultAddress() {
    return env.universalGet('LAND_REGISTRY_CONTRACT_ADDRESS')
  }

  static getDefaultAbi() {
    return abi
  }

  updateManyLandData(coordinates, data, opts = {}) {
    const x = coordinates.map(coor => coor.x)
    const y = coordinates.map(coor => coor.y)
    return this.transaction('updateManyLandData', x, y, data, opts)
  }

  assignNewParcel(x, y, address, opts = {}) {
    opts = Object.assign({ gas: 4000000, gasPrice: 28 * 1e9 }, opts)
    return this.transaction('assignNewParcel', x, y, address, opts)
  }

  assignMultipleParcels(x, y, address, opts = {}) {
    opts = Object.assign({ gas: 1000000, gasPrice: 28 * 1e9 }, opts)
    return this.transaction('assignMultipleParcels', x, y, address, opts)
  }
}

class DataError extends Error {
  constructor(message) {
    super(message)
    this.name = 'DataError'
  }
}
