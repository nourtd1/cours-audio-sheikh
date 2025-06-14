import { supabase } from '../utils/config.js';

export const audioController = {
  // Récupérer tous les fichiers audio
  async getAllAudios(req, res) {
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .select('*');

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer un fichier audio par ID
  async getAudioById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ message: 'Fichier audio non trouvé' });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Créer un nouveau fichier audio
  async createAudio(req, res) {
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .insert([req.body])
        .select();

      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mettre à jour un fichier audio
  async updateAudio(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('audio_files')
        .update(req.body)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (!data.length) {
        return res.status(404).json({ message: 'Fichier audio non trouvé' });
      }
      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Supprimer un fichier audio
  async deleteAudio(req, res) {
    try {
      const { id } = req.params;
      const { error } = await supabase
        .from('audio_files')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ message: 'Fichier audio supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}; 