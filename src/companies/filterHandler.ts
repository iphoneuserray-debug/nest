import { Company } from "./interfaces/company.interface";
import type { CreateFilterDto } from './dto/create-filter.dto';

export function filterHandler(filter: CreateFilterDto, row: Company): boolean {
    for (const key of Object.keys(filter || {}) as Array<keyof CreateFilterDto>) {
        const value = filter[key];
        const rowValue = row[key as keyof Company];

        if (value == null) continue;

        // Selector: array of allowed values
        if (Array.isArray(value)) {
            if (value.length === 0) continue;
            if (typeof value[0] === 'number') {
                if (typeof rowValue !== 'number' || !(value as number[]).includes(rowValue as number)) return false;
            } else {
                if (typeof rowValue !== 'string' || !(value as string[]).includes(rowValue as string)) return false;
            }
        }

        // Range object: { min, max }
        else if (typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
            const rv = rowValue as unknown;
            const min = (value as any).min as number;
            const max = (value as any).max as number;
            if (typeof min !== 'number' || typeof max !== 'number') continue;
            // Uninitialised range values convention: negative
            if (min < 0 || max < 0) continue;
            if (typeof rv !== 'number' || rv < min || rv > max) return false;
        }
    }
    return true;
}