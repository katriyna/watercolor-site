
export async function loadImages() {
  const res = await fetch('/watercolors/metadata/info.json');
  if (!res.ok) {
    throw new Error(`Failed to load images metadata: ${res.status}`);
  }
  const resJson = await res.json();
  return resJson?.images || [];
}
