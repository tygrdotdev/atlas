export function convertTime(duration: number) {
	let seconds = Math.floor((duration / 1000) % 60);
	let minutes = Math.floor((duration / (1000 * 60)) % 60);
	let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	let hoursStr = hours.toString().padStart(2, '0');
	let minutesStr = minutes.toString().padStart(2, '0');
	let secondsStr = seconds.toString().padStart(2, '0');

	if (duration < 3600000) {
		return `${minutesStr}:${secondsStr}`;
	} else {
		return `${hoursStr}:${minutesStr}:${secondsStr}`;
	}
}

export function formatDuration(duration: number) {
	if (isNaN(duration) || typeof duration === 'undefined') return '00:00';
	if (duration > 3600000000) return 'Live';
	return convertTime(duration);
}

