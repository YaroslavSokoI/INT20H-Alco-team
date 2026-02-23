import axios from 'axios';
import { config } from '../../config';
import type { Jurisdiction } from '../models/order';

interface NominatimAddress {
  postcode?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
}

interface NominatimResponse {
  address: NominatimAddress;
}

export async function reverseGeocode(lat: number, lon: number): Promise<Jurisdiction> {
  const response = await axios.get<NominatimResponse>(config.nominatim.baseUrl, {
    params: {
      lat,
      lon,
      format: 'json',
      addressdetails: 1,
    },
    headers: {
      'User-Agent': config.nominatim.userAgent,
    },
    timeout: 10000,
  });

  const addr = response.data.address;

  return {
    postcode: addr.postcode ?? '',
    city: addr.city ?? addr.town ?? addr.village ?? '',
    county: addr.county ?? '',
    state: addr.state ?? '',
  };
}
