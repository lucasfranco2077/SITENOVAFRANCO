# Auditoria pré-publicação — NOVA FRANCO

Data: 02/11/2026. Escopo: fonte mais recente em `sites-nova-franco`, pasta `SITENOVAFRANCO` do GitHub Desktop, artefato estático destinado à Vercel e histórico Git local disponível. Sem testes autenticados na Vercel: o proprietário confirmou que o projeto ainda não foi criado.

## Parecer

O código e o build estão tecnicamente preparados para um primeiro deploy de validação na Vercel. A liberação pública/para Google Ads depende das configurações e dos testes de produção abaixo. Não foi comprovada vulnerabilidade crítica ou alta. Isso não equivale a ausência garantida de vulnerabilidades nem a certificação de segurança/LGPD.

As correções estão na pasta local do GitHub Desktop. Não foram feitos commit, push, criação de projeto Vercel, alteração de DNS, publicação ou contratação de plano nesta auditoria. A publicação anterior do Sites não recebeu estas correções.

## 1. Arquitetura e integrações

- HTML/CSS e JavaScript nativo, sem framework, npm, lockfile ou bibliotecas JavaScript de terceiros no artefato final. Build com APIs nativas do Node.js, sem instalação de pacotes.
- Site estático, sem Functions, backend, APIs, banco, login, sessão, autenticação por cookies ou área restrita. A prévia móvel é uma página pública sem informação reservada; `noindex` não é controle de acesso.
- Não há formulário de envio nesta versão. Os botões abrem links HTTPS para o WhatsApp com mensagens de modelo. Não há upload, armazenamento de leads ou processamento de dados do orçamento pelo site.
- Não encontrados Google Analytics, Google Ads, Tag Manager, pixels, cookies próprios, localStorage, sessionStorage ou chamadas fetch/XHR no código publicado. Isso não valida a configuração da futura hospedagem ou do WhatsApp.
- Fontes do sistema, imagens locais e SVGs locais. Não são carregados CDN, scripts/fontes remotos ou iframes externos.
- 4 páginas: início, galeria, prévia de celular e privacidade. Robots e sitemap incluídos.
- Há divergência entre o checkout Sites e o GitHub Desktop. Antes de copiar, foi verificado que CSS/JS/preview coincidiam; diferenças HTML anteriores eram de conteúdo/legendas. As alterações foram aplicadas às duas fontes preservando a estrutura própria de cada uma.

## 2. Achados e classificação

| ID | Gravidade | Evidência anterior | Tratamento |
|---|---|---|---|
| SEC-01 | Média — configuração defensiva | Não havia configuração versionada Vercel de CSP, anti-iframe e demais cabeçalhos. Não se afirmou ausência observada em produção: ela ainda não existe. | `vercel.json` preparado. Aplicação real depende do deploy. |
| SEC-02 | Baixa — superfície pública desnecessária | Pasta Sites pública tinha 267 arquivos (~21,1 MB), incluindo clone.js, CSS e recursos legados do clone. Nenhum segredo foi encontrado nesses arquivos. | Build por fechamento de dependências publica 37 arquivos (~2,34 MB). Os originais ficam preservados na fonte para reversibilidade. |
| SEC-03 | Baixa — compatibilidade de proteção | Prévia móvel tinha script e CSS inline, incompatíveis com a CSP restrita proposta. | Script e CSS extraídos sem relaxar a CSP para unsafe-inline/unsafe-eval. Iframe passou a carregar `/` diretamente; testado no navegador. |
| PRIV-01 | Pendência de transparência | Não havia página de privacidade para explicar atendimento, hospedagem e WhatsApp. | Página criada e vinculada no rodapé; conteúdo operacional precisa de validação da empresa. Não é parecer jurídico. |
| DEP-01 | Bloqueio operacional, não vulnerabilidade AppSec | Site comercial destinado a captar clientes; Vercel Hobby é limitado a uso pessoal/não comercial. | Confirmar plano elegível ou hospedagem alternativa que aceite uso comercial. Nenhum recurso pago ativado. |

Críticos: nenhum comprovado. Altos: nenhum comprovado. Não foi identificado XSS/injeção explorável, redirecionamento aberto, credencial exposta ou falha de autorização no escopo examinado.

A canonical da galeria apontava para a página inicial: corrigida para `/galeria` como ajuste de SEO, sem classificar como vulnerabilidade.

## 3. Controles efetivamente preparados

- Publicação apenas de páginas e recursos usados, com validação de caminhos, tipos de arquivo e SVG ativo. Código de build, configuração, README, documentos e arquivos internos não entram em `public-vercel`.
- CSP: `default-src 'none'`; scripts/estilos/fontes locais; imagens locais/data; `connect-src 'none'`; `object-src 'none'`; `base-uri 'none'`; `form-action 'none'`; iframe e ancestrais apenas da mesma origem; upgrade de recursos inseguros. Sem curingas, unsafe-inline ou unsafe-eval.
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, Permissions Policy sem câmera/microfone/localização/pagamento e HSTS de 1 ano.
- SAMEORIGIN preserva a prévia móvel e bloqueia enquadramento por outros sites. Não foi usado DENY, que quebraria a funcionalidade.
- HSTS sem `includeSubDomains` e sem preload: não impor HTTPS a subdomínios desconhecidos. A Vercel pode adicionar sua própria política; verificar o resultado final.
- Nenhum CORS permissivo ou middleware desnecessário foi acrescentado. Não existe API que necessite CORS.
- Nenhum captcha, rate limiter ou serviço adicional foi instalado: não existe endpoint de formulário. Contato por WhatsApp permanece sujeito a spam direto e às proteções do próprio serviço.
- `.gitignore` exclui envs, estado Vercel, dependências e build gerado. Gitignore não revoga segredos já publicados; não foram encontrados padrões de credenciais no escopo examinado.
- Redirect somente do host exato `novafranco.com.br` para `https://www.novafranco.com.br`, sem utilizar destinos controlados por parâmetros do visitante. Não redireciona previews automaticamente para produção.

## 4. Itens não aplicáveis à arquitetura atual

- CSRF de operações autenticadas, sessão/cookies de login, controle de acesso, SQL/NoSQL injection e autorização de APIs: não há essas funcionalidades.
- Validação no servidor, proteção de upload e limitação de envio de formulários: não há receptor de dados.
- Auditoria npm de CVEs: não há manifesto/lockfile ou grafo npm. `npm audit` não foi executado e não foi inventado um resultado. Foram revisados os 3 scripts JavaScript publicados e SVGs alcançáveis.
- Não adicionar validação apenas no navegador para simular proteção de um futuro backend. Qualquer inclusão de backend/formulário exige nova avaliação e validação no servidor.

## 5. Testes executados e resultados

- Build de produção no checkout Sites e na pasta GitHub Desktop: passou; 37 arquivos, 2.338.033 bytes. Sem instalação de dependências.
- Verificação sintática Node (`--check`) dos 3 scripts publicados: passou.
- Análise estática de sinks comuns de XSS nos scripts publicados: nenhum innerHTML, outerHTML, document.write, eval ou new Function encontrado. Fluxos revisados usam textContent/dados estáticos da página.
- Busca heurística de segredos em 200 arquivos da pasta GitHub: nenhum padrão encontrado. Não prova ausência absoluta de segredo.
- Histórico disponível do GitHub Desktop: 25 commits verificados por assinaturas de credenciais/chaves; sem ocorrências. Histórico Sites: 29 commits verificados, sem ocorrências. Não abrange cópias remotas inacessíveis, branches inexistentes localmente ou serviços de terceiros.
- 20 links internos/fragmentos: destinos existentes; links HTTPS externos limitados a WhatsApp e domínio da empresa. Não foi enviada mensagem nem validada entrega no aparelho de atendimento.
- 37 recursos da saída: HTTP local 200.
- 6 rotas públicas: HTTP local 200. 9 rotas internas/inexistentes: 404, incluindo `.env`, `.git/config`, código de build e clone legado.
- 6 cabeçalhos de segurança conferidos em todas as rotas locais verificadas, inclusive erros. O servidor de teste reproduz a configuração; isto NÃO comprova comportamento da Vercel.
- URL com payload de script: resposta idêntica à página sem parâmetros, sem reflexão. Parâmetro redirect externo não produziu redirecionamento. POST local rejeitado pelo simulador; não é uma garantia de política de métodos da Vercel.
- Navegador com CSP local: filtro de pinturas, modal de imagem e fechamento funcionaram. Prévia de celular carregou o iframe; controles de 320/430 pixels e menu móvel funcionaram após ajuste de rota.
- Observado um erro MutationObserver sem URL de origem no navegador integrado; esse código não existe na aplicação. Não foi atribuído ao site e não se afirma console global sem erros.
- JSON da configuração validamente lido. Validação completa contra schema oficial Vercel não executada: biblioteca jsonschema indisponível; nenhuma dependência instalada só para isso. A aceitação pela plataforma fica para o primeiro deploy.
- Nenhum teste de TLS, cabeçalhos na Vercel, painel, DDoS, carga, WAF, cobrança, conta WhatsApp ou envio real de lead foi executado. Não foi feito teste invasivo em terceiros.

Evidências estruturadas: `testes-finais.json`, entregue junto deste relatório.

## 6. Arquivos modificados/criados na pasta GitHub Desktop

- `vercel.json`: build, diretório de saída, URLs limpas, redirect e cabeçalhos.
- `scripts/build-vercel.mjs`: build restrito e sem pacotes externos.
- `scripts/preview-security.mjs`: servidor local de verificação, fora da saída pública.
- `scripts/check-live.mjs`: verificação pós-deploy; preparado, não executado em produção.
- `.gitignore`: proteção contra inclusão acidental de arquivos privados/gerados.
- `index.html`, `galeria.html`: link de privacidade, atualização de CSS, sincronização de legendas; canonical da galeria corrigida.
- `previa-celular.html`, `assets/css/previa-celular.css`, `assets/js/previa-celular.js`: extração de código inline e rota direta do iframe.
- `assets/css/nova-franco.css`: estilos limitados à página de privacidade.
- `privacidade.html`, `robots.txt`, `sitemap.xml`: informação de privacidade e metadados de indexação.
- `README.md` e `AUDITORIA-SEGURANCA.md`: instruções e este relatório. Nenhum dado confidencial incluído.

Os equivalentes de configuração/build/conteúdo também foram preparados no checkout Sites; isso não publica nem aplica headers na hospedagem Sites. Para a Vercel, usar o repositório GitHub Desktop com sua raiz própria.

## 7. Dados pessoais, LGPD e Google Ads

No código atual não há coleta de campos ou cookies de publicidade. Por isso não foi colocado um banner de consentimento sem finalidade real. Os registros técnicos da futura hospedagem e as conversas do WhatsApp continuam sendo tratamento de dados.

A página de privacidade explica o contato externo, solicita minimização de dados em fotos/plantas e oferece o canal existente para solicitações de privacidade. A empresa precisa confirmar identidade completa do controlador, acesso dos colaboradores, retenção, exclusão, fornecedores e processos de atendimento; não foram inventados CNPJ, e-mail ou prazo de retenção.

Para Google Analytics/Ads/Tag Manager futuros: documentar finalidades e base legal, atualizar o aviso e implantar controles de consentimento quando aplicáveis ANTES de habilitar rastreamento não necessário. A CSP atual intencionalmente bloqueia scripts/conexões externos; expandir apenas para os domínios estritamente necessários, após nova revisão. Não adicionar curingas ou unsafe-inline para contornar bloqueios. Consent Mode não substitui, por si só, a análise de consentimento/base legal.

## 8. Configurações manuais necessárias na Vercel

1. Conferir elegibilidade do plano para site comercial. Hobby não é apropriado segundo as regras publicadas. Sem contratação automática.
2. Fazer commit/push das correções locais pelo fluxo normal do GitHub. Importar o repositório correto na Vercel e selecionar a branch de produção.
3. Root Directory: raiz do repositório GitHub; Framework: Other; Build: `node scripts/build-vercel.mjs`; Output: `public-vercel`. Não publicar a raiz. Nenhuma variável de ambiente necessária.
4. Adicionar os domínios com e sem www. Usar os registros DNS exatos exibidos no painel, sem adivinhar IPs. Confirmar certificado emitido, HTTP→HTTPS e canonical www; conferir redirect sem loop e preservação dos parâmetros de campanhas.
5. Ativar Vercel Authentication / Standard Protection para previews e URLs de deployment, conforme disponibilidade do plano. Deixar o domínio de produção acessível ao público. Não colocar autenticação no domínio dos anúncios.
6. Manter Build Logs and Source Protection e Git Fork Protection. Conferir colaboradores, acesso ao GitHub/Vercel e autenticação multifator. Nunca colar credenciais em arquivos públicos.
7. Revisar a proteção DDoS automática, eventos do Firewall e recursos efetivamente incluídos no plano. Não ativar regras ou limites pagos sem autorização. Sem funções há menor risco de invocações abusivas, mas tráfego/banda continuam sujeitos a limites e custos.
8. Configurar alertas/limites de consumo disponíveis e acompanhar tráfego durante campanhas. Não aplicar desafios gerais que bloqueiem visitantes legítimos ou validadores dos anúncios.
9. Conferir que previews protegidos não sejam usados como URL final de anúncio nem indexados como produção. `robots.txt` sozinho não restringe acesso.
10. Após o deploy, executar `node scripts/check-live.mjs https://www.novafranco.com.br` e conferir no navegador, rede móvel e dispositivo real. Esse script está apenas preparado.

## 9. Checklist de liberação

- [x] Código/arquitetura e integrações identificados.
- [x] Build estático sem dependências externas executado.
- [x] Saída pública restrita e arquivos antigos fora do artefato.
- [x] Cabeçalhos preparados e testados localmente.
- [x] Navegação, galeria e prévia móvel verificadas no navegador integrado.
- [x] Busca de segredos e histórico disponível realizada sem valores no relatório.
- [x] Página de privacidade adicionada, sem rastreamento novo.
- [ ] Confirmar práticas/identificação de privacidade com a empresa.
- [ ] Commit/push e primeiro deploy na Vercel.
- [ ] Resolver elegibilidade do plano para uso comercial.
- [ ] Configurar domínio, certificado e redirects reais.
- [ ] Ativar proteção de previews/logs e revisar consumo/firewall no painel.
- [ ] Confirmar cabeçalhos/404/HTTPS no domínio publicado.
- [ ] Validar botão WhatsApp no telefone, sem enviar dados desnecessários.
- [ ] Reauditar antes de instalar tags de publicidade, formulários ou backend.

## Fontes oficiais consultadas

- https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- https://vercel.com/docs/project-configuration/vercel-json
- https://vercel.com/docs/deployment-protection
- https://vercel.com/docs/project-configuration/security-settings
- https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting
- https://vercel.com/docs/domains/working-with-ssl
- https://vercel.com/docs/vercel-firewall
- https://vercel.com/changelog/web-application-firewall-mitigated-traffic-is-free-on-vercel
- https://vercel.com/docs/plans/hobby
- https://vercel.com/legal/terms
- https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf
