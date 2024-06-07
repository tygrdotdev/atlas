export default function stringToBoolean(str: string) {
	// Convert the string to lowercase for a case-insensitive comparison
	switch (str.toLowerCase().trim()) {
		case "true":
		case "1":
		case "yes":
		case "y":
			return true;
		case "false":
		case "0":
		case "no":
		case "n":
			return false;
		default:
			return false; // if all else, return false
	}
}