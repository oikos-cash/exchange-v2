import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { SYNTHS_MAP, CurrencyKey, CurrencyKeys, CRYPTO_CURRENCY_MAP } from 'constants/currency';

import { ReactComponent as CogIcon } from 'assets/images/cog.svg';

import SearchInput from 'components/Input/SearchInput';

import { StyledButton, IconButton } from './common';

const ASSET_FILTERS: CurrencyKeys = [SYNTHS_MAP.oUSD, SYNTHS_MAP.oBTC, SYNTHS_MAP.oETH];

type SimpleSearchProps = {
	search: string;
	marketsAssetFilter: CurrencyKey;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onAssetFilterClick: (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		asset: CurrencyKey
	) => void;
	onAdvancedSearchClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const SimpleSearch: FC<SimpleSearchProps> = ({
	marketsAssetFilter,
	onSearchChange,
	onAdvancedSearchClick,
	search,
	onAssetFilterClick,
}) => {
	const { t } = useTranslation();
	ASSET_FILTERS[2] = "oBNB"
	return (
		<>
			<StyledSearchInput
				value={search}
				onChange={onSearchChange}
				placeholder={t('common.currency.try-currencyA-currencyB-or-currencyC-currencyD', {
					currencyA: SYNTHS_MAP.oBNB,
					currencyB: SYNTHS_MAP.iBTC,
					currencyC: CRYPTO_CURRENCY_MAP.LINK,
					currencyD: CRYPTO_CURRENCY_MAP.BNB,
				})}
			/>
			<ButtonsRow>
				{ASSET_FILTERS.map((asset) => {
					console.log(asset)
					if (asset != "oETH") {
						return (
							<StyledButton
								key={`button-filter-${asset}`}
								isActive={asset === marketsAssetFilter}
								onClick={(e) => onAssetFilterClick(e, asset)}
							>
								{asset}
							</StyledButton>
						) 
					}

				})
				}
				<IconButton onClick={onAdvancedSearchClick}>
					<CogIcon />
				</IconButton>
			</ButtonsRow>
		</>
	);
};

const ButtonsRow = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr auto;
	grid-gap: 8px;
`;

const StyledSearchInput = styled(SearchInput)`
	.search-input {
		&::placeholder {
			text-transform: none;
		}
	}
`;

export default SimpleSearch;
