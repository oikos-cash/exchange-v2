const USER_DENIED = { type: 'cancelled', message: 'User denied transaction signature' };
const USER_NOBALANCE = 'transactionProcessing.error.type.noBalance';

const ERROR_CODES = {
	Metamask: {
		'-32603': USER_DENIED,
		4001: USER_DENIED,
	},
	MathWallet: {
		'1001': USER_NOBALANCE,
		'4001': USER_DENIED,
	},
	Ledger: {
		27013: USER_DENIED,
	},
	Trezor: {},
	Coinbase: {
		'-32603': USER_DENIED,
	},
};

export default (error, walletType) => {
	if (String(error).indexOf("invalid hash") != -1) {
		error.code = 1001;
		error.statusCode = 1001;
	}
	if (!error.code && !error.statusCode) return error;
	const code = (error.code || error.statusCode).toString();
	if (!code || !ERROR_CODES[walletType][code]) {
		return { message: error.message || 'Error' };
	}
	return { code, ...ERROR_CODES[walletType][code] };
};
