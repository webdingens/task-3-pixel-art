# Task Result

## Used technologies / Frameworks

I use the following technologies / frameworks in my project:

- React
- Vite
- Tailwind
- (S)CSS Modules
- CSS Custom Properties
- Canvas API
- classnames
- Gif JS

I chose React because the app required dynamic updates of color values and at least three states for color, image data and grid size.

Vite was chosen for the fast compile times and HMR.

Started out by adding tailwind for the container. I'd remove it now, but would have to import a new css reset, and the css file is really small.

(S)CSS Modules were used to organize the style and handle the custom properties.

CSS Custom Properties are used to reflect the current state of the color select and the current color value of a pixel.

The Canvas API was used to generate data Urls for the images. GIF was not supported by Chrome or Firefox and needed an extra library called `gif.js`. Dynamic imports were tried but TypeScript wasn't happy with it. `gif.js` is now being directly imported from the start, which makes sense, since current Chrome doesn't have support for it.

## Points for improvement

- Performance: mouse events are dropped if moved too fast. Right now the app is keyboard accessible. Fast solutions might not be accessible and would need a switch. I'd start by setting `pointer-events: none;` on the pixels and move the input handlers to the wrapping div, then apply the same handler as for touchMove, mapping the current touch/pointer position to the image.
- Remove tailwind: depending on the surrounding project I'd either remove tailwind or scss modules, probably tailwind.
- Low priority: load `gif.js` with dynamic imports.
- Add image output size. Currently the images are rather tiny.

## Used 3rd Party Libraries

I use the following 3rd party libraries in my project: (if none, remove the table and explain why)

Name | Reason
--- | ---
[React Icons](https://react-icons.github.io/react-icons/) | For the paintbucket icon.
[Tailwind](https://tailwindcss.com/) | For CSS reset and container.
[classnames](https://www.npmjs.com/package/classnames) | For easily defining composite classNames.
[gif.js](https://www.npmjs.com/package/gif.js) | Using gif.js to provide gif encoding capabilities

## Installation / Run

Tested with the following requirements:

- [nodejs](https://nodejs.org/en/) v16.16.0 (vite requirements: ^14.18.0 || >=16.0.0)
- [npm](https://docs.npmjs.com/cli/v8/configuring-npm/install?v=true) v8.11.0

To run the project locally, enter the following in the command line / bash:

```console
$ git clone <linktorepository>
$ cd <repositoryname>
$ npm install
$ npm run dev
```
---