import { render } from "preact";
import { Panel } from "./components/grid";
import { PositionChecker } from "./core/positionChecker";

const shipLengths = { 1: 5, 2: 4, 3: 3, 4: 3, 5: 2 };
render(
    <Panel
        positionChecker={new PositionChecker(shipLengths, 10)}
        activeShip={1}
        orientation="h"
    />,
    document.body
);