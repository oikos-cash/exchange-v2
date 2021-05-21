import { HistoricalTrades } from './types';
import { SYNTHS_MAP } from 'constants/currency';

export const normalizeTrades = (trades: HistoricalTrades) =>
	trades.map((trade) => ({
		...trade,
		price:
			trade.toCurrencyKey === SYNTHS_MAP.oUSD
				? trade.fromAmountInUSD / trade.fromAmount
				: trade.toAmountInUSD / trade.toAmount,
		amount: trade.toCurrencyKey === SYNTHS_MAP.oUSD ? trade.fromAmountInUSD : trade.toAmountInUSD,
	}));
