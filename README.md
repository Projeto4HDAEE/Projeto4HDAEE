
# Projeto de Medição de Consumo de Energia - Segundo Andar, Prédio 4H DAEE

Este repositório contém o projeto de medição de consumo de energia do segundo andar do prédio 4H do DAEE. O projeto é uma ferramenta de monitoramento que apresenta dados de consumo de energia em uma interface web e um aplicativo Android. 
Ele foi desenvolvido como método avaliativo para a disciplina de Microprocessados.
## Sobre o Projeto

- **Alunos**: Guilherme Roque Almeida de Sousa; João Vitor dos Santos Padilha.
- **Curso**: Engenharia Elétrica
- **Disciplina**: Microprocessados
- **Professor**: Dr. Prof. Ciro José Egoavil Montero

### Objetivo

O objetivo deste projeto é desenvolver uma solução que permita monitorar e analisar o consumo de energia elétrica em tempo real no segundo andar do prédio 4H do DAEE. 
A aplicação é composta por uma interface web e um aplicativo Android, permitindo o acesso remoto aos dados.

### Tecnologias Utilizadas

- **Frontend Web**: HTML, CSS e JavaScript
- **Firebase**: Base de dados em tempo real para armazenamento e sincronização dos dados de consumo
- **Android**: Aplicativo desenvolvido em Java (Android Studio) para monitoramento móvel
- **PIC16F877A**: Microcontrolador utilizado para a captação de dados de consumo de energia
- **ESP32**: Interface de comunicação utilizada para coletar os dados do pic e enviar para o Firebase 

### Funcionalidades

1. **Monitoramento em Tempo Real**: Visualização dos dados de consumo de energia em tempo real.
2. **Aplicação Web**: Interface para acesso via navegador.
3. **Aplicativo Android**: Acesso aos dados via dispositivo móvel.
4. **Armazenamento em Firebase**: Dados sincronizados e armazenados em banco de dados em tempo real.

### Estrutura do Repositório

- `/`: Código da interface web
- `/android-app`: Código do aplicativo Android
- `/pic-code`: Código para configuração do PIC16F877A e captura dos dados
- `/esp32-code`: Código para configuração do ESP32 e envio de dados
- `/assets`: Imagens e outros arquivos de suporte
- `README.md`: Documentação do projeto

### Como Executar

#### Interface Web

1. Clone o repositório.
2. Abra o arquivo `index.html` no navegador para visualizar a interface de monitoramento.

#### Aplicativo Android

1. Abra o projeto `/android-app` no Android Studio.
2. Compile e execute o aplicativo em um dispositivo ou emulador Android.

#### ESP32

1. Carregue o código do ESP32 usando o Arduino IDE.
2. Grave o codigo do PIC16F877A.
3. Configure o ESP32 para enviar os dados para o Firebase.

### Contribuições

Para contribuições, abra uma issue ou envie um pull request com sugestões e melhorias.
by Guilherme Roque
