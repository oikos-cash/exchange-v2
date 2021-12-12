import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';

import { getGasInfo } from 'utils/networkUtils';
import snxJSConnector from 'utils/snxJSConnector';

import { bytesFormatter, bigNumberFormatter, parseBytes32String } from 'utils/formatters';

import { SYNTHS_MAP, CurrencyKey } from 'constants/currency';

import { BigNumberish } from 'ethers-utils';
import { takeLatest, put, select} from 'redux-saga/effects';


const getNetworkPrices = async () => {
	let result = await getGasInfo();
	console.log(result)
	return result
};

const getFrozenSynths = async () => {
	const frozenSynths = await (snxJSConnector as any).synthSummaryUtilContract.frozenSynths();

	return compact(frozenSynths.map(parseBytes32String));
};

export const getExchangeData = async () => {
	try {
		const [networkPrices, frozenSynths] = await Promise.all([
			getNetworkPrices(),
			getFrozenSynths(),
		]);
		return {
			networkPrices,
			frozenSynths,
		};
	} catch (e) {
		console.log('Error while fetching exchange data', e);
	}
};

export const fetchSynthsBalance = async (walletAddress: string, availableSynths: Array<{name: string}>) => {
	let balances: Record<
		CurrencyKey,
		{
			balance: number;
			// @ts-ignore
			balanceBN: BigNumberish;
			usdBalance: number;
		}
	> = {};

	/*const [balanceResults, totalBalanceResults] = await Promise.all([
		(snxJSConnector as any).synthSummaryUtilContract.synthsBalances(walletAddress),
		(snxJSConnector as any).synthSummaryUtilContract.totalSynthsInKey(
			walletAddress,
			bytesFormatter(SYNTHS_MAP.oUSD)
		),
	]);

	const [synthsKeys, synthsBalances, synthsUSDBalances] = balanceResults;

	synthsKeys.forEach((key: string, i: string) => {
		const synthName = parseBytes32String(key) as CurrencyKey;
		balances[synthName] = {
			balance: bigNumberFormatter(synthsBalances[i]),
			balanceBN: synthsBalances[i],
			usdBalance: bigNumberFormatter(synthsUSDBalances[i]),
		};
	});

	return {
		balances: isEmpty(balances) ? 0 : balances,
		usdBalance: totalBalanceResults ? bigNumberFormatter(totalBalanceResults) : 0,
	};*/

	const balanceResults = await Promise.all(
		availableSynths.map(synth => {
			//@ts-ignore
			return snxJSConnector.snxJS[synth.name].balanceOf(walletAddress);
		}) 
	);
			

	//const synthsBalance = {};
	const totalBalance = await Promise.all(
		balanceResults.map((balance, i) => {
			//@ts-ignore
			return snxJSConnector.snxJS.ExchangeRates.effectiveValue(
			bytesFormatter(availableSynths[i].name),
			balance,
			bytesFormatter(SYNTHS_MAP.oUSD)
			);
		})
	);

	//const [synthsKeys, balanceResults, totalBalance] = balanceResults;

	//synthsKeys.forEach((key: string, i: string) => {
	availableSynths.map((synth, i) => {
		const synthName = synth.name as CurrencyKey;
		balances[synthName] = {
			balance: bigNumberFormatter(balanceResults[i]),
			balanceBN: balanceResults[i],
			usdBalance: bigNumberFormatter(totalBalance[i]),
		};
	});

	let total = 0

	//@ts-ignore
	totalBalance.map(el => {
		if (!isNaN(el)) {
			total = total +  Number(bigNumberFormatter(el))

		}
	})

	return {
		balances: isEmpty(balances) ? 0 : balances,
		usdBalance: total,
	};
};

export const fetchEthBalance = async (walletAddress: string) => {
	const balance = await (snxJSConnector as any).provider.getBalance(walletAddress);
	
	const usdBalance = await (snxJSConnector as any).snxJS.ExchangeRates.effectiveValue(
		bytesFormatter(SYNTHS_MAP.oBNB),
		balance,
		bytesFormatter(SYNTHS_MAP.oUSD)
	);
	//console.log(`got BNB balance of ${bigNumberFormatter(balance)} $dollar value of ${bigNumberFormatter(usdBalance)}`)
	return {
		balance: bigNumberFormatter(balance),
		usdBalance: bigNumberFormatter(usdBalance),
	};
};

export const fetchVBNBBalance = async (walletAddress: string) => {

	const balance = await snxJSConnector.vBNBContract.balanceOf(walletAddress);

	return { 
		balance: balance / 10 ** (8),
	}; 
};

export type Rates = Record<CurrencyKey, number>;

export const fetchVBNBRate = async ()  => {

   //@ts-ignore
   const vBNBRate = await snxJSConnector.snxJS.ExchangeRates.rateForCurrency( bytesFormatter("VBNB"));
	console.log(vBNBRate)
   return vBNBRate
}

export const FetchRates = async (availableSynths: Array<{name: string}>)  => {
 
 	//@ts-ignore
	console.log(snxJSConnector.snxJS.ExchangeRates)
 
	let exchangeRates: Rates = {}; 

	//@ts-ignore
	const synthRates = await snxJSConnector.snxJS.ExchangeRates.ratesForCurrencies(
		//@ts-ignore
		availableSynths.map(synth => {
			console.log( bytesFormatter(synth.name))
			return bytesFormatter(synth.name)
		})
	);

	try {
		let vBNBRate = await fetchVBNBRate();
		//console.log(vBNBRate)
		exchangeRates["VBNB"] = vBNBRate;

	}catch (err) {
		console.log(err)
	}

	availableSynths.forEach((synth, i) => {

		exchangeRates[synth.name] = synthRates[i]
	})


	 
	return exchangeRates
}
