fitpicsjs
=========

Create Beautiful image galleries with pure JavaScript, with no dependencies.

Currently supporting two strategies:
 - Linear Partition
 - BRIC - Blocked Recursive Image Composition

This library wont draw or measure anything for you, thats up to you and the library you are using.

You pass in a list of image objects, and you get back a list of image objects with recalculated dimensions ofcourse.


1. Usage

options = {
    containerWidth: int,
    preferedImageHeight: int,
    border: int,
    spacing: int
}

linearPartitionFitPics(images, options);

options = {
    width: int*,
    height: int*,
    spacing: int,
    border: int,
    layout: "horizontal" | "vertical"
}

* Mutual Exclusive

bricLayoutFitPics(images, options);



