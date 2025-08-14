// Default sections and items
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

function saveSections() {
    localStorage.setItem("sections", JSON.stringify(sections));
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

        sections[section].forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "item";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = section + "_" + index;
            const label = document.createElement("label");
            label.htmlFor = checkbox.id;
            label.textContent = item;
            div.appendChild(checkbox);
            div.appendChild(label);
            listDiv.appendChild(div);
        });
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

function showSelected() {
    const selected = {};
    for (const section in sections) {
        sections[section].forEach((item, index) => {
            const checkbox = document.getElementById(section + "_" + index);
            if (checkbox.checked) {
                if (!selected[section]) selected[section] = [];
                selected[section].push(item);
            }
        });
    }
    let output = "";
    for (const section in selected) {
        output += section + ":\n" + selected[section].join("\n") + "\n\n";
    }
    document.getElementById("output").textContent = output || "No items selected.";
}

// Initial render
renderList();
