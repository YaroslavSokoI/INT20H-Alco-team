import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import type { Feature, Polygon, MultiPolygon, FeatureCollection } from 'geojson';
import { reverseGeocode } from '../clients/nominatim.client';
import { getTaxRate } from '../clients/tax.client';
import type { TaxBreakdown, Jurisdiction } from '../models/order';
import nyBoundaryJson from '../data/ny-boundary.json';

export interface TaxCalculationResult {
  jurisdiction: Jurisdiction;
  tax: TaxBreakdown;
  taxAmount: number;
  totalAmount: number;
}

import Decimal from 'decimal.js';

type NyBoundaryGeoJson = Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon>;
const raw = nyBoundaryJson as unknown as NyBoundaryGeoJson;
const nyBoundary = raw.type === 'FeatureCollection' ? raw.features[0] : raw;

export function isWithinNY(lat: number, lon: number): boolean {
  return booleanPointInPolygon(point([lon, lat]), nyBoundary);
}

export async function calculateTax(
  lat: number,
  lon: number,
  subtotal: number
): Promise<TaxCalculationResult> {
  if (!booleanPointInPolygon(point([lon, lat]), nyBoundary)) {
    throw new Error(
      `Coordinates (${lat}, ${lon}) are outside New York State.`
    );
  }

  const jurisdiction = await reverseGeocode(lat, lon);

  if (!jurisdiction.state) {
    jurisdiction.state = 'New York';
  }

  const tax = await getTaxRate(jurisdiction);

  const sub = new Decimal(subtotal);
  const rate = new Decimal(tax.compositeRate);

  const taxAmount = sub.times(rate).toDecimalPlaces(4).toNumber();
  const totalAmount = sub.plus(taxAmount).toDecimalPlaces(4).toNumber();

  return { jurisdiction, tax, taxAmount, totalAmount };
}
