import { currencyKeyToIconMap, CurrencyKey } from 'constants/currency';

export const getCurrencyKeyIcon = (currencyKey: CurrencyKey) => currencyKeyToIconMap[currencyKey];

export const getCurrencyKeyURLPath = (currencyKey: CurrencyKey) =>
	`https://minter.oikos.cash/images/currencies/${currencyKey}.svg`;
