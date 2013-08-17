var Photo = function (rootUrl, width, height) {
    this.rootUrl = rootUrl;
    this.width = width;
    this.height = height;
    this.calculate_aspect_ratio();
};

Photo.prototype.resize = function (width, height) {
    this.width = width;
    this.height = height;
    this.calculate_aspect_ratio();
};

Photo.prototype.calculate_aspect_ratio = function () {
    this.aspect_ratio = this.width / this.height;
    return this.aspect_ratio;
};