import { Grid } from './components/grid';
import { PositionChecker } from './core/positionChecker';
import { OrientationSelector, SelectionPanel } from './components/panel';
import { render } from 'preact';
import { useState } from 'preact/hooks';

function App<ShipId extends number>(props: {
    positionChecker: PositionChecker<ShipId>;
    initialActiveShip: ShipId,
    shipNames: Record<ShipId, string>;
    shipLengths: Record<ShipId, number>;
}) {
    const [activeShip, setActiveShip] = useState(props.initialActiveShip);
    const [orientation, setOrientation] = useState<'h' | 'v'>('h');
    return <div id="app">
        <SelectionPanel
            shipNames={props.shipNames}
            shipLengths={props.shipLengths}
            onShipSelect={setActiveShip}
            activeShip={activeShip}
        />
        <OrientationSelector
            onFlipOrientation={() => setOrientation(orientation === 'h' ? 'v' : 'h')}
            orientation={orientation}
        />
        <Grid
            positionChecker={props.positionChecker}
            activeShip={activeShip}
            orientation={orientation}
        />
    </div>;
}

(function main() {
    const shipLengths = { 1: 5, 2: 4, 3: 3, 4: 3, 5: 2 };
    const shipNames = {
        1: 'Carrier',
        2: 'Battleship',
        3: 'Cruiser',
        4: 'Submarine',
        5: 'Destroyer'
    };
    const positionChecker = new PositionChecker(shipLengths, 10)
    render(
        <App
            positionChecker={positionChecker}
            initialActiveShip={1}
            shipNames={shipNames}
            shipLengths={shipLengths}
        />,
        document.body
    );
})();