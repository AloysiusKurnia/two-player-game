import { BattleshipClient, BattleshipController } from "../../../src/backend/games/battleship/controller";
import { exampleShipConfig } from "./test-util";

describe('battleship controller: initialization phase', () => {
    let mockP1Client: BattleshipClient;
    let mockP2Client: BattleshipClient;
    let game: BattleshipController;
    beforeEach(() => {
        mockP1Client = {
            player: { id: '1', name: 'p1' },
            sendCommand: jest.fn()
        };
        mockP2Client = {
            player: { id: '2', name: 'p2' },
            sendCommand: jest.fn()
        };
        game = new BattleshipController(mockP1Client, mockP2Client);
    });

    it('sets up a game', () => {
        expect(game).toBeDefined();
    });

    it('sends a game start command after both players submit ships', () => {
        const ships = exampleShipConfig();
        game.execute({ type: 'submitShips', ships }, mockP1Client.player);
        game.execute({ type: 'submitShips', ships }, mockP2Client.player);

        expect(mockP1Client.sendCommand).toHaveBeenCalledWith({
            type: 'start',
            first: expect.any(Boolean),
        });
        expect(mockP2Client.sendCommand).toHaveBeenCalledWith({
            type: 'start',
            first: expect.any(Boolean),
        });
    });

    it("won't send a game start command if only one player 1 submits", () => {
        const ships = exampleShipConfig();
        game.execute({ type: 'submitShips', ships }, mockP1Client.player);

        expect(mockP1Client.sendCommand).not.toHaveBeenCalled();
        expect(mockP2Client.sendCommand).not.toHaveBeenCalled();
    });

    it("won't send a game start command if only one player 2 submits", () => {
        const ships = exampleShipConfig();
        game.execute({ type: 'submitShips', ships }, mockP2Client.player);

        expect(mockP1Client.sendCommand).not.toHaveBeenCalled();
        expect(mockP2Client.sendCommand).not.toHaveBeenCalled();
    });

    it('randomly chooses a player to go first: P1', () => {
        const ships = exampleShipConfig();
        jest.spyOn(Math, 'random').mockReturnValue(0);
        game.execute({ type: 'submitShips', ships }, mockP1Client.player);
        game.execute({ type: 'submitShips', ships }, mockP2Client.player);

        expect(mockP1Client.sendCommand).toHaveBeenCalledWith({
            type: 'start',
            first: true,
        });
        expect(mockP2Client.sendCommand).toHaveBeenCalledWith({
            type: 'start',
            first: false,
        });
    });

    it('randomly chooses a player to go first: P2', () => {
        const ships = exampleShipConfig();
        jest.spyOn(Math, 'random').mockReturnValue(1);
        game.execute({ type: 'submitShips', ships }, mockP1Client.player);
        game.execute({ type: 'submitShips', ships }, mockP2Client.player);

        expect(mockP1Client.sendCommand).toHaveBeenCalledWith({
            type: 'start',
            first: false,
        });
        expect(mockP2Client.sendCommand).toHaveBeenCalledWith({
            type: 'start',
            first: true,
        });
    });
});
