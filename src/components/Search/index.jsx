import React from 'react'
import PropTypes from 'prop-types'
import Loading from 'react-loading'
import styles from './index.css'
import BPList from 'components/Common/BPList'
import Toast from 'components/Common/Toast'
import Input from './Input'
import i18n from 'i18n'
import { connect } from 'dva'
import initApp from '../../initApp'

class Search extends React.Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
  }

  static defaultProps = {
    appState: {},
  }

  constructor(props) {
    super(props)
    initApp(props)

    const hash = props.location.hash || ''
    this.state = {
      searching: false,
      searchedData: [],
      keyword: hash.replace('#', ''),
    }
  }

  componentDidMount() {
    const { keyword } = this.state
    if (keyword) {
      this.handleSearch(keyword)
    } else {
      this.searchInput.focusTextInput()
    }
  }

  render() {
    return (
      <div className={styles.wrap}>
        <Input
          ref={(input) => { this.searchInput = input }}
          value={this.state.keyword}
          onChange={this.handleSearch}
          onCancel={() => window.history.back()}
        />
        {this.renderLoading()}
        {this.renderList()}
      </div>
    )
  }

  renderLoading() {
    return this.state.searching && (
      <div className={styles.loading}><Loading color="#000" type="bubbles" height={30} width={30} /></div>
    )
  }

  renderList() {
    const { searchedData, keyword, searching } = this.state
    if (!searchedData.length && keyword && !searching) {
      return this.renderListEmpty()
    }

    const data = {
      producers: searchedData,
      selectedProducers: this.props.appState.selectedProducers,
    }

    return <BPList
      appState={data}
      onSelected={this.handleCheck}
    />
  }

  renderListEmpty() {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>{i18n.no_search_data}</p>
      </div>
    )
  }

  handleCheck = (bp, selected, add) => {
    if (selected.length > 30) {
      Toast.show(i18n.producers_num_limit)
      return
    }
    this.props.dispatch({
      type: 'appState/update',
      payload: {
        selectedProducers: selected
      }
    })
    Toast.show(add ? i18n.added : i18n.canceled)
  }

  handleSearch = (keyword) => {
    const { appState } = this.props
    this.setState({ searching: true, searchedData: [], keyword }, () => {
      this.searchDelay && clearTimeout(this.searchDelay)
      this.searchDelay = setTimeout(() => {
        const searchedData = []
        const key = keyword.trim()
        appState.producers.forEach(producer => {
          const reg = new RegExp(key, 'i')
          if (producer.title.match(reg) || producer.meta.owner.match(reg)) {
            searchedData.push(producer)
          }
        })
        this.setState({ searching: false, searchedData: key ? searchedData : [] })
        this.props.history.replace(`/search/#${keyword}`)
      }, !keyword ? 0 : 500)
    })
  }
}

export default connect(({ appState }) => ({ appState }))(Search)
