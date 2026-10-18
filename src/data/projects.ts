// Projetos do portfólio. Para adicionar um trabalho novo, basta incluir um
// item na lista `projects` abaixo (não precisa mexer em mais nenhum arquivo).

export type Category = "video" | "site";

export interface Project {
  id: string;
  title: string;
  category: Category;
  description: string;
  // Imagem de capa. Para vídeos do YouTube pode ser omitida (usa a miniatura).
  image?: string;
  // Vídeos: ID do YouTube (o que vem depois de "v=" na URL).
  youtubeId?: string;
  // Sites: endereço do projeto no ar.
  link?: string;
  tags?: string[];
}

export const categoryLabels: Record<Category | "all", string> = {
  all: "Todos",
  video: "Vídeos e VFX",
  site: "Sites",
};

export const projects: Project[] = [
  {
    id: "video-0OKPMsnscHc",
    title: "Vídeo em destaque 1",
    category: "video",
    description: "Edição e efeitos visuais produzidos pelo Sowe Studio.",
    youtubeId: "0OKPMsnscHc",
    tags: ["Edição", "VFX"],
  },
  {
    id: "video-SGsAEn5kTUA",
    title: "Vídeo em destaque 2",
    category: "video",
    description: "Edição e efeitos visuais produzidos pelo Sowe Studio.",
    youtubeId: "SGsAEn5kTUA",
    tags: ["Edição", "VFX"],
  },
  {
    id: "video-EDDi_Vi1650",
    title: "Vídeo em destaque 3",
    category: "video",
    description: "Edição e efeitos visuais produzidos pelo Sowe Studio.",
    youtubeId: "EDDi_Vi1650",
    tags: ["Edição", "VFX"],
  },
  {
    id: "video-SH_VTSTyy9Q",
    title: "Vídeo em destaque 4",
    category: "video",
    description: "Edição e efeitos visuais produzidos pelo Sowe Studio.",
    youtubeId: "SH_VTSTyy9Q",
    tags: ["Edição", "VFX"],
  },
  {
    id: "site-sowe-studio",
    title: "Sowe Studio",
    category: "site",
    description: "Site institucional focado em branding.",
    image:
      "https://res.cloudinary.com/dvqbwddan/image/upload/v1772083015/Sowe-Site/Sites/Sowe_Site_nzowxk.jpg",
    link: "https://sowestudio.com.br",
    tags: ["React", "Branding"],
  },
  {
    id: "site-tnk-store",
    title: "TNK Store",
    category: "site",
    description: "Loja focada em conversão de vendas.",
    image:
      "https://res.cloudinary.com/dvqbwddan/image/upload/v1772082969/Sowe-Site/Sites/TNK_Store_u5mv3k.jpg",
    link: "https://tnkstore3.lojavirtualnuvem.com.br/",
    tags: ["E-commerce"],
  },
  {
    id: "site-hotmart",
    title: "Hotmart Área de Membros",
    category: "site",
    description: "Área de membros personalizada para cursos online.",
    image:
      "https://res.cloudinary.com/dvqbwddan/image/upload/v1777065423/Sowe-Site/Sites/Screenshot_1_cubrmy.jpg",
    link: "https://hotmart.com/pt-br/club/sowe",
    tags: ["Cursos"],
  },
];

export function filterProjects(
  list: Project[],
  category: Category | "all",
): Project[] {
  return category === "all" ? list : list.filter((p) => p.category === category);
}

export function projectImage(project: Project): string {
  if (project.image) return project.image;
  if (project.youtubeId) {
    return `https://i.ytimg.com/vi/${project.youtubeId}/hqdefault.jpg`;
  }
  return "";
}
