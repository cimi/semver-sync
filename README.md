
Synchronizes version numbers accross `package.json`, `component.json` and other source files of your choosing.

Usage: **`semver-sync -s [source list] -b [release type]`**.

Options:
  
* `-b, --bump`  
   Bump the version number in package.json, component.json and all other specified source files. It can take one of the following values: `major`, `minor`, `patch`. If no value is specified, it defaults to `patch`.
* `-v, --verify`  
   Verifies that package.json, component.json and all other source files have the same version number and checks if it conforms to the semver specification.
* `-s, --sources`  
  Declare additional files in which the version number will be updated or checked. If not explicitly specified, it is read from the package.json "versionedSources" property. If it's not present in the package.json and not explicitly specified, only component.json and package.json will be synced.


Examples:

TODO.
