import { TermFormatterParams } from "./model";

export const basicFormatter = (params: TermFormatterParams) => {
    console.info(params.title, params.detail)
}