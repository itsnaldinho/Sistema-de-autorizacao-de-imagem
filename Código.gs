function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Gerador de Autorização de Imagem')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Dados fixos de cada Grupo Escoteiro (endereço, CNPJ e cidade)
// Preencha os campos "______" quando tiver a informação dos grupos que faltam.
const GRUPOS_INFO = {
  "19° Grupo Escoteiro São José": {
    numero: "19º",
    rua: "Rua Padre Champagnat, nº 81",
    bairro: "Roxo Verde",
    cnpj: "07.721.751/0001-46",
    local: "Montes Claros - MG"
  },
  "92° Grupo Escoteiro Guimarães Rosa": {
    numero: "92º",
    rua: "AV Tito Versiane dos Anjos, 890",
    bairro: "Augusta Mota",
    cnpj: "11.733.209/0001-80",
    local: "Montes Claros - MG"
  },
  "99° Grupo Escoteiro Nova Geração": {
    numero: "99º",
    rua: "Av. Cel. Luiz Maia, nº 1355",
    bairro: "Santa Lúcia",
    cnpj: "N/A",
    local: "Montes Claros - MG"
  },
  "115° Grupo Escoteiro Tiradentes": {
    numero: "115º",
    rua: "Rua Geraldinho Machado, nº 1245",
    bairro: "Vila Áurea",
    cnpj: "N/A",
    local: "Montes Claros - MG"
  },
  "140° Grupo Escoteiro Imaculada": {
    numero: "140º",
    rua: "Av. Juarez Nunes, s/n",
    bairro: "Jardim Sao Luiz",
    cnpj: "09.395.398/0001-87",
    local: "Montes Claros - MG"
  },
  "146° Grupo Escoteiro Major Anatólio A. de Assis": {
    numero: "146º",
    rua: "Rua Herculano Pena, 344",
    bairro: "Centro",
    cnpj: "06.889.996/0001-14",
    local: "Diamantina - MG"
  },
  "170° Grupo Escoteiro Darcy Ribeiro": {
    numero: "170º",
    rua: "Avenida Mestra Fininha, nº 1225",
    bairro: "São Luiz",
    cnpj: "23.713.002/0001-23",
    local: "Montes Claros - MG"
  },
  "179° Grupo Escoteiro Taiobeiras": {
    numero: "179º",
    rua: "Rua Turmalina, nº 635",
    bairro: "Planalto",
    cnpj: "46.458.958/0001-21",
    local: "Taiobeiras - MG"
  },
  "223° Grupo Escoteiro do Mar Piraporé": {
    numero: "223º",
    rua: "AV São Francisco, 758",
    bairro: "Centro",
    cnpj: "58.387.262/0001-30",
    local: "Pirapora - MG"
  }
};

// Retorna a data atual formatada por extenso em português (ex: 02 de Setembro de 2026)
function getDataAtualPorExtenso() {
  const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
                 "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = meses[hoje.getMonth()];
  const ano = hoje.getFullYear();
  return `${dia} de ${mes} de ${ano}`;
}

function gerarPDF(dadosFormulario) {
  // O ID exato do seu documento (template no novo padrão UEB)
  const ID_DO_TEMPLATE = '1kZzEQo4WmtZuY3JI2-QrgX0QYB8PkhEVKPvCKIGP6BI';

  const grupoNome = dadosFormulario.grupo;
  const infoGrupo = GRUPOS_INFO[grupoNome];

  if (!infoGrupo) {
    throw new Error('Grupo Escoteiro não encontrado na base de dados.');
  }

  // Dados do menor (opcionais -> linha para preencher à mão se vazio)
  const nomeJovem = dadosFormulario.nomeJovem || "________________________________________________";
  const dataNascimento = dadosFormulario.dataNascimento
    ? formatarData(dadosFormulario.dataNascimento)
    : "________________________________________________";
  const cpfMenor = dadosFormulario.cpfMenor || "______________________";
  const rgMenor = dadosFormulario.rgMenor || "______________________";

  // Dados do responsável (opcionais)
  const nomeResponsavel = dadosFormulario.nomeResponsavel || "________________________________________________";
  const cpfResponsavel = dadosFormulario.cpfResponsavel || "______________________";
  const rgResponsavel = dadosFormulario.rgResponsavel || "______________________";

  const dataAtual = getDataAtualPorExtenso();

  // Faz a cópia do template
  const arquivoTemplate = DriveApp.getFileById(ID_DO_TEMPLATE);
  const arquivoTemp = arquivoTemplate.makeCopy(`Temp_Autorizacao_${infoGrupo.numero}`);
  const doc = DocumentApp.openById(arquivoTemp.getId());
  const body = doc.getBody();

  // Substitui as tags no documento
  body.replaceText('\\[NOME_GRUPO\\]', grupoNome);
  body.replaceText('\\[NOME_MENOR\\]', nomeJovem);
  body.replaceText('\\[DATA_NASCIMENTO\\]', dataNascimento);
  body.replaceText('\\[CPF_MENOR\\]', cpfMenor);
  body.replaceText('\\[RG_MENOR\\]', rgMenor);
  body.replaceText('\\[NOME_RESPONSAVEL\\]', nomeResponsavel);
  body.replaceText('\\[CPF_RESPONSAVEL\\]', cpfResponsavel);
  body.replaceText('\\[RG_RESPONSAVEL\\]', rgResponsavel);
  body.replaceText('\\[CNPJ\\]', infoGrupo.cnpj);
  body.replaceText('\\[RUA\\]', infoGrupo.rua);
  body.replaceText('\\[BAIRRO\\]', infoGrupo.bairro);
  body.replaceText('\\[CIDADE_SEDE\\]', infoGrupo.local);
  body.replaceText('\\[LOCAL\\]', infoGrupo.local);
  body.replaceText('\\[DATA_ATUAL\\]', dataAtual);

  // Salva e gera o PDF
  doc.saveAndClose();
  const pdfBlob = arquivoTemp.getAs('application/pdf');

  // Exclui o arquivo temporário
  arquivoTemp.setTrashed(true);

  // Nome do arquivo: Termo_(nº grupo)_(nome do jovem)
  const nomeArquivoJovem = dadosFormulario.nomeJovem ? dadosFormulario.nomeJovem : "SemNome";
  const nomeArquivo = `Termo_${infoGrupo.numero}_${nomeArquivoJovem}.pdf`;

  const base64 = Utilities.base64Encode(pdfBlob.getBytes());
  return {
    nomeArquivo: nomeArquivo,
    tipoMime: 'application/pdf',
    dadosBase64: base64
  };
}

// Converte AAAA-MM-DD para DD/MM/AAAA
function formatarData(data) {
  const partes = data.split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return data;
}
