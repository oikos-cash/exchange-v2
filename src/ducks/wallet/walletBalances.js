import { createSlice, createSelector } from '@reduxjs/toolkit';
import { takeLatest, put, select } from 'redux-saga/effects';
import orderBy from 'lodash/orderBy';

import { fetchSynthsBalance, fetchEthBalance } from '../../dataFetcher';
import { CRYPTO_CURRENCY_MAP } from 'constants/currency';
import { toBigNumber } from '../../utils/formatters';
import { getAvailableSynths } from '../synths';
import { getHideSmallValueAssets } from '../ui';
import { getCurrentWalletAddress } from './walletDetails';

const LOW_ASSET_VALUE_USD = 1;

export const walletBalancesSlice = createSlice({
	name: 'walletBalances',
	initialState: {
		balances: null,
		isFetchingWalletBalances: false,
		isRefreshingWalletBalances: false,
		isLoadedWalletBalances: false,
	},
	reducers: {
		fetchWalletBalancesRequest: (state) => {
			state.isFetchingWalletBalances = true;
			if (state.isLoadedWalletBalances) {
				state.isRefreshingWalletBalances = true;
			}
		},
		fetchWalletBalancesSuccess: (state, action) => {
			const { balances } = action.payload;

			state.balances = balances;
			state.isFetchingWalletBalances = false;
			state.isRefreshingWalletBalances = false;
			state.isLoadedWalletBalances = true;
		},
		fetchWalletBalancesFailure: (state) => {
			state.isFetchingWalletBalances = false;
		},
	},
});
export const getWalletBalancesState = (state) => state.wallet.walletBalances;
export const getWalletBalancesMap = (state) => getWalletBalancesState(state).balances;
export const getWalletBalances = createSelector(getWalletBalancesMap, (walletBalancesMap) => {
	if (walletBalancesMap == null) {
		return [];
	}

	const { bnb, synths } = walletBalancesMap;

	let assets = [];

	if (bnb) {
		assets.push({
			...bnb,
			name: CRYPTO_CURRENCY_MAP.BNB,
		});
	}

	return orderBy(
		Object.entries(synths.balances)
			.filter(([, walletBalance]) => walletBalance.balance > 0)
			.map(([currencyKey, walletBalance]) => ({
				...walletBalance,
				name: currencyKey,
				portfolioPercent: walletBalance.usdBalance / synths.usdBalance,
			}))
			.concat(assets),
		'usdBalance',
		'desc'
	);
});
export const getTotalETHBalanceUSD = createSelector(getWalletBalancesMap, (walletBalancesMap) =>
	walletBalancesMap == null ? 0 : walletBalancesMap.bnb.usdBalance
);
export const getTotalETHBalance = createSelector(getWalletBalancesMap, (walletBalancesMap) =>
	walletBalancesMap == null ? 0 : walletBalancesMap.bnb.balance
);
export const getTotalSynthsBalanceUSD = createSelector(getWalletBalancesMap, (walletBalancesMap) =>
	walletBalancesMap == null ? 0 : walletBalancesMap.synths.usdBalance
);
export const getTotalWalletBalanceUSD = createSelector(
	getTotalETHBalanceUSD,
	getTotalSynthsBalanceUSD,
	(totalWalletETHBalanceUSD, totalSynthsBalanceUSD) =>
		toBigNumber(totalWalletETHBalanceUSD).plus(totalSynthsBalanceUSD).toNumber()
);
export const getIsFetchingWalletBalances = (state) =>
	getWalletBalancesState(state).isFetchingWalletBalances;
export const getIsRefreshingWalletBalances = (state) =>
	getWalletBalancesState(state).isRefreshingWalletBalances;
export const getIsLoadedWalletBalances = (state) =>
	getWalletBalancesState(state).isLoadedWalletBalances;

export const getSynthsWalletBalances = createSelector(
	getWalletBalances,
	getHideSmallValueAssets,
	(walletBalances, hideSmallValueAssets) =>
		walletBalances.filter(({ name, usdBalance }) => {
			const filterBNB = name !== CRYPTO_CURRENCY_MAP.BNB;
			const filterSmallValueAssets = hideSmallValueAssets ? usdBalance > LOW_ASSET_VALUE_USD : true;

			return filterBNB && filterSmallValueAssets;
		})
);

function* fetchWalletBalances() {
	const synths = yield select(getAvailableSynths);

	const currentWalletAddress = yield select(getCurrentWalletAddress);

	if (currentWalletAddress != null) {
		try {
			console.log(synths)
			const [synthsBalance, bnbBalance] = yield Promise.all([
				fetchSynthsBalance(currentWalletAddress, synths),
				fetchEthBalance(currentWalletAddress),
			]);

			const balances = { synths: synthsBalance, bnb: bnbBalance };

			yield put(fetchWalletBalancesSuccess({ balances }));

			return true;
		} catch (e) {
			yield put(fetchWalletBalancesFailure({ error: e.message }));

			return false;
		}
	}
	return false;
}

export function* watchFetchWalletBalancesRequest() {
	yield takeLatest(fetchWalletBalancesRequest.type, fetchWalletBalances);
}

const {
	updateWalletPaginatorIndex,
	fetchWalletBalancesRequest,
	fetchWalletBalancesSuccess,
	fetchWalletBalancesFailure,
} = walletBalancesSlice.actions;

export {
	updateWalletPaginatorIndex,
	fetchWalletBalancesRequest,
	fetchWalletBalancesSuccess,
	fetchWalletBalancesFailure,
};

export default walletBalancesSlice.reducer;
