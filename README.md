# Gerador de Autorização de Imagem Escoteira

Um sistema web prático, desenvolvido em Google Apps Script (HTML, CSS e JavaScript), criado para otimizar o trabalho das Unidades Escoteiras Locais (UELs) na emissão de autorizações de uso de imagem para os jovens. 

Em vez do preenchimento manual e repetitivo de cada item do formulário padrão da UEB, este sistema permite que a secretaria selecione o Grupo Escoteiro desejado e preencha os dados básicos. Com poucos cliques, o sistema gera e baixa automaticamente um PDF formatado e preenchido.

## 🌟 Benefícios e Funcionalidades

* **Agilidade para a UEL:** Reduz drasticamente o tempo de secretaria ao automatizar a criação dos termos de imagem.
* **Preenchimento Dinâmico:** O sistema possui um banco de dados interno com as informações de múltiplos grupos (CNPJ, Rua, Bairro e Cidade). Ao selecionar o grupo no formulário, estes dados são injetados automaticamente no documento.
* **Flexibilidade (Campos Opcionais):** Os dados do jovem e do responsável são opcionais no formulário web. Se deixados em branco, o sistema inteligentemente imprime linhas pontilhadas (ex: `___`) no PDF gerado para que possam ser preenchidos à mão posteriormente[cite: 2].
* **Geração Direta em PDF:** O sistema clona um documento template oculto, preenche as *tags* de substituição, converte para PDF, baixa no computador do usuário e exclui o arquivo temporário gerado para não lotar o Google Drive[cite: 2].
* **Interface Responsiva e Temática:** Possui um design moderno, responsivo (funciona bem em celulares) e com as cores padrão do escotismo[cite: 2].

---

## 🚀 Pré-work (Como colocar o código em funcionamento)

Para rodar este sistema do zero, você precisará configurar um "Template" no Google Docs e publicar o script. Siga os passos:

### 1. Criar o Documento Template (Google Docs)
1. Crie um novo arquivo no Google Docs contendo o texto padrão da Autorização de Imagem da UEB.
2. No local onde os dados devem entrar, digite exatamente as seguintes *tags* (com os colchetes):
   * `[NOME_GRUPO]`[cite: 2]
   * `[NOME_MENOR]`[cite: 2]
   * `[DATA_NASCIMENTO]`[cite: 2]
   * `[CPF_MENOR]`[cite: 2]
   * `[RG_MENOR]`[cite: 2]
   * `[NOME_RESPONSAVEL]`[cite: 2]
   * `[CPF_RESPONSAVEL]`[cite: 2]
   * `[RG_RESPONSAVEL]`[cite: 2]
   * `[CNPJ]`[cite: 2]
   * `[RUA]`, `[BAIRRO]`, `[CIDADE_SEDE]`, `[LOCAL]`[cite: 2]
   * `[DATA_ATUAL]`[cite: 2]
3. Copie o **ID deste documento** (a sequência de letras e números que fica na URL do Google Docs, entre `/d/` e `/edit`).

### 2. Configurar o Google Apps Script
1. Acesse o [Google Apps Script](https://script.google.com/) e crie um "Novo Projeto".
2. Crie dois arquivos no projeto:
   * **`code.gs`**: Cole o código de backend neste arquivo[cite: 2].
   * **`Index.html`**: Crie um arquivo HTML e cole o código de frontend[cite: 2].
3. No arquivo `code.gs`, localize a variável `ID_DO_TEMPLATE` e substitua o valor existente pelo ID do documento template que você copiou no passo anterior[cite: 2].

### 3. Deploy (Implantação)
1. Clique em **Implantar > Nova implantação**.
2. Selecione o tipo **App da Web** (ícone de engrenagem).
3. Configurações:
   * **Executar como:** *Eu (seu email)*
   * **Quem pode acessar:** *Qualquer pessoa* (ou restrinja conforme a necessidade da UEL).
4. Clique em **Implantar** e autorize as permissões de acesso ao seu Google Drive e Documentos (necessário para ler o template e gerar o PDF)[cite: 2].

---

## 🛠️ Customização: Implementando em um Novo Ambiente

Se você precisar usar este sistema para outro Distrito, Região ou replicar para grupos não listados originalmente, faça as seguintes alterações:

### 1. Atualizar o Banco de Dados de Grupos (`code.gs`)
Localize a constante `GRUPOS_INFO` no arquivo `code.gs`. Você deverá adicionar, remover ou editar os blocos de informação com os dados reais dos novos grupos[cite: 2]. Exemplo de estrutura:
```javascript
  "NOME DO NOVO GRUPO": {
    numero: "XXº",
    rua: "Nome da Rua, Número",
    bairro: "Nome do Bairro",
    cnpj: "00.000.000/0001-00",
    local: "Cidade - Estado"
  }
