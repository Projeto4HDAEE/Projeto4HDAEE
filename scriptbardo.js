document.addEventListener("DOMContentLoaded", function () {
      // Configurações do Firebase (substitua com suas próprias configurações)
      const firebaseConfig = {
        apiKey: "AIzaSyDRh_q0hG7U6xwpHcfX7BR8h3Y5KwYUT_g",
        authDomain: "consumo4hdaee.firebaseapp.com",
        databaseURL: "https://consumo4hdaee-default-rtdb.firebaseio.com",
        projectId: "consumo4hdaee",
        storageBucket: "consumo4hdaee.firebasestorage.app",
        messagingSenderId: "109357079256",
        appId: "1:109357079256:web:66ec2323ccc23a536695ad",
        measurementId: "G-Y5J0M7VY51"
      };

      // Inicializa o Firebase
      firebase.initializeApp(firebaseConfig);
      const database = firebase.database();

      function buscarDadosFaseA() {
  const ref = database.ref("/BARDO/Medidas/CorrenteA");
  ref.on("value", (snapshot) => {
    const data = (snapshot.val()*127);
    console.log("Dados Fase W:", data); // Log para verificar os dados
    const valorFormatado = typeof data === "number" ? data.toFixed(2) : data;

       const tempoAtual = new Date().toLocaleTimeString(); // Rótulo de tempo
        historicoChart.data.labels.push(tempoAtual); // Adiciona o tempo no eixo X
        historicoChart.data.datasets[0].data.push(data); // Adiciona o dado à Fase A
        historicoChart.update();

    document.getElementById("mensagemA").innerText = valorFormatado
      ? valorFormatado + "VA"
      : "Sem dados disponíveis";
  });
}

function buscarDadosFaseB() {
  const ref = database.ref("/BARDO/Medidas/CorrenteB");
  ref.on("value", (snapshot) => {
    const data = snapshot.val()*127;
    console.log("Dados Fase B:", data); // Log para verificar os dados
    const valorFormatado = typeof data === "number" ? data.toFixed(2) : data;

    const tempoAtual = new Date().toLocaleTimeString(); // Rótulo de tempo
        historicoChart.data.labels.push(tempoAtual); // Adiciona o tempo no eixo X
        historicoChart.data.datasets[1].data.push(data); // Adiciona o dado à Fase A
        historicoChart.update();

    document.getElementById("mensagemB").innerText = valorFormatado
      ? valorFormatado + "VA"
      : "Sem dados disponíveis";
  });
}

function buscarDadosFaseC() {
  const ref = database.ref("/BARDO/Medidas/CorrenteC");
  ref.on("value", (snapshot) => {
    const data = snapshot.val()*127;
    console.log("Dados Fase C:", data); // Log para verificar os dados
    const valorFormatado = typeof data === "number" ? data.toFixed(2) : data;

    const tempoAtual = new Date().toLocaleTimeString(); // Rótulo de tempo
        historicoChart.data.labels.push(tempoAtual); // Adiciona o tempo no eixo X
        historicoChart.data.datasets[2].data.push(data); // Adiciona o dado à Fase A
        historicoChart.update();

    document.getElementById("mensagemC").innerText = valorFormatado
      ? valorFormatado + "VA"
      : "Sem dados disponíveis";
      
  });
}

      function abrirMenu() {
        document.getElementById("sidebar").style.left = "0";
      }

      // Função para fechar a barra lateral
      function fecharMenu() {
        document.getElementById("sidebar").style.left = "-250px";
      }
      // Chama a função buscarDados
      buscarDadosFaseA();
 
      buscarDadosFaseB();

      buscarDadosFaseC();
      const ctx = document.getElementById('historicoConsumo').getContext('2d');
const historicoChart = new Chart(ctx, {
    type: 'line', // Tipo de gráfico
    data: {
        labels: [], // Adicione os rótulos (tempo, por exemplo)
        datasets: [
            {
                label: 'Fase A',
                data: [], // Dados para a Fase A
                borderColor: 'rgba(255, 99, 132, 1)', // Cor da linha
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Cor de fundo
                borderWidth: 1,
            },
            {
                label: 'Fase B',
                data: [], // Dados para a Fase B
                borderColor: 'rgba(54, 162, 235, 1)', // Cor da linha
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Cor de fundo
                borderWidth: 1,
            },
            {
                label: 'Fase C',
                data: [], // Dados para a Fase C
                borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de fundo
                borderWidth: 1,
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: { display: true, text: 'Tempo' },
            },
            y: {
                title: { display: true, text: 'Consumo (VA)' },
            },
        },
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true, // Permite zoom com o scroll do mouse
                    },
                    pinch: {
                        enabled: true, // Permite zoom com gestos de pinça (touch)
                    },
                    mode: 'xy', // Permite zoom nos eixos X e Y
                },
                pan: {
                    enabled: true, // Permite deslocar o gráfico
                    mode: 'xy', // Permite pan nos eixos X e Y
                },
            },
        },
    },
});
const canvas = document.getElementById('historicoConsumo');


// Ajusta os atributos internos do canvas
canvas.width = canvas.offsetWidth; // Tamanho interno igual ao tamanho CSS
canvas.height = 300; // Altura definida em p
});