import i18n from 'i18n'

async function _getProducers(rpcUrl) {
  const locale = i18n.lang

  return fetch(rpcUrl, {
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "blockProducers.getList",
      params: []
    }),
    headers: {
      'X-LOCALE': locale,
    },
    method: 'POST',
  }).then(res => res.json())
    .then(res => res.result)
}

function getRpcURL() {
  return window.imToken.eosBpListUrl
}

export async function getProducers() {
  const rpcUrl = getRpcURL()

  return _getProducers(rpcUrl).then(res => {

    const sortByVoteRows = res.slice(0).sort((a, b) => {
      return parseFloat(a.meta.totalVotes) - parseFloat(b.meta.totalVotes) > 0 ? -1 : 1
    })

    return res.map(item => {
      item.id = item.meta.owner
      const index = sortByVoteRows.findIndex((el) => {
        return el.meta.owner === item.meta.owner
      })
      item.votesOrder = index >= 0 ? index + 1 : 'None'
      return item
    })
  })
}

export async function reportPV(accountName) {
  const rpcUrl = getRpcURL()

  const locale = i18n.lang

  return fetch(rpcUrl, {
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "blockProducers.statisticPageView",
      params: [{ account_name: accountName }]
    }),
    headers: {
      'X-LOCALE': locale,
    },
    method: 'POST',
  }).then(res => res.json())
    .then(res => res.result)
}

