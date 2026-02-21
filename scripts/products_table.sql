-- =============================================
-- Table: public.products
-- =============================================

-- Sequence for auto-increment id (required before table)
CREATE SEQUENCE IF NOT EXISTS public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

-- Drop table if you need a clean recreate (uncomment if needed)
-- DROP TABLE IF EXISTS public.products;

CREATE TABLE IF NOT EXISTS public.products
(
    id integer NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    product_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    product_name text COLLATE pg_catalog."default",
    category text COLLATE pg_catalog."default",
    discounted_price numeric(10,2),
    actual_price numeric(10,2),
    discount_percentage numeric(5,2),
    rating numeric(3,1),
    rating_count integer,
    about_product text COLLATE pg_catalog."default",
    user_name text COLLATE pg_catalog."default",
    review_title text COLLATE pg_catalog."default",
    review_content text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_product_id_key UNIQUE (product_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.products
    OWNER TO postgres;
