# Formulário de orçamento — entrega

## O que mudou

- `index.html`: formulário na seção `#contato`, com contato direto preservado.
- `assets/js/orcamento.js`: validação, mensagem WhatsApp e eventos locais sem dados pessoais.
- `assets/css/nova-franco.css`: estilos responsivos do formulário; versão de cache atualizada nas páginas.
- `galeria.html`: registro de eventos locais para contatos diretos, sem alterar os links.
- `privacidade.html`: informação sobre o formulário e processamento no navegador; links do menu corrigidos.
- `scripts/test-orcamento.mjs`: 26 testes sem serviços externos.
- `FORMULARIO-ORCAMENTO.md`: estas instruções.

Nome e sobrenome, telefone com DDD e região são obrigatórios. Limites: nome 100, telefone 20, região 100 e descrição 1.000 caracteres. As opções dos selects são validadas por lista permitida. Telefones brasileiros com DDD, com ou sem +55, são aceitos conforme a validação do código; a validade/posse da linha não é verificada.

Não há backend, banco, instalação de pacotes, persistência local ou rastreador novo. A mensagem é codificada com encodeURIComponent e enviada ao endereço fixo do WhatsApp após clique. O cliente ainda precisa confirmar o envio no aplicativo. O texto passa ao WhatsApp e pode ficar no histórico do navegador; não incluir dados sensíveis. Os recursos de preenchimento automático do navegador são independentes do armazenamento pelo site.

A CSP permanece inalterada. `form-action 'none'` é compatível com o processamento em JavaScript que impede o submit HTTP e navega para o WhatsApp. Sem JavaScript, o botão de formulário fica desabilitado e há contato direto alternativo; nenhum campo é enviado em GET por fallback.

## Eventos preparados, sem rastreamento ativo

O código dispara eventos DOM `nf:quote-event`. Nenhum evento é enviado pela rede ou salvo no site. Não foi instalado Google Analytics, Ads, GTM ou SDK.

Detalhes permitidos, e somente eles:

- `event`: `quote_cta_click` ou `whatsapp_open_requested`.
- `source`: `quote_form` ou `direct_link`.
- `channel`: `whatsapp`.
- `version`: `1`.

`whatsapp_open_requested` significa solicitação de navegação; NÃO confirma aplicativo aberto, mensagem enviada ou lead recebido. Não criar evento de envio confirmado sem evidência real. Um futuro listener pode usar esse hook após autorização e revisão de privacidade/CSP; não capturar FormData, valores dos campos, href completo, URL de destino ou texto da mensagem em analytics.

## Testes executados

- `node scripts/test-orcamento.mjs`: 26 verificações passaram, incluindo obrigatórios, limites, HTML/controles, telefone, opções adulteradas, codificação, destino fixo, foco no erro, navegação simulada e ausência de dados pessoais nos eventos.
- `node scripts/build-vercel.mjs`: passou, 38 arquivos (~2,35 MB), sem dependências.
- Verificação no navegador integrado com a CSP local: erros acessíveis, foco no primeiro campo inválido, formulário preenchido, selects, telefone inválido e correção dos erros.
- Desktop e viewports 320/390 pixels: sem overflow horizontal. Não foi realizado teste em telefones físicos.
- Console: nenhum erro capturado durante esta sessão de teste do formulário.
- O fluxo válido foi testado em harness isolado, verificando a navegação/URL sem abrir conversa nem enviar mensagem real. Não se afirma mensagem entregue ao WhatsApp.
- Cabeçalhos e recursos da saída local verificados. Cabeçalhos da produção haviam sido conferidos na auditoria anterior; o formulário novo só poderá ser testado em produção após deploy.

## Publicar pelo GitHub Desktop

As alterações já foram salvas na pasta `C:/Users/lucas/Documents/GitHub/SITENOVAFRANCO`. Não precisa substituir arquivos se utilizar essa mesma pasta. Nesta entrega não foi feito commit ou push.

Para usar o ZIP em outra cópia: faça um backup da pasta do repositório, extraia o conteúdo do ZIP e copie os arquivos para a raiz mantendo as subpastas. Preserve a pasta `.git` existente. Não copie a pasta gerada `public-vercel` sobre a fonte: ela será recriada pelo build.

No GitHub Desktop, selecione SITENOVAFRANCO, confira Changes, faça commit com `Adiciona formulário seguro de orçamento pelo WhatsApp` e clique em Push origin. A Vercel deverá executar o build configurado e publicar após sucesso. Confirme a implantação e teste a página `/` até `#contato` no domínio oficial.

Framework Other, build `node scripts/build-vercel.mjs`, saída `public-vercel`; nenhuma variável de ambiente nova necessária.
