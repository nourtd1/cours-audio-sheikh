// Recherche d'un mot-clé dans les chapitres du livre
export function searchBookChapters(chapters, query) {
  if (!query) return chapters;
  return chapters.filter(chap =>
    chap.title.toLowerCase().includes(query.toLowerCase()) ||
    chap.content.toLowerCase().includes(query.toLowerCase())
  );
}

// Ajoute d'autres utilitaires pour le livre ici si besoin 