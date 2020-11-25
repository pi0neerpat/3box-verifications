// import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import KeyResolver from '@ceramicnetwork/key-did-resolver'

import { initIPFS } from 'ipfs-s3-dag-get'
import { DID } from 'dids'
const didJWT = require('did-jwt')

class ClaimMgr {
  constructor() {
    this.signerPrivate = null
    this.signerPublic = null
  }

  isSecretsSet() {
    return (
      this.ipfs !== null &&
      this.signerPrivate !== null &&
      this.signerPublic !== null
    )
  }

  async setSecrets(secrets) {
    this.signerPrivate = secrets.KEYPAIR_PRIVATE_KEY
    this.signerPublic = secrets.KEYPAIR_PUBLIC_KEY
    const ipfsPath = secrets.IPFS_PATH
    const bucket = secrets.AWS_BUCKET_NAME
    const shardBlockstore = true
    this.ipfs = await initIPFS({ ipfsPath, bucket, shardBlockstore })
    this.resolver = {
      registry: {
        ...KeyResolver.getResolver()
        // ...ThreeIdResolver.getResolver(),
      }
    }
  }

  async issueTwitter(did, handle, url) {
    const signer = didJWT.SimpleSigner(this.signerPrivate)
    return didJWT
      .createJWT(
        {
          sub: did,
          iat: Math.floor(Date.now() / 1000),
          claim: {
            twitter_handle: handle,
            twitter_proof: url
          }
        },
        {
          issuer: 'did:https:verifications.3box.io',
          signer
        }
      )
      .then(jwt => {
        return jwt
      })
      .catch(err => {
        console.log(err)
      })
  }

  async issueGithub(did, handle, url) {
    const signer = didJWT.SimpleSigner(this.signerPrivate)
    return didJWT
      .createJWT(
        {
          sub: did,
          iat: Math.floor(Date.now() / 1000),
          claim: {
            github_handle: handle,
            github_proof: url
          }
        },
        {
          issuer: 'did:https:verifications.3box.io',
          signer
        }
      )
      .then(jwt => {
        return jwt
      })
      .catch(err => {
        console.log(err)
      })
  }

  async issueEmail(did, email) {
    const signer = didJWT.SimpleSigner(this.signerPrivate)
    return didJWT
      .createJWT(
        {
          sub: did,
          iat: Math.floor(Date.now() / 1000),
          claim: {
            email_address: email
          }
        },
        {
          issuer: 'did:https:verifications.3box.io',
          signer
        }
      )
      .then(jwt => {
        return jwt
      })
      .catch(err => {
        console.log(err)
      })
  }

  decode(jwt) {
    if (!this.signerPublic) throw new Error('no keypair created yet')
    return didJWT.decodeJWT(jwt)
  }

  getPublicKeyHex() {
    if (!this.signerPublic) throw new Error('no keypair created yet')
    return this.signerPublic
  }

  async verifyToken(token) {
    if (!token) throw new Error('no token')
    return didJWT.verifyJWT(token, { resolver: this.resolver })
  }
}

module.exports = ClaimMgr
