import axios from 'axios';

const API_BASE_URL = 'https://api-v3.mbta.com';

// HTTP status code indicating that there was no need to retransmit the requested resources
const NOT_MODIFIED_STATUS_CODE = 304;

async function getStopNames() {
  try {
    const lastModified = localStorage.getItem('stopNamesLastModified');
    const config = lastModified
      ? { headers: { 'If-Modified-Since': lastModified } }
      : {};
    const response = await axios.get(`${API_BASE_URL}/stops`, config);
    localStorage.setItem(
      'stopNamesLastModified',
      response.headers['last-modified']
    );

    console.log('using new data');
    return response.data.data.map((stop) => stop.attributes.name); // return new stop names
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

    console.log('using cached data');
    return JSON.parse(localStorage.getItem('stopNames')); // return cached stop names
  }
}

export { getStopNames };
