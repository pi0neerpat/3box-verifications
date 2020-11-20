class GithubMgr {
  constructor() {
    this.username = null;
    this.personal_access_token = null;
  }

  isSecretsSet() {
    return this.username !== null || this.personal_access_token !== null;
  }

  setSecrets(secrets) {
    this.username = secrets.GITHUB_USERNAME;
    this.personal_access_token = secrets.GITHUB_PERSONAL_ACCESS_TOKEN;
  }

  async findDidInGists(handle, did) {
    if (!handle) throw new Error("no github handle provided");
    if (!did) throw new Error("no did provided");

    const thirtyMinutesAgo = new Date(
      new Date().setMinutes(new Date().getMinutes() - 30)
    );

    return fetch(
      `https://api.github.com/users/${handle}/gists?since=${thirtyMinutesAgo}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      }
    )
      .catch(err => {
        console.log("caught error", err.stack);
      })
      .then(res => {
        const gists = res.data;
        let status = "";
        // No gists
        if (!gists || !gists.length) satus = "none";
        // No challenge-code
        gists.forEach(gist => {
          if (gist.full_text.includes(did)) {
            status = "https://twitter.com/" + handle + "/status/";
            status = status + tweet.id_str;
          }
        });
        // No DID
        return status;
      });
  }
}

module.exports = GithubMgr;
