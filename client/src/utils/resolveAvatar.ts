function resolveAvatarUrl(url: string) {
  try {
    new URL(url); // si ça marche → URL externe valide
    return url;
  } catch {
    return `http://localhost:3000${url}`; // sinon → interne
  }
}

export default resolveAvatarUrl;