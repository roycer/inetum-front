export class Modulo {

  constructor(
    public idModulo: number | null,
    public key?: string,
    public label?: string,
    public tableName?: string,
    public estadoReg?: number,
    public fechaReg?: string,
  ) { }
}
