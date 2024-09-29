export const isDateExpired = (date) => {
	const cDate = new Date();
	const oDate = new Date(date);
	return cDate > oDate;
};

export const splitDate = (dateString: string | number | Date = "") => {
	const orderDate = new Date(dateString);
	const orderDateStr = orderDate.toDateString().split(" ");
	const orderTimeStr = orderDate.toLocaleTimeString().split(":");
	return {
		dd: String(orderDate.getDay()),
		DD: orderDateStr[0],
		mm: String(orderDate.getMonth()),
		MM: orderDateStr[1],
		date: orderDateStr[2],
		yyyy: orderDateStr[3],
		hour: orderTimeStr[0],
		minute: orderTimeStr[1],
		second: orderTimeStr[2]?.split(" ")?.[0] || "",
		ampm: orderTimeStr[2]?.split(" ")?.[1] || "",
	};
};

export const dateFormate = (
	dateString: string | number | Date,
	formate?: string
) => {
	const dateTime = splitDate(dateString);
	const date = new Date(dateString);
	try {
		if (formate === "iso") {
			return date.toISOString().split("T")[0];
		}
		if (formate === "time") {
			return date.toLocaleTimeString("en-GB");
		}
		return ` ${dateTime.date} ${dateTime.MM}, ${dateTime.yyyy} at
	${dateTime.hour}:${dateTime.minute} ${dateTime.ampm}`;
	} catch (err) {
		return "N/A";
	}
};

export const generateDateFormat = (date: string | number, format: string) => {
	const dateTime = splitDate(date);
	return format
		.replace("%dd%", dateTime?.dd || "0")
		.replace("%DD%", dateTime?.DD || "0")
		.replace("%date%", dateTime?.date || "0")
		.replace("%mm%", dateTime?.mm || "0")
		.replace("%MM%", dateTime?.MM || "0")
		.replace("%yyyy%", dateTime?.yyyy || "0")
		.replace("%hour%", dateTime?.hour || "0")
		.replace("%minute%", dateTime?.minute || "0")
		.replace("%second%", dateTime?.second || "0")
		.replace("%ampm%", dateTime?.ampm || "N/A");
};

export const addHours = (numOfHours, date = null) => {
	date = date ? new Date(date) : new Date();
	date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
	return date;
};
