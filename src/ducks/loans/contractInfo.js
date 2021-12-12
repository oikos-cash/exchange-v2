import { createSlice } from '@reduxjs/toolkit';

import snxJSConnector from '../../utils/snxJSConnector';
import { bigNumberFormatter, bigNumberFormatter1} from '../../utils/formatters';

import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from '../../constants/currency';

export const contractInfoSlice = createSlice({
	name: 'contractInfo',
	initialState: {
		collateralPair: null,
		loadingError: null,
		isLoading: false,
		isLoaded: false,
		isRefreshing: false,
		contractType: "oBNB",
		contract: null,
	},
	reducers: {
		fetchLoansContractInfoRequest: (state) => {
			state.loadingError = null;
			state.isLoading = true;
			if (state.isLoaded) {
				state.isRefreshing = true;
			}
		},
		fetchLoansContractInfoFailure: (state, action) => {
			state.loadingError = action.payload.error;
			state.isLoading = false;
			state.isRefreshing = false;
		},
		fetchLoansContractInfoSuccess: (state, action) => {
			state.collateralPair = action.payload.collateralPair;
			state.isLoading = false;
			state.isRefreshing = false;
			state.isLoaded = true;
		},
		setContractType: (state, action) => {
			state.contractType = action.payload.contractType;
		},
		setContract: (state, action) => {
			state.contract = action.payload.contract;
		},
	},
});

export const getLoansContractInfoState = (state) => state.loans.contractInfo;
export const getIsLoadingLoansContractInfo = (state) => getLoansContractInfoState(state).isLoading;
export const getIsRefreshingLoansContractInfo = (state) =>
	getLoansContractInfoState(state).isRefreshing;
export const getIsLoadedLoansContractInfo = (state) => getLoansContractInfoState(state).isLoaded;
export const getLoansContractInfoLoadingError = (state) =>
	getLoansContractInfoState(state).loadingError;
export const getLoansCollateralPair = (state) => getLoansContractInfoState(state).collateralPair;
export const getContractType = (state) => getLoansContractInfoState(state).contractType;
export const getContract = (state) => getLoansContractInfoState(state).contract;

const {
	fetchLoansContractInfoRequest,
	fetchLoansContractInfoSuccess,
	fetchLoansContractInfoFailure,
	setContractType,
	setContract,
} = contractInfoSlice.actions;

export const fetchLoansContractInfo = () => async (dispatch, getState) => {
	const {
		snxJS: { BNBCollateral, VBNBCollateraloUSD },
		vBNBContract
	} = snxJSConnector;
	let contract;

	const state = getState();
	const { contractType } = state.loans.contractInfo;

	console.log(`Got contract type ${contractType}`)

	if (contractType === 'oBNB') {
		contract = BNBCollateral.contract;
	} else {
		contract = VBNBCollateraloUSD.contract;
	}

	console.log(contract)

	dispatch(setContract({ contract }));
	dispatch(fetchLoansContractInfoRequest());

	try {
		 
		const [contractInfo, lockedETHBalance] = await Promise.all([
			contract.getContractInfo(),
			contractType === "oBNB" ? snxJSConnector.provider.getBalance(contract.address) : vBNBContract.balanceOf(contract.address),
		]);

		console.log(`Contrat type is ${contractType}`)
		const collateralPair = {
			collateralCurrencyKey:  contractType === 'oBNB' ? CRYPTO_CURRENCY_MAP.BNB : "VBNB",
			loanCurrencyKey: contractType === 'oBNB' ? SYNTHS_MAP.oBNB : SYNTHS_MAP.oUSD,
			minLoanSize:
				contractType === 'oBNB'
					? bigNumberFormatter(contractInfo._minLoanSize)
					: bigNumberFormatter(contractInfo._minLoanCollateralSize),
			issuanceRatio: 100 / bigNumberFormatter(contractInfo._collateralizationRatio),
			issueFeeRatePercent: bigNumberFormatter(contractInfo._issueFeeRate),
			collateralizationRatioPercent: bigNumberFormatter(contractInfo._collateralizationRatio) / 100,
			interestRatePercent: bigNumberFormatter(contractInfo._interestRate),
			totalOpenLoanCount: Number(contractInfo._totalOpenLoanCount),
			issueLimit: bigNumberFormatter(contractInfo._issueLimit),
			totalIssuedSynths: bigNumberFormatter(contractInfo._totalIssuedSynths),
			lockedCollateralAmount: contractType === "oBNB" ? bigNumberFormatter(lockedETHBalance) : bigNumberFormatter1(lockedETHBalance),
		};

		console.log(collateralPair)

		dispatch(fetchLoansContractInfoSuccess({ collateralPair }));
	} catch (e) {
		dispatch(fetchLoansContractInfoFailure({ error: e.message }));
	}
};

export const setSelectedContractType = (contractType) => (dispatch) => {
	dispatch(setContractType({ contractType }));
};

export default contractInfoSlice.reducer;
