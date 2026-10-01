const nativeSurfaces = new Set(['native-copilot-cli', 'integrated-terminal']);

export function resolveMediaEntry(chapterId, entry, present) {
  if (!/^C[1-7]$/.test(chapterId) || !entry || entry.file !== `media/${chapterId}.mp4`) {
    throw new Error(`Unexpected local media path for ${chapterId}.`);
  }
  if (typeof entry.reviewed !== 'boolean') {
    throw new Error(`${chapterId}: reviewed must be a boolean.`);
  }
  if (entry.sourceSurface != null && !nativeSurfaces.has(entry.sourceSurface)) {
    throw new Error(`${chapterId}: only genuine Copilot CLI or real integrated-terminal footage is allowed.`);
  }
  if (entry.selectedAgent != null && entry.selectedAgent !== 'squad') {
    throw new Error(`${chapterId}: product footage must show Squad selected.`);
  }
  if (entry.reviewed && (!present || typeof entry.takeId !== 'string' || !entry.takeId.trim())) {
    throw new Error(`Reviewed ${chapterId} needs a local file and take ID.`);
  }
  if (entry.reviewed && (!nativeSurfaces.has(entry.sourceSurface) || entry.selectedAgent !== 'squad')) {
    throw new Error(`Reviewed ${chapterId} needs an attested native source surface and selected Squad agent.`);
  }
  return { ...entry, present, available: present && entry.reviewed };
}
