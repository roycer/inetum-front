import { Control } from "./control.model";

export class ControlOption {

  constructor(
    public idControlOption: number | null,
    public control?: Control,
    public key?: string,
    public value?: string,
    public tableName?: string,
    public columnName?: string,
    public estadoReg?: number,
    public fechaReg?: string,
  ) { }
}