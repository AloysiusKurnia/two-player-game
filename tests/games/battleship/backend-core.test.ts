import {
    BattleshipGameData
} from '../../../src/games/battleship/backend/core';
import { exampleShipConfig } from './test-util';

describe('Battleship game initialization', () => {
    it('makes a new game', () => {
        const game = new BattleshipGameData([
            exampleShipConfig('h'),
            exampleShipConfig('v')
        ]);
        expect(game).toBeDefined();
    });

    it('does not allow ships to intersect horizontally', () => {
        const badConfig = exampleShipConfig();
        badConfig.battleship = { x: 2, y: 0, orientation: 'h' };
        expect(
            () => new BattleshipGameData([badConfig, exampleShipConfig()])
        ).toThrow();
    });

    it('does not allow ships to intersect vertically', () => {
        const badConfig = exampleShipConfig();
        badConfig.battleship = { x: 0, y: 2, orientation: 'v' };
        expect(
            () => new BattleshipGameData([badConfig, exampleShipConfig()])
        ).toThrow();
    });

    it('does not allow ships to be out of bounds', () => {
        const badConfig = exampleShipConfig();
        badConfig.battleship = { x: 9, y: 0, orientation: 'h' };
        badConfig.carrier = { x: -1, y: 0, orientation: 'h' };
        badConfig.cruiser = { x: 5, y: 9, orientation: 'v' };
        badConfig.submarine = { x: 0, y: -1, orientation: 'v' };
        expect(
            () => new BattleshipGameData([badConfig, exampleShipConfig()])
        ).toThrow();
    });
});

describe('Battleship gameplay', () => {
    let game: BattleshipGameData;
    const PLAYER_INDEX = 0;
    beforeEach(() => {
        game = new BattleshipGameData([
            exampleShipConfig(),
            exampleShipConfig()
        ]);
    });

    it('allows a player to attack', () => {
        const hitShip = game.hit(PLAYER_INDEX, 2, 2)!;
        expect(hitShip).not.toBeNull();
        expect(hitShip.name).toBe('battleship');
        expect(game.checkAlreadyHit(PLAYER_INDEX, 2, 2)).toBe(true);
    });

    it('should sink a ship when all its parts are hit', () => {
        // Carrier is of length 5
        game.hit(PLAYER_INDEX, 0, 0);
        game.hit(PLAYER_INDEX, 1, 0);
        game.hit(PLAYER_INDEX, 2, 0);
        game.hit(PLAYER_INDEX, 3, 0);
        const hitCarrier = game.hit(PLAYER_INDEX, 4, 0)!;
        expect(hitCarrier).not.toBeNull();
        expect(hitCarrier.name).toBe('carrier');
        expect(game.checkSunken(PLAYER_INDEX, hitCarrier)).toBe(true);
    });

    it('should not sink a ship when not all its parts are hit', () => {
        // Carrier is of length 5
        game.hit(PLAYER_INDEX, 0, 0);
        game.hit(PLAYER_INDEX, 1, 0);
        game.hit(PLAYER_INDEX, 2, 0);
        const hitCarrier = game.hit(PLAYER_INDEX, 4, 0)!
        expect(hitCarrier).not.toBeNull();
        expect(hitCarrier.name).toBe('carrier');
        expect(game.checkSunken(PLAYER_INDEX, hitCarrier)).toBe(false);
    });

    it('returns opposite player index', () => {
        expect(game.getOpponent(0)).toBe(1);
        expect(game.getOpponent(1)).toBe(0);
    });
});