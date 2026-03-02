import {game, islandAt, canConnect, toggleBridge} from "./engine.js";
import {render} from "./render.js";

export function handleCellClick(row,col){

    const island = islandAt(row,col);
    if(!island) return;

    if(!game.selected){
        game.selected = island; //if nothing is selected, this is the first island click

    } else if(game.selected.id === island.id){
        // same island clicked - deselect
        game.selected = null;

    } else {
        // second island click - build bridge if allowed
        if(canConnect(game.selected,island))
            toggleBridge(game.selected,island);

        game.selected = null;
    }

    render();
}