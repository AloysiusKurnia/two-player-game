export interface GridButtonProps {
    children?: string;
    onButtonClick(): void;
    onButtonHover(): void;
    onButtonUnhover(): void;
    isInHoverGroup: boolean;
    hoverGroupIsValid: boolean;
    containsShip: boolean;
    containsCurrentShip: boolean;
}

export function GridButton(props: GridButtonProps) {
    const fillClass = props.containsShip
        ? (props.containsCurrentShip ? 'has-own-ship' : 'has-other-ship')
        : '';
    const outlineClass = props.isInHoverGroup
        ? (props.hoverGroupIsValid ? 'valid-outline' : 'invalid-outline')
        : '';

    return < button
        onClick={props.onButtonClick}
        onMouseEnter={props.onButtonHover}
        onMouseLeave={props.onButtonUnhover}
        class={`grid-button ${fillClass} ${outlineClass}`}
    >{props.children}</button >;
}