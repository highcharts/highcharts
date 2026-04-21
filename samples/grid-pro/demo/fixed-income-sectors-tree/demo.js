/* eslint-disable max-len, quotes */
const FIXED_INCOME_SECTORS_PAYLOAD = JSON.parse("{\"morningstarFixedIncomeSectorsBreakdown\":{\"fixedIncSuperSectorGovernmentPercLongRescaled\":9.1,\"fixedIncSuperSectorMunicipalPercLongRescaled\":22.9,\"fixedIncSuperSectorCorporatePercLongRescaled\":24.3,\"fixedIncSuperSectorSecuritizedPercLongRescaled\":15.8,\"fixedIncSuperSectorCashAndEquivalentsPercLongRescaled\":22.8,\"fixedIncSuperSectorDerivativePercLongRescaled\":5.1,\"fixedIncSuperSectorRescalingFactorLong\":0.036676,\"fixedIncPrimarySectorRescalingFactorLong\":0.036676,\"fixedIncPrimarySectorGovernmentPercLongRescaled\":6.1,\"fixedIncPrimarySectorGovernmentRelatedPercLongRescaled\":3,\"fixedIncPrimarySectorMunicipalTaxablePercLongRescaled\":15.3,\"fixedIncPrimarySectorMunicipalTaxExemptPercLongRescaled\":7.6,\"fixedIncPrimarySectorBankLoanPercLongRescaled\":0,\"fixedIncPrimarySectorConvertiblePercLongRescaled\":0,\"fixedIncPrimarySectorCorporateBondPercLongRescaled\":8.1,\"fixedIncPrimarySectorPreferredStockPercLongRescaled\":16.2,\"fixedIncPrimarySectorAgencyMortgageBackedPercLongRescaled\":5.3,\"fixedIncPrimarySectorNonAgencyResidentialMortgageBackedPercLongRescaled\":1,\"fixedIncPrimarySectorCommercialMortgageBackedPercLongRescaled\":4.2,\"fixedIncPrimarySectorCoveredBondPercLongRescaled\":2.1,\"fixedIncPrimarySectorAssetBackedPercLongRescaled\":3.2,\"fixedIncPrimarySectorCashAndEquivalentsPercLongRescaled\":22.8,\"fixedIncPrimarySectorSwapPercLongRescaled\":1.7,\"fixedIncPrimarySectorForwardorfuturePercLongRescaled\":3.4,\"fixedIncPrimarySectorOptionorwarrantPercLongRescaled\":0,\"fixedIncSecondarySectorTreasuryPercLongRescaled\":0,\"fixedIncSecondarySectorInflationProtectedPercLongRescaled\":1.8,\"fixedIncSecondarySectorAgencyorquasiAgencyPercLongRescaled\":0.6,\"fixedIncSecondarySectorSupranationalPercLongRescaled\":1,\"fixedIncSecondarySectorInterestRateDerivativePercLongRescaled\":1.2,\"fixedIncSecondarySectorTreasuryFuturesPercLongRescaled\":2.5,\"fixedIncSecondarySectorGovernmentRelatedOtherPercLongRescaled\":2,\"fixedIncSecondarySectorTaxableGeneralObligationStateAndLocalPercLongRescaled\":2.8,\"fixedIncSecondarySectorTaxableAdvanceRefundedPercLongRescaled\":1.9,\"fixedIncSecondarySectorTaxableTobaccoPercLongRescaled\":1.7,\"fixedIncSecondarySectorTaxableEducationPercLongRescaled\":1.1,\"fixedIncSecondarySectorTaxableHealthPercLongRescaled\":1.4,\"fixedIncSecondarySectorTaxableHousingPercLongRescaled\":2.2,\"fixedIncSecondarySectorTaxableIndustrialPercLongRescaled\":0.8,\"fixedIncSecondarySectorTaxableTransportationPercLongRescaled\":0,\"fixedIncSecondarySectorTaxableUtilitiesPercLongRescaled\":0.3,\"fixedIncSecondarySectorTaxableWaterAndSewerPercLongRescaled\":2.5,\"fixedIncSecondarySectorTaxableMiscRevenueorunspecifiedPercLongRescaled\":0.6,\"fixedIncSecondarySectorTaxExemptGeneralObligationStateAndLocalPercLongRescaled\":0.3,\"fixedIncSecondarySectorTaxExemptAdvanceRefundedPercLongRescaled\":1,\"fixedIncSecondarySectorTaxExemptTobaccoPercLongRescaled\":0.9,\"fixedIncSecondarySectorTaxExemptEducationPercLongRescaled\":1.3,\"fixedIncSecondarySectorTaxExemptHealthPercLongRescaled\":0.6,\"fixedIncSecondarySectorTaxExemptHousingPercLongRescaled\":1.2,\"fixedIncSecondarySectorTaxExemptIndustrialPercLongRescaled\":0.7,\"fixedIncSecondarySectorTaxExemptTransportationPercLongRescaled\":0.1,\"fixedIncSecondarySectorTaxExemptUtilitiesPercLongRescaled\":0.5,\"fixedIncSecondarySectorTaxExemptWaterAndSewerPercLongRescaled\":0.2,\"fixedIncSecondarySectorTaxExemptMiscRevenueorunspecifiedPercLongRescaled\":0.8,\"fixedIncSecondarySectorBankLoanBasicMaterialsPercLongRescaled\":0,\"fixedIncSecondarySectorBankLoanConsumerCyclicalPercLongRescaled\":0,\"fixedIncSecondarySectorBankLoanFinancialServicesPercLongRescaled\":0,\"fixedIncSecondarySectorBankLoanRealEstatePercLongRescaled\":0,\"fixedIncSecondarySectorBankLoanConsumerDefensivePercLongRescaled\":0,\"fixedIncSecondarySectorBankLoanHealthCarePercLongRescaled\":0,\"fixedIncSecondarySectorBankLoanUtilitiesPercLongRescaled\":0,\"fixedIncSecondarySectorBankLoanCommunicationServicesPercLongRescaled\":0,\"fixedIncSecondarySectorBankLoanEnergyPercLongRescaled\":0,\"fixedIncSecondarySectorBankLoanIndustrialsPercLongRescaled\":0,\"fixedIncSecondarySectorBankLoanTechnologyPercLongRescaled\":0,\"fixedIncSecondarySectorBankLoanUnspecifiedPercLongRescaled\":0,\"fixedIncSecondarySectorConvertibleBasicMaterialsPercLongRescaled\":0,\"fixedIncSecondarySectorConvertibleConsumerCyclicalPercLongRescaled\":0,\"fixedIncSecondarySectorConvertibleFinancialServicesPercLongRescaled\":0,\"fixedIncSecondarySectorConvertibleRealEstatePercLongRescaled\":0,\"fixedIncSecondarySectorConvertibleConsumerDefensivePercLongRescaled\":0,\"fixedIncSecondarySectorConvertibleHealthCarePercLongRescaled\":0,\"fixedIncSecondarySectorConvertibleUtilitiesPercLongRescaled\":0,\"fixedIncSecondarySectorConvertibleCommunicationServicesPercLongRescaled\":0,\"fixedIncSecondarySectorConvertibleEnergyPercLongRescaled\":0,\"fixedIncSecondarySectorConvertibleIndustrialsPercLongRescaled\":0,\"fixedIncSecondarySectorConvertibleTechnologyPercLongRescaled\":0,\"fixedIncSecondarySectorConvertibleUnspecifiedPercLongRescaled\":0,\"fixedIncSecondarySectorCorporateBasicMaterialsPercLongRescaled\":0.2,\"fixedIncSecondarySectorCorporateConsumerCyclicalPercLongRescaled\":0.7,\"fixedIncSecondarySectorCorporateFinancialServicesPercLongRescaled\":0,\"fixedIncSecondarySectorCorporateRealEstatePercLongRescaled\":1,\"fixedIncSecondarySectorCorporateConsumerDefensivePercLongRescaled\":1.1,\"fixedIncSecondarySectorCorporateHealthCarePercLongRescaled\":1.4,\"fixedIncSecondarySectorCorporateUtilitiesPercLongRescaled\":1.2,\"fixedIncSecondarySectorCorporateCommunicationServicesPercLongRescaled\":0.1,\"fixedIncSecondarySectorCorporateEnergyPercLongRescaled\":0.4,\"fixedIncSecondarySectorCorporateIndustrialsPercLongRescaled\":0.9,\"fixedIncSecondarySectorCorporateTechnologyPercLongRescaled\":0.5,\"fixedIncSecondarySectorCorporateUnspecifiedPercLongRescaled\":0.6,\"fixedIncSecondarySectorPreferredBasicMaterialsPercLongRescaled\":2.3,\"fixedIncSecondarySectorPreferredConsumerCyclicalPercLongRescaled\":2.5,\"fixedIncSecondarySectorPreferredFinancialServicesPercLongRescaled\":1.9,\"fixedIncSecondarySectorPreferredRealEstatePercLongRescaled\":2.1,\"fixedIncSecondarySectorPreferredConsumerDefensivePercLongRescaled\":0.8,\"fixedIncSecondarySectorPreferredHealthCarePercLongRescaled\":1.7,\"fixedIncSecondarySectorPreferredUtilitiesPercLongRescaled\":1,\"fixedIncSecondarySectorPreferredCommunicationServicesPercLongRescaled\":1.5,\"fixedIncSecondarySectorPreferredEnergyPercLongRescaled\":0.4,\"fixedIncSecondarySectorPreferredIndustrialsPercLongRescaled\":0.6,\"fixedIncSecondarySectorPreferredTechnologyPercLongRescaled\":0.2,\"fixedIncSecondarySectorPreferredUnspecifiedPercLongRescaled\":1.2,\"fixedIncSecondarySectorAgencyPassThruPercLongRescaled\":1.8,\"fixedIncSecondarySectorAgencyArmPercLongRescaled\":3.5,\"fixedIncSecondarySectorAgencyCmoPercLongRescaled\":0,\"fixedIncSecondarySectorUnspecifiedPercLongRescaled\":0,\"fixedIncSecondarySectorNonAgencyResidentialMortgageBackedPercLongRescaled\":1,\"fixedIncSecondarySectorCommercialMortgageBackedPercLongRescaled\":4.2,\"fixedIncSecondarySectorCoveredBondPercLongRescaled\":2.1,\"fixedIncSecondarySectorHomeEquityPercLongRescaled\":0.5,\"fixedIncSecondarySectorCreditCardPercLongRescaled\":0.1,\"fixedIncSecondarySectorCboorcdoPercLongRescaled\":0.9,\"fixedIncSecondarySectorAutoPercLongRescaled\":0.8,\"fixedIncSecondarySectorStudentLoanPercLongRescaled\":0.6,\"fixedIncSecondarySectorAssetBackedOtherPercLongRescaled\":0,\"fixedIncSecondarySectorAbsPercLongRescaled\":0.3,\"fixedIncSecondarySectorCashPercLongRescaled\":3.3,\"fixedIncSecondarySectorCorporatePercLongRescaled\":2.3,\"fixedIncSecondarySectorCurrencyPercLongRescaled\":2.5,\"fixedIncSecondarySectorDerivativeCashOffsetsPercLongRescaled\":0.7,\"fixedIncSecondarySectorFrnPercLongRescaled\":1.2,\"fixedIncSecondarySectorGovernmentPercLongRescaled\":0,\"fixedIncSecondarySectorGseoragencyPercLongRescaled\":0.5,\"fixedIncSecondarySectorMbsPercLongRescaled\":2,\"fixedIncSecondarySectorMoneyMarketPercLongRescaled\":2.8,\"fixedIncSecondarySectorMunicipalPercLongRescaled\":1.5,\"fixedIncSecondarySectorCommercialPaperPercLongRescaled\":0,\"fixedIncSecondarySectorRepurchaseAgreementsPercLongRescaled\":3,\"fixedIncSecondarySectorTdorcdPercLongRescaled\":1,\"fixedIncSecondarySectorCollateralPercLongRescaled\":1.8,\"fixedIncSecondarySectorCashOtherPercLongRescaled\":0.2,\"fixedIncSecondarySectorCreditDefaultSwapPercLongRescaled\":0.8,\"fixedIncSecondarySectorTotalReturnSwapPercLongRescaled\":0.6,\"fixedIncSecondarySectorDebtSwapPercLongRescaled\":0.3,\"fixedIncSecondarySectorBondFuturePercLongRescaled\":1.1,\"fixedIncSecondarySectorBondIndexFuturePercLongRescaled\":0,\"fixedIncSecondarySectorCurrencyForwardorfuturePercLongRescaled\":2.3,\"fixedIncSecondarySectorBondUnitPercLongRescaled\":0,\"fixedIncSecondarySectorBondOptionPercLongRescaled\":0,\"fixedIncSecondarySectorBondWarrantPercLongRescaled\":0,\"fixedIncSecondarySectorRescalingFactorLong\":0.036676,\"usTreasuryPercLongRescaled\":\"0.00000\",\"usTreasuryTipsPercLongRescaled\":\"0.00000\",\"usAgencyPercLongRescaled\":\"0.00000\",\"nonUsGovernmentPercLongRescaled\":\"0.00000\",\"otherGovernmentRelatedPercLongRescaled\":\"0.00000\",\"corporateBondPercLongRescaled\":\"0.00000\",\"bankLoanPercLongRescaled\":\"0.00000\",\"convertiblePercLongRescaled\":\"0.00000\",\"preferredStockPercLongRescaled\":\"0.00000\",\"agencyMbsPassThruPercLongRescaled\":\"0.00000\",\"agencyArmPercLongRescaled\":\"0.00000\",\"agencyCmoPercLongRescaled\":\"0.00000\",\"nonAgencyResidentialMortgageBackedPercLongRescaled\":\"0.00000\",\"commercialMortgageBackedPercLongRescaled\":\"0.00000\",\"coveredBondPercLongRescaled\":\"0.00000\",\"cashAndEquivalentsPercLongRescaled\":\"100.00000\",\"fixdIncMorningstarSectorsPortfolioDate\":\"2018-04-30\",\"cashRescalingFactorLong\":\"0.0366758\",\"governmentPercLongRescaled\":\"0.00000\",\"governmentSponsoredEnterpriseoragencyPercLongRescaled\":\"0.00000\",\"municipalPercLongRescaled\":\"0.00000\",\"corporatePercLongRescaled\":\"0.00000\",\"agencyMortgageBackedPercLongRescaled\":\"0.00000\",\"nonAgencyMortgageBackedPercLongRescaled\":\"0.00000\",\"assetBackedPercLongRescaled\":\"0.00000\",\"floatingRateNotePercLongRescaled\":\"0.00000\",\"commercialPaperPercLongRescaled\":\"0.00000\",\"repurchaseAgreementPercLongRescaled\":\"0.00000\",\"timeDepositorcdPercLongRescaled\":\"0.00000\",\"moneyMarketFundPercLongRescaled\":\"0.00000\",\"currencyIncludingDerivativesPercLongRescaled\":\"0.00000\",\"cashPercLongRescaled\":\"100.00000\",\"derivativeCashOffsetPercLongRescaled\":\"0.00000\",\"otherPercLongRescaled\":\"0.00000\",\"fixedIncSuperSectorGovernmentPercNet\":\"0\",\"fixedIncSuperSectorMunicipalPercNet\":\"0\",\"fixedIncSuperSectorCorporatePercNet\":\"0\",\"fixedIncSuperSectorSecuritizedPercNet\":\"0\",\"fixedIncSuperSectorCashAndEquivalentsPercNet\":\"3.66758\",\"fixedIncSuperSectorDerivativePercNet\":\"0\",\"fixedIncPrimarySectorGovernmentPercNet\":\"0\",\"fixedIncPrimarySectorGovernmentRelatedPercNet\":\"0\",\"fixedIncPrimarySectorMunicipalTaxablePercNet\":\"0\",\"fixedIncPrimarySectorMunicipalTaxExemptPercNet\":\"0\",\"fixedIncPrimarySectorBankLoanPercNet\":\"0\",\"fixedIncPrimarySectorConvertiblePercNet\":\"0\",\"fixedIncPrimarySectorCorporateBondPercNet\":\"0\",\"fixedIncPrimarySectorPreferredStockPercNet\":\"0\",\"fixedIncPrimarySectorAgencyMortgageBackedPercNet\":\"0\",\"fixedIncPrimarySectorNonAgencyResidentialMortgageBackedPercNet\":\"0\",\"fixedIncPrimarySectorCommercialMortgageBackedPercNet\":\"0\",\"fixedIncPrimarySectorCoveredBondPercNet\":\"0\",\"fixedIncPrimarySectorAssetBackedPercNet\":\"0\",\"fixedIncPrimarySectorCashAndEquivalentsPercNet\":\"3.66758\",\"fixedIncPrimarySectorSwapPercNet\":\"0\",\"fixedIncPrimarySectorForwardorfuturePercNet\":\"0\",\"fixedIncPrimarySectorOptionorwarrantPercNet\":\"0\",\"fixedIncSecondarySectorTreasuryPercNet\":\"0.00000\",\"fixedIncSecondarySectorInflationProtectedPercNet\":\"0.00000\",\"fixedIncSecondarySectorAgencyorquasiAgencyPercNet\":\"0.00000\",\"fixedIncSecondarySectorSupranationalPercNet\":\"0.00000\",\"fixedIncSecondarySectorInterestRateDerivativePercNet\":\"0.00000\",\"fixedIncSecondarySectorTreasuryFuturesPercNet\":\"0.00000\",\"fixedIncSecondarySectorGovernmentRelatedOtherPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxableGeneralObligationStateAndLocalPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxableAdvanceRefundedPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxableTobaccoPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxableEducationPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxableHealthPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxableHousingPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxableIndustrialPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxableTransportationPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxableUtilitiesPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxableWaterAndSewerPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxableMiscRevenueorunspecifiedPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptGeneralObligationStateAndLocalPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptAdvanceRefundedPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptTobaccoPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptEducationPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptHealthPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptHousingPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptIndustrialPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptTransportationPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptUtilitiesPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptWaterAndSewerPercNet\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptMiscRevenueorunspecifiedPercNet\":\"0.00000\",\"fixedIncSecondarySectorBankLoanBasicMaterialsPercNet\":\"0.00000\",\"fixedIncSecondarySectorBankLoanConsumerCyclicalPercNet\":\"0.00000\",\"fixedIncSecondarySectorBankLoanFinancialServicesPercNet\":\"0.00000\",\"fixedIncSecondarySectorBankLoanRealEstatePercNet\":\"0.00000\",\"fixedIncSecondarySectorBankLoanConsumerDefensivePercNet\":\"0.00000\",\"fixedIncSecondarySectorBankLoanHealthCarePercNet\":\"0.00000\",\"fixedIncSecondarySectorBankLoanUtilitiesPercNet\":\"0.00000\",\"fixedIncSecondarySectorBankLoanCommunicationServicesPercNet\":\"0.00000\",\"fixedIncSecondarySectorBankLoanEnergyPercNet\":\"0.00000\",\"fixedIncSecondarySectorBankLoanIndustrialsPercNet\":\"0.00000\",\"fixedIncSecondarySectorBankLoanTechnologyPercNet\":\"0.00000\",\"fixedIncSecondarySectorBankLoanUnspecifiedPercNet\":\"0.00000\",\"fixedIncSecondarySectorConvertibleBasicMaterialsPercNet\":\"0.00000\",\"fixedIncSecondarySectorConvertibleConsumerCyclicalPercNet\":\"0.00000\",\"fixedIncSecondarySectorConvertibleFinancialServicesPercNet\":\"0.00000\",\"fixedIncSecondarySectorConvertibleRealEstatePercNet\":\"0.00000\",\"fixedIncSecondarySectorConvertibleConsumerDefensivePercNet\":\"0.00000\",\"fixedIncSecondarySectorConvertibleHealthCarePercNet\":\"0.00000\",\"fixedIncSecondarySectorConvertibleUtilitiesPercNet\":\"0.00000\",\"fixedIncSecondarySectorConvertibleCommunicationServicesPercNet\":\"0.00000\",\"fixedIncSecondarySectorConvertibleEnergyPercNet\":\"0.00000\",\"fixedIncSecondarySectorConvertibleIndustrialsPercNet\":\"0.00000\",\"fixedIncSecondarySectorConvertibleTechnologyPercNet\":\"0.00000\",\"fixedIncSecondarySectorConvertibleUnspecifiedPercNet\":\"0.00000\",\"fixedIncSecondarySectorCorporateBasicMaterialsPercNet\":\"0.00000\",\"fixedIncSecondarySectorCorporateConsumerCyclicalPercNet\":\"0.00000\",\"fixedIncSecondarySectorCorporateFinancialServicesPercNet\":\"0.00000\",\"fixedIncSecondarySectorCorporateRealEstatePercNet\":\"0.00000\",\"fixedIncSecondarySectorCorporateConsumerDefensivePercNet\":\"0.00000\",\"fixedIncSecondarySectorCorporateHealthCarePercNet\":\"0.00000\",\"fixedIncSecondarySectorCorporateUtilitiesPercNet\":\"0.00000\",\"fixedIncSecondarySectorCorporateCommunicationServicesPercNet\":\"0.00000\",\"fixedIncSecondarySectorCorporateEnergyPercNet\":\"0.00000\",\"fixedIncSecondarySectorCorporateIndustrialsPercNet\":\"0.00000\",\"fixedIncSecondarySectorCorporateTechnologyPercNet\":\"0.00000\",\"fixedIncSecondarySectorCorporateUnspecifiedPercNet\":\"0.00000\",\"fixedIncSecondarySectorPreferredBasicMaterialsPercNet\":\"0.00000\",\"fixedIncSecondarySectorPreferredConsumerCyclicalPercNet\":\"0.00000\",\"fixedIncSecondarySectorPreferredFinancialServicesPercNet\":\"0.00000\",\"fixedIncSecondarySectorPreferredRealEstatePercNet\":\"0.00000\",\"fixedIncSecondarySectorPreferredConsumerDefensivePercNet\":\"0.00000\",\"fixedIncSecondarySectorPreferredHealthCarePercNet\":\"0.00000\",\"fixedIncSecondarySectorPreferredUtilitiesPercNet\":\"0.00000\",\"fixedIncSecondarySectorPreferredCommunicationServicesPercNet\":\"0.00000\",\"fixedIncSecondarySectorPreferredEnergyPercNet\":\"0.00000\",\"fixedIncSecondarySectorPreferredIndustrialsPercNet\":\"0.00000\",\"fixedIncSecondarySectorPreferredTechnologyPercNet\":\"0.00000\",\"fixedIncSecondarySectorPreferredUnspecifiedPercNet\":\"0.00000\",\"fixedIncSecondarySectorAgencyPassThruPercNet\":\"0.00000\",\"fixedIncSecondarySectorAgencyArmPercNet\":\"0.00000\",\"fixedIncSecondarySectorAgencyCmoPercNet\":\"0.00000\",\"fixedIncSecondarySectorUnspecifiedPercNet\":\"0.00000\",\"fixedIncSecondarySectorNonAgencyResidentialMortgageBackedPercNet\":\"0.00000\",\"fixedIncSecondarySectorCommercialMortgageBackedPercNet\":\"0.00000\",\"fixedIncSecondarySectorCoveredBondPercNet\":\"0.00000\",\"fixedIncSecondarySectorHomeEquityPercNet\":\"0.00000\",\"fixedIncSecondarySectorCreditCardPercNet\":\"0.00000\",\"fixedIncSecondarySectorCboorcdoPercNet\":\"0.00000\",\"fixedIncSecondarySectorAutoPercNet\":\"0.00000\",\"fixedIncSecondarySectorStudentLoanPercNet\":\"0.00000\",\"fixedIncSecondarySectorAssetBackedOtherPercNet\":\"0.00000\",\"fixedIncSecondarySectorAbsPercNet\":\"0.00000\",\"fixedIncSecondarySectorCashPercNet\":\"3.66758\",\"fixedIncSecondarySectorCorporatePercNet\":\"0.00000\",\"fixedIncSecondarySectorCurrencyPercNet\":\"0.00000\",\"fixedIncSecondarySectorDerivativeCashOffsetsPercNet\":\"0.00000\",\"fixedIncSecondarySectorFrnPercNet\":\"0.00000\",\"fixedIncSecondarySectorGovernmentPercNet\":\"0.00000\",\"fixedIncSecondarySectorGseoragencyPercNet\":\"0.00000\",\"fixedIncSecondarySectorMbsPercNet\":\"0.00000\",\"fixedIncSecondarySectorMoneyMarketPercNet\":\"0.00000\",\"fixedIncSecondarySectorMunicipalPercNet\":\"0.00000\",\"fixedIncSecondarySectorCommercialPaperPercNet\":\"0.00000\",\"fixedIncSecondarySectorRepurchaseAgreementsPercNet\":\"0.00000\",\"fixedIncSecondarySectorTdorcdPercNet\":\"0.00000\",\"fixedIncSecondarySectorCollateralPercNet\":\"0.00000\",\"fixedIncSecondarySectorCashOtherPercNet\":\"0.00000\",\"fixedIncSecondarySectorCreditDefaultSwapPercNet\":\"0.00000\",\"fixedIncSecondarySectorTotalReturnSwapPercNet\":\"0.00000\",\"fixedIncSecondarySectorDebtSwapPercNet\":\"0.00000\",\"fixedIncSecondarySectorBondFuturePercNet\":\"0.00000\",\"fixedIncSecondarySectorBondIndexFuturePercNet\":\"0.00000\",\"fixedIncSecondarySectorCurrencyForwardorfuturePercNet\":\"0.00000\",\"fixedIncSecondarySectorBondUnitPercNet\":\"0.00000\",\"fixedIncSecondarySectorBondOptionPercNet\":\"0.00000\",\"fixedIncSecondarySectorBondWarrantPercNet\":\"0.00000\",\"governmentPercNet\":\"0.00000\",\"governmentSponsoredEnterpriseoragencyPercNet\":\"0.00000\",\"municipalPercNet\":\"0.00000\",\"corporatePercNet\":\"0.00000\",\"agencyMortgageBackedPercNet\":\"0.00000\",\"nonAgencyMortgageBackedPercNet\":\"0.00000\",\"assetBackedPercNet\":\"0.00000\",\"floatingRateNotePercNet\":\"0.00000\",\"commercialPaperPercNet\":\"0.00000\",\"repurchaseAgreementPercNet\":\"0.00000\",\"timeDepositorcdPercNet\":\"0.00000\",\"moneyMarketFundPercNet\":\"0.00000\",\"currencyIncludingDerivativesPercNet\":\"0.00000\",\"cashPercNet\":\"3.66758\",\"derivativeCashOffsetPercNet\":\"0.00000\",\"otherPercNet\":\"0.00000\",\"usTreasuryPercNet\":\"0.00000\",\"usTreasuryTipsPercNet\":\"0.00000\",\"usAgencyPercNet\":\"0.00000\",\"nonUsGovernmentPercNet\":\"0.00000\",\"otherGovernmentRelatedPercNet\":\"0.00000\",\"corporateBondPercNet\":\"0\",\"bankLoanPercNet\":\"0\",\"convertiblePercNet\":\"0\",\"preferredStockPercNet\":\"0\",\"agencyMbsPassThruPercNet\":\"0.00000\",\"agencyArmPercNet\":\"0.00000\",\"agencyCmoPercNet\":\"0.00000\",\"nonAgencyResidentialMortgageBackedPercNet\":\"0\",\"commercialMortgageBackedPercNet\":\"0\",\"coveredBondPercNet\":\"0\",\"cashAndEquivalentsPercNet\":\"3.66758\",\"fixedIncSuperSectorGovernmentPercLong\":\"0\",\"fixedIncSuperSectorMunicipalPercLong\":\"0\",\"fixedIncSuperSectorCorporatePercLong\":\"0\",\"fixedIncSuperSectorSecuritizedPercLong\":\"0\",\"fixedIncSuperSectorCashAndEquivalentsPercLong\":\"3.66758\",\"fixedIncSuperSectorDerivativePercLong\":\"0\",\"fixedIncPrimarySectorGovernmentPercLong\":\"0\",\"fixedIncPrimarySectorGovernmentRelatedPercLong\":\"0\",\"fixedIncPrimarySectorMunicipalTaxablePercLong\":\"0\",\"fixedIncPrimarySectorMunicipalTaxExemptPercLong\":\"0\",\"fixedIncPrimarySectorBankLoanPercLong\":\"0\",\"fixedIncPrimarySectorConvertiblePercLong\":\"0\",\"fixedIncPrimarySectorCorporateBondPercLong\":\"0\",\"fixedIncPrimarySectorPreferredStockPercLong\":\"0\",\"fixedIncPrimarySectorAgencyMortgageBackedPercLong\":\"0\",\"fixedIncPrimarySectorNonAgencyResidentialMortgageBackedPercLong\":\"0\",\"fixedIncPrimarySectorCommercialMortgageBackedPercLong\":\"0\",\"fixedIncPrimarySectorCoveredBondPercLong\":\"0\",\"fixedIncPrimarySectorAssetBackedPercLong\":\"0\",\"fixedIncPrimarySectorCashAndEquivalentsPercLong\":\"3.66758\",\"fixedIncPrimarySectorSwapPercLong\":\"0\",\"fixedIncPrimarySectorForwardorfuturePercLong\":\"0\",\"fixedIncPrimarySectorOptionorwarrantPercLong\":\"0\",\"fixedIncSecondarySectorTreasuryPercLong\":\"0.00000\",\"fixedIncSecondarySectorInflationProtectedPercLong\":\"0.00000\",\"fixedIncSecondarySectorAgencyorquasiAgencyPercLong\":\"0.00000\",\"fixedIncSecondarySectorSupranationalPercLong\":\"0.00000\",\"fixedIncSecondarySectorInterestRateDerivativePercLong\":\"0.00000\",\"fixedIncSecondarySectorTreasuryFuturesPercLong\":\"0.00000\",\"fixedIncSecondarySectorGovernmentRelatedOtherPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxableGeneralObligationStateAndLocalPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxableAdvanceRefundedPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxableTobaccoPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxableEducationPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxableHealthPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxableHousingPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxableIndustrialPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxableTransportationPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxableUtilitiesPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxableWaterAndSewerPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxableMiscRevenueorunspecifiedPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptGeneralObligationStateAndLocalPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptAdvanceRefundedPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptTobaccoPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptEducationPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptHealthPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptHousingPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptIndustrialPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptTransportationPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptUtilitiesPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptWaterAndSewerPercLong\":\"0.00000\",\"fixedIncSecondarySectorTaxExemptMiscRevenueorunspecifiedPercLong\":\"0.00000\",\"fixedIncSecondarySectorBankLoanBasicMaterialsPercLong\":\"0.00000\",\"fixedIncSecondarySectorBankLoanConsumerCyclicalPercLong\":\"0.00000\",\"fixedIncSecondarySectorBankLoanFinancialServicesPercLong\":\"0.00000\",\"fixedIncSecondarySectorBankLoanRealEstatePercLong\":\"0.00000\",\"fixedIncSecondarySectorBankLoanConsumerDefensivePercLong\":\"0.00000\",\"fixedIncSecondarySectorBankLoanHealthCarePercLong\":\"0.00000\",\"fixedIncSecondarySectorBankLoanUtilitiesPercLong\":\"0.00000\",\"fixedIncSecondarySectorBankLoanCommunicationServicesPercLong\":\"0.00000\",\"fixedIncSecondarySectorBankLoanEnergyPercLong\":\"0.00000\",\"fixedIncSecondarySectorBankLoanIndustrialsPercLong\":\"0.00000\",\"fixedIncSecondarySectorBankLoanTechnologyPercLong\":\"0.00000\",\"fixedIncSecondarySectorBankLoanUnspecifiedPercLong\":\"0.00000\",\"fixedIncSecondarySectorConvertibleBasicMaterialsPercLong\":\"0.00000\",\"fixedIncSecondarySectorConvertibleConsumerCyclicalPercLong\":\"0.00000\",\"fixedIncSecondarySectorConvertibleFinancialServicesPercLong\":\"0.00000\",\"fixedIncSecondarySectorConvertibleRealEstatePercLong\":\"0.00000\",\"fixedIncSecondarySectorConvertibleConsumerDefensivePercLong\":\"0.00000\",\"fixedIncSecondarySectorConvertibleHealthCarePercLong\":\"0.00000\",\"fixedIncSecondarySectorConvertibleUtilitiesPercLong\":\"0.00000\",\"fixedIncSecondarySectorConvertibleCommunicationServicesPercLong\":\"0.00000\",\"fixedIncSecondarySectorConvertibleEnergyPercLong\":\"0.00000\",\"fixedIncSecondarySectorConvertibleIndustrialsPercLong\":\"0.00000\",\"fixedIncSecondarySectorConvertibleTechnologyPercLong\":\"0.00000\",\"fixedIncSecondarySectorConvertibleUnspecifiedPercLong\":\"0.00000\",\"fixedIncSecondarySectorCorporateBasicMaterialsPercLong\":\"0.00000\",\"fixedIncSecondarySectorCorporateConsumerCyclicalPercLong\":\"0.00000\",\"fixedIncSecondarySectorCorporateFinancialServicesPercLong\":\"0.00000\",\"fixedIncSecondarySectorCorporateRealEstatePercLong\":\"0.00000\",\"fixedIncSecondarySectorCorporateConsumerDefensivePercLong\":\"0.00000\",\"fixedIncSecondarySectorCorporateHealthCarePercLong\":\"0.00000\",\"fixedIncSecondarySectorCorporateUtilitiesPercLong\":\"0.00000\",\"fixedIncSecondarySectorCorporateCommunicationServicesPercLong\":\"0.00000\",\"fixedIncSecondarySectorCorporateEnergyPercLong\":\"0.00000\",\"fixedIncSecondarySectorCorporateIndustrialsPercLong\":\"0.00000\",\"fixedIncSecondarySectorCorporateTechnologyPercLong\":\"0.00000\",\"fixedIncSecondarySectorCorporateUnspecifiedPercLong\":\"0.00000\",\"fixedIncSecondarySectorPreferredBasicMaterialsPercLong\":\"0.00000\",\"fixedIncSecondarySectorPreferredConsumerCyclicalPercLong\":\"0.00000\",\"fixedIncSecondarySectorPreferredFinancialServicesPercLong\":\"0.00000\",\"fixedIncSecondarySectorPreferredRealEstatePercLong\":\"0.00000\",\"fixedIncSecondarySectorPreferredConsumerDefensivePercLong\":\"0.00000\",\"fixedIncSecondarySectorPreferredHealthCarePercLong\":\"0.00000\",\"fixedIncSecondarySectorPreferredUtilitiesPercLong\":\"0.00000\",\"fixedIncSecondarySectorPreferredCommunicationServicesPercLong\":\"0.00000\",\"fixedIncSecondarySectorPreferredEnergyPercLong\":\"0.00000\",\"fixedIncSecondarySectorPreferredIndustrialsPercLong\":\"0.00000\",\"fixedIncSecondarySectorPreferredTechnologyPercLong\":\"0.00000\",\"fixedIncSecondarySectorPreferredUnspecifiedPercLong\":\"0.00000\",\"fixedIncSecondarySectorAgencyPassThruPercLong\":\"0.00000\",\"fixedIncSecondarySectorAgencyArmPercLong\":\"0.00000\",\"fixedIncSecondarySectorAgencyCmoPercLong\":\"0.00000\",\"fixedIncSecondarySectorUnspecifiedPercLong\":\"0.00000\",\"fixedIncSecondarySectorNonAgencyResidentialMortgageBackedPercLong\":\"0.00000\",\"fixedIncSecondarySectorCommercialMortgageBackedPercLong\":\"0.00000\",\"fixedIncSecondarySectorCoveredBondPercLong\":\"0.00000\",\"fixedIncSecondarySectorHomeEquityPercLong\":\"0.00000\",\"fixedIncSecondarySectorCreditCardPercLong\":\"0.00000\",\"fixedIncSecondarySectorCboorcdoPercLong\":\"0.00000\",\"fixedIncSecondarySectorAutoPercLong\":\"0.00000\",\"fixedIncSecondarySectorStudentLoanPercLong\":\"0.00000\",\"fixedIncSecondarySectorAssetBackedOtherPercLong\":\"0.00000\",\"fixedIncSecondarySectorAbsPercLong\":\"0.00000\",\"fixedIncSecondarySectorCashPercLong\":\"3.66758\",\"fixedIncSecondarySectorCorporatePercLong\":\"0.00000\",\"fixedIncSecondarySectorCurrencyPercLong\":\"0.00000\",\"fixedIncSecondarySectorDerivativeCashOffsetsPercLong\":\"0.00000\",\"fixedIncSecondarySectorFrnPercLong\":\"0.00000\",\"fixedIncSecondarySectorGovernmentPercLong\":\"0.00000\",\"fixedIncSecondarySectorGseoragencyPercLong\":\"0.00000\",\"fixedIncSecondarySectorMbsPercLong\":\"0.00000\",\"fixedIncSecondarySectorMoneyMarketPercLong\":\"0.00000\",\"fixedIncSecondarySectorMunicipalPercLong\":\"0.00000\",\"fixedIncSecondarySectorCommercialPaperPercLong\":\"0.00000\",\"fixedIncSecondarySectorRepurchaseAgreementsPercLong\":\"0.00000\",\"fixedIncSecondarySectorTdorcdPercLong\":\"0.00000\",\"fixedIncSecondarySectorCollateralPercLong\":\"0.00000\",\"fixedIncSecondarySectorCashOtherPercLong\":\"0.00000\",\"fixedIncSecondarySectorCreditDefaultSwapPercLong\":\"0.00000\",\"fixedIncSecondarySectorTotalReturnSwapPercLong\":\"0.00000\",\"fixedIncSecondarySectorDebtSwapPercLong\":\"0.00000\",\"fixedIncSecondarySectorBondFuturePercLong\":\"0.00000\",\"fixedIncSecondarySectorBondIndexFuturePercLong\":\"0.00000\",\"fixedIncSecondarySectorCurrencyForwardorfuturePercLong\":\"0.00000\",\"fixedIncSecondarySectorBondUnitPercLong\":\"0.00000\",\"fixedIncSecondarySectorBondOptionPercLong\":\"0.00000\",\"fixedIncSecondarySectorBondWarrantPercLong\":\"0.00000\",\"governmentPercLong\":\"0.00000\",\"governmentSponsoredEnterpriseoragencyPercLong\":\"0.00000\",\"municipalPercLong\":\"0.00000\",\"corporatePercLong\":\"0.00000\",\"agencyMortgageBackedPercLong\":\"0.00000\",\"nonAgencyMortgageBackedPercLong\":\"0.00000\",\"assetBackedPercLong\":\"0.00000\",\"floatingRateNotePercLong\":\"0.00000\",\"commercialPaperPercLong\":\"0.00000\",\"repurchaseAgreementPercLong\":\"0.00000\",\"timeDepositorcdPercLong\":\"0.00000\",\"moneyMarketFundPercLong\":\"0.00000\",\"currencyIncludingDerivativesPercLong\":\"0.00000\",\"cashPercLong\":\"3.66758\",\"derivativeCashOffsetPercLong\":\"0.00000\",\"otherPercLong\":\"0.00000\",\"usTreasuryPercLong\":\"0.00000\",\"usTreasuryTipsPercLong\":\"0.00000\",\"usAgencyPercLong\":\"0.00000\",\"nonUsGovernmentPercLong\":\"0.00000\",\"otherGovernmentRelatedPercLong\":\"0.00000\",\"corporateBondPercLong\":\"0\",\"bankLoanPercLong\":\"0\",\"convertiblePercLong\":\"0\",\"preferredStockPercLong\":\"0\",\"agencyMbsPassThruPercLong\":\"0.00000\",\"agencyArmPercLong\":\"0.00000\",\"agencyCmoPercLong\":\"0.00000\",\"nonAgencyResidentialMortgageBackedPercLong\":\"0\",\"commercialMortgageBackedPercLong\":\"0\",\"coveredBondPercLong\":\"0\",\"cashAndEquivalentsPercLong\":\"3.66758\"},\"identifiers\":{\"performanceId\":\"0P00000FIA\"},\"metadata\":{\"requestId\":\"9f523299-6ba2-4d82-9c28-5ff6e0183258\",\"time\":\"2026-03-20T13:47:26.3777786Z\"}}");

/** Super-sector color (Morningstar-style palette) for the weight sparkline. */
const SUPER_META = {
    Government: { color: '#2364B9' },
    Municipal: { color: '#6B4EA1' },
    Corporate: { color: '#F47206' },
    Securitized: { color: '#125B2F' },
    CashAndEquivalents: { color: '#039649' },
    Derivative: { color: '#0F86A3' }
};

/**
 * Super → primary → secondary API tokens. Each leaf becomes
 * `fixedIncSecondarySector${token}PercLongRescaled`. Key order is UI order.
 */
const SECTOR_TREE = {
    Government: {
        Government: [
            'Treasury', 'InflationProtected', 'AgencyorquasiAgency',
            'InterestRateDerivative', 'TreasuryFutures'
        ],
        GovernmentRelated: ['Supranational', 'GovernmentRelatedOther']
    },
    Municipal: {
        MunicipalTaxable: [
            'TaxableGeneralObligationStateAndLocal', 'TaxableAdvanceRefunded',
            'TaxableTobacco', 'TaxableEducation', 'TaxableHealth', 'TaxableHousing',
            'TaxableIndustrial', 'TaxableTransportation', 'TaxableUtilities',
            'TaxableWaterAndSewer', 'TaxableMiscRevenueorunspecified'
        ],
        MunicipalTaxExempt: [
            'TaxExemptGeneralObligationStateAndLocal', 'TaxExemptAdvanceRefunded',
            'TaxExemptTobacco', 'TaxExemptEducation', 'TaxExemptHealth',
            'TaxExemptHousing', 'TaxExemptIndustrial', 'TaxExemptTransportation',
            'TaxExemptUtilities', 'TaxExemptWaterAndSewer',
            'TaxExemptMiscRevenueorunspecified'
        ]
    },
    Corporate: {
        BankLoan: [
            'BankLoanBasicMaterials', 'BankLoanConsumerCyclical',
            'BankLoanFinancialServices', 'BankLoanRealEstate',
            'BankLoanConsumerDefensive', 'BankLoanHealthCare', 'BankLoanUtilities',
            'BankLoanCommunicationServices', 'BankLoanEnergy', 'BankLoanIndustrials',
            'BankLoanTechnology', 'BankLoanUnspecified'
        ],
        Convertible: [
            'ConvertibleBasicMaterials', 'ConvertibleConsumerCyclical',
            'ConvertibleFinancialServices', 'ConvertibleRealEstate',
            'ConvertibleConsumerDefensive', 'ConvertibleHealthCare',
            'ConvertibleUtilities', 'ConvertibleCommunicationServices',
            'ConvertibleEnergy', 'ConvertibleIndustrials', 'ConvertibleTechnology',
            'ConvertibleUnspecified'
        ],
        CorporateBond: [
            'CorporateBasicMaterials', 'CorporateConsumerCyclical',
            'CorporateFinancialServices', 'CorporateRealEstate',
            'CorporateConsumerDefensive', 'CorporateHealthCare', 'CorporateUtilities',
            'CorporateCommunicationServices', 'CorporateEnergy', 'CorporateIndustrials',
            'CorporateTechnology', 'CorporateUnspecified'
        ],
        PreferredStock: [
            'PreferredBasicMaterials', 'PreferredConsumerCyclical',
            'PreferredFinancialServices', 'PreferredRealEstate',
            'PreferredConsumerDefensive', 'PreferredHealthCare', 'PreferredUtilities',
            'PreferredCommunicationServices', 'PreferredEnergy', 'PreferredIndustrials',
            'PreferredTechnology', 'PreferredUnspecified'
        ]
    },
    Securitized: {
        AgencyMortgageBacked: [
            'AgencyPassThru', 'AgencyArm', 'AgencyCmo', 'Unspecified'
        ],
        NonAgencyResidentialMortgageBacked: ['NonAgencyResidentialMortgageBacked'],
        CommercialMortgageBacked: ['CommercialMortgageBacked'],
        CoveredBond: ['CoveredBond'],
        AssetBacked: [
            'HomeEquity', 'CreditCard', 'Cboorcdo', 'Auto', 'StudentLoan',
            'AssetBackedOther', 'Abs'
        ]
    },
    CashAndEquivalents: {
        CashAndEquivalents: [
            'Cash', 'Corporate', 'Currency', 'DerivativeCashOffsets', 'Frn',
            'Government', 'Gseoragency', 'Mbs', 'MoneyMarket', 'Municipal',
            'CommercialPaper', 'RepurchaseAgreements', 'Tdorcd', 'Collateral',
            'CashOther'
        ]
    },
    Derivative: {
        Swap: ['CreditDefaultSwap', 'TotalReturnSwap', 'DebtSwap'],
        Forwardorfuture: [
            'BondFuture', 'BondIndexFuture', 'CurrencyForwardorfuture', 'BondUnit'
        ],
        Optionorwarrant: ['BondOption', 'BondWarrant']
    }
};

/**
 * Column buffers passed to Grid (`id` doubles as tree path when using path input).
 */
const result = {
    id: [],
    path: [],
    name: [],
    value: [],
    weight: [],
    superKey: []
};

/**
 * Append one row to all parallel column arrays.
 */
function pushNode({ pathParts, label, valueNum, superSector }) {
    const path = pathParts.join('/');

    result.id.push(path);
    result.path.push(path);
    result.name.push(label);
    result.value.push(`${valueNum.toFixed(1)}%`);
    result.weight.push(valueNum);
    result.superKey.push(superSector);
}

/**
 * Build super → primary → secondary rows from the flat breakdown object.
 */
const sectorsBreakdowns =
    FIXED_INCOME_SECTORS_PAYLOAD.morningstarFixedIncomeSectorsBreakdown;

Object.entries(SECTOR_TREE).forEach(([superSector, primaryToLeaves]) => {
    const superField = `fixedIncSuperSector${superSector}PercLongRescaled`;
    const superParsed = parseFloat(sectorsBreakdowns[superField]);
    const superValue = Number.isFinite(superParsed) ? superParsed : 0;

    // Super-sector row
    pushNode({
        pathParts: [superSector],
        label: superSector,
        valueNum: superValue,
        superSector
    });

    const primaries = Object.keys(primaryToLeaves);
    // One primary with the same id as the super (e.g. CashAndEquivalents): skip the
    // duplicate primary row; leaves hang directly under the super in the path.
    const skipDupPrimary =
        primaries.length === 1 && primaries[0] === superSector;

    primaries.forEach(primary => {
        const primaryField = `fixedIncPrimarySector${primary}PercLongRescaled`;
        const primaryParsed = parseFloat(sectorsBreakdowns[primaryField]);
        const primaryValue =
            Number.isFinite(primaryParsed) ? primaryParsed : 0;

        if (!skipDupPrimary) {
            pushNode({
                pathParts: [superSector, primary],
                label: primary,
                valueNum: primaryValue,
                superSector
            });
        }

        const leaves = primaryToLeaves[primary] || [];
        leaves.forEach(leaf => {
            const secKey = `fixedIncSecondarySector${leaf}PercLongRescaled`;
            const secParsed = parseFloat(sectorsBreakdowns[secKey]);
            const value = Number.isFinite(secParsed) ? secParsed : 0;

            pushNode({
                pathParts: skipDupPrimary ?
                    [superSector, leaf] :
                    [superSector, primary, leaf],
                label: leaf,
                valueNum: value,
                superSector
            });
        });
    });
});

Grid.grid('container', {
    data: {
        columns: result,
        idColumn: 'id',
        treeView: {
            input: {
                type: 'path',
                separator: '/'
            },
            treeColumn: 'name',
            expandedRowIds: ['CashAndEquivalents']
        }
    },
    caption: {
        text: 'Fixed Income Sector Allocation'
    },
    rendering: {
        rows: {
            strictHeights: true
        }
    },
    columnDefaults: {
        resizing: {
            enabled: true
        },
        filtering: {
            enabled: true
            // inline: true
        }
    },
    columns: [{
        id: 'id',
        enabled: false
    }, {
        id: 'superKey',
        enabled: false
    }, {
        id: 'name',
        header: {
            format: 'Sector'
        },
        cells: {
            formatter: function () {
                return this.value.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
                    .toLowerCase()
                    .replace(/^./, c => c.toUpperCase());
            }
        }
    }, {
        id: 'value',
        header: {
            format: 'Allocation (rescaled %)'
        },
        sorting: {
            enabled: false
        }
    }, {
        id: 'weight',
        dataType: 'string',
        filtering: {
            enabled: false
        },
        sorting: {
            order: 'desc'
        },
        header: {
            format: 'Share within level'
        },
        width: 300,
        cells: {
            renderer: {
                type: 'sparkline',
                chartOptions: function (cellValue) {
                    const sk = String(this.row?.data?.superKey ?? '');
                    const color =
                        SUPER_META[sk]?.color ?? '#7cb5ec';

                    let trimmed = ('' + cellValue).trim();
                    if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
                        trimmed = `[${trimmed}]`;
                    }
                    const data = JSON.parse(trimmed);

                    return {
                        chart: {
                            type: 'bar',
                            height: 30,
                            margin: [2, 6, 2, 6],
                            animation: false,
                            width: 300
                        },
                        yAxis: {
                            visible: false,
                            min: 0,
                            max: 100
                        },
                        plotOptions: {
                            bar: {
                                borderRadius: 1,
                                pointPadding: 0.2,
                                groupPadding: 0,
                                pointWidth: 4,
                                dataLabels: {
                                    crop: false,
                                    overflow: 'allow',
                                    useHTML: true,
                                    enabled: true,
                                    format:
                                        `<span style="color:${color};">{y:.1f}%</span>`
                                }
                            },
                            series: {
                                animation: false
                            }
                        },
                        series: [{
                            type: 'bar',
                            color: color,
                            data: data
                        }]
                    };
                }
            }
        }
    }, {
        id: 'path',
        enabled: false
    }],
    header: [
        'name',
        'value',
        'weight',
        'superKey'
    ]
});
