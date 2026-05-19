import { legalLinkClass } from "@/components/legal/link-styles"

export function PrivacyArticle({
  locale,
  siteUrl,
}: {
  locale: string
  siteUrl: string
}) {
  if (locale === "es") return <PrivacyArticleEs siteUrl={siteUrl} />
  if (locale === "ptBR") return <PrivacyArticlePtBR siteUrl={siteUrl} />
  return <PrivacyArticleEn siteUrl={siteUrl} />
}

function PrivacyArticleEn({ siteUrl }: { siteUrl: string }) {
  return (
    <>
      <p className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-foreground">
        This policy describes how fernn handles information in connection with Discord. It
        reflects how the open-source bot is designed; consider legal counsel for your
        jurisdiction if you rely on it commercially.
      </p>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">1. Who we are</h2>
        <p>
          The Bot is operated by Fernando Divino de Mores Júnior. This site: {siteUrl}. Source
          code reference:{" "}
          <a className={legalLinkClass} href="https://github.com/FernaandoJr/fernn" target="_blank" rel="noopener noreferrer">
            github.com/FernaandoJr/fernn
          </a>
          .
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">2. Data we process via Discord</h2>
        <p>
          To respond to slash commands and run configured features, the Bot processes data
          Discord sends to the application, such as user IDs, guild (server) IDs, channel IDs,
          roles, interaction payloads, and content required for a given command (for example,
          targets of moderation commands where applicable).
        </p>
        <p>
          For optional server logging (&quot;/server-log&quot;), the Bot listens to certain gateway
          events (for example member join/leave, voice activity, message deletes, moderation
          audit events, depending on configuration) and posts human-readable embeds to a channel
          you select. Those log messages live in Discord like any other channel messages; they
          are not stored by the Bot as a separate event history database.
        </p>
        <p>
          This website offers an optional dashboard for authenticated server administrators.
          When you sign in and connect Discord, the dashboard may read your configured log
          channel via the Discord API and display recent log embeds in the browser. That view
          shows the same messages visible in Discord; we do not maintain a separate long-term
          log archive on the web service beyond your account session data.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">3. Data we store (MongoDB)</h2>
        <p>
          The Bot uses MongoDB to store per-guild configuration needed for features such as
          server logging (for example which channel to use and which categories are enabled).
          This is operational configuration, not a copy of your server&apos;s message history managed
          by the Bot.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">4. Operational logs</h2>
        <p>
          Server operators may see command success/failure output in infrastructure logs when
          they host the Bot. We do not describe third-party hosting here; if you use a provider,
          their logging and retention policies also apply.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">5. Legal bases (EEA/UK, if applicable)</h2>
        <p>
          Where GDPR applies, we rely on legitimate interests in operating and securing the Bot,
          performing a contract with server operators where relevant, and consent where required.
          Discord is an independent controller for platform data; see Discord&apos;s privacy notices.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">6. Retention and deletion</h2>
        <p>
          Configuration documents in MongoDB persist until removed or overwritten by an
          administrator using the Bot&apos;s controls or until the database is deleted by the
          operator. To request deletion of stored configuration for a guild you administer,
          contact{" "}
          <a className={legalLinkClass} href="mailto:contact@fernaandojr.dev">
            contact@fernaandojr.dev
          </a>{" "}
          or remove the Bot and delete related database records if you self-host.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">7. Sharing</h2>
        <p>
          We do not sell personal data. Data is shared with Discord as necessary to operate the
          Bot, and with MongoDB/your database host as necessary to persist configuration. We do
          not use Discord data to train generalized machine learning models.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">8. Security</h2>
        <p>
          We take reasonable measures to protect tokens and databases (for example access
          controls and secrets handling on deployment). No method of transmission or storage is
          completely secure.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">9. Your rights</h2>
        <p>
          Depending on your region, you may have rights to access, correct, delete, or object to
          certain processing. Contact{" "}
          <a className={legalLinkClass} href="mailto:contact@fernaandojr.dev">
            contact@fernaandojr.dev
          </a>{" "}
          to make a request. We may need to verify your request and account for Discord&apos;s own
          processes for platform data.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">10. Children</h2>
        <p>
          Discord is not intended for users under the minimum age set by Discord in your region.
          We do not knowingly collect personal information from children outside what Discord
          provides to the Bot.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">11. Changes</h2>
        <p>
          We may update this Privacy Policy by posting a new version on this site and updating
          the effective date.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">12. Contact</h2>
        <p>
          Privacy questions:{" "}
          <a className={legalLinkClass} href="mailto:contact@fernaandojr.dev">
            contact@fernaandojr.dev
          </a>
          .
        </p>
      </section>
    </>
  )
}

function PrivacyArticleEs({ siteUrl }: { siteUrl: string }) {
  return (
    <>
      <p className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-foreground">
        Esta política describe cómo fernn trata la información relacionada con Discord. Refleja
        el diseño del bot de código abierto; consulta asesoría legal en tu jurisdicción si la
        usas con fines comerciales.
      </p>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">1. Quiénes somos</h2>
        <p>
          El Bot lo opera Fernando Divino de Mores Júnior. Este sitio: {siteUrl}. Código fuente:{" "}
          <a className={legalLinkClass} href="https://github.com/FernaandoJr/fernn" target="_blank" rel="noopener noreferrer">
            github.com/FernaandoJr/fernn
          </a>
          .
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">2. Datos que tratamos vía Discord</h2>
        <p>
          Para responder a comandos slash y ejecutar funciones configuradas, el Bot trata los
          datos que Discord envía a la aplicación, como IDs de usuario, IDs de gremio (servidor),
          IDs de canal, roles, cargas de interacción y el contenido necesario para un comando
          dado (por ejemplo, objetivos de comandos de moderación cuando aplique).
        </p>
        <p>
          Para el registro opcional del servidor (&quot;/server-log&quot;), el Bot escucha ciertos eventos
          de la pasarela (por ejemplo entradas/salidas de miembros, actividad de voz, borrados de
          mensajes, eventos de auditoría de moderación, según la configuración) y publica
          incrustaciones legibles en un canal que selecciones. Esos mensajes viven en Discord como
          cualquier otro mensaje de canal; el Bot no almacena una base de datos de historial de
          eventos aparte.
        </p>
        <p>
          Este sitio ofrece un panel opcional para administradores autenticados. Al iniciar
          sesión y conectar Discord, el panel puede leer tu canal de registro configurado
          mediante la API de Discord y mostrar embeds recientes en el navegador. Esa vista
          refleja los mismos mensajes visibles en Discord; no mantenemos un archivo de
          historial aparte en el servicio web más allá de los datos de tu cuenta.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">3. Datos que almacenamos (MongoDB)</h2>
        <p>
          El Bot usa MongoDB para guardar la configuración por gremio necesaria para funciones
          como el registro del servidor (por ejemplo qué canal usar y qué categorías están
          activas). Es configuración operativa, no una copia del historial de mensajes de tu
          servidor gestionada por el Bot.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">4. Registros operativos</h2>
        <p>
          Los operadores del servidor pueden ver salidas de éxito o error de comandos en los
          registros de infraestructura al hospedar el Bot. No describimos aquí el hospedaje de
          terceros; si usas un proveedor, también aplican sus políticas de registro y retención.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">5. Bases legales (EEE/Reino Unido, si aplica)</h2>
        <p>
          Cuando aplique el RGPD, nos basamos en intereses legítimos para operar y asegurar el Bot,
          en el contrato con operadores del servidor cuando corresponda y en el consentimiento
          cuando sea necesario. Discord es un responsable independiente de los datos de la
          plataforma; consulta sus avisos de privacidad.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">6. Conservación y supresión</h2>
        <p>
          Los documentos de configuración en MongoDB persisten hasta que un administrador los
          elimine o sobrescriba con los controles del Bot o hasta que el operador borre la base de
          datos. Para solicitar la supresión de la configuración almacenada de un gremio que
          administras, escribe a{" "}
          <a className={legalLinkClass} href="mailto:contact@fernaandojr.dev">
            contact@fernaandojr.dev
          </a>{" "}
          o elimina el Bot y los registros relacionados si lo hospedas tú mismo.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">7. Compartición</h2>
        <p>
          No vendemos datos personales. Los datos se comparten con Discord según sea necesario
          para operar el Bot, y con MongoDB o tu proveedor de base de datos para persistir la
          configuración. No usamos datos de Discord para entrenar modelos de aprendizaje
          automático generalizados.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">8. Seguridad</h2>
        <p>
          Aplicamos medidas razonables para proteger tokens y bases de datos (por ejemplo controles
          de acceso y manejo de secretos en el despliegue). Ningún método de transmisión o
          almacenamiento es totalmente seguro.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">9. Tus derechos</h2>
        <p>
          Según tu región, puedes tener derechos de acceso, rectificación, supresión u oposición al
          tratamiento. Escríbenos a{" "}
          <a className={legalLinkClass} href="mailto:contact@fernaandojr.dev">
            contact@fernaandojr.dev
          </a>{" "}
          para solicitarlo. Podemos necesitar verificar tu solicitud y tener en cuenta los
          procesos propios de Discord para datos de la plataforma.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">10. Menores</h2>
        <p>
          Discord no está destinado a usuarios por debajo de la edad mínima que Discord fije en
          tu región. No recopilamos a sabiendas información personal de menores más allá de lo que
          Discord proporciona al Bot.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">11. Cambios</h2>
        <p>
          Podemos actualizar esta Política de privacidad publicando una nueva versión en este sitio
          y actualizando la fecha de vigencia.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">12. Contacto</h2>
        <p>
          Preguntas de privacidad:{" "}
          <a className={legalLinkClass} href="mailto:contact@fernaandojr.dev">
            contact@fernaandojr.dev
          </a>
          .
        </p>
      </section>
    </>
  )
}

function PrivacyArticlePtBR({ siteUrl }: { siteUrl: string }) {
  return (
    <>
      <p className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-foreground">
        Esta política descreve como o fernn trata informações em conexão com o Discord. Ela reflete
        o design do bot de código aberto; considere assessoria jurídica na sua jurisdição se
        depender dela comercialmente.
      </p>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">1. Quem somos</h2>
        <p>
          O Bot é operado por Fernando Divino de Mores Júnior. Este site: {siteUrl}. Código-fonte:{" "}
          <a className={legalLinkClass} href="https://github.com/FernaandoJr/fernn" target="_blank" rel="noopener noreferrer">
            github.com/FernaandoJr/fernn
          </a>
          .
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">2. Dados que processamos via Discord</h2>
        <p>
          Para responder a comandos slash e executar recursos configurados, o Bot processa dados
          que o Discord envia ao aplicativo, como IDs de usuário, IDs de servidor (guild), IDs de
          canal, cargos, payloads de interação e conteúdo necessário para um comando (por exemplo,
          alvos de comandos de moderação quando aplicável).
        </p>
        <p>
          Para o registro opcional do servidor (&quot;/server-log&quot;), o Bot escuta certos eventos do
          gateway (por exemplo entrada/saída de membros, atividade de voz, exclusões de
          mensagens, eventos de auditoria de moderação, conforme a configuração) e publica
          incorporações legíveis em um canal que você selecionar. Essas mensagens ficam no Discord
          como qualquer outra mensagem de canal; o Bot não armazena um banco de histórico de
          eventos separado.
        </p>
        <p>
          Este site oferece um painel opcional para administradores autenticados. Ao entrar e
          conectar o Discord, o painel pode ler o canal de registro configurado pela API do
          Discord e exibir incorporações recentes no navegador. Essa visualização mostra as
          mesmas mensagens visíveis no Discord; não mantemos um arquivo de histórico separado no
          serviço web além dos dados da sua conta.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">3. Dados que armazenamos (MongoDB)</h2>
        <p>
          O Bot usa o MongoDB para armazenar configuração por servidor necessária para recursos como
          registro do servidor (por exemplo qual canal usar e quais categorias estão ativas). Isso
          é configuração operacional, não uma cópia do histórico de mensagens do seu servidor
          gerenciada pelo Bot.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">4. Registros operacionais</h2>
        <p>
          Operadores do servidor podem ver saídas de sucesso ou falha de comandos em logs de
          infraestrutura ao hospedar o Bot. Não descrevemos hospedagem de terceiros aqui; se você
          usar um provedor, as políticas de registro e retenção dele também se aplicam.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">5. Bases legais (EEE/Reino Unido, se aplicável)</h2>
        <p>
          Quando o GDPR se aplicar, nos baseamos em interesses legítimos para operar e proteger o
          Bot, em contrato com operadores do servidor quando relevante e em consentimento quando
          necessário. O Discord é um controlador independente para dados da plataforma; consulte os
          avisos de privacidade do Discord.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">6. Retenção e exclusão</h2>
        <p>
          Documentos de configuração no MongoDB persistem até serem removidos ou sobrescritos por
          um administrador usando os controles do Bot ou até o operador excluir o banco de dados.
          Para solicitar a exclusão da configuração armazenada de um servidor que você administra,
          contate{" "}
          <a className={legalLinkClass} href="mailto:contact@fernaandojr.dev">
            contact@fernaandojr.dev
          </a>{" "}
          ou remova o Bot e os registros relacionados se você mesmo hospedar.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">7. Compartilhamento</h2>
        <p>
          Não vendemos dados pessoais. Os dados são compartilhados com o Discord conforme necessário
          para operar o Bot, e com o MongoDB ou seu provedor de banco de dados para persistir a
          configuração. Não usamos dados do Discord para treinar modelos generalizados de aprendizado
          de máquina.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">8. Segurança</h2>
        <p>
          Adotamos medidas razoáveis para proteger tokens e bancos de dados (por exemplo controles de
          acesso e manejo de segredos na implantação). Nenhum método de transmissão ou armazenamento
          é totalmente seguro.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">9. Seus direitos</h2>
        <p>
          Dependendo da sua região, você pode ter direitos de acesso, correção, exclusão ou oposição
          a certos tratamentos. Contate{" "}
          <a className={legalLinkClass} href="mailto:contact@fernaandojr.dev">
            contact@fernaandojr.dev
          </a>{" "}
          para fazer um pedido. Podemos precisar verificar seu pedido e considerar os processos do
          próprio Discord para dados da plataforma.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">10. Crianças</h2>
        <p>
          O Discord não se destina a usuários abaixo da idade mínima definida pelo Discord na sua
          região. Não coletamos intencionalmente informações pessoais de crianças além do que o
          Discord fornece ao Bot.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">11. Alterações</h2>
        <p>
          Podemos atualizar esta Política de privacidade publicando uma nova versão neste site e
          atualizando a data de vigência.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">12. Contato</h2>
        <p>
          Dúvidas sobre privacidade:{" "}
          <a className={legalLinkClass} href="mailto:contact@fernaandojr.dev">
            contact@fernaandojr.dev
          </a>
          .
        </p>
      </section>
    </>
  )
}
