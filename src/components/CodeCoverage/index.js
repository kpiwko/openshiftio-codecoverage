import React from 'react'
import { Alert, Container, Table, Button } from 'reactstrap'
import PropTypes from 'prop-types'
import moment from 'moment'
import Icon from '../Icon'
import fetchCodecovioCoverage from './codecov.io'
import fetchSonarcloudioCoverage from './sonarcloud.io'

class CodeCoverageValue extends React.Component {
  constructor(props) {
    super(props)
    const value = props.value
    this.value = value
    this.ccJobUrl = props.ccJobUrl
    this.color =
      value >= 80.0 ? 'success' : value <= 40.0 ? 'danger' : 'warning'
  }

  render() {
    let button
    if (!isNaN(this.value)) {
      button = (
        <Button color={this.color}>{Number(this.value).toFixed(2)} %</Button>
      )
    } else {
      button = <img src={this.value} />
    }

    return <a href={this.ccJobUrl}>{button}</a>
  }
}

CodeCoverageValue.props = {
  value: PropTypes.number.isRequired,
  ccJobUrl: PropTypes.string.isRequired,
}

class CodeCoverageCI extends React.Component {
  constructor(props) {
    super(props)
    const latestCommit = props.latestCommit
    this.latestCommit = latestCommit
    if (
      latestCommit === null ||
      latestCommit.ciPassed === null ||
      latestCommit.ciPassed === undefined
    ) {
      this.icon = 'question-circle'
      this.iconStyle = 'text-warning'
    } else if (latestCommit.ciPassed === false) {
      this.icon = 'times-circle'
      this.iconStyle = 'text-danger'
    } else {
      this.icon = 'check-circle'
      this.iconStyle = 'text-success'
    }
  }

  render() {
    if (!this.latestCommit) {
      return null
    }

    return (
      <React.Fragment>
        <a href={this.latestCommit.ciUrl} className={this.iconStyle}>
          <Icon name={this.icon} />
        </a>
      </React.Fragment>
    )
  }
}

CodeCoverageCI.props = {
  latestCommit: PropTypes.object,
}

class CodeCoverageRepository extends React.Component {
  constructor(props) {
    super(props)
    this.ghRepository = props.ghRepository
    this.name = props.name
    this.latestCommit = props.latestCommit
  }

  render() {
    const latestCommit = this.latestCommit ? (
      <small>Latest commit {moment().from(this.latestCommit.date)}</small>
    ) : null

    return (
      <React.Fragment>
        <a href={this.ghRepository}>
          <Icon name={['fab', 'github']} /> <strong>{this.name}</strong>
        </a>
        <br />
        {latestCommit}
      </React.Fragment>
    )
  }
}

CodeCoverageRepository.props = {
  ghRepository: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  latestCommit: PropTypes.object,
}

class CodeCoverage extends React.Component {
  constructor(props) {
    super(props)
    this.org = props.org
    this.type = props.type
    this.ghRepository = props.ghRepository
    this.resolver =
      props.type === 'codecov.io'
        ? fetchCodecovioCoverage.bind(this, this.org)
        : fetchSonarcloudioCoverage.bind(this, this.org, this.ghRepository)
    this.state = {
      statusCode: 200,
      entries: [],
    }
  }

  async componentDidMount() {
    const { statusCode, entries } = await this.resolver()

    this.setState({
      statusCode,
      entries,
    })
  }

  sort(column, direction) {
    let data = this.state.entries || []
    direction = direction === 'down' ? 1.0 : -1.0
    if (column === 'name') {
      data.sort((entry1, entry2) => {
        return entry1[column].localeCompare(entry2[column]) * direction
      })
    } else if (column === 'coverage') {
      data.sort((entry1, entry2) => {
        return (entry1[column] - entry2[column]) * direction
      })
    }

    this.setState({
      statusCode: this.state.statusCode,
      entries: data,
    })
  }

  render() {
    if (this.state.statusCode >= 300 || this.state.statusCode < 200) {
      return (
        <Container>
          <h2>Code Coverage in {this.org} organization</h2>
          <Alert color="danger">
            Failed fetching data - HTTP {this.state.statusCode}
          </Alert>
        </Container>
      )
    }
    if (this.state.entries.length === 0) {
      return (
        <Container>
          <h2>Code Coverage in {this.org} organization</h2>
          <Alert color="info">
            Fetching code coverage results for {this.org}
          </Alert>
        </Container>
      )
    }

    return (
      <Container>
        <h1>Code Coverage in {this.org} organization</h1>
        <Table striped>
          <thead>
            <tr>
              <th>
                Repository{' '}
                <a onClick={this.sort.bind(this, 'name', 'up')}>
                  <Icon name="sort-alpha-up" />
                </a>{' '}
                <a onClick={this.sort.bind(this, 'name', 'down')}>
                  <Icon name="sort-alpha-down" />
                </a>
              </th>
              <th>CI</th>
              <th className="text-right">
                Coverage{' '}
                <a onClick={this.sort.bind(this, 'coverage', 'up')}>
                  <Icon name="sort-numeric-up" />
                </a>{' '}
                <a onClick={this.sort.bind(this, 'coverage', 'down')}>
                  <Icon name="sort-numeric-down" />
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.entries.map(repo => {
              return (
                <tr key={repo.name}>
                  <td>
                    <CodeCoverageRepository
                      name={repo.name}
                      ghRepository={repo.ghRepository}
                      latestCommit={repo.latestCommit}
                    />
                  </td>
                  <td>
                    <CodeCoverageCI latestCommit={repo.latestCommit} />
                  </td>
                  <td className="text-right">
                    <CodeCoverageValue
                      value={repo.coverage}
                      ccJobUrl={repo.ccJobUrl}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Container>
    )
  }
}

CodeCoverage.props = {
  org: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  ghRepository: PropTypes.string,
}

export default CodeCoverage
