import React from 'react';

import MarketsSection from 'pages/shared/components/MarketsSection';
import NewUserPromo from 'pages/shared/components/NewUserPromo';
import Hero from './Hero/index.js';

export const Markets = () => (
	<>
	    <Hero />
		<NewUserPromo />
		<MarketsSection />
	</>
);

export default Markets;
