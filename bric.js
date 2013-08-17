var bric_layout = function(images, type) {
  var count = images.length, box;

  console.log(count);

  if (count >= 2) {
    var images2 = [].concat(images);
    var images1 = images2.splice(0, Math.floor(count / 2));

    box = {
        type: 'box',
        box_type: type ? 'vertical' : 'horizontal',
        pixel_check: false,
        leafs: {
            one: bric_layout(images1, !type),
            two: bric_layout(images2, !type)
        }
      };

    box.leafs.one.parent_box_type = box.leafs.two.parent_box_type = box.box_type;

    box.leafs.one.pixel_check = false;
    box.leafs.two.pixel_check = true;

    var dimensions;

    if (type) {
      dimensions = {
        width: box.leafs.one.total_width
      };
    }else {
      dimensions = {
        height: box.leafs.one.total_height
      };
    }

    box.leafs.two = bric_layout_scale_box(box.leafs.two, dimensions);

    if (type) {
      // Horizontal contact; vertical box type.
      box.total_height = box.leafs.one.total_height + box.leafs.two.total_height;
      box.total_width = box.leafs.one.total_width;
    }else {
      // Vertical contact; horizontal box type.
      box.total_width = box.leafs.one.total_width + box.leafs.two.total_width;
      box.total_height = box.leafs.one.total_height;
    }

    box.leafs.one.parent_total_width = box.leafs.two.parent_total_width = box.total_width;
    box.leafs.one.parent_total_height = box.leafs.two.parent_total_height = box.total_height;
    box.leafs.one.siblings_total_width = box.leafs.two.total_width;
    box.leafs.one.siblings_total_height = box.leafs.two.total_height;
    box.leafs.two.siblings_total_width = box.leafs.one.total_width;
    box.leafs.two.siblings_total_height = box.leafs.one.total_height;

  }else if (count === 1) {
    box = images.pop();
  }

  return box;
};

var bric_layout_scale_box = function(box, dimensions) {
  var dimensions1, dimensions2;

// If it is an image - just resize it (change dimensions).
  if (box.type == 'image') {
    if (dimensions.hasOwnProperty('width')) {
      box.total_height = (dimensions.width / box.total_width) * box.total_height;
      box.total_width = dimensions.width;
    }
    else if (dimensions.hasOwnProperty('height')) {
      box.total_width = (dimensions.height / box.total_height) * box.total_width;
      box.total_height = dimensions.height;
    }
    return box;
  }

  // If it is a box - then it should consist of two box elements;
  // Determine sizes of elements and resize them.
  if (dimensions.hasOwnProperty('width')) {
    // Vertical box type; horizontal contact.
    if (box.box_type === 'vertical') {
      dimensions1 = dimensions2 = dimensions;
    }
    // Horizontal box type; vertical contact.
    else if (box.box_type === 'horizontal') {
      dimensions1 = {'width' : (box.leafs.one.total_width / (box.leafs.one.total_width + box.leafs.two.total_width)) * dimensions.width};
      dimensions2 = {'width' : (box.leafs.two.total_width / (box.leafs.one.total_width + box.leafs.two.total_width)) * dimensions.width};
    }
  }
  else if (dimensions.hasOwnProperty('height')) {
    // Vertical box type; horizontal contact.
    if (box.box_type === 'vertical') {
      dimensions1 = {'height' : (box.leafs.one.total_height / (box.leafs.one.total_height + box.leafs.two.total_height)) * dimensions.height};
      dimensions2 = {'height' : (box.leafs.two.total_height / (box.leafs.one.total_height + box.leafs.two.total_height)) * dimensions.height};
    }
    // Horizontal box type; vertical contact.
    else if (box.box_type === 'horizontal') {
      dimensions1 = dimensions2 = dimensions;
    }
  }

  box.leafs.one = bric_layout_scale_box(box.leafs.one, dimensions1);
  box.leafs.two = bric_layout_scale_box(box.leafs.two, dimensions2);

  if (box.box_type === 'vertical') {
    box.total_height = box.leafs.one.total_height + box.leafs.two.total_height;
    box.total_width = box.leafs.one.total_width;
  }
  else if (box.box_type === 'horizontal') {
    box.total_width = box.leafs.one.total_width + box.leafs.two.total_width;
    box.total_height = box.leafs.one.total_height;
  }
  box.leafs.one.parent_total_width = box.leafs.two.parent_total_width = box.total_width;
  box.leafs.one.parent_total_height = box.leafs.two.parent_total_height = box.total_height;
  box.leafs.one.siblings_total_width = box.leafs.two.total_width;
  box.leafs.one.siblings_total_height = box.leafs.two.total_height;
  box.leafs.two.siblings_total_width = box.leafs.one.total_width;
  box.leafs.two.siblings_total_height = box.leafs.one.total_height;

  return box;
};

var bric_layout_render = function(box){
  var output;

  if(box.hasOwnProperty("parent_box_type")){
    if(box.parent_box_type === 'vertical'){
      box.total_width = box.parent_total_width;
    } else if (box.parent_box_type === 'horizontal'){
      box.total_height = box.parent_total_height;
    }
  }

  if(box.pixel_check){
    var pixels;

    if (box.parent_box_type == 'vertical') {
      pixels === Math.floor(box.parent_total_height) - Math.floor(box.total_height) - Math.floor(box.siblings_total_height);
      if (pixels) {
        box.total_height += pixels;
      }
    }
    else if (box.parent_box_type == 'horizontal') {
      pixels === Math.floor(box.parent_total_width) - Math.floor(box.total_width) - Math.floor(box.siblings_total_width)
      if (pixels) {
        box.total_width += pixels;
      }
    }
  }

  if (box.type === "box"){
    box.leafs.one.parent_total_height = box.leafs.two.parent_total_height = box.total_height;
    box.leafs.one.parent_total_width = box.leafs.two.parent_total_width = box.total_width;
  }

  if (box.type === "image"){
    var image_width, image_height;

    image_width = Math.floor(box.total_width - 2 * box.render.border_size - box.render.gap_size);
    image_height = Math.floor(box.total_height - 2 * box.render.border_size - box.render.gap_size);

    var image_wrapper = document.createElement("div");
    image_wrapper.style["float"] = "left";
    image_wrapper.style.width = Math.floor(box.total_width - box.render.gap_size) + 'px';
    image_wrapper.style.height = Math.floor(box.total_height - box.render.gap_size) + 'px';
    image_wrapper.style["margin-top"] = box.render.gap_size + "px";
    image_wrapper.style["margin-left"] = box.render.gap_size + "px";

    var image = document.createElement("img");
    image.src = box.render.image_link;
    image.style.border = box.render.border_size + "px solid " + box.render.border_color;
    image.width = image_width;
    image.height = image_height;

    image_wrapper.appendChild(image);

    output = image_wrapper;

  }else if (box.type == 'box') {
    var new_container = document.createElement("div");

    new_container.style["float"] = "left";
    new_container.style.width = Math.floor(box.total_width) + "px";
    new_container.style.height = Math.floor(box.total_height) + "px";

    var child1 = bric_layout_render(box.leafs.one);
    var child2 = bric_layout_render(box.leafs.two);

    new_container.appendChild(child1);
    new_container.appendChild(child2);

    output = new_container;
  }

  return output;
};