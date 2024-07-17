-- Ensure the necessary indexes are created on the columns used in ORDER BY
-- Example: CREATE INDEX idx_boe_flex_data_stg ON boe_axiom_data.BOE_FLEX_DATA_STG (
--              orgunitid, counterparty_id, finstat_product_name, intragroup,
--              reporting_date, isderecognised, assetliability, residenceoverride,
--              sectoroverride, isintergroup, trade_value_date, trade_maturity_date,
--              currency, sap_account, loandepositterm, lkupisownissued, lkupissubordinated,
--              lkupisquoted, interest_rate, lkupindustryoverride, lkupisintermediatefincorp,
--              flex_balance_source, trade_value_date_1, isin, issuer_bic_code,
--              issuer_bta_code, counterparty_bic_code, orig_cptyid, lkupisindexlinked,
--              collateral_type
--          );

WITH ranked_data AS (
    SELECT 
        c.orgunitid,
        c.counterparty_id,
        c.finstat_product_name,
        c.intragroup,
        c.reporting_date,
        c.isderecognised,
        c.assetliability,
        c.residenceoverride,
        c.sectoroverride,
        c.isintergroup,
        c.trade_value_date,
        c.trade_maturity_date,
        c.currency,
        c.sap_account,
        c.loandepositterm,
        c.lkupisownissued,
        c.lkupissubordinated,
        c.lkupisquoted,
        c.interest_rate,
        c.lkupindustryoverride,
        c.lkupisintermediatefincorp,
        c.flex_balance_source,
        c.trade_value_date_1,
        c.isin,
        c.issuer_bic_code,
        c.issuer_bta_code,
        c.counterparty_bic_code,
        c.orig_cptyid,
        c.lkupisindexlinked,
        c.collateral_type,
        DENSE_RANK() OVER (
            ORDER BY
                c.orgunitid,
                c.counterparty_id,
                c.finstat_product_name,
                c.intragroup,
                c.reporting_date,
                c.isderecognised,
                c.assetliability,
                c.residenceoverride,
                c.sectoroverride,
                c.isintergroup,
                c.trade_value_date,
                c.trade_maturity_date,
                c.currency,
                c.sap_account,
                c.loandepositterm,
                c.lkupisownissued,
                c.lkupissubordinated,
                c.lkupisquoted,
                c.interest_rate,
                c.lkupindustryoverride,
                c.lkupisintermediatefincorp,
                c.flex_balance_source,
                c.trade_value_date_1,
                c.isin,
                c.issuer_bic_code,
                c.issuer_bta_code,
                c.counterparty_bic_code,
                c.orig_cptyid,
                c.lkupisindexlinked,
                c.collateral_type
        ) AS rnk
    FROM boe_axiom_data.BOE_FLEX_DATA_STG c
    WHERE c.reporting_date = p_reporting_period
      AND c.partition_key = p_partition
      AND c.gbp_ccy_amount > 0
      AND c.unique_key NOT IN (
          SELECT unique_key
          FROM BOE_NETTING_REPORT
          WHERE reporting_date = p_reporting_period
      )
)
