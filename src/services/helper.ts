import dayjs from "dayjs"

export const FORMAT_DATE = 'YYYY-MM-DD'
export const dateRangeValidate = (dateRange: any) => {

    if (!dateRange) return undefined;
    const startDate = dayjs(dateRange[0], FORMAT_DATE).startOf("day").toISOString();
    const endDate = dayjs(dateRange[1], FORMAT_DATE).endOf("day").toISOString();

    return [startDate, endDate]
}