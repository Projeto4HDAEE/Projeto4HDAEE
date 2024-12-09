function navigateTo(url, background) {
    // Altera o fundo da página
    document.body.style.background = background;

    // Armazena o gradiente no Local Storage
    localStorage.setItem("background", background);
    const containers = document.querySelectorAll(".container, .container1, .container2");
    containers.forEach(container => {
        container.classList.add("animate");
    });

    setTimeout(() => {
        window.location.href = url;
    },1000); // Atraso de 1 segundo
}


function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

document.addEventListener("DOMContentLoaded", function () {document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-btn');

    if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});
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
    const firestore = firebase.firestore();
    let amostrasA = [];
let amostrasB = [];
let amostrasC = [];


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
            const data = (snapshot.val() * 127)/3.78;
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
            processarDados(fase, data);
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
    function salvarMediaNoFirestore(amostras, fase, usuario) {
        if (amostras.length >= 50) {
            const soma = amostras.reduce((acc, val) => acc + val, 0);
            const media = soma / amostras.length;
    
            const agora = new Date();
            const timestamp = agora.toISOString();
            const data = agora.toLocaleDateString();
            const hora = agora.toLocaleTimeString();
            console.log("chamou salvarmedia:", usuario,fase,amostras);
            firestore
                .collection("4h")
                .doc(usuario)
                .collection(fase)
                .add({
                    media: parseFloat(media.toFixed(2)),
                    data: data,
                    hora: hora,
                    timestamp: timestamp
                })
                .then(() => console.log(`Média da fase ${fase} para ${usuario} salva com sucesso!`))
                .catch((err) => console.error(`Erro ao salvar a média da fase ${fase} para ${usuario}:`, err));
    
            // Limpa as amostras após salvar
            amostras.length = 0;
        }
    }
   

    // Função genérica para processar dados recebidos e acumular amostras
    function processarDados(fase, valor) {
        // Obtém o usuário dinamicamente a partir da URL
        const urlParams = new URLSearchParams(window.location.search);
        const usuario = urlParams.get("usuario") || "default_user"; // Define um usuário padrão se não estiver na URL
        console.log("chamou processardados:", usuario);
        if (fase === "A") {
            amostrasA.push(valor);
            salvarMediaNoFirestore(amostrasA, "Fase A", usuario);
        } else if (fase === "B") {
            amostrasB.push(valor);
            salvarMediaNoFirestore(amostrasB, "Fase B", usuario);
        } else if (fase === "C") {
            amostrasC.push(valor);
            salvarMediaNoFirestore(amostrasC, "Fase C", usuario);
        }
    }
    
    
});
