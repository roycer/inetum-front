import { Control } from "./control.model";
import { Modulo } from "./modulo.model";

export class FormularioData {

    constructor(
        public modulo: Modulo,
        public control: Control,
        public columnValue: string,
    ) { }
}