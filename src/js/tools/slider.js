Element.prototype.addClass = function (className) {
	if (!this.classList.contains(className)) {
		this.classList.add(className);
	}
};

Element.prototype.removeClass = function (className) {
	if (this.classList.contains(className)) {
		this.classList.remove(className);
	}
};

Array.prototype.first = function () {
	return this[0];
}

Array.prototype.last = function () {
	return this[this.length - 1];
}
