import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import get from 'lodash/get';
 
import snxJSConnector from '../utils/snxJSConnector';
import { bigNumberFormatter, parseBytes32String, bytesFormatter } from '../utils/formatters';
import { SYNTHS_MAP, CurrencyKey } from '../constants/currency';
import { RootState } from './types';
import { takeLatest, put, select} from 'redux-saga/effects';
import { FetchRates } from '../dataFetcher';

import { getAvailableSynths } from './synths';


export type Rates = Record<CurrencyKey, number>;

export type RatesSliceState = {
	exchangeRates: Rates | null;
	loadingError: string | null;
	isLoading: boolean;
	isLoaded: boolean;
	isRefreshing: boolean;
	isRefreshed: boolean;
};

const sliceName = 'rates';

const initialState: RatesSliceState = {
	exchangeRates: null,
	loadingError: null,
	isLoading: false,
	isLoaded: false,
	isRefreshing: false,
	isRefreshed: false,
};

export const ratesSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		fetchRatesRequest: (state) => {
			state.loadingError = null;
			state.isLoading = true;
			if (state.isLoaded) {
				state.isRefreshing = true;
			}
		},
		fetchRatesFailure: (
			state,
			action: PayloadAction<{
				error: string;
			}>
		) => {
			state.loadingError = action.payload.error;
			state.isLoading = false;
			state.isRefreshing = false;
		},
		fetchRatesSuccess: (
			state,
			action: PayloadAction<{
				exchangeRates: Rates;
			}>
		) => {
			state.exchangeRates = action.payload.exchangeRates;
			state.isLoading = false;
			state.isRefreshing = false;
			state.isLoaded = true;
		},
	},
});

export const getRatesState = (state: RootState) => state[sliceName];
export const getIsLoadingRates = (state: RootState) => getRatesState(state).isLoading;
export const getIsRefreshingRates = (state: RootState) => getRatesState(state).isRefreshing;
export const getIsLoadedRates = (state: RootState) => getRatesState(state).isLoaded;
export const getRatesLoadingError = (state: RootState) => getRatesState(state).loadingError;
export const getRatesExchangeRates = (state: RootState) => getRatesState(state).exchangeRates;
export const getEthRate = createSelector(getRatesExchangeRates, (exchangeRates) =>
	//@ts-ignore
	get(exchangeRates, SYNTHS_MAP.oBNB, null) !== null ? bigNumberFormatter(get(exchangeRates, SYNTHS_MAP.oBNB, null)) : 0
	
);

export const { fetchRatesRequest, fetchRatesSuccess, fetchRatesFailure } = ratesSlice.actions;

// @ts-ignore
function* fetchRates() {
	// @ts-ignore
	const { ExchangeRates } = snxJSConnector;
	const synths = yield select(getAvailableSynths);
	try {
		let exchangeRates: Rates = {}; 
 
		exchangeRates = yield FetchRates(synths)
		console.log(exchangeRates)
		yield put(fetchRatesSuccess({ exchangeRates }));
	} catch (e) {
		yield put(fetchRatesFailure({ error: e.message }));
	}
}

export function* watchFetchRatesRequest() {
	yield takeLatest(fetchRatesRequest.type, fetchRates);
}

export default ratesSlice.reducer;
