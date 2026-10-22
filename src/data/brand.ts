// Marca do Sowe Studio. Para trocar uma imagem, basta mudar a URL aqui.
// Os parâmetros f_auto,q_auto,h_… deixam o Cloudinary entregar a imagem
// no formato mais leve e na altura certa (não alteram o desenho).
const BASE = "https://res.cloudinary.com/dvqbwddan/image/upload";

export const BRAND = {
  // Emblema (monograma S): cabeçalho.
  emblem: `${BASE}/f_auto,q_auto,h_200/v1792644563/Sowe-Site/Emblema-Dourado-Sowe-Studio_brasao_sgukbw.png`,
  // Logo completa: rodapé.
  fullLogo: `${BASE}/f_auto,q_auto,h_260/v1792644821/Sowe-Site/Dourado-Sowe-Studio-Site_isw13k.png`,
  whatsapp: "https://wa.me/5542984265832",
};

// Link do WhatsApp com a mensagem já escrita.
export function whatsappUrl(message: string): string {
  return `${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}
