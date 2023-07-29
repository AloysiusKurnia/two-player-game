type Double<T> = [T, T];
type Orientation = 'h' | 'v';

export interface ShipPositioning {
    /** The x coordinate of the top left corner of the ship */
    x: number;

    /** The y coordinate of the top left corner of the ship */
    y: number;

    /** The orientation of the ship */
    orientation: Orientation;
}

const shipNames = [
    'carrier',
    'battleship',
    'cruiser',
    'submarine',
    'destroyer'
] as const;

type ShipName = typeof shipNames[number];

const shipLengths = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
} as Record<ShipName, number>;

export type BattleshipShipConfig = Record<ShipName, ShipPositioning>;

const BOARD_SIZE = 10;

function createSquareArray<T>(size: number, value: T): T[][] {
    const arr: T[][] = [];
    for (let i = 0; i < size; i++) {
        const row: T[] = [];
        for (let j = 0; j < size; j++) {
            row.push(value);
        }
        arr.push(row);
    }
    return arr;
}

export class ShipIntersectionError extends Error {
    constructor(public readonly ship1: Ship, public readonly ship2: Ship) {
        const message = `${ship1.name} and ${ship2.name} intersect`;
        super(message);
    }
}

export class ShipOutOfBoundsError extends Error {
    constructor(public readonly ship: Ship) {
        const message = `${ship.name} is out of bounds`;
        super(message);
    }
}

export class BattleshipGame {
    private field: Double<(Ship | null)[][]>;
    private hitData: Double<boolean[][]>;
    private ships: Double<Ship[]>;
    constructor(
        shipConfigs: Double<BattleshipShipConfig>,
    ) {
        this.hitData = [
            createSquareArray(BOARD_SIZE, false),
            createSquareArray(BOARD_SIZE, false),
        ];

        this.ships = [
            this.createShips(shipConfigs[0]),
            this.createShips(shipConfigs[1]),
        ];
        this.field = [
            createSquareArray(BOARD_SIZE, null),
            createSquareArray(BOARD_SIZE, null),
        ];

        for (let i = 0; i < 2; i++) {
            this.populateField(this.field[i], this.ships[i]);
        }
    }

    private createShips(shipConfig: BattleshipShipConfig): Ship[] {
        const ships: Ship[] = [];

        for (const ship of shipNames) {
            const { x, y, orientation } = shipConfig[ship];
            const length = shipLengths[ship];
            const newShip = new Ship(ship, length, orientation, [x, y]);

            ships.push(newShip);
        }

        return ships;
    }

    private populateField(field: (Ship | null)[][], ships: Ship[]) {
        for (const ship of ships) {
            for (const [x, y] of ship.iterPositions()) {
                if (field[x][y] !== null) {
                    throw new ShipIntersectionError(field[x][y]!, ship);
                }
                field[x][y] = ship;
            }
        }
    }

    getOpponent(player: 0 | 1): 0 | 1 {
        return player === 0 ? 1 : 0;
    }

    checkAlreadyHit(defendingPlayer: 0 | 1, x: number, y: number): boolean {
        return this.hitData[defendingPlayer][x][y];
    }

    hit(defendingPlayer: 0 | 1, x: number, y: number): Ship | null {
        this.hitData[defendingPlayer][x][y] = true;
        const defendingShip = this.field[defendingPlayer][x][y];
        return defendingShip;
    }

    checkSunken(defendingPlayer: 0 | 1, ship: Ship): boolean {
        const hitData = this.hitData[defendingPlayer];

        for (const [x, y] of ship.iterPositions()) {
            if (!hitData[x][y]) {
                return false;
            }
        }

        return true;
    }
}

class Ship {
    constructor(
        public readonly name: ShipName,
        public readonly length: number,
        public readonly orientation: Orientation,
        public readonly position: [number, number],
    ) {
        const bboxHeight = orientation === 'h' ? 1 : length;
        const bboxWidth = orientation === 'v' ? 1 : length;

        const [x, y] = position;
        const isOutOfBounds = x < 0
            || y < 0
            || x + bboxWidth >= BOARD_SIZE
            || y + bboxHeight >= BOARD_SIZE;

        if (isOutOfBounds) {
            throw new ShipOutOfBoundsError(this);
        }
    }

    *iterPositions(): Generator<[number, number]> {
        const [x, y] = this.position;
        const dx = this.orientation === 'h' ? 1 : 0;
        const dy = this.orientation === 'v' ? 1 : 0;

        for (let i = 0; i < this.length; i++) {
            yield [x + dx * i, y + dy * i];
        }
    }
}