# Code Coverage dashboard for public repositories associated with OpenShift.io, Fabric8, etc.

## Usage
Pages are statically generated however data are dynamically fetched at runtime
```
npm install -g gatsby-cli
npm install
gatsby develop
gatsby build
```

## Adding new repositories

Update `sources.json` file. Currently it supports gathering data from *codecov.io* and *sonarcloud.io* services. Only repositories that publish data to those services are actually list.

## Adding new services
Have a look into `src/components/CodeCoverage` directory.