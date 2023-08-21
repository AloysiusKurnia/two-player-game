import {
    BattleshipClient,
    BattleshipController
} from '../../../src/games/battleship/backend/controller';
import { exampleShipConfig } from './test-util';

type ClientCommand = Parameters<BattleshipClient['sendCommand']>;

describe('battleship controller: initialization phase', () => {
    let p1Client: BattleshipClient;
    let p2Client: BattleshipClient;
    let game: BattleshipController;
    let sendCommandP1: jest.Mock;
    let sendCommandP2: jest.Mock;
    const p1 = { id: '1', name: 'p1' };
    const p2 = { id: '2', name: 'p2' };
    beforeEach(() => {
        sendCommandP1 = jest.fn();
        sendCommandP2 = jest.fn();
        p1Client = { player: p1, sendCommand: sendCommandP1 };
        p2Client = { player: p2, sendCommand: sendCommandP2 };
        game = new BattleshipController(p1Client, p2Client);
    });

    it('sets up a game', () => {
        expect(game).toBeDefined();
    });

    it('sends a game start command after both players submit ships', () => {
        const ships = exampleShipConfig();
        game.execute({ type: 'submitShips', ships }, p1);
        game.execute({ type: 'submitShips', ships }, p2);

        expect(sendCommandP1).toHaveBeenCalledWith<ClientCommand>({
            type: 'start',
            first: expect.any(Boolean),
        });
        expect(sendCommandP2).toHaveBeenCalledWith<ClientCommand>({
            type: 'start',
            first: expect.any(Boolean),
        });
    });

    it('won\'t send a game start command if only one player 1 submits', () => {
        const ships = exampleShipConfig();
        game.execute({ type: 'submitShips', ships }, p1);

        expect(sendCommandP1).not.toHaveBeenCalled();
        expect(sendCommandP2).not.toHaveBeenCalled();
    });

    it('won\'t send a game start command if only one player 2 submits', () => {
        const ships = exampleShipConfig();
        game.execute({ type: 'submitShips', ships }, p2);

        expect(sendCommandP1).not.toHaveBeenCalled();
        expect(sendCommandP2).not.toHaveBeenCalled();
    });

    it('randomly chooses a player to go first: P1', () => {
        const ships = exampleShipConfig();
        jest.spyOn(Math, 'random').mockReturnValue(0);
        game.execute({ type: 'submitShips', ships }, p1Client.player);
        game.execute({ type: 'submitShips', ships }, p2Client.player);

        expect(sendCommandP1).toHaveBeenCalledWith<ClientCommand>({
            type: 'start',
            first: true,
        });
        expect(sendCommandP2).toHaveBeenCalledWith<ClientCommand>({
            type: 'start',
            first: false,
        });
    });

    it('randomly chooses a player to go first: P2', () => {
        const ships = exampleShipConfig();
        jest.spyOn(Math, 'random').mockReturnValue(1);
        game.execute({ type: 'submitShips', ships }, p1Client.player);
        game.execute({ type: 'submitShips', ships }, p2Client.player);

        expect(sendCommandP1).toHaveBeenCalledWith({
            type: 'start',
            first: false,
        });
        expect(sendCommandP2).toHaveBeenCalledWith({
            type: 'start',
            first: true,
        });
    });
});

describe('battleship controller: gameplay phase', () => {
    let p1Client: BattleshipClient;
    let p2Client: BattleshipClient;
    let game: BattleshipController;
    let sendCommandP1: jest.Mock;
    let sendCommandP2: jest.Mock;
    const p1 = { id: '1', name: 'p1' };
    const p2 = { id: '2', name: 'p2' };

    beforeEach(() => {
        sendCommandP1 = jest.fn();
        sendCommandP2 = jest.fn();
        p1Client = { player: p1, sendCommand: sendCommandP1 };
        p2Client = { player: p2, sendCommand: sendCommandP2 };
        game = new BattleshipController(p1Client, p2Client);
        const ships = exampleShipConfig();
        // Make sure P1 goes first every time
        jest.spyOn(Math, 'random').mockReturnValue(0);
        game.execute({ type: 'submitShips', ships }, p1);
        game.execute({ type: 'submitShips', ships }, p2);

        sendCommandP1.mockClear();
        sendCommandP2.mockClear();
    });

    it('allows a player to make a move when it\'s their move', () => {
        game.execute({ type: 'attack', x: 1, y: 0 }, p1);

        expect(sendCommandP1).toHaveBeenCalledWith<ClientCommand>({
            type: 'shotHit',
            ship: null,
        });
        expect(sendCommandP2).toHaveBeenCalledWith<ClientCommand>({
            type: 'enemyMove',
            x: 1, y: 0,
        });
    });

    it('won\'t allow a player to make a move when it\'s not their move', () => {
        game.execute({ type: 'attack', x: 0, y: 0 }, p2);

        expect(sendCommandP1).not.toHaveBeenCalled();
        expect(sendCommandP2).not.toHaveBeenCalled();
    });

    it('allows p1 to make a move again after p2\'s move', () => {
        game.execute({ type: 'attack', x: 1, y: 0 }, p1);
        expect(sendCommandP1).toHaveBeenLastCalledWith<ClientCommand>({
            type: 'shotHit',
            ship: null,
        });

        game.execute({ type: 'attack', x: 0, y: 0 }, p2);
        game.execute({ type: 'attack', x: 2, y: 0 }, p1);

        expect(sendCommandP1).toHaveBeenLastCalledWith<ClientCommand>({
            type: 'shotHit',
            ship: null,
        });
        expect(sendCommandP2).toHaveBeenLastCalledWith<ClientCommand>({
            type: 'enemyMove',
            x: 2, y: 0,
        });
    });

    it('allows P2 to make a move after P1s move', () => {
        game.execute({ type: 'attack', x: 1, y: 0 }, p1);
        game.execute({ type: 'attack', x: 0, y: 0 }, p2);

        expect(sendCommandP2).toHaveBeenLastCalledWith<ClientCommand>({
            type: 'shotHit',
            ship: null,
        });
        expect(sendCommandP1).toHaveBeenLastCalledWith<ClientCommand>({
            type: 'enemyMove',
            x: 0, y: 0,
        });
    });

    it('allows player to sink a ship', () => {
        for (let x = 0; x < 4; x++) {
            game.execute({ type: 'attack', x, y: 0 }, p1);
            game.execute({ type: 'attack', x, y: 0 }, p2);
        }

        game.execute({ type: 'attack', x: 4, y: 0 }, p1);
        expect(sendCommandP1).toHaveBeenLastCalledWith<ClientCommand>({
            type: 'shotHit',
            ship: 'carrier',
        });
        game.execute({ type: 'attack', x: 4, y: 0 }, p2);
        expect(sendCommandP2).toHaveBeenLastCalledWith<ClientCommand>({
            type: 'shotHit',
            ship: 'carrier',
        });
    });

    it('should mark a missed shot correctly', () => {
        game.execute({ type: 'attack', x: 0, y: 1 }, p1);

        expect(sendCommandP1).toHaveBeenLastCalledWith<ClientCommand>({
            type: 'shotMissed',
        });
        expect(sendCommandP2).toHaveBeenLastCalledWith<ClientCommand>({
            type: 'enemyMove',
            x: 0, y: 1,
        });
    });
});