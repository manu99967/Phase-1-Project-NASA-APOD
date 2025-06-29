
# 🚀 Phase-1-Project-NASA-APOD

This is a single-page web application that displays NASA's **Astronomy Picture of the Day (APOD)** using the official [NASA APOD API](https://api.nasa.gov/).

Users can view the image  for any selected date, read the explanation, and "like" the content. Likes are stored per date using local storage (non-persistent across devices).


## 📸 Features

- Fetches and displays the APOD for any date since June 16, 1995
- Supports  images 
- Date picker with automatic limit to today's date
- "Like" button with persistent local like count per date
- Loader indicator during fetch
- Error handling for unavailable or invalid dates

---

## 🧰 Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- NASA Open API — [https://api.nasa.gov/](https://api.nasa.gov/)



## 🧪 Functionality & Interactivity

This app uses:

- `DOMContentLoaded` event to initialize the app
- `click` events for the "Get Picture" and "Like" buttons
- `change` event for the date picker
- Asynchronous API calls using `fetch()` and `async/await`
- JSON for all API responses


# Author
Emmanuel

# License
This project is licensed under the MIT License.
