import axios from 'axios';
import collapse from 'collapse-white-space';

const API_BASE_URL = 'https://api-v3.mbta.com';

// HTTP status code indicating that there was no need to retransmit the requested resources
const NOT_MODIFIED_STATUS_CODE = 304;

async function loadStopNamesIntoLocalStorage() {
  try {
    const lastModified = localStorage.getItem('stopNamesLastModified');
    const config = lastModified
      ? { headers: { 'If-Modified-Since': lastModified } }
      : {};
    const response = await axios.get(`${API_BASE_URL}/stops`, config);
    const stopNameData = response.data.data
      .filter((stop) => stop.relationships.parent_station.data === null)
      .map((stop) => ({
        name: stop.attributes.name,
        id: stop.id,
      }));
    localStorage.setItem(
      'stopNamesLastModified',
      response.headers['last-modified']
    );
    localStorage.setItem('stops', JSON.stringify(stopNameData));
  } catch (err) {
    console.log('in getStopNames catch');
    const isAxiosError = Object.prototype.hasOwnProperty.call(
      err,
      'isAxiosError'
    );

    if (
      !isAxiosError ||
      err.response === undefined ||
      err.response.status !== NOT_MODIFIED_STATUS_CODE
    ) {
      throw err;
    }
  }
}

function getSearchSuggestions(searchValue, trie) {
  const trimmedSearchVal = collapse(searchValue).trim();
  if (trimmedSearchVal.length < 1 || trimmedSearchVal === ' ') return [];
  const searchSuggestions = trie.searchPhrase(searchValue);
  const suggestionsToReturn = [];
  let i = 0;

  if (searchSuggestions) {
    for (const suggestion of searchSuggestions) {
      if (i > 4) break;
      suggestionsToReturn.push(suggestion);
      i += 1;
    }
    return suggestionsToReturn;
  }
  return [];
}

// final result
// <div className="form-group__suggestion">
//   <span className="form-group__match">Porter</span> Square
// </div>

// const stops = JSON.parse(localStorage.getItem('suggestionPool'));
// const stopNames = stops.map(stop => stop.name);
// const trie = new Trie();
// trie.insertMany(stopNames);

// const suggestions = trie.searchPhrase('el');
// if (suggestions) {
//   for (let i = 0; i < 5; i++) {
//     if (suggestions[i]) console.log(suggestions[i]);
//   }
// } else {
//   console.log('no suggestions');
// }

export { loadStopNamesIntoLocalStorage, getSearchSuggestions };
