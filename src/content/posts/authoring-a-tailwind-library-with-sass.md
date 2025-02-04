---
title: Authoring a Tailwind library with Sass
description: The pain of authoring Tailwind V4 libraries and the surprising solution.
publishedAt: 2025-02-04
updatedAt: 2024-02-04
visibility: public
---

## Introduction

Yes, you've read the title correctly, but before we dive into the _what_, let's take discuss the _why_.
It all started on the 22nd of January 2025: Tailwinds first major release in over 4 years: [Tailwind V4](https://tailwindcss.com/blog/tailwindcss-v4).

Before you continue reading this blog, I highly recommend reading the Tailwind V4 blog linked above, it provides critical context about the changes that inspired me to write this blogpost. But for those who dislike reading or merely need a refresher, the TL;DR is: Tailwind V4 moves from a JavaScript based config to a CSS based config. And although many agree that this is a much "cleaner" solution to configure Tailwind, it does introduce a pretty major problem: _Authoring Tailwind plugins_.

## What are Tailwind plugins?

Before we can talk about Tailwind plugins, we should first determine what they exactly are, although some might have consumed some official tailwind plugins (like `@tailwincss/typography` or `@tailwindcss/forms`), barely anyone (that I personally know) authors their own plugins.

Tailwind plugins are JavaScript modules that change or extend the behaviour of Tailwind. Let's take this plugin for example:

```js
import plugin from "tailwindcss/plugin";

const myPlugin = plugin(({ addUtilities }) => {
  addUtilities({
    ".my-utility": {
        "background": "blue";
    }
  });
});

export default {
  plugins: [myPlugin],
};
```

This plugin would add the `my-utility` utility class, which would apply a `background` of `blue` to the element. This was a pretty neat way to use JavaScript to author Tailwind plugins.

The project I spend my most time on: [Skeleton](https://github.com/skeletonlabs/skeleton) took advantage of this and used [various JavaScript loops](https://github.com/skeletonlabs/skeleton/blob/dev/packages/plugin/src/tailwind/colors.ts#L9) to create a large amount of utility classes in a maintainable manner.

## The Problem

So what's the problem? Well, like I previously said, Tailwind V4 moves to a CSS based configuration, and while the JavaScript based configuration is still supported using the `@config` rule, Tailwind is clearly moving in a direction where these are considered legacy and likely won't be supported forever. My guess is they will be completely removed in the next major version (Tailwind V5). This poses a serious problem for Skeleton, and likely many other projects. CSS unlike JavaScript, doesn't have any control flow logic like loops or if statements, which makes for a signifcant challenge in authoring maintainable plugins. We were left with two choices:

- **A**: Create our own `plugin` function and compile step that compiles JavaScript to a CSS stylesheet.
- **B**: Manually write out all our CSS variables and maintain them by hand.

After trying out both solutions, we discovered that they both have significant downsides, let's discuss these solutions:

### Proposed Solution A: Compiling JS to CSS

Not only would solution A mean that we'd have to maintain our own version of the `plugin` module. We'd also need a way to handle Hot Reload during development, which is always tricky to do when you add extra build steps to any library. Although we gave it a honest shot, we never felt that it was the "right" solution for the given problem.

### Proposed Solution B: Manually maintaining utilities

Solution B wasn't great either, although we didn't need an additional build step, we would need to write out and maintain a _very large_ amount of classes by hand, we can calculate how many by doing the following math: In our theme system alone, we had 7 colors, each color requiring 9 shades (50-950). So that'd be 7 x 9 = 63, and mind you, this is _only_ the colors in our theme, this is only a small amount of the total amount of classes we would have to write. This made it clear to use that this definitely wasn't something we would want to maintain by hand.

## The (surprising) Solution C

Now there is one more solution we never really discussed but looked interesting to me personally: using a CSS preprocessor. CSS preprocessors are usually a way for CSS authors to write a different, usually more concise, form of CSS and compile it to valid CSS in some sort of build/compile step. Popular preprocessors you might of heard of are: [Sass](https://sass-lang.com/), [Less](http://lesscss.org/) and [Stylus](https://stylus-lang.com/).

Now because Stylus used a non standard CSS notation (pythonic identation) and Less, being not so familiar with, I decided to try my luck with Sass. Because Sass has two major ways to write CSS: Sass synax or SCSS syntax, I decided to go with SCSS because it aligns more with our goal, which is to stick to the native platform as much as we can. This way the barier for entry in terms of contributions is also much lower, because you're essentially writing CSS with extra syntactic sugar.

Note: Just because I chose SCSS doesn't make the other options any less valid, as long as these preprocessors compile to native CSS, you can use any option you like.

So I created my first `.scss` file, and converted our color pairings code from JavaScript to SCSS, and the results were pretty awesome:

```scss
$colors: (primary, secondary, tertiary, success, warning, error, surface);
$shades: (50, 100, 200, 300, 400);

@theme {
  @each $color in $colors {
    @each $shade in $shades {
      $contrasting-shade: 1000 - $shade;
      --color-#{$color}-#{$shade}-#{$contrasting-shade}: light-dark(
        var(--color-#{$color}-#{$shade}),
        var(--color-#{$color}-#{$contrasting-shade})
      );
      --color-#{$color}-#{$contrasting-shade}-#{$shade}: light-dark(
        var(--color-#{$color}-#{$contrasting-shade}),
        var(--color-#{$color}-#{$shade})
      );
    }
  }
}
```

This is now _all_ that's needed to generate all 63 CSS custom properties.

One additionl benefit to this approach is Vite, which is our build tool. Vite by default supports major preprocesors like Sass. This means that all we had to do is change the `.css` extension to `.scss` to get our library to build. On top of that, Vite has a build in `--watch` flag to allow us to have Hot Reload which is a signficant improvement in our Developer Experience.

## Conclusion

Although funny in a certain way, the Skeleton team and I feel that using Sass for our Tailwind plugin is the best way to move forward, it just works extremely well for this specific use case.
The reason I wanted to write this blogpost is to share the possibilities of Sass for other people that are in the same boat as us and need to convert their V3 Tailwind plugin to the new CSS only format.

I really hope you enjoyed this read and most importantly, learned something from it.
