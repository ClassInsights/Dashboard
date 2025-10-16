export type ComputerCommand = "shutdown" | "restart" | "logoff";

export type CommandMessage = {
  computerId: number;
  command: ComputerCommand;
};
