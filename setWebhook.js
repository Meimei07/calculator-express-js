export function setWebhook() {
  fetch(
    "https://api.telegram.org/bot8765110803:AAG7OGGxjQt2tqcGSZ1uydxoVI9RGQeG7qQ/setWebhook?url=https://calculator-express-js.onrender.com/calculator",
  )
    .then((res) => res.json())
    .then((data) => console.log(data));
}
