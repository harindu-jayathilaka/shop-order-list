let sections = JSON.parse(localStorage.getItem("sections")) || {
    "Alcohol and Spirits": ["Whiskey", "Vodka", "Gin"],
    "Beer and Cider": ["Lager", "Ale", "Cider"],
    "Drinks - Can": ["Coke Can", "Pepsi Can"],
    "Drinks - Bottles": ["Coke Bottle", "Pepsi Bottle"],
    "Drinks - 2L": ["Coke 2L", "Pepsi 2L"],
    "Drinks - Juices": ["Orange Juice", "Apple Juice"],
    "Mineral Water": ["Still Water", "Sparkling Water"],
    "Grocery": ["Rice", "Sugar", "Flour"],
    "Household": ["Detergent", "Toilet Paper"],
    "Chilled Items": ["Milk", "Cheese", "Yogurt"],
    "Crisps": ["Potato Chips", "Corn Chips"],
    "Pet Foods": ["Dog Food", "Cat Food"],
    "Sweets": ["Chocolate", "Candy"]
};

let selectedItems = JSON.parse(localStorage.getItem("selectedItems")) || {};

function saveSections() {
    localStorage.setItem("sections", JSON.stringify(sections));
}

function saveSelected() {
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
}

function renderList() {
    const listDiv = document.getElementById("list");
    listDiv.innerHTML = "";
    for (const section of Object.keys(sections).sort()) {
        const h2 = document.createElement("h2");
        h2.textContent = section;
        listDiv.appendChild(h2);

        sections[section].sort().forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "item";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = section + "_" + index;
            checkbox.checked = selectedItems[section]?.includes(item) || false;
            checkbox.onchange = () => toggleSelection(section, item, checkbox.checked);

            const label = document.createElement("label");
            label.htmlFor = checkbox.id;
            label.textContent = item;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "×";
            deleteBtn.onclick = () => deleteItem(section, index);

            const editBtn = document.createElement("button");
            editBtn.textContent = "✎";
            editBtn.onclick = () => editItem(section, index);

            div.appendChild(checkbox);
            div.appendChild(label);
            div.appendChild(editBtn);
            div.appendChild(deleteBtn);

            listDiv.appendChild(div);
        });
    }
}

function toggleSelection(section, item, isChecked) {
    if (!selectedItems[section]) selectedItems[section] = [];
    if (isChecked) {
        selectedItems[section].push(item);
    } else {
        selectedItems[section] = selectedItems[section].filter(i => i !== item);
    }
    saveSelected();
}

function deleteItem(section, index) {
    if (confirm(`Delete "${sections[section][index]}" from ${section}?`)) {
        sections[section].splice(index, 1);
        saveSections();
        renderList();
    }
}

function editItem(section, index) {
    const newItem = prompt("Edit item:", sections[section][index]);
    if (newItem && newItem.trim()) {
        sections[section][index] = newItem.trim();
        saveSections();
        renderList();
    }
}

function addItem(section) {
    const newItem = prompt("Enter new item name for " + section + ":");
    if (newItem && newItem.trim()) {
        sections[section].push(newItem.trim());
        saveSections();
        renderList();
    }
}

function promptAddItem() {
    const section = prompt("Enter section name to add item to:");
    if (section && sections[section]) {
        addItem(section);
    } else {
        alert("Section not found.");
    }
}

function showSelected() {
    let output = "";
    for (const section in selectedItems) {
        if (selectedItems[section].length > 0) {
            output += section + ":\n" + selectedItems[section].join("\n") + "\n\n";
        }
    }
    document.getElementById("output").textContent = output || "No items selected.";
}

function unselectAll() {
    selectedItems = {};
    saveSelected();
    renderList();
}

function backupData() {
    const data = {
        sections,
        selectedItems
    };
    const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup.json";
    a.click();
}

function restoreData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const data = JSON.parse(reader.result);
            sections = data.sections || {};
            selectedItems = data.selectedItems || {};
            saveSections();
            saveSelected();
            renderList();
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportPDF() {
    const doc = new jsPDF();
    let y = 10;
    for (const section of Object.keys(selectedItems)) {
        if (selectedItems[section].length > 0) {
            doc.setFont(undefined, 'bold');
            doc.text(section, 10, y);
            y += 6;
            doc.setFont(undefined, 'normal');
            selectedItems[section].forEach(item => {
                doc.text(" - " + item, 10, y);
                y += 6;
                if (y > 280) {
                    doc.addPage();
                    y = 10;
                }
            });
            y += 6;
        }
    }
    doc.save("selected-items.pdf");
}

renderList();
