export interface SearchCondition {
  field: string;
  term: string;
  exact: boolean;
}

export interface ParsedSearch {
  defaultTerms: string[];
  structured: SearchCondition[];
}

interface FieldConfig {
  expr: string;
  exact: boolean;
}

const KEY_MAP: Record<string, FieldConfig> = {
  'id':                   { expr: 'id',                    exact: true  },
  'uuid':                 { expr: 'uuid::text',             exact: false },
  'latitude':             { expr: 'latitude',               exact: true  },
  'lat':                  { expr: 'latitude',               exact: true  },
  'longitude':            { expr: 'longitude',              exact: true  },
  'lon':                  { expr: 'longitude',              exact: true  },
  'lng':                  { expr: 'longitude',              exact: true  },
  'subtotal':             { expr: 'subtotal',               exact: true  },
  'date':                 { expr: 'CAST(timestamp AS TEXT)', exact: false },
  'order date':           { expr: 'CAST(timestamp AS TEXT)', exact: false },
  'timestamp':            { expr: 'CAST(timestamp AS TEXT)', exact: false },
  'tax rate':             { expr: 'composite_tax_rate',     exact: true  },
  'composite tax rate':   { expr: 'composite_tax_rate',     exact: true  },
  'tax':                  { expr: 'tax_amount',             exact: true  },
  'tax amount':           { expr: 'tax_amount',             exact: true  },
  'total':                { expr: 'total_amount',           exact: true  },
  'total amount':         { expr: 'total_amount',           exact: true  },
  'state rate':           { expr: 'state_rate',             exact: true  },
  'county rate':          { expr: 'county_rate',            exact: true  },
  'city rate':            { expr: 'city_rate',              exact: true  },
  'special':              { expr: 'special_rates',          exact: true  },
  'special rates':        { expr: 'special_rates',          exact: true  },
  'city':                 { expr: 'city',                   exact: false },
  'county':               { expr: 'county',                 exact: false },
  'state':                { expr: 'state',                  exact: false },
  'postcode':             { expr: 'postcode',               exact: false },
  'zip':                  { expr: 'postcode',               exact: false },
  'created':              { expr: 'CAST(created_at AS TEXT)', exact: false },
  'created at':           { expr: 'CAST(created_at AS TEXT)', exact: false },
};

export function parseSearch(input: string): ParsedSearch {
  const structured: SearchCondition[] = [];
  let remaining = input;

  // Match "Multi Word Key=value" or "Key=value" - greedy from longest keys first
  const sortedKeys = Object.keys(KEY_MAP).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`${escaped}\\s*=\\s*(\\S+)`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(input)) !== null) {
      const config = KEY_MAP[key];
      structured.push({ field: config.expr, term: match[1], exact: config.exact });
      remaining = remaining.replace(match[0], '');
    }
  }

  const defaultTerms = remaining
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean);

  return { defaultTerms, structured };
}
