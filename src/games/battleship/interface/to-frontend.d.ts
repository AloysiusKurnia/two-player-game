import { GameCommand } from '../../.abstracts/abstract-command';
import { ShipName } from './data';

export interface BattleshipGameStart extends GameCommand<'start'> {
    /** Whether the player is going first. */
    first: boolean;
}

export interface BattleshipEnemyMove extends
    GameCommand<'enemyMove'> {
    /** The x coordinate of the move. */
    x: number;
    /** The y coordinate of the move. */
    y: number;
}

export interface BattleshipYourMoveMiss extends
    GameCommand<'shotMissed'> { }

export interface BattleshipYourMoveHit extends
    GameCommand<'shotHit'> {

    /** If the move sunk a ship, this is the name of the ship. */
    ship: ShipName | null;
}

export type BattleshipForwardCommand = BattleshipGameStart
    | BattleshipEnemyMove
    | BattleshipYourMoveMiss
    | BattleshipYourMoveHit;