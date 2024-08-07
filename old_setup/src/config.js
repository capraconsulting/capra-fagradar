const config = () => {
  const env = {
    production: {
      featureToggles: {
        UIRefresh2022: true,
      },
      sheetUrl: 'https://raw.githubusercontent.com/capraconsulting/capra-fagradar/master/data/radar.csv',
    },
    development: {
      featureToggles: {
        UIRefresh2022: true,
      },
      sheetUrl: 'https://raw.githubusercontent.com/capraconsulting/capra-fagradar/master/data/radar.csv',
    },
  }
  return process.env.ENVIRONMENT ? env[process.env.ENVIRONMENT] : env
}
module.exports = config
