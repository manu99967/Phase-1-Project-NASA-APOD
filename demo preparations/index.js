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
const loader = document.getElementById("loader");

let currentDate = "";

// LocalStorage-based like system
function getLikes(date) {
  return parseInt(localStorage.getItem(`likes-${date}`)) || 0;
}

function setLikes(date, count) {
  localStorage.setItem(`likes-${date}`, count);
}

function showLoader(show) {
  loader.style.display = show ? "block" : "none";
}

async function fetchAPOD(date) {
  try {
    titleEl.textContent = "Loading...";
    explanationEl.textContent = "";
    imgEl.style.display = "none";
    dateEl.textContent = "";
    likeBtn.classList.remove("liked");
    showLoader(true);

    const url = `${API_URL}?api_key=${API_KEY}&date=${date}`;
    const response = await fetch(url);
    const data = await response.json();

    showLoader(false);

    if (data.code || data.error) {
      titleEl.textContent = "Error fetching data";
      explanationEl.textContent = data.error?.message || "Unknown error";
      return;
    }

    currentDate = date;
    titleEl.textContent = data.title;
    dateEl.textContent = data.date;
    explanationEl.textContent = data.explanation;

    const videoEl = document.getElementById("apod-video");
    if (videoEl) videoEl.remove();

    if (data.media_type === "image") {
      imgEl.src = data.url;
      imgEl.alt = data.title;
      imgEl.style.display = "block";
    } else if (data.media_type === "video") {
      imgEl.style.display = "none";
      const iframe = document.createElement("iframe");
      iframe.id = "apod-video";
      iframe.width = "100%";
      iframe.height = "480";
      iframe.style.borderRadius = "8px";
      iframe.style.display = "block";
      iframe.style.margin = "20px auto";
      iframe.src = data.url;
      iframe.allowFullscreen = true;
      imgEl.insertAdjacentElement("afterend", iframe);
    }

    const likes = getLikes(date);
    likesCountEl.textContent = likes;
    likeBtn.classList.toggle("liked", likes > 0);
  } catch (error) {
    showLoader(false);
    titleEl.textContent = "Error fetching data";
    explanationEl.textContent = error.message;
  }
}

function setMaxDate() {
  const today = new Date().toISOString().split("T")[0];
  datePicker.max = today;
  if (!datePicker.value) {
    datePicker.value = today;
  }
  currentDate = datePicker.value;
}

document.addEventListener("DOMContentLoaded", () => {
  setMaxDate();
  fetchAPOD(currentDate);
});

fetchBtn.addEventListener("click", () => {
  const selectedDate = datePicker.value;
  if (selectedDate) {
    fetchAPOD(selectedDate);
  }
});

datePicker.addEventListener("change", () => {
  const selectedDate = datePicker.value;
  if (selectedDate) {
    fetchAPOD(selectedDate);
  }
});

likeBtn.addEventListener("click", () => {
  let likes = getLikes(currentDate);
  const liked = likeBtn.classList.toggle("liked");

  likes += liked ? 1 : -1;
  likes = Math.max(likes, 0);
  setLikes(currentDate, likes);
  likesCountEl.textContent = likes;
});
 