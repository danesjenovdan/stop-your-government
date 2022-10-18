function emitVariablesChanged(value) {
  const event = new CustomEvent('x-variables-changed', { detail: value });
  window.dispatchEvent(event);
}

export function getStoredVariables() {
  return JSON.parse(localStorage.getItem('variables') || '{}');
}

export function setStoredVariables(value) {
  localStorage.setItem('variables', JSON.stringify(value));
  emitVariablesChanged(value);
}

export function deleteStoredVariables() {
  setStoredVariables({});
}

export function getUnlockedChapters() {
  return JSON.parse(localStorage.getItem('unlockedChapters') || '{}');
}

export function setUnlockedChapters(value) {
  localStorage.setItem('unlockedChapters', JSON.stringify(value));
}

export function deleteUnlockedChapters() {
  setUnlockedChapters({});
}

export function getCompletedChapters() {
  return JSON.parse(localStorage.getItem('completedChapters') || '{}');
}

export function setCompletedChapters(value) {
  localStorage.setItem('completedChapters', JSON.stringify(value));
}

export function deleteCompletedChapters() {
  setCompletedChapters({});
}
