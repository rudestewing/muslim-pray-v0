// Register service worker for PWA functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful with scope: ", registration.scope)
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error)
      })
  })
}

// Add to home screen functionality
let deferredPrompt
const addBtn = document.querySelector(".add-button")

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault()
  // Stash the event so it can be triggered later
  deferredPrompt = e
  // Update UI to notify the user they can add to home screen
  if (addBtn) addBtn.style.display = "block"
})

if (addBtn) {
  addBtn.addEventListener("click", () => {
    // Show the prompt
    if (deferredPrompt) {
      deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt")
        } else {
          console.log("User dismissed the A2HS prompt")
        }
        deferredPrompt = null
      })
    }
  })
}

// Check for online/offline status
window.addEventListener("online", updateOnlineStatus)
window.addEventListener("offline", updateOnlineStatus)

function updateOnlineStatus() {
  const statusElement = document.getElementById("connection-status")
  if (statusElement) {
    if (navigator.onLine) {
      statusElement.textContent = "Online"
      statusElement.classList.remove("bg-red-100", "text-red-800")
      statusElement.classList.add("bg-green-100", "text-green-800")
    } else {
      statusElement.textContent = "Offline"
      statusElement.classList.remove("bg-green-100", "text-green-800")
      statusElement.classList.add("bg-red-100", "text-red-800")
    }
  }
}
