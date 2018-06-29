import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import ListView from 'rmc-list-view'
import styles from './index.css'
import Checkbox from 'components/Common/Checkbox'
import i18n from 'i18n'
import enPartnerIcon from 'icon/partner-en@3x.png'
import zhPartnerIcon from 'icon/partner-ch@3x.png'

export default class List extends React.Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    onSelected: PropTypes.func.isRequired,
    onlyShowSelected: PropTypes.bool,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    appState: {
      producers: [],
      selectedProducers: [],
    },
    votes: 0,
    onlyShowSelected: false,
    disabled: false,
    onSelected: () => { }
  }

  constructor(props) {
    super(props)
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })

    this.state = {
      selected: props.appState.selectedProducers,
    }
  }

  render() {
    const { appState, onlyShowSelected } = this.props
    const listData = onlyShowSelected ? appState.selectedProducers : appState.producers

    // TODO: 排序筛选
    const sortType = appState.sortType
    let sortProducers = listData.slice(0)
    switch (sortType) {
      case 1:
        sortProducers = sortProducers.sort((a, b) => {
          return a.votesOrder < b.votesOrder ? -1 : 1
        })
        break
      case 2:
        sortProducers = sortProducers.sort((a, b) => {
          if (!a.locationName) return 1
          if (!b.locationName) return -1
          return a.locationName < b.locationName ? -1 : 1
        })
        break
      default:
    }

    const dataSource = this.dataSource.cloneWithRows(sortProducers)
    return (
      <div className={styles.listWrap}>
        <ListView
          dataSource={dataSource}
          className={styles.list}
          style={{ height: 64 * sortProducers.length, width: '100%' }}
          renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
          initialListSize={sortProducers.length}
        />
      </div>
    )
  }

  renderRow(rowData, sectionID, rowID) {
    const { disabled, appState } = this.props
    const { sortType } = appState
    const showOrder = sortType === 1

    const rowClass = classNames({
      [styles.row]: true,
      [styles.odd]: rowID % 2 === 1
    })
    const checked = !!this.props.appState.selectedProducers.find(x => x.id === rowData.id)
    const isPartner = rowData.partner
    const isRecommend = rowData.ad
    const partnerIcon = i18n.partner === 'partner_zh' ? zhPartnerIcon : enPartnerIcon

    return (
      <div className={rowClass} key={rowData.id}>
        {
          disabled ?
            <div className={styles.bp}>
              <div className={styles.title}>{rowData.title}
                {!!isPartner && <img src={partnerIcon} className={styles.partner} />}
              </div>
              <div className={styles.content}>
                {showOrder && <div className={styles.votes}>{rowData.votesOrder}</div>}
                {!!isRecommend && <div className={styles.recommend}>{i18n.recommend}</div>}
                {rowData.locationName && <div className={styles.desc}>{rowData.locationName + ' | '}</div>}
                <div className={styles.desc}>{rowData.intro || rowData.meta.url}</div>
              </div>
            </div>
            :
            <Link to={`/detail/${rowData.id}`} className={styles.bp}>
              <div className={styles.title}>{rowData.title}
                {!!isPartner && <img src={partnerIcon} className={styles.partner} />}
              </div>
              <div className={styles.content}>
                {showOrder && <div className={styles.votes}>{rowData.votesOrder}</div>}
                {!!isRecommend && <div className={styles.recommend}>{i18n.recommend}</div>}
                {rowData.locationName && <div className={styles.desc}>{rowData.locationName + ' | '}</div>}
                <div className={styles.desc}>{rowData.intro || rowData.meta.url}</div>
              </div>
            </Link>
        }
        {!disabled &&
          <Checkbox checked={checked} onChange={(e) => this.handleCheck(rowData, e)} />
        }
      </div>
    )
  }

  handleCheck = (bp, e) => {
    const checked = e.target.checked
    const selected = this.state.selected
    if (checked) {
      selected.push(bp)
    } else {
      const index = selected.findIndex(s => s.id === bp.id)
      selected.splice(index, 1)
    }
    this.setState({ selected })
    this.props.onSelected(bp, selected, checked)
  }
}
