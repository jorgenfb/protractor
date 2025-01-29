export function isNumeric(n: any): n is number {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
