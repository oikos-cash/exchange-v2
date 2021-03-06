import throttle from 'lodash/throttle';

export type NetworkId = 56;

export const GWEI_UNIT = 1000000000;

export const SUPPORTED_NETWORKS: Record<NetworkId, string> = {
	56: 'BSC',
};

export const DEFAULT_GAS_LIMIT = {
	mint: 2200000,
	burn: 2200000,
	claim: 1400000,
	exchange: 220000,
	sendSNX: 120000,
	sendEth: 21000,
	sendSynth: 150000,
};

export const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const INFURA_JSON_RPC_URLS: Record<NetworkId, string> = {
	56: `https://bsc-dataseed.binance.org`,
};

export const PORTIS_APP_ID = '26e198be-a8bb-4240-ad78-ae88579085bc';

export type WalletType =
	| 'METAMASK'
	| 'BSCWALLET'
	| 'MATHWALLET'
	| 'TREZOR'
	| 'LEDGER'
	| 'COINBASE'
	| 'WALLET_CONNECT'
	| 'PORTIS';

export const SUPPORTED_WALLETS_MAP: Record<WalletType, string> = {
	METAMASK: 'Metamask',
	BSCWALLET: 'BSCWallet',
	MATHWALLET: 'MathWallet',
	TREZOR: 'Trezor',
	LEDGER: 'Ledger',
	COINBASE: 'Coinbase',
	WALLET_CONNECT: 'WalletConnect',
	PORTIS: 'Portis',
};
export const SUPPORTED_WALLETS = Object.values(SUPPORTED_WALLETS_MAP);

export const hasEthereumInjected = () => !!window.ethereum;

export const defaultNetwork: { name: string; networkId: NetworkId } = {
	name: 'MAINNET',
	networkId: 56,
};

export async function getEthereumNetwork() {
	if (!hasEthereumInjected()) {
		return defaultNetwork;
	}

	let networkId: NetworkId = 56;

	try {
		if (window.ethereum?.networkVersion) {
			networkId = Number(window.ethereum?.networkVersion) as NetworkId;

			return { name: SUPPORTED_NETWORKS[networkId], networkId };
		} else if (window.web3?.eth?.net) {
			networkId = await window.web3.eth.net.getId();

			return { name: SUPPORTED_NETWORKS[networkId], networkId: Number(networkId) as NetworkId };
		} else if (window.web3?.version?.network) {
			networkId = Number(window.web3.version.network) as NetworkId;

			return { name: SUPPORTED_NETWORKS[networkId], networkId };
		}
		return defaultNetwork;
	} catch (e) {
		console.log(e);
		return defaultNetwork;
	}
}

export const getTransactionPrice = (
	gasPrice: number | null,
	gasLimit: number | null,
	ethPrice: number | null
) => {
	if (!gasPrice || !gasLimit || !ethPrice) return 0;

	return (gasPrice * ethPrice * gasLimit) / GWEI_UNIT;
};

const getPriceLimit = (
	networkInfo: { fast: number; average: number; safeLow: number },
	gasPriceLimit: number
) => {
	const fast = networkInfo.fast / 10;
	const average = networkInfo.average / 10;
	const slow = networkInfo.safeLow / 10;

	const speed = {
		fast,
		average,
		slow,
	};

	if (gasPriceLimit) {
		return {
			...speed,
			fastestAllowed: gasPriceLimit,
			averageAllowed: Math.min(average, gasPriceLimit),
			slowAllowed: Math.min(slow, gasPriceLimit),
		};
	}
	return {
		...speed,
		fastestAllowed: fast,
		averageAllowed: average,
		slowAllowed: slow,
	};
};

export const getGasInfo = async () => {
	try {
		const results = await fetch('https://ethgasstation.info/json/ethgasAPI.json');
		const networkInfo = await results.json();
		return getPriceLimit(networkInfo, 0);
	} catch (e) {
		console.log('Error while getting gas info', e);
	}
};

export function onMetamaskAccountChange(cb: () => void) {
	if (!window.ethereum) return;
	const listener = throttle(cb, 1000);
	window.ethereum.on('accountsChanged', listener);
}

export function onMetamaskNetworkChange(cb: () => void) {
	if (!window.ethereum) return;
	const listener = throttle(cb, 1000);
	window.ethereum.on('networkChanged', listener);
}

export function onMathWalletNetworkChange(cb: () => void) {
	if (!window.ethereum?.isMetaMask) return;
	const listener = throttle(cb, 1000);
	window.ethereum.on('networkChanged', listener);
}

//@ts-ignore
export function onBSCWalletNetworkChange(cb) {
	//@ts-ignore
	if (!window.BinanceChain) return;
	const listener = throttle(cb, 1000);
	//@ts-ignore
	window.BinanceChain.on('networkChanged', listener);
}

export function hasMetamaskInstalled() {
	return window.ethereum?.isMetaMask || false;
}

export function hasBSCWalletInstalled() {
	//@ts-ignore	
	console.log(window.BinanceChain?.isMetaMask)
	//@ts-ignore
	return window.BinanceChain?.isMetaMask || false;
}

export function hasMathWalletInstalled() {
	//@ts-ignore
	return window.ethereum?.isMathWallet || false;
}

export const isMainNet = (networkId: NetworkId) => networkId === 56;
