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

var linear_partition = function (seq, k) {
    var i, n, partition_table, table, solution, ans = [],
        final_result = [];

    if (k <= 0) {
        return final_result;
    }

    n = seq.length - 1;

    if (k > n) {
        for (i = 0; i < seq.length; i++) {
            final_result.push([seq[i]]);
        }

        return final_result;
    }

    partition_table = linear_partition_table(seq, k);

    table = partition_table[0];
    solution = partition_table[1];

    k = k - 2;

    while (k >= 0) {
        var partial_ans = [];

        for (i = solution[n - 1][k] + 1; i < n + 1; i++) {
            partial_ans.push(seq[i]);
        }

        partial_ans = [partial_ans];

        ans = partial_ans.concat(ans);
        n = solution[n - 1][k];
        k = k - 1;
    }

    for (i = 0; i < n + 1; i++) {
        final_result.push(seq[i]);
    }

    final_result = [final_result];

    return final_result.concat(ans);
};


var linear_partition_table = function (seq, k) {
    var i, j, n = seq.length,
        row = [],
        table = [],
        solution = [];

    // Create the table
    for (i = 0; i < n; i++) {
        row = [];
        for (j = 0; j < k; j++) {
            row.push(0);
        }
        table.push(row);
    }

    // Create solution
    for (i = 0; i < n - 1; i++) {
        row = [];
        for (j = 0; j < k - 1; j++) {
            row.push(0);
        }
        solution.push(row);
    }

    for (i = 0; i < n; i++) {
        table[i][0] = seq[i] + (i ? table[i - 1][0] : 0);
    }

    for (i = 0; i < k; i++) {
        table[0][i] = seq[0];
    }

    for (i = 1; i < n; i++) {
        for (j = 1; j < k; j++) {
            var lists_to_min = [],
                x;
            for (x = 0; x < i; x++) {
                lists_to_min.push([Math.max.apply(Math, [table[x][j - 1], table[i][0] - table[x][0]]), x]);
            }

            var result = {
                computed: Infinity,
                value: Infinity
            };
            for (x = 0; x < lists_to_min.length; x++) {
                lists_to_min[x][0] < result.computed && (result = {
                    value: lists_to_min[x],
                    computed: lists_to_min[x][0]
                });
            }

            table[i][j] = result.value[0];
            solution[i - 1][j - 1] = result.value[1];
        }
    }

    return [table, solution];
};

var fitPics = function (photos, container_width, prefered_height) {
    var ideal_height, index = 0,
        partition, row_buffer = [],
        rows, summed_width = 0,
        summed_ratios = 0,
        weights = [];

    for (var i = 0; i < photos.length; i++) {
        summed_width += photos[i].aspect_ratio * prefered_height;
    }

    rows = Math.round(summed_width / container_width);

    if (rows < 1) {
        for (i = 0; i < photos.length; i++) {
            photos[i].resize(parseInt(prefered_height * photo.aspect_ratio), prefered_height);
        }
    } else {
        for (i = 0; i < photos.length; i++) {
            weights.push(parseInt(photos[i].aspect_ratio * 100));
        }

        partition = linear_partition(weights, rows);

        for (i = 0; i < partition.length; i++) {
            var row = partition[i];
            summed_ratios = 0;
            summed_width = 0;
            row_buffer = [];

            for (j = 0; j < row.length; j++) {
                row_buffer.push(photos[index++]);
            }

            for (j = 0; j < row_buffer.length; j++) {
                summed_ratios += row_buffer[j].aspect_ratio;
            }

            for (j = 0; j < row_buffer.length; j++) {
                var photo = row_buffer[j];
                summed_width += parseInt(container_width / summed_ratios * photo.aspect_ratio);
                photo.resize(parseInt(container_width / summed_ratios * photo.aspect_ratio), parseInt(container_width / summed_ratios));
            }
        }
    }
};