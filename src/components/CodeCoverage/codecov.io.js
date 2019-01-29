import fetch from 'isomorphic-unfetch'
import get from 'lodash/get'

const fetchCodecovioCoverage = async org => {
  const res = await fetch(`https://codecov.io/api/gh/${org}`)

  if (!res.ok) {
    return {
      statusCode: res.status,
      entries: [],
    }
  }

  const { repos } = await res.json()
  const repoDetailPromises = repos.map(async repo => {
    return fetch(`https://codecov.io/api/gh/${org}/${repo.name}`)
      .then(response => {
        if (!response.ok) {
          const error = new Error(response.statusText)
          error.response = response
          return Promise.reject(error)
        }
        return response.json()
      })
      .then(data => {
        return {
          repository: repo.name,
          date: get(data, 'commit.timestamp'),
          id: get(data, 'commit.commitid'),
          message: get(data, 'commit.message'),
          ciPassed: get(data, 'commit.ci_passed'),
          ciUrl: `https://codecov.io/gh/${org}/${repo.name}/commit/${get(
            data,
            'commit.commitid'
          )}`,
        }
      })
      .catch(error => {
        console.error(
          `Unable to fetch ${
            repo.name
          } repository details from codecov.io, ${error}`
        )
        return Promise.resolve(null)
      })
  })

  // execute all requests for repository details and filter empty ones
  const repoDetails = (await Promise.all(repoDetailPromises)).filter(
    v => v !== null
  )

  return {
    statusCode: res.status,
    entries: repos.map(repo => {
      const latestCommit =
        repoDetails.find(
          repositoryDetails => repositoryDetails.repository === repo.name
        ) || null
      return {
        name: repo.name,
        language: repo.language,
        ghRepository: `https://github.com/${org}/${repo.name}`,
        ccJobUrl: `https://codecov.io/gh/${org}/${repo.name}`,
        latestCommit,
        coverage: repo.coverage,
      }
    }),
  }
}

export default fetchCodecovioCoverage
