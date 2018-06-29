/**
 * {
    "id": 1765,
    "name": "EOS",
    "symbol": "EOS",
    "website_slug": "eos",
    "rank": 5,
    "circulating_supply": 878817071.0,
    "total_supply": 900000000.0,
    "max_supply": 1000000000.0,
    "quotes": {
      "USDT": {
        "price": 11.835041336,
        "volume_24h": 2086027279.727989,
        "market_cap": 10402386309.0,
        "percent_change_1h": -2.62,
        "percent_change_24h": 8.39,
        "percent_change_7d": -6.24
      },
      "USD": {
        "price": 12.124,
        "volume_24h": 2189740000.0,
        "market_cap": 10654778167.0,
        "percent_change_1h": 0.14,
        "percent_change_24h": 11.93,
        "percent_change_7d": -3.96
      }
    },
    "last_updated": 1527239652
  },
 */

export function getEosMarketInfo() {
  const url = 'https://api.coinmarketcap.com/v2/ticker/1765/?convert=USDT'
  return fetch(url).then(res => res.json()).then(result => {
    return result.data
  })
}
