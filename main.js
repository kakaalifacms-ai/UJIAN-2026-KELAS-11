// ==========================================
// 1. IMPORT FIREBASE
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


// ==========================================
// 2. CONFIG FIREBASE
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyC_1XwbW-9zcNkRJXIQr4N1GgAyzQr6O2g",
  authDomain: "uasgenap2026-549f7.firebaseapp.com",
  projectId: "uasgenap2026-549f7",
  storageBucket: "uasgenap2026-549f7.firebasestorage.app",
  messagingSenderId: "560108074909",
  appId: "1:560108074909:web:50c7719780334c88bee174"
};


// ==========================================
// 3. HUBUNGKAN FIREBASE
// ==========================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ==========================================
// 4. AMBIL ELEMENT HTML
// ==========================================
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messages");

const nameInput = document.getElementById("nameInput");
const joinForm = document.getElementById("joinForm");

const joinCard = document.getElementById("joinCard");
const chatCard = document.getElementById("chatCard");

const logoutBtn = document.getElementById("logoutBtn");

const notificationSound =
  document.getElementById("notificationSound");


// ==========================================
// 5. NAMA USER
// ==========================================
let username = localStorage.getItem("chatUsername") || "";

if (username && nameInput) {
  nameInput.value = username;
}


// ==========================================
// 6. MASUK KE CHAT
// ==========================================
if (joinForm) {

  joinForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = nameInput.value.trim();

    if (name === "") {
      alert("Masukkan nama terlebih dahulu!");
      return;
    }

    username = name;

    localStorage.setItem("chatUsername", username);

    if (joinCard) {
      joinCard.classList.add("hidden");
    }

    if (chatCard) {
      chatCard.classList.remove("hidden");
    }

    if (messageInput) {
      messageInput.focus();
    }

  });

}


// ==========================================
// 7. KELUAR DARI CHAT
// ==========================================
if (logoutBtn) {

  logoutBtn.addEventListener("click", function () {

    localStorage.removeItem("chatUsername");

    username = "";

    if (chatCard) {
      chatCard.classList.add("hidden");
    }

    if (joinCard) {
      joinCard.classList.remove("hidden");
    }

    if (nameInput) {
      nameInput.value = "";
      nameInput.focus();
    }

  });

}


// ==========================================
// 8. COLLECTION DATABASE
// ==========================================
const messagesRef = collection(db, "messages");


// ==========================================
// 9. KIRIM PESAN
// ==========================================
if (messageForm) {

  messageForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const text = messageInput.value.trim();

    if (text === "") {
      return;
    }

    if (username === "") {
      alert("Masukkan nama terlebih dahulu!");
      return;
    }

    try {

      await addDoc(messagesRef, {

        nama: username,

        pesan: text,

        waktu: serverTimestamp()

      });

      messageInput.value = "";

      messageInput.focus();

    } catch (error) {

      console.error("Gagal mengirim pesan:", error);

      alert("Pesan gagal dikirim!");

    }

  });

}


// ==========================================
// 10. MEMBACA PESAN REALTIME
// ==========================================
const q = query(
  messagesRef,
  orderBy("waktu", "asc")
);


let pertamaKali = true;
let jumlahPesanSebelumnya = 0;


onSnapshot(q, function (snapshot) {

  if (!messagesContainer) {
    return;
  }

  messagesContainer.innerHTML = "";


  if (snapshot.empty) {

    const emptyMessage =
      document.createElement("div");

    emptyMessage.className = "empty";

    emptyMessage.textContent =
      "Belum ada pesan. Jadilah yang pertama mengirim pesan!";

    messagesContainer.appendChild(emptyMessage);

  }


  snapshot.forEach(function (doc) {

    const data = doc.data();


    // ==============================
    // CONTAINER PESAN
    // ==============================
    const messageDiv =
      document.createElement("div");

    messageDiv.className = "message";


    if (data.nama === username) {
      messageDiv.classList.add("mine");
    }


    // ==============================
    // NAMA
    // ==============================
    const nameDiv =
      document.createElement("div");

    nameDiv.className = "message-name";

    nameDiv.textContent =
      data.nama || "Pengguna";


    // ==============================
    // ISI PESAN
    // ==============================
    const textDiv =
      document.createElement("div");

    textDiv.className = "message-text";

    textDiv.textContent =
      data.pesan || "";


    // ==============================
    // WAKTU
    // ==============================
    const timeDiv =
      document.createElement("div");

    timeDiv.className = "message-time";


    if (data.waktu) {

      const date =
        data.waktu.toDate();

      timeDiv.textContent =
        date.toLocaleTimeString(
          "id-ID",
          {
            hour: "2-digit",
            minute: "2-digit"
          }
        );

    } else {

      timeDiv.textContent = "...";

    }


    messageDiv.appendChild(nameDiv);

    messageDiv.appendChild(textDiv);

    messageDiv.appendChild(timeDiv);

    messagesContainer.appendChild(messageDiv);

  });


  // ==================================
  // 11. NOTIFIKASI SUARA
  // ==================================
  const jumlahPesanSekarang =
    snapshot.size;


  if (!pertamaKali) {

    if (
      jumlahPesanSekarang >
      jumlahPesanSebelumnya
    ) {

      if (notificationSound) {

        notificationSound.currentTime = 0;

        notificationSound.play()
          .catch(function (error) {

            console.log(
              "Audio belum diizinkan browser:",
              error
            );

          });

      }

    }

  }


  jumlahPesanSebelumnya =
    jumlahPesanSekarang;

  pertamaKali = false;


  // ==================================
  // 12. AUTO SCROLL
  // ==================================
  messagesContainer.scrollTop =
    messagesContainer.scrollHeight;

});


// ==========================================
// 13. ENTER UNTUK MENGIRIM PESAN
// ==========================================
if (messageInput) {

  messageInput.addEventListener(
    "keydown",
    function (e) {

      if (
        e.key === "Enter" &&
        !e.shiftKey
      ) {

        e.preventDefault();

        if (messageForm) {
          messageForm.requestSubmit();
        }

      }

    }
  );

}


// ==========================================
// 14. MIC / REKAM SUARA
// ==========================================
const micBtn =
  document.getElementById("micBtn");

let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;


if (micBtn) {

  micBtn.addEventListener(
    "click",
    async function () {

      // ==============================
      // MULAI REKAM
      // ==============================
      if (!isRecording) {

        try {

          const stream =
            await navigator.mediaDevices.getUserMedia({
              audio: true
            });


          audioChunks = [];


          mediaRecorder =
            new MediaRecorder(stream);


          mediaRecorder.ondataavailable =
            function (event) {

              if (event.data.size > 0) {

                audioChunks.push(
                  event.data
                );

              }

            };


          mediaRecorder.onstop =
            function () {

              const audioBlob =
                new Blob(
                  audioChunks,
                  {
                    type: "audio/webm"
                  }
                );


              const audioURL =
                URL.createObjectURL(
                  audioBlob
                );


              const audio =
                document.createElement("audio");


              audio.controls = true;

              audio.src = audioURL;


              messagesContainer.appendChild(
                audio
              );


              messagesContainer.scrollTop =
                messagesContainer.scrollHeight;


              // Matikan microphone
              stream
                .getTracks()
                .forEach(function (track) {

                  track.stop();

                });

            };


          mediaRecorder.start();


          isRecording = true;


          micBtn.textContent = "⏹️";

          micBtn.classList.add(
            "recording"
          );


        } catch (error) {

          console.error(error);

          alert(
            "Microphone tidak bisa digunakan. Izinkan akses microphone di browser."
          );

        }

      }


      // ==============================
      // STOP REKAM
      // ==============================
      else {

        if (mediaRecorder) {

          mediaRecorder.stop();

        }


        isRecording = false;


        micBtn.textContent = "🎙️";

        micBtn.classList.remove(
          "recording"
        );

      }

    }
  );

}