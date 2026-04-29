import { legalLinkClass } from "@/components/legal/link-styles"

export function TermsArticle({ locale }: { locale: string }) {
  if (locale === "es") return <TermsArticleEs />
  if (locale === "ptBR") return <TermsArticlePtBR />
  return <TermsArticleEn />
}

function TermsArticleEn() {
  return (
    <>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">1. Agreement</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of the fernn Discord
          application (the &quot;Bot&quot;), operated by Fernando Divino de Mores Júnior
          (&quot;we&quot;, &quot;us&quot;). By adding or using the Bot in a Discord server, you
          agree to these Terms and to Discord&apos;s{" "}
          <a className={legalLinkClass} href="https://discord.com/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>
          ,{" "}
          <a className={legalLinkClass} href="https://discord.com/guidelines" target="_blank" rel="noopener noreferrer">
            Community Guidelines
          </a>
          , and{" "}
          <a
            className={legalLinkClass}
            href="https://support-dev.discord.com/hc/en-us/articles/8562894815383-Discord-Developer-Terms-of-Service"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord Developer Terms
          </a>
          . If you do not agree, do not use the Bot.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">2. What fernn is</h2>
        <p>
          fernn is a slash-command Discord bot built with discord.js. It provides server
          utilities, moderation actions where permitted by Discord and your server&apos;s
          roles, optional server logging to a channel you configure, and related features as
          described in the{" "}
          <a className={legalLinkClass} href="https://github.com/FernaandoJr/fernn" target="_blank" rel="noopener noreferrer">
            fernn repository
          </a>
          . The Bot only operates within Discord according to the permissions and channel
          configuration chosen by server administrators.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">3. Eligibility and responsibility</h2>
        <p>
          You must comply with Discord&apos;s age and eligibility requirements. Server owners
          and administrators are responsible for configuring the Bot, granting permissions,
          choosing log channels, and ensuring use complies with applicable law and server
          rules. We are not responsible for how moderators use the Bot or for content posted
          by users in your community.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">4. Acceptable use</h2>
        <p>
          You agree not to use the Bot to violate law, Discord policies, or others&apos;
          rights; to harass, threaten, or spam; to attempt unauthorized access to systems or
          data; or to interfere with the Bot&apos;s or Discord&apos;s operation. We may suspend
          or limit access if we reasonably believe these Terms or Discord&apos;s policies are
          violated.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">5. Disclaimers</h2>
        <p>
          THE BOT IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
          IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT, TO THE MAXIMUM EXTENT PERMITTED BY LAW.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">6. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, Fernando Divino de Mores Júnior WILL NOT BE
          LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, OR
          ANY LOSS OF PROFITS, DATA, GOODWILL, OR SERVICE INTERRUPTION, ARISING OUT OF OR
          RELATED TO YOUR USE OF THE BOT. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE
          TERMS OR THE BOT WILL NOT EXCEED THE GREATER OF (A) AMOUNTS YOU PAID US FOR THE BOT IN
          THE TWELVE MONTHS BEFORE THE CLAIM OR (B) FIFTY US DOLLARS (US $50), IF APPLICABLE LAW
          ALLOWS SUCH A CAP.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">7. Changes</h2>
        <p>
          We may update these Terms by posting a revised version on this site and updating the
          effective date. Continued use after changes constitutes acceptance of the revised
          Terms where permitted by law.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">8. Contact</h2>
        <p>
          Questions about these Terms:{" "}
          <a className={legalLinkClass} href="mailto:contact@fernaandojr.dev">
            contact@fernaandojr.dev
          </a>
          .
        </p>
      </section>
    </>
  )
}

function TermsArticleEs() {
  return (
    <>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">1. Aceptación</h2>
        <p>
          Estos Términos del servicio (los &quot;Términos&quot;) regulan el uso de la aplicación de
          Discord fernn (el &quot;Bot&quot;), operada por Fernando Divino de Mores Júnior
          (&quot;nosotros&quot;). Al añadir o usar el Bot en un servidor de Discord, aceptas estos
          Términos y los{" "}
          <a className={legalLinkClass} href="https://discord.com/terms" target="_blank" rel="noopener noreferrer">
            Términos del servicio de Discord
          </a>
          , las{" "}
          <a className={legalLinkClass} href="https://discord.com/guidelines" target="_blank" rel="noopener noreferrer">
            Normas de la comunidad
          </a>{" "}
          y los{" "}
          <a
            className={legalLinkClass}
            href="https://support-dev.discord.com/hc/en-us/articles/8562894815383-Discord-Developer-Terms-of-Service"
            target="_blank"
            rel="noopener noreferrer"
          >
            Términos para desarrolladores de Discord
          </a>
          . Si no estás de acuerdo, no uses el Bot.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">2. Qué es fernn</h2>
        <p>
          fernn es un bot de Discord con comandos de barra diagonal (slash), construido con
          discord.js. Ofrece utilidades de servidor, acciones de moderación cuando Discord y los
          roles de tu servidor lo permitan, registro opcional del servidor en un canal que
          configures y otras funciones descritas en el{" "}
          <a className={legalLinkClass} href="https://github.com/FernaandoJr/fernn" target="_blank" rel="noopener noreferrer">
            repositorio fernn
          </a>
          . El Bot solo opera dentro de Discord según los permisos y la configuración de canales
          elegidos por los administradores del servidor.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">3. Elegibilidad y responsabilidad</h2>
        <p>
          Debes cumplir los requisitos de edad y elegibilidad de Discord. Los propietarios y
          administradores del servidor son responsables de configurar el Bot, otorgar permisos,
          elegir canales de registro y garantizar el cumplimiento de la ley aplicable y las
          normas del servidor. No somos responsables del uso que los moderadores hagan del Bot
          ni del contenido publicado por los usuarios de tu comunidad.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">4. Uso aceptable</h2>
        <p>
          Te comprometes a no usar el Bot para violar la ley, las políticas de Discord o los
          derechos de terceros; acosar, amenazar o enviar spam; intentar accesos no autorizados a
          sistemas o datos; o interferir en el funcionamiento del Bot o de Discord. Podemos
          suspender o limitar el acceso si creemos de buena fe que se infringen estos Términos o
          las políticas de Discord.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">5. Exención de garantías</h2>
        <p>
          EL BOT SE PROPORCIONA &quot;TAL CUAL&quot;, SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS,
          INCLUIDAS LAS DE COMERCIABILIDAD, IDONEIDAD PARA UN FIN PARTICULAR Y NO INFRACCIÓN, EN
          LA MEDIDA MÁXIMA PERMITIDA POR LA LEY.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">6. Limitación de responsabilidad</h2>
        <p>
          EN LA MEDIDA MÁXIMA PERMITIDA POR LA LEY, Fernando Divino de Mores Júnior NO SERÁ
          RESPONSABLE DE DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENTES O EJEMPLARES, NI
          DE PÉRDIDA DE BENEFICIOS, DATOS, FONDO DE COMERCIO O INTERRUPCIÓN DEL SERVICIO, DERIVADOS
          DEL USO DEL BOT. NUESTRA RESPONSABILIDAD TOTAL POR CUALQUIER RECLAMO RELACIONADO CON
          ESTOS TÉRMINOS O EL BOT NO SUPERARÁ EL MAYOR ENTRE (A) LO QUE NOS HAYAS PAGADO POR EL BOT
          EN LOS DOCE MESES ANTERIORES AL RECLAMO O (B) CINCUENTA DÓLARES ESTADOUNIDENSES (50 USD),
          SI LA LEY APLICABLE LO PERMITE.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">7. Cambios</h2>
        <p>
          Podemos actualizar estos Términos publicando una versión revisada en este sitio y
          actualizando la fecha de vigencia. El uso continuado tras los cambios implica la
          aceptación de los Términos revisados cuando la ley lo permita.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">8. Contacto</h2>
        <p>
          Preguntas sobre estos Términos:{" "}
          <a className={legalLinkClass} href="mailto:contact@fernaandojr.dev">
            contact@fernaandojr.dev
          </a>
          .
        </p>
      </section>
    </>
  )
}

function TermsArticlePtBR() {
  return (
    <>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">1. Acordo</h2>
        <p>
          Estes Termos de serviço (os &quot;Termos&quot;) regem o uso do aplicativo Discord fernn (o
          &quot;Bot&quot;), operado por Fernando Divino de Mores Júnior (&quot;nós&quot;). Ao adicionar ou usar o
          Bot em um servidor do Discord, você concorda com estes Termos e com os{" "}
          <a className={legalLinkClass} href="https://discord.com/terms" target="_blank" rel="noopener noreferrer">
            Termos de serviço do Discord
          </a>
          , as{" "}
          <a className={legalLinkClass} href="https://discord.com/guidelines" target="_blank" rel="noopener noreferrer">
            Diretrizes da comunidade
          </a>{" "}
          e os{" "}
          <a
            className={legalLinkClass}
            href="https://support-dev.discord.com/hc/en-us/articles/8562894815383-Discord-Developer-Terms-of-Service"
            target="_blank"
            rel="noopener noreferrer"
          >
            Termos do desenvolvedor Discord
          </a>
          . Se não concordar, não use o Bot.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">2. O que é o fernn</h2>
        <p>
          fernn é um bot Discord com comandos slash, feito com discord.js. Ele oferece utilidades
          de servidor, ações de moderação quando permitido pelo Discord e pelas funções do seu
          servidor, registro opcional do servidor em um canal que você configurar e outros
          recursos descritos no{" "}
          <a className={legalLinkClass} href="https://github.com/FernaandoJr/fernn" target="_blank" rel="noopener noreferrer">
            repositório fernn
          </a>
          . O Bot opera somente no Discord conforme as permissões e a configuração de canais
          escolhidas pelos administradores do servidor.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">3. Elegibilidade e responsabilidade</h2>
        <p>
          Você deve cumprir os requisitos de idade e elegibilidade do Discord. Proprietários e
          administradores do servidor são responsáveis por configurar o Bot, conceder permissões,
          escolher canais de log e garantir o uso em conformidade com a lei aplicável e as regras
          do servidor. Não somos responsáveis por como moderadores usam o Bot nem pelo conteúdo
          publicado pelos usuários da sua comunidade.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">4. Uso aceitável</h2>
        <p>
          Você concorda em não usar o Bot para violar a lei, políticas do Discord ou direitos de
          terceiros; assediar, ameaçar ou enviar spam; tentar acesso não autorizado a sistemas ou
          dados; ou interferir na operação do Bot ou do Discord. Podemos suspender ou limitar o
          acesso se acreditarmos razoavelmente que estes Termos ou as políticas do Discord foram
          violados.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">5. Isenção de garantias</h2>
        <p>
          O BOT É FORNECIDO &quot;NO ESTADO EM QUE SE ENCONTRA&quot;, SEM GARANTIAS DE QUALQUER TIPO,
          EXPRESSAS OU IMPLÍCITAS, INCLUINDO COMERCIALIZAÇÃO, ADEQUAÇÃO A UM FIM ESPECÍFICO E NÃO
          VIOLAÇÃO, NA MÁXIMA EXTENSÃO PERMITIDA POR LEI.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">6. Limitação de responsabilidade</h2>
        <p>
          NA MÁXIMA EXTENSÃO PERMITIDA POR LEI, Fernando Divino de Mores Júnior NÃO SERÁ
          RESPONSÁVEL POR QUAISQUER DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS, CONSEQUENCIAIS OU
          EXEMPLARES, OU PERDA DE LUCROS, DADOS, FUNDO DE COMÉRCIO OU INTERRUPÇÃO DE SERVIÇO,
          DECORRENTES DO USO DO BOT. NOSSA RESPONSABILIDADE TOTAL POR QUALQUER REIVINDICAÇÃO
          DECORRENTE DESTES TERMOS OU DO BOT NÃO EXCEDERÁ O MAIOR ENTRE (A) VALORES QUE VOCÊ NOS
          PAGOU PELO BOT NOS DOZE MESES ANTERIORES À REIVINDICAÇÃO OU (B) CINQUENTA DÓLARES
          AMERICANOS (US$ 50), SE A LEI APLICÁVEL PERMITIR ESSE LIMITE.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">7. Alterações</h2>
        <p>
          Podemos atualizar estes Termos publicando uma versão revisada neste site e atualizando a
          data de vigência. O uso continuado após as alterações constitui aceitação dos Termos
          revisados quando permitido por lei.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">8. Contato</h2>
        <p>
          Dúvidas sobre estes Termos:{" "}
          <a className={legalLinkClass} href="mailto:contact@fernaandojr.dev">
            contact@fernaandojr.dev
          </a>
          .
        </p>
      </section>
    </>
  )
}
