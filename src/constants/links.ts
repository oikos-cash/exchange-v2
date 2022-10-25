import { CurrencyKey } from './currency';

export const LINKS = {
	Support: 'https://t.me/oikoscash',
	Tokens: 'https://docs.oikos.cash/tokens/',
	Trading: {
		DexAG: 'https://dex.ag/', 
		PancakeswapoUSD: 'https://pancakeswap.finance/swap/0x6bf2be9468314281cd28a94c35f967cafd388325?inputCurrency=BNB&ChainId=56',
		Pancakeswap: 'https://pancakeswap.finance/',
		OneInchLink: (base: CurrencyKey, quote: CurrencyKey) =>
			`https://1inch.exchange/#/${base}/${quote}`,
	},
	Learn: {
		Litepaper: 'https://docs.oikos.cash/litepaper/',
		Tokens: 'https://docs.oikos.cash/tokens/',
		Blog: 'https://blog.oikos.cash',
	},
	Products: {
		Minter: 'https://minter.oikos.cash',
		Dashboard: 'https://stats.oikos.cash/',
	},
	Social: {
		Twitter: 'https://twitter.com/oikos_cash',
		Medium: 'https://blog.oikos.cash',
		Discord: 'https://t.me/oikos_cash',
		GitHub: 'https://github.com/oikos-cash',
	},
	Misc: {
		EthereumOrg: 'https://ethereum.org/',
		DefiNetwork: 'https://defi.network/',
		Messari: 'https://github.com/oikos-cash/oikos-bsc/raw/master/audit/AUDIT.pdf',
	},
	Blog: {
		HowBinaryOptionsWork: 'https://blog.synthetix.io/how-binary-options-work/',
		HowFeeReclamationRebatesWork: 'https://blog.synthetix.io/how-fee-reclamation-rebates-work/',
	},
};
