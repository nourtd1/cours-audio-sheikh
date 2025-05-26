// utils/audioUtils.js
// Fonctions utilitaires pour la gestion audio

export const playAudio = async (uri) => {
  // TODO: Implémenter la lecture audio avec expo-av
};

export function formatMillis(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// Ajoute d'autres utilitaires audio ici si besoin 