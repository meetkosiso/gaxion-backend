// sort the array in ascending order if flag = true, or desending order if flag = false;
export function sortArray(array, key, flag = true) {
	// return sorted array
	return array.sort(function(a, b) {
		const x = a[key];
		const y = b[key];
		if (flag) return x < y ? -1 : x > y ? 1 : 0;
		return (x < y ? -1 : x > y ? 1 : 0) * -1;
	});
}
