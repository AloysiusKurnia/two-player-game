import { useReducer, useState } from 'preact/hooks';
import { GridButton } from './button';
import { PositionChecker } from '../core/positionChecker';


type GridProps<ShipId extends number> = {
    positionChecker: PositionChecker<ShipId>;
    activeShip: ShipId;
    orientation: 'h' | 'v';
};

export function Grid<ShipId extends number>(props: GridProps<ShipId>) {
    const {
        positionChecker,
        activeShip,
        orientation
    } = props;

    const [hoveredCell, setHoveredCell] = useState<number | null>(null);
    const forceUpdate = useReducer(x => x + 1, 0)[1] as () => void;

    let hoveredCells: Set<number>;
    let hoveredCellIsValid: boolean;

    if (hoveredCell !== null) {
        const x = hoveredCell % 10;
        const y = Math.floor(hoveredCell / 10);
        hoveredCells = new Set(
            positionChecker.iterateShipPositions(activeShip, x, y, orientation)
        );
        hoveredCellIsValid = positionChecker.checkValidPosition(
            activeShip,
            x, y,
            orientation
        );
    } else {
        hoveredCells = new Set();
        hoveredCellIsValid = false;
    }

    return <div class="grid">
        {
            Array.from({ length: 100 }, (_, i) => <GridButton
                key={i}
                onButtonClick={() => {
                    if (hoveredCellIsValid) {
                        positionChecker.setShip(
                            activeShip,
                            i % 10, Math.floor(i / 10),
                            orientation
                        );
                        forceUpdate();
                    }
                }}
                onButtonHover={() => setHoveredCell(i)}
                onButtonUnhover={() => setHoveredCell(null)}
                isInHoverGroup={hoveredCells.has(i)}
                hoverGroupIsValid={hoveredCellIsValid}
                containsShip={positionChecker.field[i] !== null}
                containsCurrentShip={positionChecker.field[i] === activeShip}
            />)
        }

    </div>;
}