// Pede ao Cloudinary a imagem já redimensionada e no formato mais leve do
// navegador (f_auto,q_auto). Só mexe em URLs de imagem sem transformação;
// qualquer outra coisa volta igual.
export function optimizeImage(url: string, width: number): string {
  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  const head = url.slice(0, i + marker.length);
  const rest = url.slice(i + marker.length);
  if (!/^v\d+\//.test(rest)) return url;
  return `${head}f_auto,q_auto,w_${Math.round(width)}/${rest}`;
}
