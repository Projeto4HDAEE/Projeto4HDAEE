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
  
    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
  
    // Variáveis para armazenar os valores das fases
    let faseA = 0;
    let faseB = 0;
    let faseC = 0;
  
    // Função para atualizar o consumo total
    function atualizarConsumo() {
      const total = faseA + faseB + faseC;
      const valorFormatado = typeof total === "number" ? total.toFixed(2) : total;
  
      document.getElementById("mensagem").innerText = valorFormatado
        ? valorFormatado + " VA"
        : "Sem dados disponíveis";
    }
  
    // Listeners para atualizar os valores das fases
    database.ref("/BARDO/Medidas/CorrenteA").on("value", (snapshot) => {
      faseA = snapshot.val() * 127;
      atualizarConsumo();
    });
  
    database.ref("/BARDO/Medidas/CorrenteB").on("value", (snapshot) => {
      faseB = snapshot.val() * 127;
      atualizarConsumo();
    });
  
    database.ref("/BARDO/Medidas/CorrenteC").on("value", (snapshot) => {
      faseC = snapshot.val() * 127;
      atualizarConsumo();
    });
  });
  