export function __debug() {
  if (/__debug/.test(window.location.search)) {
    window.imToken = {}
    window.imToken.eosAccountName = 'ge2tsmzzgene'
    window.imToken.eosProvider = 'https://api1-imtoken.eosasia.one'
    window.imToken.callAPI = (apiName, params, cb) => {
      // cb(null, true)
      cb && cb({ message: "It's a vote message" }, true)
    }
  }
}
