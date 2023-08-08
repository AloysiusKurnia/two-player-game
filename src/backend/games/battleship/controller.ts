import { BattleshipBackwardCommand } from "../../../interface/battleship/to-backend";
import { ClientInterface, GameController } from '../abstracts';
import { Player } from "../../player/player";
import { BattleshipForwardCommand } from "../../../interface/battleship/to-frontend";
import { Pair } from "../../../util/types";
import { BattleshipShipConfig } from "../../../interface/battleship/data";
import { BattleshipGameData } from "./core";

export type BattleshipClient = ClientInterface<BattleshipForwardCommand>;

export class BattleshipController implements GameController<BattleshipBackwardCommand> {
    private clients: Pair<BattleshipClient>;
    private state: BattleshipControllerState;
    constructor(player1: BattleshipClient, player2: BattleshipClient) {
        this.clients = [player1, player2];
        this.state = new BattleshipSetupController(this.clients);
    }

    execute<C extends BattleshipBackwardCommand>(
        command: C,
        player: Player
    ): void {
        const playerIndex = this.getIndexOfPlayer(player);
        const newState = this.state.execute(command, playerIndex);
        if (newState !== null) {
            this.state = newState;
        }
    }

    private getIndexOfPlayer(player: Player): 0 | 1 {
        if (player === this.clients[0].player) {
            return 0;
        } else {
            return 1;
        }
    }
}

interface BattleshipControllerState {
    execute<C extends BattleshipBackwardCommand>(
        command: C,
        playerIndex: 0 | 1
    ): BattleshipControllerState | null;
}

class BattleshipSetupController implements BattleshipControllerState {
    private shipConfigs: Pair<BattleshipShipConfig | null> = [null, null];
    constructor(
        private clients: Pair<BattleshipClient>
    ) { }

    execute<C extends BattleshipBackwardCommand>(
        command: C,
        playerIndex: 0 | 1
    ): BattleshipControllerState | null {
        if (command.type === 'submitShips') {
            const shipConfig = command.ships;
            this.shipConfigs[playerIndex] = shipConfig;

            if (this.shipConfigs[0] !== null && this.shipConfigs[1] !== null) {
                const firstMove = Math.random() < 0.5 ? 0 : 1;

                return new BattleshipGameplayController(
                    this.shipConfigs as Pair<BattleshipShipConfig>,
                    this.clients,
                    firstMove
                );
            }
        }
        return null;
    }
}

class BattleshipGameplayController implements BattleshipControllerState {
    private game: BattleshipGameData;
    constructor(
        shipConfigs: Pair<BattleshipShipConfig>,
        private clients: Pair<BattleshipClient>,
        private turn: 0 | 1
    ) {
        clients[0].sendCommand({
            type: 'start',
            first: turn === 0,
        });
        clients[1].sendCommand({
            type: 'start',
            first: turn === 1,
        });

        this.game = new BattleshipGameData(shipConfigs);
    }

    execute<C extends BattleshipBackwardCommand>(
        command: C,
        playerIndex: 0 | 1
    ): BattleshipControllerState | null {
        if (command.type === 'attack') {
            if (playerIndex !== this.turn) {
                return null;
            }

            const otherPlayerIndex = playerIndex === 0 ? 1 : 0;
            const hitShip = this.game.hit(
                otherPlayerIndex,
                command.x,
                command.y);

            if (hitShip) {
                const hitShipSunken = this.game.checkSunken(
                    otherPlayerIndex,
                    hitShip
                );
                this.clients[playerIndex].sendCommand({
                    type: 'shotHit',
                    ship: hitShipSunken ? hitShip.name : null
                });
            } else {
                this.clients[playerIndex].sendCommand({ type: 'shotMissed' });
            }
            this.clients[otherPlayerIndex].sendCommand({
                type: 'enemyMove',
                x: command.x,
                y: command.y
            });
        }

        return null;
    }
}