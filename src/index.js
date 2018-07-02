import dva from 'dva'
import createHistory from 'history/createBrowserHistory'
import './components/Common/Toast/index.css'
import './index.css'
import model from './model'

// 1. Initialize
const app = dva({
  history: createHistory(),
})

// 2. Plugins
// app.use({})

// 3. Model
// app.model(require('./models/example').default)
app.model(model)

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')

