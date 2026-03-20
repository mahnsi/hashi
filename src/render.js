import {game, GRID_SIZE, islandAt, getIsland} from "./engine.js";
import {handleCellClick} from "./controller.js";

export function render(){
    renderGrid();
    renderBridges();
}

function renderGrid(){

    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    for(let r=0;r<GRID_SIZE;r++){
        for(let c=0;c<GRID_SIZE;c++){

            const cell = document.createElement("div");
            cell.className = "cell";

            cell.addEventListener("click",()=>{
                handleCellClick(r,c);
            });

            // check game state for island at this row and col
            const island = islandAt(r,c);

            if(island){
                // if there is, render the island
                const el = document.createElement("div");
                el.className = "island";
                if(island.remaining===0){
                    el.classList.add("full");
                }

                el.textContent = island.required; // write in the circle the number of bridges required

                if(game.selected && // check game state for whether this island is currently selected
                   game.selected.id===island.id){
                    el.classList.add("selected");
                }

                cell.appendChild(el); 
            }

            grid.appendChild(cell);
        }
    }
}

function renderBridges(){

    document.querySelectorAll(".bridge")
        .forEach(b=>b.remove());

    for(const b of game.bridges){

        const a = getIsland(b.a);
        const c = getIsland(b.b);

        const horizontal = a.row===c.row;

        const el = document.createElement("div");

        el.className =
            `bridge ${horizontal?"horizontal":"vertical"}`;

        if(b.count===2)
            el.classList.add("double");

        const startRow = Math.min(a.row,c.row);
        const startCol = Math.min(a.col,c.col);

        const endRow = Math.max(a.row,c.row);
        const endCol = Math.max(a.col,c.col);

        if(horizontal){

            el.style.left = (startCol*50+40)+"px";
            el.style.top  = (startRow*50+24)+"px";
            el.style.width = ((endCol-startCol)*50-30)+"px";

        } else {

            el.style.left = (startCol*50+24)+"px";
            el.style.top  = (startRow*50+40)+"px";
            el.style.height = ((endRow-startRow)*50-30)+"px";

        }

        document.getElementById("grid").appendChild(el);
    }
}