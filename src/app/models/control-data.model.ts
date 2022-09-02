import { Modulo } from "./modulo.model";
import { Control } from "./control.model";

export class ControlData {

  constructor(
    public idControlData: number | null,
    public modulo?: Modulo,
    public control?: Control,
    public key?: string,
    public value?: string,
    public estadoReg?: number,
    public fechaReg?: string,
  ) { }
}
