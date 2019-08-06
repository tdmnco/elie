# Changelog

All notable changes to this project will be documented in this file.

The format is based on a modified version of [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 0.1.7

### Bug fixes

* Fixes an issue in which keys in `{{ for each }}` operators where not replaced properly.

## 0.1.6

### News

* Adds support for the `{{ previous page number unless zero }}` operator.

## 0.1.5

### News

* Adds support for prettifying the generated HTML.

## 0.1.4

### News

* Support sorting of dates in front matter.

## 0.1.3

### News

* Better handling of header and footer HTML that allows for tabs and spaces.

## 0.1.2

### News

* Retire the `{{ link to folder }}` and `{{ link to html }}` operators in favor of the simpler `{{ slug }}`
* Removal of the HTML minification support since this should be handled in a separate pipeline in which Elie is used.

## 0.1.1

### News

* Improved pagination of the `{{ for each }}` operator.

## 0.1.0

### News

* Support for pagination of `{{ for each }}` via the `{{ paginate }}` operator.

## 0.0.9

### News

* Support for the `{{ content }}` operator in `{{ for each }}` structures.

## 0.0.8

### News

* Preliminary Windows support.

## 0.0.7

### Bug fixes

* Properly include glob as a dependency.

## 0.0.6

### Bug fixes

* Proper separation of npm dependencies.

## 0.0.5

### News

* Better separation of replacement logic.
* Support for the `{{ link to html }}` operator.

## 0.0.4

### News

* Support for `sort-by` and `sort-order` in the `{{ for each }}` operator.

## 0.0.3

### News

* Better handling of command-line arguments.
* Support for the `{{ for each }}` operator.

## 0.0.2

### News

* Basic functionality including support for templates and placeholders for metadata.

## 0.0.1

### News

* Initial release.