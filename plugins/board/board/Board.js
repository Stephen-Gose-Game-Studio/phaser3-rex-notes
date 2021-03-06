import ChessBank from '../data/ChessBank.js';
import BoardData from '../data/BoardData.js';
import ChessData from '../data/ChessData.js';

import SetBoardWidth from './SetBoardWidth.js';
import SetBoardHeight from './SetBoardHeight.js';
import AddChess from './AddChess.js';
import GridAlign from './GridAlign.js';
import RemoveChess from './RemoveChess.js';
import MoveChess from './MoveChess.js';
import SwapChess from './SwapChess.js';
import Contains from './Contains.js';
import ForEachTileXY from './ForEachTileXY.js';
import GetWrapTileX from './GetWrapTileX.js';
import GetWrapTileY from './GetWrapTileY.js';
import TileXYZToChess from './TileXYZToChess.js';
import TileXYToChess from './TileXYToChess.js';
import ChessToTileXYZ from './ChessToTileXYZ.js';
import GetNeighborTileX from './GetNeighborTileX.js';
import GetNeighborTileY from './GetNeighborTileY.js';
import GetNeighborChess from './GetNeighborChess.js';
import WorldXYToTileX from './WorldXYToTileX.js';
import WorldXYToTileY from './WorldXYToTileY.js';
import SetInteractive from './SetInteractive.js';


const EE = Phaser.Events.EventEmitter;
const GetValue = Phaser.Utils.Objects.GetValue;
const uidKey = ChessBank.uidKey;

class Board extends EE {
    constructor(scene, config) {
        super();

        this.scene = scene;
        this.boardData = new BoardData();
        this.resetFromJSON(config);
    }

    resetFromJSON(o) {
        this.setGrid(GetValue(o, 'grid', undefined));
        this.setWrapMode(GetValue(o, 'wrap', false));
        this.setInfinityBoard(GetValue(o, 'inifinity', false));
        this.setBoardWidth(GetValue(o, 'width', 0));
        this.setBoardHeight(GetValue(o, 'height', 0));
        return this;
    }

    shutdown() {
        super.shutdown();
        this.boardData.shutdown();

        this.scene = undefined;
        this.boardData = undefined;
        return this;
    }

    destroy() {
        this.emit('destroy');
        this.shutdown();
        return this;
    }

    setGrid(grid) {
        this.grid = grid;
        return this;
    }

    setWrapMode(mode) {
        if (mode === undefined) {
            mode = true;
        }
        this.wrapMode = mode;
        return this;
    }

    setInfinityBoard(mode) {
        if (mode === undefined) {
            mode = true;
        }
        this.infinityMode = mode;
        return this;
    }

    setBoardSize(width, height) {
        this.setBoardWidth(width);
        this.setBoardHeight(height);
        return this;
    }

    getChessData(gameObject) {
        // game object or uid
        var type = typeof (gameObject);
        if ((type === 'number') || (type === 'string')) {
            // uid
            var uid = gameObject;
            return ChessBank.get(uid);
        } else {
            // game object
            if (!gameObject.hasOwnProperty('rexChess')) {
                gameObject.rexChess = new ChessData(gameObject);
            }
            return gameObject.rexChess;
        }
    }

    getChessUID(gameObject) {
        // game object or uid
        var uid;
        var type = typeof (gameObject);
        if ((type === 'number') || (type === 'string')) {
            uid = gameObject;
        } else {
            uid = this.getChessData(gameObject)[uidKey];
        }
        return uid;
    }

    exists(gameObject) {
        // game object or uid
        return this.boardData.exists(this.getChessUID(gameObject));
    }

    uidToChess(uid) {
        if (uid == null) {
            return null;
        } else {
            // single uid
            if (!this.boardData.exists(uid)) {
                return null;
            }
            return ChessBank.get(uid).parent;
        }
    }

    uidArrayToChess(uid, out) {
        if (out === undefined) {
            out = [];
        }
        var uidArray = uid;
        for (var i = 0, cnt = uidArray.length; i < cnt; i++) {
            uid = uidArray[i];
            if (!this.boardData.exists(uid)) {
                continue;
            }
            out.push(ChessBank.get(uid));
        }
        return out;
    }
}

var methods = {
    setBoardWidth: SetBoardWidth,
    setBoardHeight: SetBoardHeight,
    addChess: AddChess,
    gridAlign: GridAlign,
    removeChess: RemoveChess,
    moveChess: MoveChess,
    swapChess: SwapChess,
    forEachTileXY: ForEachTileXY,
    contains: Contains,
    getWrapTileX: GetWrapTileX,
    getWrapTileY: GetWrapTileY,
    tileXYZToChess: TileXYZToChess,
    tileXYToChess: TileXYToChess,
    chessToTileXYZ: ChessToTileXYZ,
    getNeighborTileX: GetNeighborTileX,
    getNeighborTileY: GetNeighborTileY,
    getNeighborChess: GetNeighborChess,
    worldXYToTileX: WorldXYToTileX,
    worldXYToTileY: WorldXYToTileY,
    setInteractive: SetInteractive,
}
Object.assign(
    Board.prototype,
    methods
);

export default Board;