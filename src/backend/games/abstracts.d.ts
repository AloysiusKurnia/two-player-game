import { GameCommand } from '../../interface/abstract-command';
import { Player } from '../player/player';

export interface GameServerController<CommandSet extends GameCommand<string>> {
    /** Execute a command received from a player. */
    execute<T extends CommandSet>(
        command: T,
        player: Player
    ): void;
}

export interface ClientInterface<CommandSet extends GameCommand<string>> {
    /** The player that is assigned to this client. */
    readonly player: Player;

    /** Send a command to the player's client. */
    sendCommand(command: CommandSet): void;
}