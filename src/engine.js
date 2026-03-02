import {render} from "./render.js";

export const GRID_SIZE = 7;

export const game = {
    islands: [], //nodes
    bridges: [], //edges
    selected: null
};

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


function newGame(){

    const puzzle =
        puzzles[Math.floor(Math.random()*puzzles.length)];

    game.islands = puzzle.islands.map((i,idx)=>({
        id: idx,
        row: i.row,
        col: i.col,
        required: i.required
    }));

    game.bridges = [];
    game.selected = null;

    render();
}


// Game logic

export function islandAt(row,col){
    return game.islands.find(i => i.row===row && i.col===col);
}

export function getIsland(id){
    return game.islands.find(i => i.id===id);
}

export function getBridge(a,b){
    return game.bridges.find(e =>
        (e.a===a && e.b===b) ||
        (e.a===b && e.b===a)
    );
}

export function canConnect(i1,i2){
    // must be in same row or column
    if(i1.id === i2.id) return false;

    // path must be clear
    const horizontal = i1.row === i2.row;
    const vertical = i1.col === i2.col;

    if(!horizontal && !vertical) return false;

    const startRow = Math.min(i1.row,i2.row);
    const endRow = Math.max(i1.row,i2.row);
    const startCol = Math.min(i1.col,i2.col);
    const endCol = Math.max(i1.col,i2.col);

    if(horizontal){
        // horizontal path- check for islands in the columns in between
        for(let c=startCol+1;c<endCol;c++){
            if(islandAt(i1.row,c)) return false;
        }
    } else {
        for(let r=startRow+1;r<endRow;r++){
            if(islandAt(r,i1.col)) return false;
        }
    }

    // crossing bridges check
    for(const b of game.bridges){

        const a = getIsland(b.a);
        const c = getIsland(b.b);

        const bHorizontal = a.row === c.row;

        if(horizontal && !bHorizontal){

            const col = a.col;
            const minRow = Math.min(a.row,c.row);
            const maxRow = Math.max(a.row,c.row);

            if(col>startCol && col<endCol &&
               i1.row>minRow && i1.row<maxRow)
                return false;
        }

        if(!horizontal && bHorizontal){

            const row = a.row;
            const minCol = Math.min(a.col,c.col);
            const maxCol = Math.max(a.col,c.col);

            if(row>startRow && row<endRow &&
               i1.col>minCol && i1.col<maxCol)
                return false;
        }
    }

    return true;
}

export function toggleBridge(i1,i2){

    const edge = getBridge(i1.id,i2.id);

    if(edge){

        if(edge.count===1)
            edge.count = 2;
        else
            game.bridges = game.bridges.filter(e => e!==edge);

    } else {

        game.bridges.push({
            a:i1.id,
            b:i2.id,
            count:1
        });

    }
}

function islandDegree(id){
    // TODO
}

function checkWin(){
    // TODO 
    return isConnected();
}


function isConnected(){
    // TODO
    return true;
}

newGame();