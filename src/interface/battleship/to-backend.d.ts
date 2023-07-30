import { GameCommand } from "../abstract-command";
import { BattleshipShipConfig } from "./data";

export interface BattleshipSubmitShipsCommand extends
    GameCommand<'submitShips'> {
    ships: BattleshipShipConfig;
}

export interface BattleshipAttackCommand extends
    GameCommand<'attack'> {
    x: number;
    y: number;
}

export type BattleshipBackwardCommand = BattleshipSubmitShipsCommand
    | BattleshipAttackCommand;