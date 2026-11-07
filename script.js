const demoDonors = [
  { name: "Aarav Reddy", blood: "A+", city: "Warangal", availability: "Please contact to confirm" },
  { name: "Meera Sharma", blood: "O+", city: "Hyderabad", availability: "Available for contact" },
  { name: "Kiran Kumar", blood: "B+", city: "Warangal", availability: "Please contact to confirm" },
  { name: "Sana Khan", blood: "AB-", city: "Hyderabad", availability: "Currently unavailable" },
  { name: "Rahul Varma", blood: "O-", city: "Karimnagar", availability: "Available for contact" },
  { name: "Ananya Rao", blood: "A-", city: "Nizamabad", availability: "Please contact to confirm" },
  { name: "Dev Patel", blood: "B-", city: "Hyderabad", availability: "Available for contact" },
  { name: "Isha Reddy", blood: "AB+", city: "Warangal", availability: "Please contact to confirm" }
];

const resultsContainer = document.getElementById("donor-results");
const resultsCount = document.getElementById("results-count");
const searchForm = document.getElementById("search-form");
const bloodGroupInput = document.getElementById("blood-group");
const locationInput = document.getElementById("location");
const donorCount = document.getElementById("donor-count");

function getSavedDonors() {
  try {
    const saved = JSON.parse(localStorage.getItem("lifelink-demo-donors") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function allDonors() {
  return [...getSavedDonors(), ...demoDonors];
}

function renderDonors(list) {
  resultsContainer.innerHTML = "";
  resultsCount.textContent = `Showing ${list.length} ${list.length === 1 ? "profile" : "profiles"}`;
  donorCount.textContent = allDonors().length;

  if (!list.length) {
    resultsContainer.innerHTML = '<div class="empty-state"><strong>No matching demo profiles found.</strong><br>Try another blood group or location.</div>';
    return;
  }

  list.forEach((donor) => {
    const card = document.createElement("article");
    card.className = "donor-card";
    const top = document.createElement("div");
    top.className = "donor-card-top";
    const badge = document.createElement("span");
    badge.className = "blood-badge";
    badge.textContent = donor.blood;
    const status = document.createElement("span");
    status.className = "status";
    status.textContent = donor.availability || "Please contact to confirm";
    if ((donor.availability || "").toLowerCase().includes("unavailable")) status.classList.add("unavailable");
    top.append(badge, status);

    const name = document.createElement("h3");
    name.textContent = donor.name;
    const city = document.createElement("p");
    city.className = "city";
    city.textContent = `⌖ ${donor.city}`;
    const note = document.createElement("p");
    note.className = "profile-note";
    note.textContent = "Fictional profile · Demo only";
    card.append(top, name, city, note);
    resultsContainer.appendChild(card);
  });
}

function applySearch() {
  const blood = bloodGroupInput.value.trim().toLowerCase();
  const location = locationInput.value.trim().toLowerCase();
  const filtered = allDonors().filter((donor) => {
    const matchesBlood = !blood || donor.blood.toLowerCase() === blood;
    const matchesLocation = !location || donor.city.toLowerCase().includes(location);
    return matchesBlood && matchesLocation;
  });
  renderDonors(filtered);
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applySearch();
});

document.getElementById("reset-search").addEventListener("click", () => {
  bloodGroupInput.value = "";
  locationInput.value = "";
  renderDonors(allDonors());
});

document.getElementById("register-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const donor = {
    name: document.getElementById("donor-name").value.trim(),
    blood: document.getElementById("donor-blood").value,
    city: document.getElementById("donor-city").value.trim(),
    availability: document.getElementById("donor-availability").value
  };
  if (!donor.name || !donor.blood || !donor.city) return;

  const saved = getSavedDonors();
  saved.unshift(donor);
  try {
    localStorage.setItem("lifelink-demo-donors", JSON.stringify(saved));
    event.target.reset();
    document.getElementById("form-message").textContent = "Demo profile added in this browser. It has not been sent to a server.";
    bloodGroupInput.value = "";
    locationInput.value = "";
    renderDonors(allDonors());
  } catch {
    document.getElementById("form-message").textContent = "Browser storage is unavailable. Please try a different browser.";
  }
});

renderDonors(allDonors());
