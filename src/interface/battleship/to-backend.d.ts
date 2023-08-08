import { GameCommand } from "../abstract-command";
import { BattleshipShipConfig } from "./data";

export interface BattleshipSubmitShipsCommand extends
    GameCommand<'submitShips'> {
    /** The ship configuration to submit. */
    ships: BattleshipShipConfig;
}

export interface BattleshipAttackCommand extends
    GameCommand<'attack'> {
    /** The x coordinate of the attack. */
    x: number;
    /** The y coordinate of the attack. */
    y: number;
}

export type BattleshipBackwardCommand = BattleshipSubmitShipsCommand
    | BattleshipAttackCommand;