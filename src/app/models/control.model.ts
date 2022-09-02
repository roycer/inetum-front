import { Modulo } from "./modulo.model";

export type controlType = "input" | "textarea" | "select";

export type inputType = "text" | "number" | "email" | "date" | "dni" | "option";

export type gridClass = "col-md-12" | "col-md-6" | "col-md-4" | "col-md-3";

export interface option {
  key: string;
  value: string;
}

export class Control {

  constructor(
    public idControl: number | null,
    public modulo?: Modulo,
    public key?: string,
    public label?: string,
    public value?: string,
    public required?: number,
    public order?: number,
    public controlType?: string,
    public inputType?: string,
    public gridClass?: string,
    public columnName?: string,
    public opciones?: option[] | [],
    public estadoReg?: number,
    public fechaReg?: string,
  ) { }
}
