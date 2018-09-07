digi-grid
=========

[Sass](https://sass-lang.com/) grid based primarily on [960.gs](http://960.gs/) by Nathan Smith, but also on [Semantic.gs](http://semantic.gs/) (formerly referred to as the 1Kb CSS Grid) by Tyler Tate. There is the concept of a container (inherent to 960.gs) however it is less meaningful in lieu of rows. While this may seem to slightly litter markup with `class="row"` declarations, the value is seen when it comes to nested columns.

## Usage

The grid uses the following configuration variables:

* `$columns` (number, default: 12) count of grid columns
* `$rows` (number, default: 0) number of row-spans to generate by multiplying this value by `$rowHeight` (generally unused)
* `$gridWidth` (px, default: 960px) default width of the grid container
* `$gutterWidth` (px, default: 20px) default gutter width between columns
* `$rowHeight` (px, default: auto) default row height, if set to anything other than 'auto' row overflow-y is hidden
* `$leading` (px, default: 4px) base value for leading between rows; base is multiplied 12 times, 1-12, to generate 12 leading options
* `$flush` (boolean, default: false) indicates whether or not to also generate flush grid columns (aka full-width columns without gutters)
* `$nohide` (boolean, default: false) indicates whether or not to generate a `nohide` class for each grid column (overrides the default `overflow:hidden` declaration)
* `$classSeparator` (string, default: `-`) separator for generated classes

All of the mixins use these configuration variables as defaults if the corresponding argument is omitted from a mixin call.

*Note: This grid system assumes all elements be given a natural box layout model. For more information: http://www.paulirish.com/2012/box-sizing-border-box-ftw/*

### Class-Based Grid System

To create a grid system that works like an off the shelf framework, use the `+grid-system-complete` mixin to generate the corresponding classes as demonstrated:

```scss
@import "path/to/src/grid"
@include grid-system-complete;
```

The grid may also be customized by passing keyword arguments to the mixin as demonstrated:

```scss
@include grid-system-complete($columns: 12, $rows: 2, $gridWidth: 960px, $gutterWidth: 20px, $rowHeight: 100px, $leading: 10px, $flush: true);
```

*Note: Each of the optional keyword arguments pair up with with configuration variables outlined above.*

To scope the grid within a specific set of selectors or to control the class name of the grid container, use the `+grid-system` mixin instead:

```scss
@import "path/to/src/grid"

@include box-sizing-border-box-ftw; // see note below

#wrap {
  .my_container {
    @include grid-system;
  }
}
```

This will render the grid system nested within the specified selector, replacing the normal function of the container class (`.my_container` in this example).

*Note: The `+grid-system` mixin accepts all of the same keyword arguments that the `+grid-system-complete` mixin accepts. Also, ensure a natural box layout model has been given to at all elements; this is done automatically when using the `+grid-system-complete` mixin, but can be done manually by using the `+box-sizing-border-box-ftw` mixin.*

### Semantic Grids

To create a grid system using only CSS, use the following semantic grid mixins:

* Use the `@include grid-container($gridWidth)` mixin to declare your container element.
* Use the `@include grid(N, $columns, $gutterWidth)` mixin to declare a grid element.
* Use the `@include grid-row(N, $rowHeight, $leading)` mixin to declare a "row" element.
* Use the `@include alpha` and `@include omega` mixins to declare the first and last grid elements for a row.
* Use the `@include grid-prefix(N, $columns, $gridWidth, $gutterWidth)` and `@include grid-suffix(N, $columns, $gridWidth, $gutterWidth)`
 mixins to add empty grid columns before or after a grid element.
* Use the `@include grid-push(N, $columns)` and `@include grid-pull(N, $columns)` mixins to move a grid element from its default position.

`N` is the number of grid columns or rows to span (as in `col-N`, `row span-N` or `push-N`). Example:

```scss
// override defaults
$columns: 16;
$gridWidth: 960px;
$gutterWidth: 20px;

@import "path/to/src/grid"

@include box-sizing-border-box-ftw; // see note below

// semantic grid code
#wrap {
  @include grid-row;
  #header {
    @include grid(16);
  }
  #middle {
    @include grid(16);
    #left-nav {
      @include grid(5);
      @include alpha;
    }
    #main-content {
      @include grid-prefix(1);
      @include grid(10);
      @include omega;
    }
  }
}
```

## Building Demo

This project uses Grunt to generate the demo site; Grunt requires [Node](http://nodejs.org/) (>=0.10.0) be installed. If Node is already installed, simply run `npm install` from the project root folder to install Grunt (if it is not already installed) along with other project dependencies.

Once all dependencies are met, there are two tasks available:

* `grunt build` - Compiles source files into `demo/` directory for previewing
* `grunt preview` - Launches Connect middleware server with `demo/` as the base path, available for viewing at http://localhost:9000/

Running `grunt` alone will run both of these tasks in sequence.

### GitHub Pages

Any time the `master` branch is pushed to a remote, a Git pre-push hook [can be] triggered:

```sh
#!/bin/sh
echo "\n[digi-grid pre-push hook]"
if [ "`git branch | grep ^* | cut -d' ' -f2`" == "master" ]; then
   grunt build
   git checkout gh-pages
   cp demo/* .
   if ! git diff --no-ext-diff --quiet --exit-code; then
      git add .
      git commit -m "Updating demo"
      git push
   fi
   git checkout master
   echo "[digi-grid pre-push hook: complete]"
fi
```

Placing this in `.git/hooks/pre-push` (relative to the repository clone) will commit an update on the `gh-pages` branch any time the built demo files are modified.

To bypass the pre-push hook, `git push --no-verify` may be used.

*Note: Remember to `chmod +x .git/hooks/pre-push` to mark the file with execute permissions or the hook will not run.*
