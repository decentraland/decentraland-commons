import * as fs from 'fs'
import sshTunnel from 'tunnel-ssh'

import { Log } from '../log'
import { sleep } from '../utils'

const log = new Log('SSH')

/**
 * Connect via an SSH tunnel. It uses tunnel-ssh behind the scenes. Check {@link https://github.com/agebrock/tunnel-ssh} for more info.
 * @namespace
 */
export namespace tunnel {
  /**
   * Connect using an SSH tunnel
   * @param  {object|string} configOrPath - Object or path to JSON file which describes the connection. See {@link tunnel#readTunnelConfig}
   * @return {Promise<number>} - Fires when the tunnel connection has been stablished. It receives the tunnel port as a parameter
   */
  export function connect(configOrPath) {
    let tunnelConfig = readTunnelConfig(configOrPath)

    if (!tunnelConfig) {
      throw new Error(
        'Tried to connect to ssh tunnel without a valid configuration'
      )
    }

    log.info('Connecting to SSH tunnel')
    let currentTunnel = null

    return new Promise((resolve, reject) =>
      sshTunnel(tunnelConfig, (error, _tunnel) => {
        currentTunnel = _tunnel
        resolve(tunnelConfig.localPort)
      }).on('error', async (error, tunnel) => {
        log.info('Tunnel error', error.toString())
        if (currentTunnel) currentTunnel.close()

        this.close()
        await sleep(1000)

        tunnel
          .connect(configOrPath)
          .then(resolve)
          .catch(reject)
      })
    )
  }

  /**
   * Uses an object or reads one from the file system describing the connection.
   * @example <caption>A minimal example contains</caption>
   * {
   *   'username': 'remote_username',
   *   'host': 'remote_host',
   *   'privateKey': 'path_to_private_key',
   *   'port': 22024,
   *   'dstPort': 27017,
   *   'localPort': ''
   * }
   * @param  {object|string} configOrPath - The manifest for the tunnel configuration. It can be the filesystem path to the json file or the object itself.
   * @return {object} - The parsed configuration
   */
  export function readTunnelConfig(configOrPath) {
    let tunnelConfig = null

    if (typeof configOrPath === 'string') {
      tunnelConfig = fs.readFileSync(configOrPath)
      tunnelConfig = JSON.parse(tunnelConfig)
    } else {
      tunnelConfig = Object.assign({}, configOrPath)
    }

    if (tunnelConfig && tunnelConfig.privateKey) {
      tunnelConfig.privateKey = fs.readFileSync(tunnelConfig.privateKey)
    }

    return tunnelConfig
  }
}
