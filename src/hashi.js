const GRID_SIZE = 7; // default for now
let islands = [];
let bridges = [];
let selectedIsland = null;

const puzzles = [ // required = the number in the circle
    {
        islands: [
            {row: 1, col: 1, required: 3},
            {row: 1, col: 5, required: 2},
            {row: 3, col: 1, required: 3},
            {row: 3, col: 3, required: 4},
            {row: 3, col: 5, required: 3},
            {row: 5, col: 1, required: 2},
            {row: 5, col: 3, required: 3},
            {row: 5, col: 5, required: 2}
        ]
    },
    {
        islands: [
            {row: 0, col: 2, required: 2},
            {row: 2, col: 0, required: 2},
            {row: 2, col: 2, required: 4},
            {row: 2, col: 4, required: 3},
            {row: 2, col: 6, required: 1},
            {row: 4, col: 2, required: 3},
            {row: 4, col: 4, required: 2},
            {row: 6, col: 2, required: 1}
        ]
    }
];

function newGame() {
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    islands = JSON.parse(JSON.stringify(puzzle.islands));
    bridges = [];
    selectedIsland = null;
    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            const island = islands.find(i => i.row === row && i.col === col);
            if (island) {
                const islandEl = document.createElement('div');
                islandEl.className = 'island';
                if (selectedIsland === island) {
                    islandEl.classList.add('selected');
                }
                islandEl.textContent = island.required;
                cell.appendChild(islandEl);
            }

            cell.addEventListener('click', (e) => handleCellClick(row, col, e));
            grid.appendChild(cell);
        }
    }

    renderBridges();
}

function renderBridges() {
    document.querySelectorAll('.bridge').forEach(b => b.remove());

    bridges.forEach(bridge => {
        const {island1, island2, count} = bridge;
        const isHorizontal = island1.row === island2.row;
        
        const bridgeEl = document.createElement('div');
        bridgeEl.className = `bridge ${isHorizontal ? 'horizontal' : 'vertical'}`;
        if (count === 2) bridgeEl.classList.add('double');

        const startRow = Math.min(island1.row, island2.row);
        const startCol = Math.min(island1.col, island2.col);
        const endRow = Math.max(island1.row, island2.row);
        const endCol = Math.max(island1.col, island2.col);

        if (isHorizontal) {
            bridgeEl.style.left = (startCol * 50 + 40) + 'px';
            bridgeEl.style.top = (startRow * 50 + 24) + 'px';
            bridgeEl.style.width = ((endCol - startCol) * 50 - 30) + 'px';
        } else {
            bridgeEl.style.left = (startCol * 50 + 24) + 'px';
            bridgeEl.style.top = (startRow * 50 + 40) + 'px';
            bridgeEl.style.height = ((endRow - startRow) * 50 - 30) + 'px';
        }

        document.getElementById('grid').appendChild(bridgeEl);
    });
}

function handleCellClick(row, col, e) {
    const island = islands.find(i => i.row === row && i.col === col);
    if (!island) return; //empty click

    if (!selectedIsland) { //if nothing is selected
        selectedIsland = island; // first island click 
        renderGrid();
    } else if (selectedIsland === island) { 
        // same island clicked - deselect
        selectedIsland = null;
        renderGrid();
    } else {
        // second island click - build bridge if allowed
        if (canConnect(selectedIsland, island)) {
            toggleBridge(selectedIsland, island);
        }
        selectedIsland = null;
        renderGrid();
    }
}

function canConnect(island1, island2) {
    // must be in same row or column
    if (island1.row !== island2.row && island1.col !== island2.col) {
        return false;
    }

    // path must be clear
    const isHorizontal = island1.row === island2.row;

    const startCol = Math.min(island1.col, island2.col);
    const endCol = Math.max(island1.col, island2.col);

    const startRow = Math.min(island1.row, island2.row);
    const endRow = Math.max(island1.row, island2.row);

    if (isHorizontal) {
        // horizontal path- check for islands in the columns in between
        for (let c = startCol + 1; c < endCol; c++) {
            if (islands.find(i => i.row === island1.row && i.col === c)) {
                return false;
            }
        }

        // crossing bridges check
        for (const bridge of bridges) {
            const bridgeHorizontal = bridge.island1.row === bridge.island2.row;
            if (bridgeHorizontal) continue; // only checking vertical bridges

            const bridgeCol = bridge.island1.col;
            const minRow = Math.min(bridge.island1.row, bridge.island2.row);
            const maxRow = Math.max(bridge.island1.row, bridge.island2.row);

            if (bridgeCol > startCol && bridgeCol < endCol &&
                island1.row > minRow && island1.row < maxRow) {
                return true;
            }

        }

    } else {
        // check for islands in the rows in between
        for (let r = startRow + 1; r < endRow; r++) {
            if (islands.find(i => i.row === r && i.col === island1.col)) {
                return false;
            }
        }

        // crossing bridges check
        for (const bridge of bridges) {
            const bridgeHorizontal = bridge.island1.row === bridge.island2.row;
            if (!bridgeHorizontal) continue; // only checking horizontal bridges

            const bridgeRow = bridge.island1.row;
            const minCol = Math.min(bridge.island1.col, bridge.island2.col);
            const maxCol = Math.max(bridge.island1.col, bridge.island2.col);

            if (bridgeRow > startRow && bridgeRow < endRow &&
                island1.col > minCol && island1.col < maxCol) {
                return false;
            }

        }
    }
}

function toggleBridge(island1, island2) {
    const existing = bridges.find(b => 
        (b.island1 === island1 && b.island2 === island2) ||
        (b.island1 === island2 && b.island2 === island1)
    );

    if (existing) {
        if (existing.count === 1) {
            existing.count = 2;
        } else {
            bridges = bridges.filter(b => b !== existing);
        }
    } else {
        bridges.push({island1, island2, count: 1});
    }

    renderGrid();
}

newGame();