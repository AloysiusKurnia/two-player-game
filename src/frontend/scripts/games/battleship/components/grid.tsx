import { Component, ComponentChildren } from "preact";

interface ButtonProps {
    active: boolean;
    onClick: () => void;
    children: ComponentChildren;
}

class Button extends Component<ButtonProps> {
    render() {
        const { active, onClick, children } = this.props;
        const className = active ? 'active' : '';

        return (
            <button className={className} onClick={onClick}>
                {children}
            </button>
        );
    }
}

interface PanelProps {
    buttons: string[];
}

interface PanelState {
    activeButtonIndex: number;
}

export class Panel extends Component<PanelProps, PanelState> {
    constructor(props: PanelProps) {
        super(props);
        this.state = {
            activeButtonIndex: 0,
        };
    }

    handleButtonClick(index: number) {
        this.setState({ activeButtonIndex: index });
    }

    render() {
        return (
            <div className="panel">
                {this.props.buttons.map((label, index) => (
                    <Button
                        key={index}
                        active={index === this.state.activeButtonIndex}
                        onClick={() => this.handleButtonClick(index)}
                    >
                        {label}
                    </Button>
                ))}
            </div>
        );
    }
}