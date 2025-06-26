const API_KEY = "PVesielOJY4qgH70RjoSWJXlZvXeNdtIWAc12s9m";
const API_URL = "https://api.nasa.gov/planetary/apod";

const titleEl = document.getElementById("apod-title");
const dateEl = document.getElementById("apod-date");
const imgEl = document.getElementById("apod-image");
const explanationEl = document.getElementById("apod-explanation");
const datePicker = document.getElementById("date-picker");
const fetchBtn = document.getElementById("fetch-button");
const likeBtn = document.getElementById("like-button");
const likesCountEl = document.getElementById("likes-count");

let likes = 0;
let currentDate = "";

// Set max date for date picker to today
function setMaxDate() {
  const today = new Date().toISOString().split("T")[0];
  datePicker.max = today;
  if (!datePicker.value) {
    datePicker.value = today;
  }
  currentDate = datePicker.value;
}

// Show/hide loader
function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}

// Like persistence
function updateLikes(date) {
  const storedLikes = JSON.parse(localStorage.getItem("apodLikes")) || {};
  likes = storedLikes[date] || 0;
  likesCountEl.textContent = likes;
  likeBtn.classList.toggle("liked", likes > 0);
}

function saveLikes(date, value) {
  const storedLikes = JSON.parse(localStorage.getItem("apodLikes")) || {};
  storedLikes[date] = value;
  localStorage.setItem("apodLikes", JSON.stringify(storedLikes));
}

// Show media (image or video)
function showMedia(data) {
  const videoContainer = document.getElementById("video-container");
  if (data.media_type === "image") {
    imgEl.src = data.url;
    imgEl.alt = data.title;
    imgEl.style.display = "block";
    videoContainer.innerHTML = "";
  } else if (data.media_type === "video") {
    imgEl.style.display = "none";
    videoContainer.innerHTML = `<iframe width="100%" height="400" src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
  } else {
    imgEl.style.display = "none";
    videoContainer.innerHTML = "<p>Media type not supported.</p>";
  }
}

// Fetch APOD data from NASA API
async function fetchAPOD(date) {
  try {
    showLoader(true);
    titleEl.textContent = "Loading...";
    explanationEl.textContent = "";
    imgEl.style.display = "none";
    dateEl.textContent = "";
    likes = 0;
    likesCountEl.textContent = "0";
    likeBtn.classList.remove("liked");

    const url = `${API_URL}?api_key=${API_KEY}&date=${date}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code || data.error) {
      titleEl.textContent = "Error fetching data";
      explanationEl.textContent = data.error?.message || "Unknown error";
      return;
    }

    currentDate = date;
    titleEl.textContent = data.title;
    dateEl.textContent = data.date;
    explanationEl.textContent = data.explanation;
    showMedia(data);
    updateLikes(date);
  } catch (error) {
    titleEl.textContent = "Error fetching data";
    explanationEl.textContent = error.message;
  } finally {
    showLoader(false);
  }
}

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  setMaxDate();
  fetchAPOD(currentDate);
});

// Event listener for fetch button
fetchBtn.addEventListener("click", () => {
  const selectedDate = datePicker.value;
  if (selectedDate) {
    fetchAPOD(selectedDate);
  }
});

// Event listener for date input change
datePicker.addEventListener("change", () => {
  const selectedDate = datePicker.value;
  if (selectedDate) {
    fetchAPOD(selectedDate);
  }
});

// Like button toggle
likeBtn.addEventListener("click", () => {
  if (likeBtn.classList.contains("liked")) {
    likes = Math.max(likes - 1, 0);
    likeBtn.classList.remove("liked");
  } else {
    likes++;
    likeBtn.classList.add("liked");
  }
  likesCountEl.textContent = likes;
  saveLikes(currentDate, likes);
});

