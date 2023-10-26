import axios from "axios";
import { MAP_API_KEY } from "constants/constants";

export async function getAddressFromLocation(latlng?: string) {
  let params = { latlng, key: MAP_API_KEY };

  return axios
    .get(`https://maps.googleapis.com/maps/api/geocode/json`, { params })
    .then(({ data }) => data.results[0]?.formatted_address)
    .catch((error) => {
      console.log(error);
      return "not found";
    });
}
