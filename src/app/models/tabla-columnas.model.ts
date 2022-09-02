export class TablaColumnas {

    constructor(
        public id: number | null,
        public tableName?: string,
        public columnName?: string,
        public dataType?: string,
        public isNullable?: string,
    ) { }
}