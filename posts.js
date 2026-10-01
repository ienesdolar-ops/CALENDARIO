/**
 * ============================================================
 *  POSTS.JS — Dados dos posts do perfil @inspirarbalcamboriu
 * ============================================================
 *
 *  COMO ADICIONAR NOVOS POSTS:
 *  - Cada post é um objeto dentro do array `posts = [...]`.
 *  - Insira suas imagens na pasta /assets (ou use caminhos relativos).
 *  - Campos de cada post:
 *    • id: número único (ex: 1, 2, 3...)
 *    • tipo: "imagem" | "carrossel" | "reels"
 *    • midias: array de strings com caminhos das imagens
 *    • legenda: texto da publicação com quebras de linha (\n)
 *    • hashtags: texto com as hashtags
 *    • data: data planejada no formato "AAAA-MM-DD"
 *    • status: "rascunho" | "em aprovação" | "aprovado" | "publicado"
 *    • pilar: "institucional" | "educacional" | "depoimento" | "bastidores"
 *    • curtidas: número fictício para preview
 *    • comentarios: array de objetos [{ usuario: "nome", texto: "..." }]
 * ============================================================
 */

const posts = [
  // ─── POST 1: Carrossel Fisioterapia Pélvica Funcional ──────
  {
    id: 1,
    tipo: "carrossel",
    midias: [
      "assets/pelvica_slide1.jpg",
      "assets/pelvica_slide2.jpg",
      "assets/pelvica_slide3.jpg",
      "assets/pelvica_slide4.jpg",
      "assets/pelvica_slide5.jpg",
      "assets/pelvica_slide6.jpg"
    ],
    legenda: "🌸 FISIOTERAPIA PÉLVICA FUNCIONAL | Pós-Graduação Presencial em Balneário Camboriú (SC)\n\n👉 Deslize para o lado para conferir todos os detalhes da formação!\n\nVocê sabia que mais de 10% da população mundial sofre com algum tipo de disfunção pélvica? (OMS). A Fisioterapia Pélvica é hoje a primeira linha de tratamento recomendada pela comunidade científica internacional para disfunções urinárias, anorretais, sexuais, prolapsos genitais e cuidados obstétricos.\n\nMesmo diante dessa enorme demanda, o mercado ainda é carente de fisioterapeutas verdadeiramente especializados e seguros para a prática clínica.\n\n🎓 DIFERENCIAIS DA NOSSA PÓS-GRADUAÇÃO:\n✅ MasterClass Exclusiva (30h) com a Dra. Maura Seleme — pioneira e referência internacional na área.\n✅ Formação 370 horas com foco intensivo em prática presencial na unidade.\n✅ Laboratórios equipados com recursos modernos de Eletrotermofototerapia e Biofeedback Pélvico.\n✅ Horários pensados para conciliar com sua rotina de atendimentos: encontros às sextas (18h às 22h) e sábados (08h às 18h).\n\n📍 Unidade Balneário Camboriú: Rua Peru, 21 — Centro\n🗓️ Turma Confirmada para o 2º Semestre de 2026\n🏷️ Taxa de Inscrição: R$ 190,00 (Lote Promocional por tempo limitado)\n\n⚠️ Vagas limitadas para garantir o acompanhamento prático de cada aluno!\n\n📲 Quer garantir sua vaga com as condições do lote promocional ou tirar dúvidas? Envie uma mensagem no nosso Direct ou clique no link da bio para realizar seu pré-cadastro direto no portal! 👆",
    hashtags: "#FisioterapiaPelvica #Fisioterapia #PosGraduacao #FaculdadeInspirar #BalnearioCamboriu #SaudeDaMulher #AssoalhoPelvico #FisioBC #DraMauraSeleme",
    data: "2026-10-14",
    status: "em aprovação",
    pilar: "institucional",
    curtidas: 184,
    comentarios: [
      { usuario: "dra.camilafisio", texto: "Com a Dra. Maura Seleme dispensa comentários! Melhor formação do Brasil 👏" },
      { usuario: "renata_fisiobc", texto: "Já garanti minha vaga pelo link da bio! Ansiosa para o início das aulas 💙" },
      { usuario: "marina.albuquerque", texto: "Qual a data exata do primeiro módulo presencial?" },
      { usuario: "inspirarbalcamboriu", texto: "@marina.albuquerque Te enviamos o cronograma detalhado no Direct! 🎓" }
    ]
  }
];

// Exportar para uso no app.js (e compatível com Node.js para testes)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = posts;
}
