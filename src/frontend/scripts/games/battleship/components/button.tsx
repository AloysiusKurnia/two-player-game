export interface GridButtonProps {
    children?: string;
    onClick(): void;
    onMouseEnter(): void;
    onMouseLeave(): void;
    isInHoverGroup: boolean;
    isInInvalidHoverGroup: boolean;
    containsShip: boolean;
    containsCurrentShip: boolean;
};

export function GridButton(props: GridButtonProps) {
    const fillClass = props.containsShip
        ? (props.containsCurrentShip ? 'has-own-ship' : 'has-other-ship')
        : '';
    const outlineClass = props.isInHoverGroup
        ? (props.isInInvalidHoverGroup ? 'valid-outline' : 'invalid-outline')
        : '';

    return < button
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        class={`grid-button ${fillClass} ${outlineClass}`}
    >{props.children}</button >;
}