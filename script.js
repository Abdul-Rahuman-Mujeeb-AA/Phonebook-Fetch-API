const API_URL = "https://jsonplaceholder.typicode.com/users";

const form = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");
const searchInput = document.getElementById("search");

let contacts = [];
let editId = null;

// FETCH CONTACTS
async function fetchContacts() {
    try {
    const res = await fetch(API_URL);
    const data = await res.json();
    contacts = data;
    displayContacts(contacts);
    } catch (error) {
    alert("Failed to fetch contacts");
    }
}

// DISPLAY CONTACTS
function displayContacts(data) {
    contactList.innerHTML = "";

    data.forEach((contact) => {
    const li = document.createElement("li");

    li.innerHTML = `
        <strong>${contact.name}</strong>
        <span>${contact.phone}</span>
        <span>${contact.email}</span>

        <div class="actions">
        <button class="edit" onclick="editContact(${contact.id})">Edit</button>
        <button class="delete" onclick="deleteContact(${contact.id})">Delete</button>
        </div>
    `;

    contactList.appendChild(li);
    });
}

// ADD / UPDATE CONTACT
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

  // VALIDATION
    if (!name || !phone || !email) {
    alert("All fields are required");
    return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
    alert("Phone must be 10 digits");
    return;
    }

    const contactData = { name, phone, email };

    try {
    if (editId) {
      // UPDATE
        await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
        });

        contacts = contacts.map((c) =>
        c.id === editId ? { ...c, ...contactData } : c,
        );

        editId = null;
    } else {
      // ADD
        const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
        });

        const newContact = await res.json();
        contacts.push(newContact);
    }

    displayContacts(contacts);
    form.reset();
    } catch (error) {
    alert("Operation failed");
    }
});

// DELETE CONTACT
async function deleteContact(id) {
    try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    contacts = contacts.filter((c) => c.id !== id);
    displayContacts(contacts);
    } catch (error) {
    alert("Delete failed");
    }
}

// EDIT CONTACT
function editContact(id) {
    const contact = contacts.find((c) => c.id === id);
    document.getElementById("name").value = contact.name;
    document.getElementById("phone").value = contact.phone;
    document.getElementById("email").value = contact.email;

    editId = id;
}

// SEARCH
searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    const filtered = contacts.filter((c) => c.name.toLowerCase().includes(value));

    displayContacts(filtered);
});

// INIT
fetchContacts();
