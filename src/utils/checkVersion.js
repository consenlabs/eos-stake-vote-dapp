export function isOldVersion() {
  const agent = window.imToken && window.imToken.agent
  if (agent) {
    const matchs = agent.match(/(android|ios):((\d+)\.(\d+)\.(\d+)\.(\d+)):(\d+)/);
    if (matchs) {
      const os = matchs[1]
      const mainV = +matchs[3]
      const secondV = +matchs[4]
      const thirdV = +matchs[5]
      const buildV = +matchs[6]
      const codePushV = +matchs[7]

      // check version <= 2.0.1.179:1
      if (mainV === 2 && secondV === 0) {
        if (thirdV < 1) return true
        if (thirdV === 1) {
          if (buildV <= 179) {
            if (codePushV <= 1) return true
          }
        }
      }
    }
  }
  return false
}
