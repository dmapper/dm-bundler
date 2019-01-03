# dm-bundler
> Opinionated scripts and configs to develop a react-native-web project

## Usage

TBD

## Async chunks support

Pass `ASYNC=1` env var when building to enable the asynchronous chunks
support. This will make each node module from `/node_modules/`
and each component from the `/components/` folder to be its own small chunk
loaded asynchronously.

This is useful when you are using dynamic `import()` in your code.

When the `ASYNC=1` is passed, the files with the extension `.async.js`
will take priority over the plain `.js` files. This enables you
to move the asynchronous dynamic `import()` statements into their own files.

Duplicating your dependencies in `.js` and `.async.js` files enables
you to have your codebase running in environments which don't
support the dynamic `import()` yet, for example the react-native Metro builder.

Your production server must have HTTP/2 support, otherwise you'll have a connection
limit of around 6 connection per hostname.
If you use Google Load Balancer and serve your content through HTTPS, then you
already have the HTTP/2 enabled without having to handle HTTP/2 in your Node.js app:

https://cloudplatform.googleblog.com/2015/10/Full-Speed-Ahead-with-HTTP2-on-Google-Cloud-Platform.html

https://ma.ttias.be/view-http-spdy-http2-protocol-google-chrome/

## MIT Licence

Copyright (c) 2018 Pavel Zhukov
