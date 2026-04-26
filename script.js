const round = document.getElementById('round');
const tree = document.getElementById('tree');
const playButton = document.getElementById('playButton');
const growButton = document.getElementById('growButton');
const shrinkButton = document.getElementById('shrinkButton');
const table = document.getElementById('table');

let round_number = 1;
let size = 3;
let table_index = 0;

const images = [];
const characters = [
    { name: 'Goku', image: 'https://spritedatabase.net/files/ps2/2493/Sprite/CharSelectP1/Goku%2001.png' },
    { name: 'Gohan', image: 'https://spritedatabase.net/files/ps2/2493/Sprite/CharSelectP1/Gohan%2001.png' },
    { name: 'Goten', image: 'https://spritedatabase.net/files/ps2/2493/Sprite/CharSelectP1/Goten%2001.png' },
    { name: 'Vegeta', image: 'https://spritedatabase.net/files/ps2/2493/Sprite/CharSelectP1/Vegeta%2001.png' },
    { name: 'Trunks', image: 'https://spritedatabase.net/files/ps2/2493/Sprite/CharSelectP1/Kid%20Trunks%2001.png' },
    { name: 'Krillin', image: 'https://spritedatabase.net/files/ps2/2493/Sprite/CharSelectP1/Krillin.png' },
    { name: 'Yamcha', image: 'https://spritedatabase.net/files/ps2/2493/Sprite/CharSelectP1/Yamcha.png' },
    { name: 'Tien', image: 'https://spritedatabase.net/files/ps2/2493/Sprite/CharSelectP1/Tien.png' }
];

function terminator() {
    if (round_number == 1) return '1st';
    if (round_number == 2) return '2nd';
    if (round_number == 3) return '3rd';
    return `${round_number}th`;
}

function winRound(figure) {
    if (figure.children.length == 0 || figure.firstElementChild.style.filter === 'grayscale(100%)') {
        return;
    }
    const parentFigure = figure.parentElement.parentElement.parentElement.firstElementChild;
    if (parentFigure.tagName === 'FIGURE' && parentFigure.children.length == 0) {
        let found = false;
        for (const child of figure.parentElement.parentElement.children) {
            if (child.firstElementChild !== figure && child.firstElementChild.firstElementChild !== null) {
                child.firstElementChild.firstElementChild.style.filter = 'grayscale(100%)';
                found = true;
            }
        }
        if (found) {
            parentFigure.appendChild(figure.firstElementChild);
        }
    }
}

function treeIterate(node) {
    const figure = node.firstElementChild;
    if (figure.firstElementChild !== null) {
        return;
    }
    
    const ul = node.children[1];
    const combatants = [];
    for (const child of ul.children) {
        if (child.firstElementChild.firstElementChild === null) {
            treeIterate(child);
        } else {
            combatants.push(child.firstElementChild.firstElementChild);
        }
    }
    if (combatants.length === 0) {
        return;
    }

    const winner = combatants[Math.floor(Math.random() * combatants.length)];
    for (const child of ul.children) {
        const img = child.firstElementChild.firstElementChild;
        if (img !== null && img !== winner) {
            img.style.filter = 'grayscale(100%)';
        }
    }
    figure.appendChild(winner);
}

function playRound() {
    round.textContent = `${terminator(round_number)} Round`;
    if (tree.firstElementChild.firstElementChild.firstElementChild !== null) {
        return;
    }
    setTimeout(() => {
        treeIterate(tree.firstElementChild);
        round_number++;
        playRound();
    }, 1000);
}

playButton.addEventListener('click', (e) => {
    playRound();
});

growButton.addEventListener('click', (e) => {
    if (size >= 8) {
        return;
    }
    size++;
    tree_update();
});

shrinkButton.addEventListener('click', (e) => {
    if (size <= 1) {
        return;
    }
    size--;
    tree_update();
});

function tableGenerate(table, depth) {
    const count = 1 << depth;
    images.length = count;
    table.replaceChildren();
    for (let i = 0; i < count; i++) {
        const row = table.insertRow(-1);
        const character = characters[Math.floor(Math.random() * characters.length)];

        const nameTd = row.insertCell(0);
        nameTd.textContent = character.name;
        nameTd.contentEditable = true;
        nameTd.addEventListener('blur', (e) => {
            images[i].alt = nameTd.textContent;
        });

        const imageTd = row.insertCell(1);
        imageTd.textContent = character.image;
        imageTd.contentEditable = true;
        imageTd.addEventListener('blur', (e) => {
            images[i].src = imageTd.textContent;
        });
    }
}

function treeGenerate(node, depth) {
    const li = document.createElement('li');
    node.appendChild(li);
    const figure = document.createElement('figure');
    li.appendChild(figure);
    if (depth > 0) {
        const ul = document.createElement('ul');
        li.appendChild(ul);
        treeGenerate(ul, depth - 1);
        treeGenerate(ul, depth - 1);
    }
    else if (depth == 0) {
        const img = document.createElement('img');
        img.alt = table.children[table_index].children[0].textContent;
        img.src = table.children[table_index].children[1].textContent;
        figure.appendChild(img);
        images[table_index] = img;
        table_index++;
    }
}

function tree_update() {
    tree.replaceChildren();
    round.textContent = '';
    round_number = 1;
    tableGenerate(table, size);
    table_index = 0;
    treeGenerate(tree, size);
}

tree_update();
