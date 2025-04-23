import {
  Model,
  SpraypaintBase
} from "spraypaint";

@Model()
export default class ApplicationRecord extends SpraypaintBase {
  static baseUrl = "http://localhost:4567"
  static apiNamespace = "/api/v1"
} 