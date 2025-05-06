# lellowatthepark

## Getting Started
Development for this project is a bit tricky at first, but it really is quite fun once you get used to it.

### Install dependencies
The project uses `yarn` as the package manager. Installing dependencies is as simple as:
1. Installing `node` with `corepack` (should be packaged together with `node`)
   1. See their [downloads page](https://nodejs.org/en/download)
2. Enabling `corepack`
  ```
  corepack enable
  ```
3. Installing dependencies
  ```
  yarn install
  ```

### Development
Fire up the development server with `yarn dev`. This will run the build (which ensure the JSON data files necessary to load the app exist) and then launch the app via `vite`, which automatically opens an internet browser with the web app loaded. This uses hot module reloading, so as you make/save file changes, you will see them immediately reflected in the browser.

The data which drives the programs is found within the `programs` directory. Here, each JSON file is a different program which can be played. To make a new program, follow the pattern found in one of the existing programs. There is a verification step within the build which checks that each program is defined correctly in order to continue with the build. This ensures that the app will be playable.

The main file for executing the program is `src/script.ts`, which will perform the imports needed to render the project.


## Build
Running the build is as simple as `yarn build`. This will:
1. Run the Gulpfile (which encodes the JSON files within the `programs` directory)
2. Run the build via `vite`
