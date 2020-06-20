# Fuzzy New File (fnf)

CLI to create file/folder with fuzzy-file matching autocomplete.

## Installation

**Note**: The CLI requires Node v10 or above.

```bash
npm install -g fuzzy-new-file
```

## Usage

```bash
> fnf --help
fnf

Create file/folder with fuzzy-file matching autocomplete.

Options:
  --version        Show version number                                 [boolean]
  --help           Show help                                           [boolean]
  --root           Root folder where autocomplete will list its subdirectories
                               [default: "<your-current-working-directory>"]
  --no-ignore-vcs  Show search results from files and directories that would
                   otherwise be ignored by '.gitignore' files   [default: false]
```

```bash
> cd dummy-folder # cd to the folder where you want to create file/folder inside

> fnf
? Parent directory (Use arrow keys or type to search)
  bar
❯ foo
  random
  random/pictures
? Parent directory foo
? Target path (end the path with '/' to create a folder):
foo/ baz/a.js
File created: foo/baz/a.js

❯ fnf
? Parent directory (Use arrow keys or type to search)
   bar
  foo
  random
  foo/baz
❯ random/pictures
? Parent directory random/pictures
? Target path (end the path with '/' to create a folder):
random/pictures/ mini-pictures/nested-mini-pictures/
Folder created: random/pictures/mini-pictures/nested-mini-pictures/
```