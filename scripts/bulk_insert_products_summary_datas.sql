-- =============================================
-- Function: bulk_insert_products_summary_datas
-- Inserts product summary data from JSONB; returns counts.
-- =============================================

CREATE OR REPLACE FUNCTION bulk_insert_products_summary_datas(p_data JSONB)
RETURNS TABLE (
    total_records INT,
    inserted_count INT,
    skipped_count INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_total INT;
    v_inserted INT;
BEGIN

    -- count total incoming records
    SELECT COUNT(*) INTO v_total
    FROM jsonb_array_elements(p_data);

    -- insert safely
    WITH input_data AS (
        SELECT
            item->>'product_id' AS product_id,
            item->>'product_name' AS product_name,
            item->>'category' AS category,

            CASE WHEN item->>'discounted_price' ~ '^[0-9.]+$'
                THEN (item->>'discounted_price')::NUMERIC
                ELSE NULL END AS discounted_price,

            CASE WHEN item->>'actual_price' ~ '^[0-9.]+$'
                THEN (item->>'actual_price')::NUMERIC
                ELSE NULL END AS actual_price,

            CASE WHEN item->>'discount_percentage' ~ '^[0-9.]+$'
                THEN (item->>'discount_percentage')::NUMERIC
                ELSE NULL END AS discount_percentage,

            CASE WHEN item->>'rating' ~ '^[0-9.]+$'
                THEN (item->>'rating')::NUMERIC
                ELSE NULL END AS rating,

            CASE WHEN item->>'rating_count' ~ '^[0-9]+$'
                THEN (item->>'rating_count')::INT
                ELSE NULL END AS rating_count,

            item->>'about_product' AS about_product,
            item->>'user_name' AS user_name,
            item->>'review_title' AS review_title,
            item->>'review_content' AS review_content

        FROM jsonb_array_elements(p_data) AS item
    ),

    inserted AS (
        INSERT INTO products (
            product_id,
            product_name,
            category,
            discounted_price,
            actual_price,
            discount_percentage,
            rating,
            rating_count,
            about_product,
            user_name,
            review_title,
            review_content
        )
        SELECT * FROM input_data
        ON CONFLICT (product_id) DO NOTHING
        RETURNING product_id
    )

    SELECT COUNT(*) INTO v_inserted FROM inserted;

    RETURN QUERY
    SELECT
        v_total,
        v_inserted,
        (v_total - v_inserted);

END;
$$;
