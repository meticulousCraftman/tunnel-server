# WoT Tunnel Server

This is simple TCP Tunnel server for accessing Web of Things devices behind a NAT router.
This standalone solution is useful where you don't have a gateway that can be deployed at each physical location.

## Setup

Install all deps

```console
$ yarn install
```

## Running

```console
$ node index.js
```

Now point your WoT device to this server and access the device from anywhere in the world.

# Still a couple of things left before this can be used

- Arduino Library
- Place to host this
