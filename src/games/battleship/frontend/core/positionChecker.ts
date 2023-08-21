type ShipRegistryEntry<ShipId extends number> = {
    ship: ShipId;
    x: number;
    y: number;
    shipOrientation: 'h' | 'v';
};

export class PositionChecker<ShipId extends number> {
    public readonly field: (ShipId | null)[];
    private registeredShips = new Map<ShipId, ShipRegistryEntry<ShipId>>();

    constructor(
        private readonly lengthData: Record<ShipId, number>,
        private readonly fieldSize: number
    ) {
        this.field = new Array(fieldSize * fieldSize).fill(null);
    }

    /**
     * Checks if the ship can be placed on the field.
     */
    checkValidPosition(
        ship: ShipId,
        x: number, y: number,
        orientation: 'h' | 'v'
    ) {
        return this.checkShipInbounds(ship, x, y, orientation)
            && !this.checkShipOverlap(ship, x, y, orientation);
    }

    /**
     * Checks if the ship is in bounds and not overlapping with other ships.
     * The input x and y should be guaranteed to be inbounds.
     */
    checkShipInbounds(
        ship: ShipId,
        x: number, y: number,
        orientation: 'h' | 'v'
    ) {
        if (orientation === 'h') {
            return x + this.lengthData[ship] <= this.fieldSize;
        } else {
            return y + this.lengthData[ship] <= this.fieldSize;
        }
    }

    /**
     * Removes the ship from the field.
     */
    unsetShip(ship: ShipId) {
        const entry = this.registeredShips.get(ship);
        if (entry === undefined) return;
        for (const pos of this.iterateShipPositions(ship, entry.x, entry.y, entry.shipOrientation)) {
            this.field[pos] = null;
        }
    }

    /**
     * Checks if the ship is overlapping with other ships.
     */
    checkShipOverlap(
        shipToBeChecked: ShipId,
        x: number, y: number,
        orientation: 'h' | 'v'
    ) {
        for (const pos of this.iterateShipPositions(shipToBeChecked, x, y, orientation)) {
            // Ignore the ship itself
            if (this.field[pos] !== null && this.field[pos] !== shipToBeChecked) {
                return true;
            }
        }
        return false;
    }

    /**
     * Sets the ship on the field.
     * The positioning of the ship should be guaranteed to be valid.
     */
    setShip(
        ship: ShipId,
        x: number, y: number,
        orientation: 'h' | 'v'
    ) {
        if (this.registeredShips.has(ship)) {
            this.unsetShip(ship);
        }
        for (const pos of this.iterateShipPositions(ship, x, y, orientation)) {
            this.field[pos] = ship;
        }
        this.registeredShips.set(ship,
            { ship, x, y, shipOrientation: orientation }
        );
    }

    /**
     * Iterates over the positions of the ship from the given origin.
     */
    *iterateShipPositions(
        ship: ShipId,
        xOrigin: number, yOrigin: number,
        orientation: 'h' | 'v'
    ) {
        const length = this.lengthData[ship];
        if (orientation === 'h') {
            for (let i = 0; i < length; i++) {
                const x = xOrigin + i;
                if (x >= this.fieldSize) return;
                yield yOrigin * this.fieldSize + x;
            }
        } else {
            for (let i = 0; i < length; i++) {
                const y = yOrigin + i;
                if (y >= this.fieldSize) return;
                yield y * this.fieldSize + xOrigin;
            }
        }
    }
}