import "../styles/style.css";

const WHATSAPP = "https://wa.me/5542984265832";

export default function Privacy() {
  return (
    <section className="legal-section">
      <div className="legal-container">
        <h1 className="legal-title">Política de Privacidade</h1>
        <p className="legal-updated">Última atualização: 20 de outubro de 2026</p>

        <p>
          Esta política explica quais dados o site do <strong>Sowe Studio</strong>{" "}
          (sowestudio.com.br, CNPJ 62.808.317/0001-06) coleta e como eles são
          usados.
        </p>

        <h2>1. Dados que coletamos</h2>
        <ul>
          <li>
            <strong>Cadastro e login:</strong> nome, e-mail e senha (guardada
            apenas em formato criptografado) de quem cria uma conta.
          </li>
          <li>
            <strong>Agendamentos:</strong> informações dos eventos criados pelo
            estúdio para planejar entregas.
          </li>
          <li>
            <strong>Navegação:</strong> estatísticas de acesso agregadas e
            anônimas, usadas para melhorar o site.
          </li>
        </ul>

        <h2>2. Dados do YouTube (Google)</h2>
        <p>
          O painel interno do estúdio pode se conectar ao YouTube para exibir
          métricas de canais, como visualizações, horas assistidas e inscritos.
          Isso só acontece quando o dono do canal autoriza o acesso com a conta
          Google dele.
        </p>
        <ul>
          <li>
            O acesso é <strong>somente leitura</strong> (YouTube Analytics). Não
            publicamos, editamos nem apagamos nada nos canais.
          </li>
          <li>
            Os dados são usados apenas para mostrar as métricas ao dono do canal
            e à equipe do estúdio. Não são vendidos, compartilhados com
            terceiros nem usados para publicidade.
          </li>
          <li>
            Guardamos apenas a credencial de acesso, em ambiente protegido do
            servidor. As métricas são consultadas sob demanda e mantidas em
            memória por poucos minutos.
          </li>
          <li>
            O dono do canal pode revogar a autorização a qualquer momento em{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
            >
              myaccount.google.com/permissions
            </a>
            .
          </li>
        </ul>
        <p>
          O uso das informações recebidas das APIs do Google segue a{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Dados do Usuário dos Serviços de API do Google
          </a>
          , incluindo os requisitos de uso limitado.
        </p>

        <h2>3. Compartilhamento</h2>
        <p>
          Não vendemos dados pessoais. Usamos serviços de infraestrutura para
          operar o site (hospedagem, banco de dados e calendário), que tratam os
          dados apenas para esse fim.
        </p>

        <h2>4. Seus direitos</h2>
        <p>
          Conforme a LGPD, você pode pedir acesso, correção ou exclusão dos seus
          dados a qualquer momento.
        </p>

        <h2>5. Contato</h2>
        <p>
          Para qualquer pedido sobre privacidade, fale conosco pelo{" "}
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          .
        </p>
      </div>
    </section>
  );
}
