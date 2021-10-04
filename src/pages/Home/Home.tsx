import React, { FC } from 'react';

import Hero from './Hero';
import MarketsSection from 'pages/shared/components/MarketsSection';
import NewUserPromo from 'pages/shared/components/NewUserPromo';
import ExchangeFeatures from './ExchangeFeatures';

const Home: FC = () => (
	<>
		<Hero />
		<NewUserPromo />
		<MarketsSection isOnSplashPage={true} />
		{/*<ExchangeFeatures />*/}
	</>
);

export default Home;
