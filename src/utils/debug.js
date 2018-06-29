export function __debug() {
  if (/__debug/.test(window.location.search)) {
    window.imToken = {}
    window.imToken.eosAccountName = 'ge2tsmzzgene'
    window.imToken.eosProvider = 'https://api1-imtoken.eosasia.one'
    window.imToken.callAPI = (apiName, params, cb) => {
      // cb(null, true)
      cb && cb({ message: '这是一个 mock 的失败消息' }, true)
    }
  }
}
