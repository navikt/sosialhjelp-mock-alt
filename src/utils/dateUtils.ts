export const getIsoDateString = (date: Date) => {
    return (
        date.getFullYear() +
        '-' +
        (date.getMonth() < 9 ? '0' : '') +
        (date.getMonth() + 1) +
        '-' +
        (date.getDate() < 9 ? '0' : '') +
        (date.getDate() + 1)
    );
}
