import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import audioRoutes from './routes/audioRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API monApp backend opérationnelle.' });
});

app.use('/api/audios', audioRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
}); 