declare module "*.json" {
  const value: any;
  export default value;
}

declare module "node-media-server" {
  function onEvent(callback: (id: string, StreamPath?: string, args?: any) => any): void;
  export class NodeMediaServer {
    constructor(config: any);
    run(): void;
    getSession(StreamId: string): any;
    on(eventname: string, onEvent);
  }
}
