function navigateTo(url, background) {
    // Altera o fundo da página
    document.body.style.background = background;

    // Armazena o gradiente no Local Storage
    localStorage.setItem("background", background);
 

    setTimeout(() => {
        window.location.href = url;
    }, 300); // Atraso de 1 segundo
}
document.addEventListener("DOMContentLoaded", function () {
    // Configurações do Firebase
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
    const background = localStorage.getItem("background");
    // Inicializa o Firebase
   

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // Obtém o caminho base do Firebase a partir dos parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const basePath = urlParams.get("path");

    // Se o parâmetro existir, aplique o gradiente
    if (background) {
        document.body.style.background = decodeURIComponent(background);
    }
    if (basePath) {
        // Execute ações com base no 'basePath'
        console.log("Usando o caminho base:", basePath);
    } else {
        console.warn("basePath não está definido!");
    }

    // Variáveis para armazenar os valores das fases
    let faseA = 0;
    let faseB = 0;
    let faseC = 0;

    // Configurações do gráfico
    const ctx = document.getElementById("historicoConsumo").getContext("2d");
    const historicoChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                { label: "Fase A", data: [], borderColor: "rgba(255, 99, 132, 1)", backgroundColor: "rgba(255, 99, 132, 0.2)", borderWidth: 1 },
                { label: "Fase B", data: [], borderColor: "rgba(54, 162, 235, 1)", backgroundColor: "rgba(54, 162, 235, 0.2)", borderWidth: 1 },
                { label: "Fase C", data: [], borderColor: "rgba(75, 192, 192, 1)", backgroundColor: "rgba(75, 192, 192, 0.2)", borderWidth: 1 }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Tempo" } },
                y: { title: { display: true, text: "Consumo (VA)" } }
            }
        }
    });

    // Função para atualizar o consumo total
    function atualizarConsumoTotal() {
        const total = faseA + faseB + faseC;
        const valorFormatado = typeof total === "number" ? total.toFixed(2) : total;

        document.getElementById("consumoTotal").innerText = valorFormatado
            ? `${valorFormatado} VA`
            : "Sem dados disponíveis";
    }

    // Função genérica para buscar dados
    function buscarDados(fase, elementoId, datasetIndex) {
        const ref = database.ref(`${basePath}Corrente${fase}`);
        ref.on("value", (snapshot) => {
            const data = snapshot.val() * 127;
            console.log(`Dados Fase ${fase}:`, data);

            if (fase === "A") faseA = data;
            if (fase === "B") faseB = data;
            if (fase === "C") faseC = data;

            atualizarConsumoTotal();

            const valorFormatado = typeof data === "number" ? data.toFixed(2) : data;
            const tempoAtual = new Date().toLocaleTimeString();

            // Atualiza o gráfico
            historicoChart.data.labels.push(tempoAtual);
            historicoChart.data.datasets[datasetIndex].data.push(data);
            historicoChart.update();

            // Atualiza o elemento HTML
            document.getElementById(elementoId).innerText = valorFormatado
                ? valorFormatado + " VA"
                : "Sem dados disponíveis";
        });
    }

    // Força a limpeza do gráfico e dos elementos antes de carregar os dados
    historicoChart.data.labels = [];
    historicoChart.data.datasets.forEach(dataset => {
        dataset.data = [];
    });
    historicoChart.update();

    document.getElementById("mensagemA").innerText = "Carregando dados...";
    document.getElementById("mensagemB").innerText = "Carregando dados...";
    document.getElementById("mensagemC").innerText = "Carregando dados...";

    // Recarrega os dados
    buscarDados("A", "mensagemA", 0);
    buscarDados("B", "mensagemB", 1);
    buscarDados("C", "mensagemC", 2);
});
