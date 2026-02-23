import { reverseGeocode } from '../clients/nominatim.client';
import { getTaxRateByZip } from '../clients/tax.client';
import type { TaxBreakdown, Jurisdiction } from '../models/order';

export interface TaxCalculationResult {
  jurisdiction: Jurisdiction;
  tax: TaxBreakdown;
  taxAmount: number;
  totalAmount: number;
}

export async function calculateTax(
  lat: number,
  lon: number,
  subtotal: number
): Promise<TaxCalculationResult> {
  const jurisdiction = await reverseGeocode(lat, lon);

  if (!jurisdiction.postcode) {
    throw new Error(`Could not determine postcode for coordinates (${lat}, ${lon})`);
  }

  const tax = await getTaxRateByZip(jurisdiction.postcode);

  const taxAmount = Math.round(subtotal * tax.compositeRate * 10000) / 10000;
  const totalAmount = Math.round((subtotal + taxAmount) * 10000) / 10000;

  return { jurisdiction, tax, taxAmount, totalAmount };
}
