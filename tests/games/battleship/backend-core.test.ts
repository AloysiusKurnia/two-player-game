import {
    BattleshipGameData, BattleshipShipConfig, ShipPositioning
} from "../../../src/backend/games/battleship/core";

function exampleShipConfigHorizontal(): BattleshipShipConfig {
    return {
        carrier: { x: 0, y: 0, orientation: "h" },
        battleship: { x: 0, y: 2, orientation: "h" },
        cruiser: { x: 0, y: 4, orientation: "h" },
        submarine: { x: 0, y: 6, orientation: "h" },
        destroyer: { x: 0, y: 8, orientation: "h" },
    };
}

function exampleShipConfigVertical(): BattleshipShipConfig {
    return {
        carrier: { x: 0, y: 0, orientation: "v" },
        battleship: { x: 2, y: 0, orientation: "v" },
        cruiser: { x: 4, y: 0, orientation: "v" },
        submarine: { x: 6, y: 0, orientation: "v" },
        destroyer: { x: 8, y: 0, orientation: "v" },
    };
}


describe("Battleship game initialization", () => {
    it("makes a new game", () => {
        const game = new BattleshipGameData([
            exampleShipConfigHorizontal(),
            exampleShipConfigVertical()
        ]);
        expect(game).toBeDefined();
    });

    it("does not allow ships to intersect horizontally", () => {
        const badConfig = exampleShipConfigHorizontal();
        badConfig.battleship = { x: 2, y: 0, orientation: "h" };
        expect(
            () => new BattleshipGameData([badConfig, exampleShipConfigHorizontal()])
        ).toThrow();
    });

    it("does not allow ships to intersect vertically", () => {
        const badConfig = exampleShipConfigHorizontal();
        badConfig.battleship = { x: 0, y: 2, orientation: "v" };
        expect(
            () => new BattleshipGameData([badConfig, exampleShipConfigHorizontal()])
        ).toThrow();
    });

    it("does not allow ships to be out of bounds", () => {
        const badConfig = exampleShipConfigHorizontal();
        badConfig.battleship = { x: 9, y: 0, orientation: "h" };
        badConfig.carrier = { x: -1, y: 0, orientation: "h" };
        badConfig.cruiser = { x: 5, y: 9, orientation: "v" };
        badConfig.submarine = { x: 0, y: -1, orientation: "v" };
        expect(
            () => new BattleshipGameData([badConfig, exampleShipConfigHorizontal()])
        ).toThrow();
    });
});

describe("Battleship gameplay", () => {
    let game: BattleshipGameData;
    const PLAYER_INDEX = 0;
    beforeEach(() => {
        game = new BattleshipGameData([
            exampleShipConfigHorizontal(),
            exampleShipConfigHorizontal()
        ]);
    });

    it("allows a player to attack", () => {
        const hitShip = game.hit(PLAYER_INDEX, 2, 2)!;
        expect(hitShip).not.toBeNull();
        expect(hitShip.name).toBe("battleship");
        expect(game.checkAlreadyHit(PLAYER_INDEX, 2, 2)).toBe(true);
    });

    it("should sink a ship when all its parts are hit", () => {
        // Carrier is of length 5
        game.hit(PLAYER_INDEX, 0, 0);
        game.hit(PLAYER_INDEX, 1, 0);
        game.hit(PLAYER_INDEX, 2, 0);
        game.hit(PLAYER_INDEX, 3, 0);
        const hitCarrier = game.hit(PLAYER_INDEX, 4, 0)!;
        expect(hitCarrier).not.toBeNull();
        expect(hitCarrier.name).toBe("carrier");
        expect(game.checkSunken(PLAYER_INDEX, hitCarrier)).toBe(true);
    });

    it("should not sink a ship when not all its parts are hit", () => {
        // Carrier is of length 5
        game.hit(PLAYER_INDEX, 0, 0);
        game.hit(PLAYER_INDEX, 1, 0);
        game.hit(PLAYER_INDEX, 2, 0);
        const hitCarrier = game.hit(PLAYER_INDEX, 4, 0)!
        expect(hitCarrier).not.toBeNull();
        expect(hitCarrier.name).toBe("carrier");
        expect(game.checkSunken(PLAYER_INDEX, hitCarrier)).toBe(false);
    });

    it('returns opposite player index', () => {
        expect(game.getOpponent(0)).toBe(1);
        expect(game.getOpponent(1)).toBe(0);
    });
});