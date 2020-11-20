import { request } from '@octokit/request'

class GithubMgr {
  constructor() {
    this.username = null
    this.personal_access_token = null
    this.client = null
  }

  isSecretsSet() {
    return this.username !== null || this.personal_access_token !== null
  }

  setSecrets(secrets) {
    this.username = secrets.GITHUB_USERNAME
    this.personal_access_token = secrets.GITHUB_PERSONAL_ACCESS_TOKEN
    this.client = request.defaults({
      headers: {
        authorization: `token ${secrets.GITHUB_PERSONAL_ACCESS_TOKEN}`
      }
    })
  }

  async findDidInGists(handle, did) {
    if (!handle) throw new Error('no github handle provided')
    if (!did) throw new Error('no did provided')

    const thirtyMinutesAgo = new Date(
      new Date().setMinutes(new Date().getMinutes() - 30)
    )

    return this.client('GET /users/:username/gists', {
      username: handle,
      since: thirtyMinutesAgo
    }).then(result => {
      let status = ''
      const gists = result.data
      if (!gists.length) return status
      console.log(gists)

      // Return the URL of the gist with the did
    })

    console.log(gists)
    //     // No gists
    //     if (!gists || !gists.length) satus = "none";
    //     // No challenge-code
    //     gists.forEach(gist => {
    //       if (gist.full_text.includes(did)) {
    //         status = "https://twitter.com/" + handle + "/status/";
    //         status = status + tweet.id_str;
    //       }
    //     });
    //     // No DID
    //     return status;
    //   });
  }
}

module.exports = GithubMgr
