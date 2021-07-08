import React, { FC } from 'react';

import { useAllTradesQuery } from 'queries/myTrades';
import TradeHistory from './TradeHistory';

type AllTradesProps = {};

const AllTrades: FC<AllTradesProps> = () => {
	const allTradesQuery = useAllTradesQuery();
	const arr = allTradesQuery.data;
	arr?.forEach(obj => { 
		obj.price = obj.toAmountInUSD / obj.toAmount;
		obj.amount = obj.toAmountInUSD;
	})
	return (
		<TradeHistory
			trades={allTradesQuery.data || []}
			isLoading={allTradesQuery.isLoading && !allTradesQuery.isSuccess}
			isLoaded={allTradesQuery.isSuccess}
		/>
	);
};

export default AllTrades;
