# CozyLife temperature sensor plugin for Homebridge

This is a [CozyLife](http://cozylife.app) plugin for [Homebridge](https://homebridge.io) with a [custom API client](#api) created using reverse engineering.

## Supported Devices

Currently, it only works with the WiFi version of the [Temperature & Humidity sensor](https://www.aliexpress.com/item/1005006398885795.html) (ID: `s1AxFq`).

<img src="https://github.com/iam-medvedev/homebridge-cozylife-temperature-sensor/blob/main/readme-assets/1.jpg?raw=true" width="200" />

## API

This package utilizes [OpenAPI](https://www.openapis.org/), [openapi-typescript](https://openapi-ts.pages.dev/), and [openapi-fetch](https://openapi-ts.pages.dev/openapi-fetch/) to interact with the CozyLife API.

## Usage

```sh
$ npm install homebridge-cozylife-temperature-sensor

# or

$ yarn add homebridge-cozylife-temperature-sensor
```

Use your login/password from [CozyLife App](http://cozylife.app) in the plugin settings.
