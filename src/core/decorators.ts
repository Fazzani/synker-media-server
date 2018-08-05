import Controller from "./controller";
import MetadataArgsStorage from "./MetadataArgsStorage";

export function ApiController<T extends { new (...args: any[]): object }>(target: T): T {
  return class Final extends target {
    baseUrl: string;
    constructor(...args: any[]) {
      super(...args);
      var propertyClassName = <PropertyDescriptor>Object.getOwnPropertyDescriptor(target, "name");
      let config = new ControllerConfig();
      let route = `/${config.DefaultApiSuffix}/${config.ApiVersion}/${(<string>propertyClassName.value).toLowerCase().replace("controller", "")}`;
      this.baseUrl = route;

      MetadataArgsStorage.Default.controllers.push({
        type: "Controller",
        target: this,
        route: route
      });
    }
  };
}

export class ControllerConfig {
  ApiVersion?: string = "v1";
  DefaultApiSuffix?: string = "api";
}
