import { h, render } from 'preact';

function main() {
    const hello = <h1>Hello, world!</h1>;

    render(hello, document.body);
}

main()