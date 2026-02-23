import { reverseGeocode } from '../clients/nominatim.client';
import { getTaxRateByZip } from '../clients/tax.client';
import type { TaxBreakdown, Jurisdiction } from '../models/order';

export interface TaxCalculationResult {
  jurisdiction: Jurisdiction;
  tax: TaxBreakdown;
  taxAmount: number;
  totalAmount: number;
}

import Decimal from 'decimal.js';

export async function calculateTax(
  lat: number,
  lon: number,
  subtotal: number
): Promise<TaxCalculationResult> {
  const jurisdiction = await reverseGeocode(lat, lon);

  if (!jurisdiction.postcode) {
    throw new Error(`Could not determine postcode for coordinates (${lat}, ${lon})`);
  }

  const stateUpper = jurisdiction.state?.toUpperCase();
  if (stateUpper !== 'NEW YORK' && stateUpper !== 'NY') {
    throw new Error(
      `Coordinates (${lat}, ${lon}) resolve to ${jurisdiction.state || 'an unknown state'}, but must be within New York State.`
    );
  }

  const tax = await getTaxRateByZip(jurisdiction.postcode);

  const sub = new Decimal(subtotal);
  const rate = new Decimal(tax.compositeRate);

  const taxAmount = sub.times(rate).toDecimalPlaces(4).toNumber();
  const totalAmount = sub.plus(taxAmount).toDecimalPlaces(4).toNumber();

  return { jurisdiction, tax, taxAmount, totalAmount };
}
