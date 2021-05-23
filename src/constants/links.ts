import { CurrencyKey } from './currency';

export const LINKS = {
	Support: 'https://t.me/oikoscash',
	Tokens: 'https://docs.oikos.cash/tokens/',
	Trading: {
		DexAG: 'https://dex.ag/',
		Uniswap: 'https://uniswap.exchange/',
		OneInchLink: (base: CurrencyKey, quote: CurrencyKey) =>
			`https://1inch.exchange/#/${base}/${quote}`,
	},
	Learn: {
		Litepaper: 'https://docs.oikos.cash/litepaper/',
		Tokens: 'https://docs.oikos.cash/tokens/',
		Blog: 'https://blog.oikos.cash',
	},
	Products: {
		Mintr: 'https://minter.oikos.cash',
		Dashboard: 'https://stats.oikos.cash/',
	},
	Social: {
		Twitter: 'https://twitter.com/oikos_cash',
		Medium: 'https://blog.oikos.cash',
		Discord: 'https://discordapp.com/invite/AEdUHzt',
		GitHub: 'https://github.com/oikos-cash',
	},
	Misc: {
		EthereumOrg: 'https://ethereum.org/',
		DefiNetwork: 'https://defi.network/',
		Messari: 'https://messari.io/asset/synthetix',
	},
	Blog: {
		HowBinaryOptionsWork: 'https://blog.synthetix.io/how-binary-options-work/',
		HowFeeReclamationRebatesWork: 'https://blog.synthetix.io/how-fee-reclamation-rebates-work/',
	},
};
