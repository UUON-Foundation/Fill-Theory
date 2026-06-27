import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW();');
    res.json(rows);
  } catch (error) {
    console.error('Query failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
