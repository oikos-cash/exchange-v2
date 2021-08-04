import { OikosJs, ContractSettings } from '@oikos/oikos-js-bsc';

import { ethers } from 'ethers';
import {
	getEthereumNetwork,
	INFURA_JSON_RPC_URLS,
	INFURA_PROJECT_ID,
	SUPPORTED_WALLETS_MAP,
	PORTIS_APP_ID,
	NetworkId,
} from './networkUtils';
import { synthSummaryUtilContract } from './contracts/synthSummaryUtilContract';
import binaryOptionsMarketDataContract from './contracts/binaryOptionsMarketDataContract';

console.log(OikosJs)
type SnxJSConnector = {
	initialized: boolean;
	snxJS: OikosJs;
	synths: OikosJs['contractSettings']['synths'];
	provider: OikosJs['contractSettings']['provider'];
	signer: OikosJs['contractSettings']['signer'];
	signers: typeof OikosJs.signers;
	utils: OikosJs['utils'];
	ethers: typeof ethers;
	ethersUtils: OikosJs['ethers']['utils'];
	synthSummaryUtilContract: ethers.Contract;
	binaryOptionsMarketDataContract: ethers.Contract;
	setContractSettings: (contractSettings: ContractSettings) => void;
	binaryOptionsUtils: OikosJs['binaryOptionsUtils'];
	contractSettings: ContractSettings;
};

// @ts-ignore
const snxJSConnector: SnxJSConnector = {
	initialized: false,
	signers: OikosJs.signers,

	setContractSettings: function (contractSettings: ContractSettings) {
		this.initialized = true;
		this.snxJS = new OikosJs(contractSettings);
		this.synths = this.snxJS.contractSettings.synths;
		this.signer = this.snxJS.contractSettings.signer;
		this.provider = this.snxJS.contractSettings.provider;
		this.utils = this.snxJS.utils;
		this.ethersUtils = this.snxJS.ethers.utils;
		this.binaryOptionsUtils = this.snxJS.binaryOptionsUtils;
		this.ethers = ethers;
		this.contractSettings = contractSettings;
		/*this.synthSummaryUtilContract = new ethers.Contract(
			synthSummaryUtilContract.addresses[contractSettings.networkId],
			synthSummaryUtilContract.abi,
			this.provider
		);
		this.binaryOptionsMarketDataContract = new ethers.Contract(
			binaryOptionsMarketDataContract.addresses[contractSettings.networkId],
			binaryOptionsMarketDataContract.abi,
			this.provider
		);*/
	},
};

const connectToMetamask = async (networkId: NetworkId, networkName: string) => {
	const walletState = {
		walletType: SUPPORTED_WALLETS_MAP.METAMASK,
		unlocked: false,
	};
	try {
		const accounts = await snxJSConnector.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			return {
				...walletState,
				currentWallet: accounts[0],
				unlocked: true,
				networkId,
				networkName: "bsc" //networkName.toLowerCase(),
			};
		} else {
			return {
				...walletState,
				unlockError: 'Please connect to Metamask',
			};
		}
		// We updateWalletReducer with all the infos
	} catch (e) {
		console.log(e);
		return {
			...walletState,
			unlockError: e.message,
		};
	}
};

const connectToBSCWallet = async (networkId: NetworkId, networkName: string) => {
	const walletState = {
		walletType: SUPPORTED_WALLETS_MAP.BSCWALLET,
		unlocked: false,
	};
	try {
		// Otherwise we enable ethereum if needed (modern browsers)
		//@ts-ignore
		if (window.BinanceChain) {
			//@ts-ignore
			window.BinanceChain.autoRefreshOnNetworkChange = true;
			//@ts-ignore
			await window.BinanceChain.enable();
		}
		const accounts = await snxJSConnector.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			return {
				...walletState,
				currentWallet: accounts[0],
				walletType: 'BSCWallet',
				unlocked: true,
				networkId,
				networkName: "bsc" //networkName.toLowerCase(),
			};
		} else {
			return {
				...walletState,
				unlockError: 'Please connect to BSC Wallet',
			};
		}
		// We updateWalletStatus with all the infos
	} catch (e) {
		console.log(e);
		return {
			...walletState,
			unlockError: e.message,
		};
	}
};

const connectToMathWallet = async (networkId: NetworkId, networkName: string) => {
	const walletState = {
		walletType: SUPPORTED_WALLETS_MAP.MATHWALLET,
		unlocked: false,
	};
	try {
		// Otherwise we enable ethereum if needed (modern browsers)
		//@ts-ignore
		if (window.ethereum.isMathWallet) {
			//@ts-ignore
			window.ethereum.autoRefreshOnNetworkChange = true;
			//@ts-ignore
			await window.ethereum.enable();
		}
		//@ts-ignore
		const account = await window.ethereum.address;
		if (account) {
			return {
				...walletState,
				currentWallet: account,
				walletType: 'MathWallet',
				unlocked: true,
				networkId,
				networkName: "bsc" //networkName.toLowerCase(),
			};
		} else {
			return {
				...walletState,
				unlockError: 'Please connect to MathWallet',
			};
		}
		// We updateWalletStatus with all the infos
	} catch (e) {
		console.log(e);
		return {
			...walletState,
			unlockError: e.message,
		};
	}
};


const connectToCoinbase = async (networkId: NetworkId, networkName: string) => {
	const walletState = {
		walletType: SUPPORTED_WALLETS_MAP.COINBASE,
		unlocked: false,
	};
	try {
		const accounts = await snxJSConnector.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			return {
				...walletState,
				currentWallet: accounts[0],
				unlocked: true,
				networkId: 1,
				networkName: networkName.toLowerCase(),
			};
		} else {
			return {
				...walletState,
				unlockError: 'Please connect to Coinbase Wallet',
			};
		}
		// We updateWalletReducer with all the infos
	} catch (e) {
		console.log(e);
		return {
			...walletState,
			unlockError: e.message,
		};
	}
};

const connectToHardwareWallet = (
	networkId: NetworkId,
	networkName: string,
	walletType: string
) => ({
	walletType,
	unlocked: true,
	networkId,
	networkName: networkName.toLowerCase(),
});

const connectToWalletConnect = async (networkId: NetworkId, networkName: string) => {
	const walletState = {
		walletType: SUPPORTED_WALLETS_MAP.WALLET_CONNECT,
		unlocked: false,
	};
	try {
		// @ts-ignore
		await snxJSConnector.signer.provider._web3Provider.enable();
		const accounts = await snxJSConnector.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			return {
				...walletState,
				currentWallet: accounts[0],
				unlocked: true,
				networkId,
				networkName: networkName.toLowerCase(),
			};
		}
	} catch (e) {
		console.log(e);
		return {
			...walletState,
			unlockError: e.message,
		};
	}
};

const connectToPortis = async (networkId: NetworkId, networkName: string) => {
	const walletState = {
		walletType: SUPPORTED_WALLETS_MAP.PORTIS,
		unlocked: false,
	};
	try {
		const accounts = await snxJSConnector.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			return {
				...walletState,
				currentWallet: accounts[0],
				unlocked: true,
				networkId,
				networkName: networkName.toLowerCase(),
			};
		}
	} catch (e) {
		console.log(e);
		return {
			...walletState,
			unlockError: e.message,
		};
	}
};

const getSignerConfig = ({
	type,
	networkId,
	derivationPath,
	networkName,
}: {
	type: string;
	networkId: NetworkId;
	derivationPath: string;
	networkName: string;
}) => {
	if (type === SUPPORTED_WALLETS_MAP.LEDGER) {
		const DEFAULT_LEDGER_DERIVATION_PATH = "44'/60'/0'/";
		return { derivationPath: derivationPath || DEFAULT_LEDGER_DERIVATION_PATH };
	}
	if (type === SUPPORTED_WALLETS_MAP.COINBASE) {
		return {
			appName: 'Synthetix Exchange',
			appLogoUrl: `${window.location.origin}/images/synthetix-logo-small.png`,
			jsonRpcUrl: INFURA_JSON_RPC_URLS[networkId],
			networkId,
		};
	}
	if (type === SUPPORTED_WALLETS_MAP.WALLET_CONNECT) {
		return {
			infuraId: INFURA_PROJECT_ID,
		};
	}
	if (type === SUPPORTED_WALLETS_MAP.PORTIS) {
		return {
			networkName: networkName.toLowerCase(),
			appId: PORTIS_APP_ID,
		};
	}
	return {};
};

export const setSigner = ({
	type,
	networkId,
	derivationPath,
	networkName,
}: {
	type: string;
	networkId: NetworkId;
	derivationPath: string;
	networkName: string;
}) => {
	//type = type == "MathWallet" ? type = "Metamask" : type;
	console.log(`Type is ${type}`)
	console.log(snxJSConnector.signers)
	// @ts-ignore
	const signer = new snxJSConnector.signers[type](
		getSignerConfig({ type, networkId, derivationPath, networkName })
	);

	snxJSConnector.setContractSettings({
		networkId,
		signer,
	});
};

export const connectToWallet = async ({
	wallet,
	derivationPath,
}: {
	wallet: string;
	derivationPath: string;
}) => {
	const ethereumNetwork = await getEthereumNetwork();
	if (!ethereumNetwork) {
		return {
			walletType: '',
			unlocked: false,
			unlockError: 'Network not supported',
		};
	}

	const { name, networkId } = ethereumNetwork;

	setSigner({ type: wallet, networkId, derivationPath, networkName: name });

	switch (wallet) {
		case SUPPORTED_WALLETS_MAP.BSCWALLET:
			return connectToBSCWallet(networkId, name);
		case SUPPORTED_WALLETS_MAP.METAMASK:
			return connectToMetamask(networkId, name);	
		case SUPPORTED_WALLETS_MAP.MATHWALLET:
			return connectToMathWallet(networkId, name);						
		case SUPPORTED_WALLETS_MAP.COINBASE:
			return connectToCoinbase(networkId, name);
		case SUPPORTED_WALLETS_MAP.WALLET_CONNECT:
			return connectToWalletConnect(networkId, name);
		case SUPPORTED_WALLETS_MAP.PORTIS:
			return connectToPortis(networkId, name);
		case SUPPORTED_WALLETS_MAP.TREZOR:
		case SUPPORTED_WALLETS_MAP.LEDGER:
			return connectToHardwareWallet(networkId, name, wallet);
		default:
			return {};
	}
};

export default snxJSConnector;
