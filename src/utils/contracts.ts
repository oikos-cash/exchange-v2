export const synthSummaryUtilContract = {
	addresses: {
		1: '0x0D69755e12107695E544842BF7F61D9193f09a54',
		3: '0x26a3C1878c4f3598e58f8bFB60B3cD9EF083e892',
		4: '0xba6c0220157008cecb7364b37e27885e7b5be74a',
		42: '0xA2b5742922ae4CA1676349009E33DA5fB4D05dCB',
	},
	abi: [
		{
			constant: true,
			inputs: [
				{ name: 'account', type: 'address' },
				{ name: 'currencyKey', type: 'bytes32' },
			],
			name: 'totalSynthsInKey',
			outputs: [{ name: 'total', type: 'uint256' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'synthsRates',
			outputs: [
				{ name: '', type: 'bytes32[]' },
				{ name: '', type: 'uint256[]' },
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'exchangeRates',
			outputs: [{ name: '', type: 'address' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'synthetix',
			outputs: [{ name: '', type: 'address' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [{ name: 'account', type: 'address' }],
			name: 'synthsBalances',
			outputs: [
				{ name: '', type: 'bytes32[]' },
				{ name: '', type: 'uint256[]' },
				{ name: '', type: 'uint256[]' },
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'frozenSynths',
			outputs: [{ name: '', type: 'bytes32[]' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{ name: '_synthetix', type: 'address' },
				{ name: '_exchangeRates', type: 'address' },
			],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'constructor',
		},
	],
};