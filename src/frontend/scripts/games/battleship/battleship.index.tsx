import { render } from "preact";
import { Panel } from "./components/grid";

render(
    <Panel buttons={['Button 1', 'Button 2', 'Button 3']} />,
    document.body
);