import { Modulo } from "./modulo.model";

export class SubModulo {

    constructor(
        public idSubModulo: number | null,
        public modulo?: Modulo,
        public key?: string,
        public label?: string,
        public tableName?: string,
        public columnName?: string,
        public estadoReg?: number,
        public fechaReg?: string,
    ) { }
}