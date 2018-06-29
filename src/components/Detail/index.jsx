import React from 'react'
import Button from 'components/Common/Button'
import Toast from 'components/Common/Toast'
import styles from './index.css'
import initApp from '../../initApp'
import { reportPV, getProducers } from '../../utils/rpc'
import { calculateVoteWeight } from '../../utils/calcVoteWeight'
import { updateGlobalState } from '../../utils/updateGlobalState'
import { connect } from 'dva'
import i18n from 'i18n'

class Detail extends React.Component {
  static defaultProps = {
    appState: {
      producers: []
    }
  }

  constructor(props) {
    super(props)
    initApp(props)

    const id = props.match.params.id

    this.state = {
      producer: props.appState.producers.find(p => p.id === id),
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id
    reportPV(id)

    getProducers().then(producers => {
      this.props.dispatch({ type: 'appState/update', payload: { producers } })
    })

    setTimeout(() => {
      if (window.eos) {
        updateGlobalState(this.props.dispatch).catch(e => { })
      }
    }, 1000)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const id = this.props.match.params.id
    this.setState({
      producer: nextProps.appState.producers.find(p => p.id === id),
    })
  }

  render() {
    const { producer } = this.state
    if (!producer) return null

    return (
      <div className={styles.wrap}>
        {this.renderHeader(producer)}
        {this.renderDetail(producer)}
        {this.renderContacts(producer)}
      </div>
    )
  }

  renderHeader(producer) {

    return (
      <div className={styles.header}>
        <div className={styles.banner} style={{ backgroundImage: `url(${producer.banner})` }}> </div>
        <div className={styles.logo} style={{ backgroundImage: `url(${producer.logo})` }}> </div>
        <h2 className={styles.title}>{producer.title}</h2>
        <h4 className={styles.accountName}>@{producer.id}</h4>
        <h3 className={styles.intro}>{producer.intro}</h3>
        {this.renderButtons(producer)}
      </div>
    )
  }

  renderDetail(producer) {
    const { appState } = this.props
    const rate = producer.meta.totalVotes / appState.totalProducerVoteWeight
    const percent = parseFloat(rate * 100).toFixed(2)
    const votes = (producer.meta.totalVotes / calculateVoteWeight() / 10000).toFixed(0)

    return (
      <div className={styles.detail}>
        <div className={styles.row}>
          <div className={styles.rowName}>{i18n.votes_weight}</div>
          <div className={styles.rowValue}>{votes} ({percent}%)</div>
        </div>

        <div className={styles.row}>
          <div className={styles.rowName}>{i18n.location}</div>
          <div className={styles.rowValue}>{producer.locationName}</div>
        </div>

        {producer.nodes && producer.nodes.length ?
          <div className={styles.row}>
            <div className={styles.rowName}>{i18n.node_location}</div>
            <div className={styles.rowValue}>{producer.nodes.join('、')}</div>
          </div> : null
        }

        <div className={styles.row}>
          <div className={styles.rowName}>{i18n.website}</div>
          <div className={styles.rowValue}><a href={producer.meta.url}>{producer.meta.url}</a></div>
        </div>

        <div className={styles.row}>
          <div className={styles.rowName}>{i18n.team_introduce}</div>
          <div className={styles.rowValue}>{producer.detail}</div>
        </div>
      </div >
    )
  }

  getSocialPrefix(key) {
    switch (key) {
      case 'Email':
        return 'mailto:'
      case 'Facebook':
        return 'https://facebook.com/'
      case 'Twitter':
        return 'https://twitter.com/'
      default:
        return ''
    }
  }

  renderContacts(producer) {
    if (!producer.social) return null
    const socials = []
    for (let key in producer.social) {
      socials.push([key, producer.social[key]])
    }
    return (
      <div className={styles.detail}>
        <div className={styles.row}>
          <div className={styles.rowName}>{i18n.contact}</div>
          {socials.map(s => {
            const link = this.getSocialPrefix(s[0]) + s[1]
            return <div className={styles.socialRow} key={s[0]}>
              <span>{s[0]}</span>
              <a href={link}>{s[1]}</a>
            </div>
          })}
        </div>
      </div>
    )
  }

  renderButtons(producer) {
    const { appState } = this.props
    const isSelected = !!appState.selectedProducers.find(p => p.id === producer.id)
    return (
      <div className={styles.buttons}>
        <Button title={isSelected ? '✓ ' + i18n.unadd : i18n.add} onClick={() => this.handleAdd(isSelected)} style={styles.button} />
        <Button title={i18n.vote_now} onClick={this.handleVote} style={styles.button} />
      </div>
    )
  }

  handleVote = () => {
    const { producer } = this.state
    this.props.dispatch({
      type: 'appState/update',
      payload: {
        selectedProducers: [producer],
      }
    })
    this.props.history.push('/vote')
  }

  handleAdd = (isSelected) => {
    const { producer } = this.state
    const { appState } = this.props
    const selectedProducers = appState.selectedProducers.slice(0)

    if (isSelected) {
      const index = selectedProducers.findIndex(p => p.id === producer.id)
      selectedProducers.splice(index, 1)
    } else {
      selectedProducers.push(producer)
    }

    this.props.dispatch({
      type: 'appState/update',
      payload: {
        selectedProducers: selectedProducers,
      }
    })
    Toast.show(isSelected ? i18n.canceled : i18n.added)
  }
}

export default connect(({ appState }) => ({ appState }))(Detail)
