---
title: Pagefind with Vite
description: How to use Pagefind with Vite and overcoming the issues it creates.
publishedAt: 2024-02-05
updatedAt: 2024-04-16
image: ./pagefind-with-vite.svg
---

## Introduction

In this article I will talk about my experience with integrating [Pagefind](https://pagefind.app/) into a [Vite](https://vitejs.dev/) based project. I will talk about why I needed Pagefind, why it was difficult to implement with Vite and how I ended up solving it.
(Spoiler alert: I wrote a plugin)

## What is Pagefind?

Pagefind is a library used to add search to a website, quote from the creators of Pagefind:

> Pagefind is a fully static search library that aims to perform well on large sites, while using as little of your users’ bandwidth as possible, and without hosting any infrastructure.

Like it states above, Pagefind is a "static" search library, this means it can analyse static content and create a searchable index from that content. This content can be any form of text: HTML, JSON, plaintext, etc.

## Why Pagefind?

Unlike [Algolia](https://www.algolia.com/), [Elastic](https://www.elastic.co/) or other server side search solutions, Pagefind requires zero server side communication and is completely static meaning all the "hard work" is done during build time instead of runtime like it's competitors, this makes it an excellent choice for a performant documentation search solution for static websites.

Here are some examples of large scale websites that have been indexed by Pagefind:

-   [MDN Web Docs](https://mdn.pagefind.app/)
-   [Godot Docs](https://godot.pagefind.app/)

## So, what's the problem?

Up until now everything sounds pretty much ideal, you have a client side search solution that doesn't hog up your bandwidth and is performant on large scale, what's there to complain about?

Enter Vite.

Vite is in general an awesome and widely loved (including me) tool to develop and bundle your apps with, it's extremely peformant and optimized compared to it's competitors.

It's also great at deciding what code should be bundled, what code will not work and **what code is not present at build time**, here is where the problems start to arise (yes there are multiple).

### Problem 1: Dynamically importing Pagefind

An awesome native ESM feature is the [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import), these allow you to import a module dynamically during runtime instead of being required to be present during build. This is perfect for our use case since pagefind cannot be present at build time because it will run when the build has finished.
Dynamically importing pagefind looks like this:

```ts
const pagefind = await import("/pagefind/pagefind.js");
```

Vite, however, tries to scan for the `/pagefind/pagefind.js` file during build and cannot find it (because it doesn't exist yet), this produces the following error:

```txt
[vite]: Rollup failed to resolve import "/pagefind/pagefind.js"
```

Luckily [Rollup](https://rollupjs.org/), the bundler behind Vite, has thought of and solved this problem by allowing you, the developer, to mark dependenies as "external" which does quote:

> Either a function that takes an id and returns true (external) or false (not external), or an Array of module IDs, or regular expressions to match module IDs, that should remain external to the bundle.

This means we can solve the first problem by marking the module as "external" like so inside your `vite.config.[ts|js]`:

```ts
import { defineConfig } from "vite";

export default defineConfig({
	// ...
	build: {
		rollupOptions: {
			external: ["/pagefind/pagefind.js"],
		},
	},
});
```

And just like that we solved the first problem!

### Problem 2: Ensuring Pagefind is present during development

Because we, the developer, spend most time in the dev server we want to make sure Pagefind atleast stays out of our way let alone function properly during development. This, however, is more easily said than done. Because Pagefind runs after our app has been built we obviously won't have Pagefind during development, sadly, this is not something Vite takes lightly and you will probably be met with the following error:

```txt
[plugin:vite:import-analysis] Failed to resolve import "/pagefind/pagefind.js" from "...". Does the file exist?
```

After attempting a million times to supress the error I still wasn't able to tell Vite to ignore it because it simply wouldn't run my dev server without the file being present, and although supressing the error might sound like a good idea, in practise it wouldn't solve everything either because it would prevent you from testing your search feature too. This left me with only one choice: Ensure Pagefind is present during development.

In order to get Pagefind to index successfuly you need to feed it a build folder containing HTML files, this means we _have_ to build our app before we can develop it, this may sound strange but it isn't all that crazy of an idea. So to fix Pagefind not being present during development we have to go through a series of steps:

1. Build our app
2. Run Pagefind on our build output
3. Copy the Pagefind bundle to our `public` folder (this is where static assets live)
4. Start the development server

Because building your app _everytime_ before you run the development server takes _way_ too long you typically want to only do it once and just leave the pagefind bundle as is for the next time you want to start the development server.

So there you have it, problem 2, Solved!

### Problem 3: Importing static assets

Since we've now ensured that Pagefind is present during development you'd think we can finally start developing right? Wrong! Vite is still not quite satisfied. This is because Pagefind is a static bundle that needs to be left "as is", so we logically place it inside our `public` folder (or whatever folder you keep your static assets in). This sadly causes Vite to once again complain and prompt us with the following error:

```txt
Internal server error: Cannot import non-asset file /pagefind/pagefind.js which is inside /public.
```

The full reasoning on why this isn't possible isn't exactly clear to me but Vite by default won't allow it. Luckily once again Vite does have a `assetInclude` option that can solve our problem.

The `assetInclude` option does two specific things, one of them is quote:

> Specify additional picomatch patterns to be treated as static assets so that importing them from JS will return their resolved URL string.

This means that we can actually tell Vite to allow importing pagefind from the static folder by once again editing your `vite.config.[ts|js]` like so:

```ts
import { defineConfig } from "vite";

export default defineConfig({
	// ...
	build: {
		rollupOptions: {
			external: ["/pagefind/pagefind.js"],
		},
	},
	assetsInclude: "**/pagefind.js",
});
```

Once this is set we solved the third problem and can finally start developing with Pagefind!

## Vite plugin

You might have realized during the process of solving the problem that there were quite a few steps neccesary to get Pagefind to function properly, this can become tedious to do and is especially time consuming.

This is where the Vite plugin comes in.

Vite plugins are an awesome way to automate and extend Vite, in a nutshell they are pieces of code that can listen to [different lifecycle hooks](https://vitejs.dev/guide/api-plugin.html#universal-hooks) and execute code. Combining the knowledge about Pagefind and Vite we've obtained above I created a plugin that handles this all for you: `vite-plugin-pagefind`.

`vite-plugin-pagefind` is a plugin specifically made to solve the problems above in any Vite based project, this means it will:

1. Ensure Pagefind is present during development
2. Ensure Pagefind is marked as external during development and build
3. Ensure Pagefind is marked as an included asset.

You can learn more about it and how to use it at: https://github.com/Hugos68/vite-plugin-pagefind

If you end up using it and/or have any questions about it be sure to let me know!

That'll be all from me, hope you enjoyed this read, and most importantly, learned something from it.