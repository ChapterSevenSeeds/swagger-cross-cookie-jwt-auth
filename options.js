
const cookieNameInput = document.getElementById('cookie-name');
const siteMappingsTable = document.getElementById('siteMappings');
const addButton = document.getElementById('add');
addButton.addEventListener('click', () => {
    const row = siteMappingsTable.insertRow(-1);
    const site = row.insertCell(0);
    const mapping = row.insertCell(1);
    const remove = row.insertCell(2);
    site.innerHTML = '<input type="text" />';
    mapping.innerHTML = '<input type="text" />';
    remove.innerHTML = '<button class="remove">-</button>';
    remove.addEventListener('click', () => {
        row.remove();
    });
});

// Saves options to chrome.storage
function saveOptions() {
    const siteMappings = [];
    for (let i = 1; i < siteMappingsTable.rows.length; i++) {
        const row = siteMappingsTable.rows[i];
        const site = row.cells[0].children[0].value;
        const mapping = row.cells[1].children[0].value;
        siteMappings.push([site, mapping]);
    }

    const cookieName = cookieNameInput.value;

    chrome.storage.sync.set(
        { siteMappings, cookieName },
        () => {
            alert("Saved");
        }
    );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
    chrome.storage.sync.get(
        { siteMappings: [], cookieName: 'accessToken' },
        (items) => {
            cookieNameInput.value = items.cookieName;
            for (let i = 0; i < items.siteMappings.length; i++) {
                const row = siteMappingsTable.insertRow(-1);
                const site = row.insertCell(0);
                const mapping = row.insertCell(1);
                const remove = row.insertCell(2);
                site.innerHTML = '<input type="text" />';
                mapping.innerHTML = '<input type="text" />';
                remove.innerHTML = '<button class="remove">-</button>';
                remove.addEventListener('click', () => {
                    row.remove();
                });
                site.children[0].value = items.siteMappings[i][0];
                mapping.children[0].value = items.siteMappings[i][1];
            }
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);