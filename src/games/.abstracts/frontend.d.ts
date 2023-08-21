import { GameCommand } from "./abstract-command";

export interface GameClientController<CommandSet extends GameCommand<string>> {
    /** Execute a command received from the server. */
    execute<T extends CommandSet>(command: T): void;
}

export interface ServerInterface<CommandSet extends GameCommand<string>> {
    /** Send a command to the server. */
    sendCommand(command: CommandSet): void;
}