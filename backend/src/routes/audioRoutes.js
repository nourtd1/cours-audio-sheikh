import express from 'express';
import { audioController } from '../controllers/audioController.js';

const router = express.Router();

// Routes pour les fichiers audio
router.get('/', audioController.getAllAudios);
router.get('/:id', audioController.getAudioById);
router.post('/', audioController.createAudio);
router.put('/:id', audioController.updateAudio);
router.delete('/:id', audioController.deleteAudio);

export default router; 