const fetchSonarcloudioCoverage = async (org, ghRepository) => {
  // return a stub, API requires CORS setup
  return {
    statusCode: 200,
    entries: [
      {
        name: org,
        ghRepository: ghRepository,
        language: null,
        latestCommit: null,
        coverage: `https://sonarcloud.io/api/project_badges/measure?project=${org}&metric=coverage`,
        ccJobUrl: `https://sonarcloud.io/component_measures?id=${org}&metric=coverage`,
      },
    ],
  }
}

export default fetchSonarcloudioCoverage
