import { useEffect } from 'preact/hooks';

export type SelectionPanelProps<ShipId extends number> = {
    shipNames: Record<ShipId, string>;
    shipLengths: Record<ShipId, number>;
    onShipSelect: (shipId: ShipId) => void;
    activeShip: ShipId;
};

export function SelectionPanel<ShipId extends number>(
    props: SelectionPanelProps<ShipId>
) {
    const shipIds = Object.keys(props.shipNames).map(x => Number(x)) as ShipId[];

    return <div class="selection-panel">
        {
            shipIds.map(shipId => <button
                key={shipId}
                class={`${props.activeShip === shipId ? 'active' : ''}`}
                onClick={() => props.onShipSelect(shipId)}
            >
                {props.shipNames[shipId]} ({props.shipLengths[shipId]})
            </button>)
        }
    </div>
}

type OrientationSelectorProps = {
    onFlipOrientation: () => void;
    orientation: 'h' | 'v';
};

export function OrientationSelector(props: OrientationSelectorProps) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'r') {
                props.onFlipOrientation();
            }
        };
        document.addEventListener('keydown', handler);

        return () => {
            document.removeEventListener('keydown', handler);
        }
    }, [props.onFlipOrientation]);

    return <div class="orientation-selector">
        <label for="orientation-selector">O[r]ientation:</label>
        <button
            id="orientation-selector"
            onClick={() => props.onFlipOrientation()}
        >
            {props.orientation === 'h' ? 'Horizontal' : 'Vertical'}
        </button>
    </div>
}