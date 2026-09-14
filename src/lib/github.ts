import "server-only";

const API_BASE = "https://api.github.com";

// Préfixé PUBLISH_ plutôt que GITHUB_TOKEN tout court : ce dernier est un
// nom de variable très standard (GitHub Actions, CLI gh...) et peut déjà
// être défini par ailleurs dans l'environnement avec des droits différents,
// ce qui provoquerait des échecs difficiles à diagnostiquer.
function config() {
  return {
    token: process.env.PUBLISH_GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER || "RafaelWaka",
    repo: process.env.GITHUB_REPO || "RA",
    branch: process.env.GITHUB_BRANCH || "claude/recruteur-demain-media-wvv51r",
  };
}

export function isGithubConfigured(): boolean {
  return Boolean(process.env.PUBLISH_GITHUB_TOKEN);
}

/**
 * Écrit (crée ou met à jour) un fichier dans le dépôt GitHub via l'API
 * Contents, sur la branche suivie par le déploiement Vercel. Chaque appel
 * déclenche un commit, donc un redéploiement automatique : l'article publié
 * devient visible sur le site après le build suivant (une à deux minutes).
 *
 * Nécessite PUBLISH_GITHUB_TOKEN : un Personal Access Token (fine-grained)
 * avec la permission "Contents: Read and write" sur ce dépôt (voir
 * .env.example et README.md pour la marche à suivre).
 */
export async function commitFile(
  filePath: string,
  content: string,
  message: string
): Promise<void> {
  const { token, owner, repo, branch } = config();
  if (!token) {
    throw new Error(
      "PUBLISH_GITHUB_TOKEN n'est pas configuré : impossible de publier l'article sur le dépôt GitHub."
    );
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const url = `${API_BASE}/repos/${owner}/${repo}/contents/${filePath}`;

  const existing = await fetch(`${url}?ref=${encodeURIComponent(branch)}`, {
    headers,
  });
  let sha: string | undefined;
  if (existing.ok) {
    const json = (await existing.json()) as { sha: string };
    sha = json.sha;
  } else if (existing.status !== 404) {
    throw new Error(
      `Lecture GitHub échouée (${existing.status}) pour ${filePath}. Vérifiez que PUBLISH_GITHUB_TOKEN a bien la permission "Contents: Read and write" sur ce dépôt.`
    );
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Écriture GitHub échouée (${res.status}) pour ${filePath} : ${text}`
    );
  }
}
