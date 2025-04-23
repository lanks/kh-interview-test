
import {
  Model,
  Attr,
  HasMany
  // etc
} from "spraypaint";
import ApplicationRecord from "./ApplicationRecord";
import Employee from "./Employee";

@Model()
export default class Department extends ApplicationRecord {
  static jsonapiType = "departments"
  @Attr() name: string
  @HasMany() employees: Employee
  
} 