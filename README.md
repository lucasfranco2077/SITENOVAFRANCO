# NOVA FRANCO — site institucional

HTML, CSS e JavaScript sem framework, dependências npm, backend, banco de dados, autenticação ou formulários de envio. Contato via telefone e WhatsApp. Fontes do sistema e imagens locais.

## Publicação na Vercel

- Importar este repositório. Root Directory: raiz do repositório.
- Framework Preset: Other. Build: `node scripts/build-vercel.mjs`.
- Output Directory: `public-vercel`. Sem comando de instalação e sem variáveis de ambiente necessárias.
- A configuração está em `vercel.json`. A saída é gerada por uma lista de páginas e pelo fechamento dos recursos utilizados; arquivos antigos não são copiados.
- `public-vercel` é gerado e ignorado pelo Git. Não selecionar a raiz como pasta pública.
- A Vercel limita Hobby a uso pessoal/não comercial. Verificar plano elegível antes de publicar este site comercial; nenhum serviço pago foi ativado.

## Verificação local

Com Node.js disponível:

```
node scripts/build-vercel.mjs
node scripts/preview-security.mjs
```

Abrir `http://127.0.0.1:4173`. O servidor é apenas um simulador local dos cabeçalhos/rotas; não substitui validação na Vercel.

Após o deploy:

```
node scripts/check-live.mjs https://www.novafranco.com.br
```

Esse teste não foi executado em produção: ainda não existe projeto na Vercel. Verificar também DNS, certificado, redirects e controles do painel.

## Segurança e privacidade

- CSP restrita a recursos locais, sem scripts inline ou origens genéricas. Iframe apenas de mesma origem para preservar a prévia móvel.
- Nenhuma integração de Google Analytics, Google Ads, Tag Manager ou publicidade foi adicionada. Campanhas podem direcionar visitas ao site sem que haja uma tag instalada.
- Antes de adicionar medição/publicidade, revisar CSP, finalidade, bases legais, consentimento quando aplicável e aviso de privacidade.
- A página de privacidade deve ser validada pela empresa quanto à identificação do controlador e práticas reais de retenção/atendimento.
- Não colocar credenciais em HTML, JS, assets ou variáveis públicas. Caso haja formulário/backend no futuro, reauditar validação, spam, autorização e limites.
- `vercel.json` só controla cabeçalhos no deploy Vercel; GitHub Pages não aplica essa configuração.

Consulte `AUDITORIA-SEGURANCA.md` para achados, evidências, limites e checklist.
