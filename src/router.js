import React from 'react'
import { Router, Route, Switch } from 'dva/router'
import Home from './components/Home'
import Vote from './components/Vote'
import Search from './components/Search'
import Detail from './components/Detail'
import Profile from './components/Profile'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/vote" exact component={Vote} />
        <Route path="/search" exact component={Search} />
        <Route path="/detail/:id" exact component={Detail} />
        <Route path="/profile" exact component={Profile} />
      </Switch>
    </Router>
  )
}

export default RouterConfig
