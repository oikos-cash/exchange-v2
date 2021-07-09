import snxData from '@oikos/oikos-data-bsc';

import {
	matchPairRates,
	getMinAndMaxRate,
	calculateRateChange,
	calculateTimestampForPeriod,
	calculateTotalVolumeForExchanges,
} from './utils';

import { SYNTHS_MAP } from 'constants/currency';
import { PERIOD_IN_HOURS } from 'constants/period';

import snxJSConnector from 'utils/snxJSConnector';
import {bytesFormatter} from 'utils/formatters';

export const fetchSynthRateUpdate = async (
	currencyKey,
	periodInHours = PERIOD_IN_HOURS.ONE_DAY
) => {
	try {
		// const now = new Date().getTime();

		const rates = await snxData.rate.updates({
			synth: currencyKey,
			// maxTimestamp: Math.trunc(now / 1000),
			minTimestamp: calculateTimestampForPeriod(periodInHours),
			max: 6000,
		});

		const [low, high] = getMinAndMaxRate(rates);
		const change = calculateRateChange(rates);
		console.log(rates)
		return {
			rates: rates.reverse(),
			low,
			high,
			change,
		};
	} catch (e) {
		return null;
	}
};

export const fetchSynthRateUpdates = async (
	baseCurrencyKey,
	quoteCurrencyKey,
	periodInHours = PERIOD_IN_HOURS.ONE_DAY
) => {
	try {
		// const now = new Date().getTime();

		const [baseRates, quoteRates] = await Promise.all(
			[baseCurrencyKey, quoteCurrencyKey].map((synthName) =>
				snxData.rate.updates({
					synth: synthName,
					// maxTimestamp: Math.trunc(now / 1000),
					minTimestamp: calculateTimestampForPeriod(periodInHours),
					max: 6000,
				})
			)
		);

		// If quote or rate is oUSD then we just get
		// the base or quote rates as they're already in oUSD
		const rates =
			quoteCurrencyKey === SYNTHS_MAP.oUSD
				? baseRates
				: baseCurrencyKey === SYNTHS_MAP.oUSD
				? quoteRates
				: matchPairRates(baseRates, quoteRates);

		const [low, high] = getMinAndMaxRate(rates);
		const change = calculateRateChange(rates);

		return {
			rates: rates.reverse(),
			low,
			high,
			change,
		};
	} catch (e) {
		return null;
	}
};

export const fetchExchanges = (periodInHours = PERIOD_IN_HOURS.ONE_DAY) =>
	snxData.exchanges.since({
		minTimestamp: calculateTimestampForPeriod(periodInHours),
	});

export const fetchSynthVolumeInUSD = async (
	baseCurrencyKey,
	quoteCurrencyKey,
	periodInHours = PERIOD_IN_HOURS.ONE_DAY
) => {
	try {
		const exchanges = await fetchExchanges(periodInHours);

		console.log(exchanges)
		return calculateTotalVolumeForExchanges(baseCurrencyKey, quoteCurrencyKey, exchanges);
	} catch (e) {
		return null;
	}
};

export const fetchInvertedSynthParameters = async (
	currencyKey,
) => {
	try {
		//@ts-ignore
		let synthParameters =  await Promise.all([
			snxJSConnector.snxJS.ExchangeRates.inversePricing(
			bytesFormatter(currencyKey)
		),]);
		console.log(synthParameters)

		return synthParameters;
	} catch (e) {
		return null;
	}
};
