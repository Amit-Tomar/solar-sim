export function dateToString(date)
{
	return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export function stringTodate(dateStr)
{
	const year = dateStr.split(' ')[0].split('-')[2]
	const month = dateStr.split(' ')[0].split('-')[1]
	const date = dateStr.split(' ')[0].split('-')[0]
	const hour = dateStr.split(' ')[1].split(':')[0]
	const min = dateStr.split(' ')[1].split(':')[1]
	const sec = dateStr.split(' ')[1].split(':')[2]

	return new Date(year, month, date, hour, min, sec)
}