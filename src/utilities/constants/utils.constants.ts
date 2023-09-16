// ===== Symbols =====

// ====== Types ======
export type FindParams = {
    filter?: string,
    page?: string,
    limit?: string,
    sort?: string
}
// ====== Enums ======
export enum SortTypes {
    ASC = 1,
    DES = -1
}

// ====== Regex ======
export const PersianLettersRegex = new RegExp(/^[\u0600-\u06FF\s]+$/);