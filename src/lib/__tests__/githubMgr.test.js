const GithubMgr = require('../githubMgr')

describe('TwitterMgr', () => {
  let sut
  let fakeDid = 'did:3:Qmasdfasdf'
  let handle = 'pi0neerpat'
  let gistUrl = 'https://twitter.com/oedtest/status/1078648593987395584'

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
    sut = new GithubMgr()
  })

  test('empty constructor', () => {
    expect(sut).not.toBeUndefined()
  })

  test('setSecrets', () => {
    expect(sut.isSecretsSet()).toEqual(false)
    sut.setSecrets({
      GITHUB_USERNAME: 'pi0neerpat',
      GITHUB_PERSONAL_ACCESS_TOKEN: 'da6988ec64d62d2e4642b519c606448124b3c0db'
    })
    expect(sut.isSecretsSet()).toEqual(true)
  })

  test('client authenticated', done => {
    sut.client('GET /users/octocat/orgs').then(res => {
      console.log(`Rate limit: ${res.headers['x-ratelimit-limit']}`)
      done()
    })
  })

  test('findDidInGists() no handle', done => {
    sut
      .findDidInGists()
      .then(resp => {
        fail("shouldn't return")
      })
      .catch(err => {
        expect(err.message).toEqual('no github handle provided')
        done()
      })
  })

  test('findDidInGists() no did', done => {
    sut
      .findDidInGists(handle)
      .then(resp => {
        fail("shouldn't return")
      })
      .catch(err => {
        expect(err.message).toEqual('no did provided')
        done()
      })
  })

  test('findDidInGists() did found', done => {
    sut.client = jest.fn(() => {
      return Promise.resolve({
        data: [
          { full_text: 'my did is ' + fakeDid, id_str: '1078648593987395584' }
        ]
      })
    })

    sut
      .findDidInGists(handle, fakeDid)
      .then(resp => {
        console.log(resp)
        expect(resp).toEqual(gistUrl)
        done()
      })
      .catch(err => {
        fail(err)
        done()
      })
  })

  test('findDidInGists() did not found', done => {
    sut.client = jest.fn(() => {
      return Promise.resolve({ data: [] })
    })

    sut
      .findDidInGists(handle, fakeDid)
      .then(resp => {
        expect(resp).toEqual('')
        done()
      })
      .catch(err => {
        fail(err)
        done()
      })
  })
})
