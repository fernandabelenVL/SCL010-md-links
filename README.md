# fv-md-links

## Install

`npm install --save fv-md-links`

### Usage


##### CLI (Command Line Interface)


`md-links <path> [options]`



##### Read Markdown(.md) file


```
const fv-md-links = requiere('fv-md-links')

$ md-links example.md

file: .some/example.md
href: http://www.example.com
text: this is an example
```

##### Option: validate [--validate] [-v]

```
const fv-md-links = requiere('fv-md-links')

$ md-links example.md --validate

file: .some/example.md
href: http://www.example.com
text: this is an example
statusCode: 200
status: OK
```

##### Option: stats [--stats] [-s]

```
const md-links-naap = requiere('md-links-naap')

$ md-links example.md --stats

Total Links: 1
Uniques Links: 1
```


##### Opition: validate y stats

```
const fv-md-links = requiere('fv-md-links')

$ md-links example.md --validate --stats

Total Links:1
Ok Links: 1
Broken Links: 0
```