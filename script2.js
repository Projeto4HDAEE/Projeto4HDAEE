// Função para buscar dados do Firestore e exibir em uma timeline ou calendário
document.addEventListener("DOMContentLoaded", function () {
    
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

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const firestore = firebase.firestore();
// Obtém o caminho base do Firebase a partir dos parâmetros da URL
const urlParams = new URLSearchParams(window.location.search);
const basePath = urlParams.get("path");
carregarCalendarioFirestore("Roque");

// Função para buscar dados do Firestore e exibir em um calendário com opção de clicar para visualizar dados do dia
function carregarCalendarioFirestore(usuario) {
    const container = document.getElementById("timelineContainer"); // Div para exibir os dados
    container.innerHTML = "<p>Carregando calendário...</p>";

    const fases = ["Fase A", "Fase B", "Fase C"];
    const promises = fases.map(fase =>
        firestore.collection("4h").doc(usuario).collection(fase).get()
    );

    Promise.all(promises)
        .then(results => {
            if (results.every(snapshot => snapshot.empty)) {
                container.innerHTML = `<p>Não há dados registrados para ${usuario}.</p>`;
                return;
            }

            let calendarioHtml = "<div class='calendario'>";

            // Objeto para agrupar dados por data
            const dadosPorData = {};

            results.forEach((snapshot, index) => {
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const dataKey = data.data; // Usa o campo "data" como chave

                    if (!dadosPorData[dataKey]) {
                        dadosPorData[dataKey] = [];
                    }

                    dadosPorData[dataKey].push({
                        fase: fases[index],
                        media: data.media,
                        hora: data.hora,
                        timestamp: data.timestamp
                    });
                });
            });

            // Cria o calendário
            Object.keys(dadosPorData).forEach(dataKey => {
                calendarioHtml += `
                    <div class='calendario-dia' onclick="exibirDadosDoDia('${dataKey}', ${JSON.stringify(dadosPorData[dataKey]).replace(/"/g, '&quot;')})">
                        <h4>${dataKey}</h4>
                        <p>${dadosPorData[dataKey].length} registros</p>
                    </div>`;
            });

            calendarioHtml += "</div>";
            container.innerHTML = calendarioHtml;
        })
        .catch(err => {
            console.error("Erro ao carregar o calendário do Firestore:", err);
            container.innerHTML = "<p>Erro ao carregar o calendário.</p>";
        });
}

// Função para exibir dados do dia selecionado e desenhar um gráfico
window.exibirDadosDoDia=function(data, registros) {
    const container = document.getElementById("timelineContainer");
    let dadosHtml = `<div class='timeline'><h2>Dados de ${data}</h2>`;

    registros.forEach(registro => {
        dadosHtml += `
            <div class='timeline-item'>
                <h3>${registro.fase}</h3>
                <p>Média: ${registro.media} VA</p>
                <p>Hora: ${registro.hora}</p>
                <small>Timestamp: ${registro.timestamp}</small>
            </div>`;
    });

    dadosHtml += `
        <div class='grafico-container'>
            <canvas id='graficoDadosDia' style='width: 100%; max-width: 600px;'></canvas>
        </div>
        <button onclick="voltarAoCalendario()" class='btn-voltar'>Voltar aos dias</button>
    </div>`;
    container.innerHTML = dadosHtml;

    // Preparar os dados para o gráfico
    const labels = registros.map(registro => registro.hora);
    const dataPorFase = {
        "Fase A": [],
        "Fase B": [],
        "Fase C": [],
    };

    registros.forEach(registro => {
        if (dataPorFase[registro.fase]) {
            dataPorFase[registro.fase].push(registro.media);
        }
    });

    // Desenhar o gráfico
    const ctx = document.getElementById("graficoDadosDia").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: Object.keys(dataPorFase).map(fase => ({
                label: fase,
                data: dataPorFase[fase],
                borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
                borderWidth: 1,
            })),
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Hora" } },
                y: { title: { display: true, text: "Média (VA)" } },
            },
        },
    });
}

// Função para voltar ao calendário
window.voltarAoCalendario= function() {
    const usuario = new URLSearchParams(window.location.search).get("usuario");
    if (usuario) {
        carregarCalendarioFirestore(usuario);
    } else {
        console.error("Usuário não especificado na URL.");
    }
}

// CSS para a exibição do calendário, timeline e botão de voltar
const style = document.createElement('style');
style.innerHTML = `
    .calendario {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        padding: 10px;
    }
    .calendario-dia {
        background: #f1f1f1;
        border: 2px solid #4e54c8;
        padding: 10px;
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        width: 120px;
    }
    .calendario-dia:hover {
        background: #e0e0e0;
    }
    .calendario-dia h4 {
        margin: 5px 0;
        font-size: 16px;
        color: #4e54c8;
    }
    .calendario-dia p {
        margin: 0;
        font-size: 14px;
        color: #666;
    }
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 10px;
    }
    .timeline-item {
        background: #f9f9f9;
        border-left: 5px solid #4e54c8;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .timeline-item h3 {
        margin: 0;
        font-size: 18px;
        color: #4e54c8;
    }
    .timeline-item p {
        margin: 5px 0;
        font-size: 14px;
        color: #333;
    }
    .timeline-item small {
        color: #666;
        font-size: 12px;
    }
    .btn-voltar {
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #4e54c8;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }
    .btn-voltar:hover {
        background-color: #3b439d;
    }
`;
document.head.appendChild(style);

// Exemplo de uso: carregar o calendário para o usuário "bardo"
// carregarCalendarioFirestore("bardo");
});