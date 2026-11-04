// შუახმელეთის რეგიონისა და ვალუტის მონაცემების ტიპს განსაზღვრავს.
export interface Realm {
  id: string;
  name: string;
  region: string;
  currencyName: string;
  currencySymbol: string;
  multiplier: number;
  marker: string;
}
