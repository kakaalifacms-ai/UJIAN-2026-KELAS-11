// ===============================
// FIREBASE
// ===============================
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

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";


// ===============================
// FIREBASE CONFIG
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyC1_1XwbW-9zcNkRJXIQr4N1GgAyzQr6O2g",
  authDomain: "uasgenap2026-549f7.firebaseapp.com",
  projectId: "uasgenap2026-549f7",
  storageBucket: "uasgenap2026-549f7.firebasestorage.app",
  messagingSenderId: "560108074909",
  appId: "1:560108074909:web:50c7719780334c88bee174"
};


// ===============================
// INIT FIREBASE
// ===============================
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);


// ===============================
// ELEMENT
// ===============================
const joinCard = document.getElementById("joinCard");
const chatCard = document.getElementById("chatCard");

const joinForm = document.getElementById("joinForm");
const nameInput = document.getElementById("nameInput");

const logoutBtn = document.getElementById("logoutBtn");

const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

const messagesContainer =
  document.getElementById("messages");

const micBtn =
  document.getElementById("micBtn");

const notificationSound =
  document.getElementById("notificationSound");

const connectionStatus =
  document.getElementById("connectionStatus");

const participantLabel =
  document.getElementById("participantLabel");


// ===============================
// USERNAME
// ===============================
let username =
  localStorage.getItem("chatUsername") || "";


// ===============================
// FIRESTORE
// ===============================
const messagesRef =
  collection(db, "messages");

const messagesQuery =
  query(
    messagesRef,
    orderBy("waktu", "asc")
  );


// ===============================
// SHOW CHAT
// ===============================
function showChat() {

  joinCard.classList.add("hidden");

  chatCard.classList.remove("hidden");

  if (participantLabel) {

    participantLabel.textContent =
      `Masuk sebagai ${username}`;
  }
}


// ===============================
// SHOW JOIN
// ===============================
function showJoin() {

  joinCard.classList.remove("hidden");

  chatCard.classList.add("hidden");
}


// ===============================
// CEK LOGIN
// ===============================
if (username) {

  showChat();

} else {

  showJoin();
}


// ===============================
// JOIN
// ===============================
if (joinForm) {

  joinForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      const name =
        nameInput.value.trim();

      if (!name) {

        alert(
          "Masukkan nama terlebih dahulu."
        );

        return;
      }

      username = name;

      localStorage.setItem(
        "chatUsername",
        username
      );

      showChat();

      messageInput.focus();
    }
  );
}


// ===============================
// LOGOUT
// ===============================
if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        "chatUsername"
      );

      username = "";

      showJoin();

      nameInput.value = "";
    }
  );
}


// ===============================
// KIRIM PESAN TEKS
// ===============================
if (messageForm) {

  messageForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const text =
        messageInput.value.trim();

      if (!text) return;

      if (!username) {

        alert(
          "Masukkan nama terlebih dahulu."
        );

        return;
      }

      try {

        await addDoc(
          messagesRef,
          {
            tipe: "text",
            nama: username,
            pesan: text,
            waktu: serverTimestamp()
          }
        );

        messageInput.value = "";

        messageInput.focus();

      } catch (error) {

        console.error(
          "Gagal mengirim pesan:",
          error
        );

        alert(
          "Pesan gagal dikirim."
        );
      }
    }
  );
}


// ===============================
// FORMAT WAKTU
// ===============================
function formatTime(timestamp) {

  if (!timestamp) return "";

  const date =
    timestamp.toDate();

  return date.toLocaleTimeString(
    "id-ID",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}


// ===============================
// BUAT PESAN TEKS
// ===============================
function createTextMessage(data) {

  const message =
    document.createElement("div");

  message.className =
    "message";

  if (data.nama === username) {

    message.classList.add("mine");
  }


  const name =
    document.createElement("div");

  name.className =
    "message-name";

  name.textContent =
    data.nama || "Pengguna";


  const text =
    document.createElement("div");

  text.className =
    "message-text";

  text.textContent =
    data.pesan || "";


  const time =
    document.createElement("div");

  time.className =
    "message-time";

  time.textContent =
    formatTime(data.waktu);


  message.appendChild(name);

  message.appendChild(text);

  message.appendChild(time);

  return message;
}


// ===============================
// BUAT PESAN AUDIO
// ===============================
function createAudioMessage(data) {

  const message =
    document.createElement("div");

  message.className =
    "message audio-message";

  if (data.nama === username) {

    message.classList.add("mine");
  }


  // NAMA
  const name =
    document.createElement("div");

  name.className =
    "message-name";

  name.textContent =
    data.nama || "Pengguna";


  // AUDIO BOX
  const audioBox =
    document.createElement("div");

  audioBox.className =
    "audio-box";


  // ICON MIC
  const micIcon =
    document.createElement("span");

  micIcon.className =
    "audio-icon";

  micIcon.textContent =
    "🎙️";


  // AUDIO PLAYER
  const audio =
    document.createElement("audio");

  audio.controls = true;

  audio.preload = "metadata";

  audio.src =
    data.audioUrl;


  audioBox.appendChild(
    micIcon
  );

  audioBox.appendChild(
    audio
  );


  // WAKTU
  const time =
    document.createElement("div");

  time.className =
    "message-time";

  time.textContent =
    formatTime(data.waktu);


  message.appendChild(name);

  message.appendChild(audioBox);

  message.appendChild(time);

  return message;
}


// ===============================
// REALTIME PESAN
// ===============================
let firstSnapshot = true;

onSnapshot(
  messagesQuery,

  (snapshot) => {

    messagesContainer.innerHTML = "";


    if (snapshot.empty) {

      const empty =
        document.createElement("div");

      empty.className =
        "empty";

      empty.textContent =
        "Belum ada pesan. Mulai percakapan!";

      messagesContainer.appendChild(
        empty
      );

      return;
    }


    snapshot.forEach(
      (doc) => {

        const data =
          doc.data();

        let messageElement;


        if (data.tipe === "audio") {

          messageElement =
            createAudioMessage(data);

        } else {

          messageElement =
            createTextMessage(data);
        }


        messagesContainer.appendChild(
          messageElement
        );
      }
    );


    messagesContainer.scrollTop =
      messagesContainer.scrollHeight;


    if (!firstSnapshot) {

      try {

        notificationSound.currentTime = 0;

        notificationSound
          .play()
          .catch(() => {});

      } catch (error) {

        console.log(error);
      }
    }


    firstSnapshot = false;
  },

  (error) => {

    console.error(
      "Firestore error:",
      error
    );

    if (connectionStatus) {

      connectionStatus.textContent =
        "Offline";
    }
  }
);


// ===============================
// STATUS
// ===============================
if (connectionStatus) {

  connectionStatus.textContent =
    "Online";
}


// ===============================
// ENTER UNTUK KIRIM
// ===============================
if (messageInput) {

  messageInput.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        messageForm.requestSubmit();
      }
    }
  );
}


// ===============================
// MICROPHONE
// ===============================
let mediaRecorder = null;

let audioChunks = [];

let isRecording = false;

let recordingStartTime = 0;

let recordingTimer = null;


// ===============================
// UPDATE TIMER
// ===============================
function updateRecordingTime() {

  if (!isRecording) return;

  const elapsed =
    Math.floor(
      (Date.now() - recordingStartTime) /
      1000
    );

  const minutes =
    Math.floor(elapsed / 60);

  const seconds =
    elapsed % 60;

  const timeText =
    `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;


  if (micBtn) {

    micBtn.textContent =
      `⏹️ ${timeText}`;
  }
}


// ===============================
// MIC
// ===============================
if (micBtn) {

  micBtn.addEventListener(
    "click",
    async () => {

      // =========================
      // MULAI REKAM
      // =========================
      if (!isRecording) {

        if (!username) {

          alert(
            "Masukkan nama terlebih dahulu."
          );

          return;
        }


        try {

          const stream =
            await navigator.mediaDevices
              .getUserMedia({
                audio: true
              });


          audioChunks = [];


          mediaRecorder =
            new MediaRecorder(stream);


          mediaRecorder.ondataavailable =
            (event) => {

              if (
                event.data.size > 0
              ) {

                audioChunks.push(
                  event.data
                );
              }
            };


          mediaRecorder.onstop =
            async () => {

              // =====================
              // BLOB AUDIO
              // =====================
              const audioBlob =
                new Blob(
                  audioChunks,
                  {
                    type:
                      "audio/webm"
                  }
                );


              // =====================
              // NAMA FILE
              // =====================
              const fileName =
                `voice_${Date.now()}_${Math.random()
                  .toString(36)
                  .substring(2, 8)}.webm`;


              // =====================
              // STORAGE PATH
              // =====================
              const storageRef =
                ref(
                  storage,
                  `voice-messages/${fileName}`
                );


              try {

                micBtn.disabled = true;

                micBtn.textContent =
                  "⏳ Mengupload...";


                // ===================
                // UPLOAD AUDIO
                // ===================
                await uploadBytes(
                  storageRef,
                  audioBlob,
                  {
                    contentType:
                      "audio/webm"
                  }
                );


                // ===================
                // URL AUDIO
                // ===================
                const audioUrl =
                  await getDownloadURL(
                    storageRef
                  );


                // ===================
                // SIMPAN KE FIRESTORE
                // ===================
                await addDoc(
                  messagesRef,
                  {
                    tipe: "audio",
                    nama: username,
                    audioUrl: audioUrl,
                    waktu:
                      serverTimestamp()
                  }
                );


                console.log(
                  "Voice message berhasil disimpan."
                );


              } catch (error) {

                console.error(
                  "Upload audio gagal:",
                  error
                );

                alert(
                  "Voice message gagal disimpan. Cek Storage Rules Firebase."
                );

              } finally {

                micBtn.disabled = false;

                micBtn.classList.remove(
                  "recording"
                );

                micBtn.textContent =
                  "🎙️";
              }


              // =====================
              // MATIKAN MICROPHONE
              // =====================
              stream
                .getTracks()
                .forEach(
                  (track) => {
                    track.stop();
                  }
                );
            };


          // =======================
          // MULAI REKAM
          // =======================
          mediaRecorder.start();

          isRecording = true;

          recordingStartTime =
            Date.now();


          recordingTimer =
            setInterval(
              updateRecordingTime,
              1000
            );


          micBtn.classList.add(
            "recording"
          );

          micBtn.textContent =
            "⏹️ 0:00";


        } catch (error) {

          console.error(
            "Microphone error:",
            error
          );

          alert(
            "Microphone tidak bisa digunakan. Izinkan akses microphone di browser."
          );
        }


      }

      // =========================
      // STOP REKAM
      // =========================
      else {

        if (mediaRecorder) {

          mediaRecorder.stop();
        }


        isRecording = false;


        clearInterval(
          recordingTimer
        );


        micBtn.classList.remove(
          "recording"
        );


        micBtn.textContent =
          "⏳";
      }
    }
  );
}