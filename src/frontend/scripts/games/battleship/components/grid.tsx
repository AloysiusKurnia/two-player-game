import { GridButton } from "./button";

function noOp() { }

export function Panel(props: {}) {
    return <div>
        <GridButton
            onClick={noOp}
            onMouseEnter={noOp}
            onMouseLeave={noOp}
            isInHoverGroup={false}
            isInInvalidHoverGroup={false}
            containsShip={false}
            containsCurrentShip={true}
        >
            Things
        </GridButton>
    </div>;
}