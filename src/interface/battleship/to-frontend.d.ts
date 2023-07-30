import { GameCommand } from "../abstract-command";
import { ShipName } from "./data";

export interface BattleshipGameStart extends GameCommand<'start'> { }

export interface BattleshipGameEnd extends GameCommand<'end'> {
    /** Whether the player won. */
    won: boolean;
}

interface EnemyMove {
    /** The x coordinate of the move. */
    x: number;
    /** The y coordinate of the move. */
    y: number;
}

export interface BattleshipEnemyMoveMiss extends
    GameCommand<'enemyMiss'>,
    EnemyMove { }

export interface BattleshipEnemyMoveHit extends
    GameCommand<'enemyHit'>,
    EnemyMove {

    /** If the move sunk a ship, this is the name of the ship. */
    ship: ShipName | null;
}

export type BattleshipForwardCommand = BattleshipGameStart
    | BattleshipGameEnd
    | BattleshipEnemyMoveMiss
    | BattleshipEnemyMoveHit;