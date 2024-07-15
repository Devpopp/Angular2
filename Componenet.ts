DECLARE
    TYPE flex_data_type IS TABLE OF flex_data_cur%ROWTYPE;
    l_data flex_data_type;
    limit_ct NUMBER := 1000;  -- or any appropriate limit

    CURSOR flex_data_cur IS
        SELECT 
            id,
            cptyid,
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
        FROM your_source_table;  -- Adjust to your actual source table
BEGIN
    OPEN flex_data_cur;

    LOOP
        FETCH flex_data_cur 
        BULK COLLECT INTO l_data 
        LIMIT limit_ct;

        EXIT WHEN l_data.COUNT = 0;

        FORALL i IN 1 .. l_data.COUNT
            INSERT INTO boe_axiom_stage.position_flex (
                id,
                cptyid,
                amount,
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
                rnk
            )
            VALUES (
                l_data(i).id,
                l_data(i).cptyid,
                l_data(i).aggregated_amount,
                l_data(i).orgUnitId,
                l_data(i).lkupIsDeRecognised,
                l_data(i).lkupAssetLiability,
                l_data(i).lkupProdType,
                l_data(i).lkupResidenceOverride,
                l_data(i).lkupSectorOverride,
                l_data(i).lkupInterGroup,
                l_data(i).startDate,
                l_data(i).maturityDate,
                l_data(i).lkupCurrency,
                l_data(i).glaccount,
                l_data(i).CUSTOM1,
                l_data(i).CUSTOM2,
                -- other values...
                l_data(i).rnk
            );

        COMMIT;
    END LOOP;

    CLOSE flex_data_cur;
END;
