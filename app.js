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
        const sectionDiv = document.createElement("div");
        sectionDiv.id = `section-${section}`;
        sectionDiv.style.padding = "10px";
        sectionDiv.style.borderBottom = "1px solid #ddd";

        const h2 = document.createElement("h2");
        h2.textContent = section;
        h2.style.display = "flex";
        h2.style.justifyContent = "space-between";
        h2.style.alignItems = "center";
        h2.style.fontSize = "18px";

        const addBtn = document.createElement("button");
        addBtn.textContent = "+ Add Item";
        addBtn.onclick = () => addItem(section);
        h2.appendChild(addBtn);

        sectionDiv.appendChild(h2);

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

            sectionDiv.appendChild(div);
        });
        listDiv.appendChild(sectionDiv);
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
            highlightSection(section);
        } else {
            alert("Item already exists in this section.");
        }
    }
}

function highlightSection(section) {
    const el = document.getElementById(`section-${section}`);
    if (el) {
        el.classList.add("highlight");
        setTimeout(() => el.classList.remove("highlight"), 1000);
    }
}

function autoAddItem() {
    const sectionsOnScreen = Object.keys(sections).filter(section => {
        const el = document.getElementById(`section-${section}`);
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    });
    if (sectionsOnScreen.length) {
        addItem(sectionsOnScreen[0]);
    } else {
        alert("No section visible. Scroll to the section where you want to add item.");
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
    a.download = "shoplist_backup.json";
    a.click();
}

function restoreData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            const data = JSON.parse(e.target.result);
            sections = data.sections || sections;
            selectedItems = data.selectedItems || selectedItems;
            saveSections();
            saveSelected();
            renderList();
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportPDF() {
    alert("Export to PDF functionality is not yet implemented.");
}

window.onload = () => {
    renderList();
};
