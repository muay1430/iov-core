# IOV-Core

[![Build Status](https://travis-ci.com/iov-one/iov-core.svg?token=evC2AgcwxuvHjXeBP3jq&branch=master)](https://travis-ci.com/iov-one/iov-core)

This repo is provides core functionality to all clients in a cross-platform typescript library.
This can be used to build cli/gui clients, automated scripts, or help build bcp-proxy apps.

Main functionality provided:

* Solid crypto library with HD support for ed25519 (following SLIP-0010, ledger compatible)
* Secure private key management, including encrypted local storage for both browser and node
* Generic, type-safe adaptor to read/write on tendermint rpc server (with http/s and ws/s support)
* Adaptor to query / create transactions for IOV's testnet of the BNS blockchain
* Adaptor for key management using IOV's BNS ledger app
* High level controller for managing multiple user profiles and various key material
* High level controller for managing read/write connections to multiple blockchains (CoreWriter)
* Integration with REPL environment for quick prototyping for developers

This is still in pre-alpha state and will evolve quickly as we add support for multiple blockchains,
more transactions types, and better extensibility. However, all attempts have been made that the
foundational code is quite solid. A security audit and stable release will occur along with the
timeline of IOV's mainnet launch, but developers looking for client-side libraries can do initial
prototypes with the current state.

We are actively building out multiple clients on top of this library and shaking out usability
issues in the API.

## Compatibility

The compiled code from this package, which is published on npm, should work on any modern (2018)
browser, and node 8+. The development environment has been tested on node 8.7.0 LTS and node 10.x.

**Yarn not Npm** Please `npm install -g yarn` and use `yarn install`, `yarn build`, etc.
Developers you installed with `npm i` have reported problems in compiling, so wipe out `node_modules`
and enjoy `yarn`.

CI Tests:

* Linux: node 8, chrome
* OSX: node 8, chrome, firefox, safari
* (Hope to add windows + edge ci tests in the future)

**Windows note:** The development tools *definitely* work under windows in "Linux subsystem for windows"
bash shell. They most likely work under cygwin as well. But they do rely on minor shell scripting.

## Gettting Started

The best way to learn about code is to use it.
You can read some [examples in @iov/core](./packages/iov-core/README.md).
And you can use a REPL to [interactively try the code](./packages/iov-cli/README.md).

Once you understand the basics, you can dig in deeper with the API documentation.

## Api Docs

Documentation is published at [https://iov-one.github.io/iov-core-docs/](https://iov-one.github.io/iov-core-docs/).

To build the documentation locally, run `yarn install && yarn build && yarn docs`
in this repository. This will generate a `./docs` directory in each package that you
can browse locally to see API docs on the various packages.

## License

This repository is licensed under the Apache License 2.0 (see NOTICE and LICENSE).
