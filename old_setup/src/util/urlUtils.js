const QueryParams = require('../util/queryParamProcessor')
const config = require('../config')
function constructSheetUrl(sheetName) {
  const noParamsUrl = window.location.href.substring(0, window.location.href.indexOf(window.location.search))
  const queryParams = QueryParams(window.location.search.substring(1))
  const sheetUrl =
    noParamsUrl +
    (config().featureToggles.UIRefresh2022
      ? '?documentId=' + queryParams.documentId
      : '?sheetId=' + queryParams.sheetId) +
    '&sheetName=' +
    encodeURIComponent(sheetName)
  return sheetUrl
}

function getDocumentOrSheetId() {
  // const queryParams = QueryParams(window.location.search.substring(1))
  // return queryParams.documentId ?? queryParams.sheetId
  return config().sheetUrl; // Override to force only our csv to load.
}

function getSheetName() {
  const queryParams = QueryParams(window.location.search.substring(1))
  return queryParams.sheetName
}

module.exports = {
  constructSheetUrl,
  getDocumentOrSheetId,
  getSheetName,
}
