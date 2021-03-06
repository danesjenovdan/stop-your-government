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
