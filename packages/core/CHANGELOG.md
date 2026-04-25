# Changelog

## 0.3.0

### Fixed

- Fix missing type deceleration

### Changed

- Drop the pageIsFull flag in favor of using nextPage
- Improve error for skipped elements

## 0.2.0

### Minor Changes

- 8e2ef6e: add `prefer` option to keepOnSamePage
- c73b65f: add OrderedListPlugin to manage numbered lists across page breaks

## 0.1.0

### Minor Changes

### Changed

- 909306c: Add page is full state check in page overflow handling (#26 (https://github.com/your-repo/pull/26))
- 909306c: Improve skipped elements logic and logging (#25 (https://github.com/your-repo/pull/25))
- 909306c: Accept empty and true as valid value for attributes
- 909306c: Expand plugin hooks with beforePagination

## 0.0.12

### Patch Changes

- 33f727c: update dependencies

## 0.0.11

### Patch Changes

- b4a5711: fix pagination issue in Table and long texts
- b4a5711: - fix section hight calculation
    - refactor `tryAddSection` to use section context instead of page contexts

## 0.0.10

### Patch Changes

- 307425f: fix empty package issue

## 0.0.9

### Patch Changes

- 673b94e: switch to pnpm

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
