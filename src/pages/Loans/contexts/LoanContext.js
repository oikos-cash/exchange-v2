import React, { createContext, useContext, useEffect, useState } from 'react';
import snxJSConnector from 'utils/snxJSConnector';

const LoanContext = createContext(null);

export const LoanProvider = ({ children }) => {
	const [contractType, setContractType] = useState('oBNB');
	const [contract, setContract] = useState(null);

	useEffect(() => {
		const getSelectedContract = async () => {
			const {
				snxJS: { BNBCollateral, EtherCollateralsUSD },
			} = snxJSConnector;
			if (contractType === 'oBNB') {
				setContract(BNBCollateral.contract);
			} //else {
			//	setContract(EtherCollateralsUSD.contract);
			//}
		};
		getSelectedContract();
	}, [contractType]);

	return (
		<LoanContext.Provider value={{ contract, setContract, contractType, setContractType }}>
			{children}
		</LoanContext.Provider>
	);
};

export const useLoanContext = () => useContext(LoanContext);
