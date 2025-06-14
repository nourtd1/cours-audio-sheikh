import { supabase } from '../config/supabase';

export const audioService = {
  // Récupérer tous les fichiers audio
  async getAllAudioFiles() {
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers audio:', error);
      throw error;
    }
  },

  // Récupérer un fichier audio spécifique
  async getAudioFile(id) {
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du fichier audio:', error);
      throw error;
    }
  }
}; 