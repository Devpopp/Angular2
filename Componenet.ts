WITH ranked_data AS (
    SELECT 
        id,
        cptyid,
        orgUnitId,
        lkupIsDeRecognised,
        lkupAssetLiability,
        lkupProdType,
        lkupResidenceOverride,
        lkupSectorOverride,
        lkupInterGroup,
        startDate,
        maturityDate,
        lkupCurrency,
        glaccount,
        CUSTOM1,
        CUSTOM2,
        -- other fields...
        SUM(amount) OVER (PARTITION BY 
            startDate, 
            maturityDate, 
            INTERESTRATE, 
            glaccount, 
            as_of_date, 
            cptyid, 
            orgunitid, 
            lkupcurrency, 
            lkupindustryoverride, 
            lkupresidenceoverride, 
            lkupsectoroverride, 
            lkupprodtype, 
            lkupassetliability, 
            lkupisownissued) AS aggregated_amount,
        DENSE_RANK() OVER (
            ORDER BY 
                startDate, 
                maturityDate, 
                INTERESTRATE, 
                glaccount, 
                as_of_date, 
                cptyid, 
                orgunitid, 
                lkupcurrency, 
                lkupindustryoverride, 
                lkupresidenceoverride, 
                lkupsectoroverride, 
                lkupprodtype, 
                lkupassetliability, 
                lkupisownissued
        ) AS rnk
    FROM your_source_table -- Adjust to your actual source table
)
SELECT DISTINCT
    id,
    cptyid,
    aggregated_amount AS amount,
    orgUnitId,
    lkupIsDeRecognised,
    lkupAssetLiability,
    lkupProdType,
    lkupResidenceOverride,
    lkupSectorOverride,
    lkupInterGroup,
    startDate,
    maturityDate,
    lkupCurrency,
    glaccount,
    CUSTOM1,
    CUSTOM2,
    rnk
FROM ranked_data
ORDER BY rnk;
