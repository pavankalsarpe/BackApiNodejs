# Database scripts

Run these in order when setting up or updating the database:

1. **products_table.sql** – Creates the `products_id_seq` sequence and `public.products` table.
2. **bulk_insert_products_summary_datas.sql** – Creates the `bulk_insert_products_summary_datas(p_data JSONB)` function for bulk insert from JSONB.

Example (from project root, using `psql` or your DB client):

```bash
psql -h <host> -U postgres -d <database> -f scripts/products_table.sql
psql -h <host> -U postgres -d <database> -f scripts/bulk_insert_products_summary_datas.sql
```

Or run both in one go:

```bash
psql -h <host> -U postgres -d <database> -f scripts/products_table.sql -f scripts/bulk_insert_products_summary_datas.sql
```
