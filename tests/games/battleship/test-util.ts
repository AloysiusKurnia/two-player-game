import { BattleshipShipConfig } from '../../../src/games/battleship/interface/data';

export function exampleShipConfig(
    orientation: 'h' | 'v' = 'h'
): BattleshipShipConfig {
    if (orientation === 'h')
        return {
            carrier: { x: 0, y: 0, orientation: 'h' },
            battleship: { x: 0, y: 2, orientation: 'h' },
            cruiser: { x: 0, y: 4, orientation: 'h' },
            submarine: { x: 0, y: 6, orientation: 'h' },
            destroyer: { x: 0, y: 8, orientation: 'h' },
        };
    else
        return {
            carrier: { x: 0, y: 0, orientation: 'v' },
            battleship: { x: 2, y: 0, orientation: 'v' },
            cruiser: { x: 4, y: 0, orientation: 'v' },
            submarine: { x: 6, y: 0, orientation: 'v' },
            destroyer: { x: 8, y: 0, orientation: 'v' },
        };
}