# 🎨 Sistema de Formulários - Estúdio de Tatuagem & Body Piercing

Sistema web completo e moderno de formulários digitais para estúdios de tatuagem e body piercing, desenvolvido com foco em segurança, conformidade legal e experiência do usuário.

## ✨ Características

### 📋 Formulários Incluídos

1. **Agendamento & Briefing**
   - Dados pessoais do cliente
   - Detalhes do projeto (tamanho, estilo, localização)
   - Preferências de agendamento
   - Orçamento estimado
   - Referências e inspirações

2. **Anamnese (Histórico de Saúde)**
   - Condições médicas pré-existentes
   - Medicamentos em uso
   - Alergias (látex, metais, anestésicos)
   - Questões específicas (gravidez, álcool, cirurgias)
   - Validações de segurança automáticas

3. **Termo de Consentimento Informado**
   - Documento legal completo
   - Esclarecimento sobre riscos e cuidados
   - Assinatura digital
   - Suporte para menores de idade (com responsável)
   - Conformidade com ANVISA

4. **Autorização de Uso de Imagem**
   - Controle granular de permissões
   - Escolha de plataformas de divulgação
   - Preferências de privacidade (rosto, identificação)
   - Opções de marcação em redes sociais
   - Conformidade com LGPD

### 🎯 Recursos Modernos

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Validações Inteligentes**: CPF, e-mail, idade, campos obrigatórios
- **Assinatura Digital**: Canvas interativo com suporte a mouse e touch
- **Armazenamento Local**: Dados salvos no navegador (localStorage)
- **Formatação Automática**: CPF, telefone, datas
- **Geração de Protocolo**: ID único para cada formulário
- **Impressão/PDF**: Formulários prontos para impressão
- **Alertas e Feedback**: Mensagens claras de sucesso/erro
- **Interface Intuitiva**: Gradientes modernos e animações suaves

### 🔒 Segurança & Conformidade

- ✅ Conformidade com LGPD (Lei Geral de Proteção de Dados)
- ✅ Conformidade com normas da ANVISA
- ✅ Validações de segurança (álcool, gravidez, menoridade)
- ✅ Criptografia em trânsito (HTTPS)
- ✅ Termos legais completos
- ✅ Proteção de privacidade do cliente

## 🚀 Como Usar

### Instalação

1. **Clone ou baixe os arquivos**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   ```

2. **Abra o arquivo index.html**
   - Basta abrir o arquivo `index.html` em um navegador moderno
   - Não requer servidor ou instalação adicional
   - Funciona offline após o primeiro carregamento

### Estrutura de Arquivos

```
📁 ESTUDIO-TATOO/
├── 📄 index.html              # Página inicial
├── 📄 agendamento.html        # Formulário de agendamento
├── 📄 anamnese.html           # Formulário de saúde
├── 📄 consentimento.html      # Termo de consentimento
├── 📄 uso-imagem.html         # Autorização de imagem
├── 📄 visualizar.html         # Visualização de formulários
├── 🎨 styles.css              # Estilos globais
├── ⚙️ script.js               # Funções JavaScript
└── 📖 README.md               # Documentação
```

### Personalização

#### 1. Informações do Estúdio

Edite os seguintes arquivos para adicionar suas informações:

**consentimento.html** (linha ~60):
```html
[NOME DO ESTÚDIO]
[CNPJ]
[ENDEREÇO]
```

**uso-imagem.html** (linha ~45):
```html
[NOME DO ESTÚDIO]
```

#### 2. Redes Sociais

**index.html** (rodapé):
```html
<a href="SEU_INSTAGRAM"><i class="fab fa-instagram"></i></a>
<a href="SEU_FACEBOOK"><i class="fab fa-facebook"></i></a>
<a href="SEU_WHATSAPP"><i class="fab fa-whatsapp"></i></a>
```

#### 3. Artistas do Estúdio

**agendamento.html** (linha ~180):
```html
<option value="artista1">Artista 1 - Especialidade</option>
<option value="artista2">Artista 2 - Especialidade</option>
```

#### 4. Cores e Estilo

**styles.css** (variáveis CSS no início do arquivo):
```css
:root {
    --primary-color: #1a1a2e;
    --accent-color: #e94560;
    /* Personalize as cores aqui */
}
```

## 💾 Gerenciamento de Dados

### Armazenamento

Os dados podem ser salvos no Firebase Firestore (quando configurado) e mantidos
como backup local no navegador usando `localStorage`:

```javascript
localStorage.getItem('studioForms') // Recuperar todos os formulários
```

### Visualizar Dados Salvos

Abra `visualizar.html` para ver todos os formulários submetidos (Firebase ou backup local):
- Filtrar por tipo de formulário
- Buscar por nome ou CPF
- Exportar para PDF/impressão
- Limpar dados antigos

### Backup e Exportação

**Navegador: Console (F12)**
```javascript
// Exportar todos os dados
const dados = localStorage.getItem('studioForms');
console.log(dados);

// Copiar para clipboard
copy(dados);
```

### Integração com Backend (Opcional)

Para salvar em servidor, modifique a função `saveFormData` em `script.js`:

```javascript
function saveFormData(formName, data) {
    // Enviar para servidor
    fetch('/api/formularios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => console.log('Salvo:', result));
}
```

## 📱 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Flexbox, Grid, Gradientes, Animações
- **JavaScript (Vanilla)**: Sem dependências externas
- **Font Awesome**: Ícones modernos
- **Canvas API**: Assinatura digital

## 🎨 Benefícios para o Estúdio

### Profissionalismo
- Primeira impressão moderna e organizada
- Processo digital elimina papelada
- Imagem de estúdio atualizado e tecnológico

### Segurança Jurídica
- Termos legais completos e conformes
- Registro digital com timestamp
- Protocolo único de identificação
- Assinaturas digitais válidas

### Eficiência Operacional
- Menos tempo preenchendo papéis
- Dados organizados e acessíveis
- Histórico completo do cliente
- Redução de erros de preenchimento

### Marketing
- Autorização de uso de imagem profissional
- Controle das preferências do cliente
- Facilita divulgação em redes sociais
- Construção de portfólio consistente

### Experiência do Cliente
- Interface amigável e intuitiva
- Preenchimento rápido (5-10 minutos)
- Validações em tempo real
- Feedback imediato

## 📋 Checklist de Implementação

- [ ] Personalizar informações do estúdio
- [ ] Adicionar logo/marca no header
- [ ] Configurar links de redes sociais
- [ ] Adicionar nomes dos artistas
- [ ] Ajustar cores da marca
- [ ] Testar em diferentes dispositivos
- [ ] Fazer backup dos dados iniciais
- [ ] Treinar equipe no uso do sistema
- [ ] Imprimir alguns formulários de exemplo
- [ ] Configurar integração com backend (opcional)

## 🔧 Requisitos Técnicos

### Mínimos
- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript habilitado
- Cookies e localStorage ativos
- Tela mínima: 320px (mobile small)

### Recomendados
- Conexão com internet (para carregar ícones)
- Impressora ou gerador de PDF
- Tablet ou computador (para melhor experiência)

## 📞 Suporte

### Problemas Comuns

**Assinatura não funciona no celular:**
- Verifique se o JavaScript está ativado
- Teste em modo retrato/paisagem
- Limpe o cache do navegador

**Dados não estão salvando:**
- Verifique se o localStorage está ativado
- Limpe cookies e tente novamente
- Não use modo anônimo/privado

**Formulário não imprime corretamente:**
- Use "Salvar como PDF" em vez de imprimir
- Ajuste as margens para mínimas
- Verifique orientação retrato/paisagem

## 🚀 Melhorias Futuras (Roadmap)

- [ ] Integração com API de WhatsApp
- [ ] Notificações por e-mail
- [ ] Dashboard administrativo
- [ ] Agendamento com calendário interativo
- [ ] Upload de referências de imagens
- [ ] Integração com sistemas de pagamento
- [ ] App mobile nativo (React Native/Flutter)
- [ ] Backup automático em nuvem
- [ ] Módulo de CRM
- [ ] Relatórios e estatísticas

## 📄 Licença

Livre para uso comercial em estúdios de tatuagem e body piercing.

## 👨‍💻 Créditos

Desenvolvido com ❤️ para a comunidade de tatuadores e body piercers.

---

**Versão:** 1.0.0  
**Data:** Fevereiro 2026  
**Última Atualização:** 20/02/2026

---

## 💡 Dicas de Uso

### Para Donos de Estúdio

1. **Primeira Sessão**: Use tablet para o cliente preencher na recepção
2. **Agendamento Online**: Compartilhe o link via WhatsApp
3. **Backup Semanal**: Exporte os dados salvos regularmente
4. **Treinamento**: Ensine a equipe a usar o sistema
5. **Impressão**: Mantenha cópias impressas dos termos importantes

### Para Clientes

1. **Prepare-se**: Tenha documentos (CPF, RG) em mãos
2. **Leia com Atenção**: Especialmente o termo de consentimento
3. **Seja Honesto**: Na anamnese, informações corretas salvam vidas
4. **Pergunte**: Tire dúvidas antes de assinar
5. **Guarde o Protocolo**: Anote o ID do formulário para referência

---

**🎨 Bom trabalho e sucesso no seu estúdio! 🎨**
