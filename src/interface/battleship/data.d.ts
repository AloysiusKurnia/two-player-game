export type Orientation = 'h' | 'v';

export interface ShipPositioning {
    /** The x coordinate of the top left corner of the ship */
    x: number;

    /** The y coordinate of the top left corner of the ship */
    y: number;

    /** The orientation of the ship */
    orientation: Orientation;
}

export type ShipName = 'carrier'
    | 'battleship'
    | 'cruiser'
    | 'submarine'
    | 'destroyer';

export type BattleshipShipConfig = Record<ShipName, ShipPositioning>;