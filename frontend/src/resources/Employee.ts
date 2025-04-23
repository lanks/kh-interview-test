
import {
  Model,
  Attr,
  BelongsTo
} from "spraypaint";
import ApplicationRecord from "./ApplicationRecord";
import Department from "./Department";

@Model()
export default class Employee extends ApplicationRecord {
  static jsonapiType = "employees"
  @Attr() firstName: string
  @Attr() lastName: string
  @Attr() age: number
  @Attr() position: string
  @Attr() departmentId: number
  
  @BelongsTo() department: Department
} 