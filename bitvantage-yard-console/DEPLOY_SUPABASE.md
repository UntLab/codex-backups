## Supabase Deploy

1. Create a Supabase project.
2. Run [setup_supabase.sql](/Users/ais/GPT/progects/BitVantage terminal/setup_supabase.sql) in the Supabase SQL editor.
3. Copy `.env.example` to `.env` and fill in the Supabase/Postgres values.
4. Install backend dependencies:
   `python3 -m venv .venv && source .venv/bin/activate && pip install -r backend/requirements.txt`
5. Create the first admin:
   `python backend/scripts/create_admin.py --username admin --password 'CHANGE_ME' --full-name 'BitVantage Admin'`
6. Start the backend:
   `source .venv/bin/activate && cd backend && uvicorn main:app --host 0.0.0.0 --port 8000`

Notes:
- `BITVANTAGE_DEMO_MODE=false` disables demo seeding.
- The backend uses `DATABASE_URL` when it is set.
