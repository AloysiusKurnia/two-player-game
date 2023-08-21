import { ShipName, ShipPositioning } from "../../../../../interface/battleship/data";

export const shipLengths = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
} as Record<ShipName, number>;
