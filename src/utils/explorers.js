import { SUPPORTED_NETWORKS, isMainNet } from '../utils/networkUtils';

const getEtherScanBaseURL = (networkId) => {
	const network = SUPPORTED_NETWORKS[networkId];

	if (isMainNet(networkId) || network == null) {
		return 'https://bscscan.com';
	}

	return `https://${network.toLowerCase()}.bscscan.com`;
};

export const getEtherscanTxLink = (networkId, txId) => {
	const baseURL = getEtherScanBaseURL(networkId);

	return `${baseURL}/tx/${txId}`;
};

export const getEtherscanAddressLink = (networkId, address) => {
	const baseURL = getEtherScanBaseURL(networkId);

	return `${baseURL}/address/${address}`;
};

export const getEtherscanTokenLink = (networkId, address) => {
	const baseURL = getEtherScanBaseURL(networkId);

	return `${baseURL}/token/${address}`;
};
