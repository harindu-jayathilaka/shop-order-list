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
    for (const section in sections) {
        const h2 = document.createElement("h2");
        h2.textContent = section;

        const addBtn = document.createElement("button");
        addBtn.textContent = "+ Add Item";
        addBtn.onclick = () => addItem(section);
        h2.appendChild(addBtn);
        listDiv.appendChild(h2);

        sections[section].sort().forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "item";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = section + "_" + index;
            checkbox.checked = selectedItems[section]?.includes(item) || false;
            checkbox.onchange = () => {
                if (!selectedItems[section]) selectedItems[section] = [];
                if (checkbox.checked) {
                    selectedItems[section].push(item);
                } else {
                    selectedItems[section] = selectedItems[section].filter(i => i !== item);
                }
                saveSelected();
            };

            const label = document.createElement("label");
            label.htmlFor = checkbox.id;
            label.textContent = item;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "×";
            deleteBtn.style.marginLeft = "10px";
            deleteBtn.onclick = () => deleteItem(section, index);

            div.appendChild(checkbox);
            div.appendChild(label);
            div.appendChild(deleteBtn);

            listDiv.appendChild(div);
        });
    }
}

function deleteItem(section, index) {
    if (confirm(`Delete "${sections[section][index]}" from ${section}?`)) {
        const item = sections[section][index];
        sections[section].splice(index, 1);
        if (selectedItems[section]) {
            selectedItems[section] = selectedItems[section].filter(i => i !== item);
        }
        saveSections();
        saveSelected();
        renderList();
    }
}

function addItem(section) {
    const newItem = prompt("Enter new item name for " + section + ":");
    if (newItem && newItem.trim()) {
        if (!sections[section].includes(newItem.trim())) {
            sections[section].push(newItem.trim());
            saveSections();
            renderList();
        } else {
            alert("Item already exists in this section.");
        }
    }
}

function promptAddItem() {
    const section = prompt("Enter section name for new item:");
    if (section && sections[section]) {
        addItem(section);
    } else {
        alert("Section not found.");
    }
}

function showSelected() {
    let output = "";
    for (const section in selectedItems) {
        if (selectedItems[section]?.length) {
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
    const data = JSON.stringify({ sections, selectedItems });
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup.json";
    a.click();
}

function restoreData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            const data = JSON.parse(event.target.result);
            sections = data.sections || sections;
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
    for (const section in selectedItems) {
        if (selectedItems[section]?.length) {
            doc.setFont(undefined, 'bold');
            doc.text(section, 10, y);
            y += 6;
            doc.setFont(undefined, 'normal');
            selectedItems[section].forEach(item => {
                doc.text("- " + item, 10, y);
                y += 6;
                if (y > 280) {
                    doc.addPage();
                    y = 10;
                }
            });
            y += 4;
        }
    }
    doc.save("SelectedItems.pdf");
}

renderList();
