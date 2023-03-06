# Backend Problem

Welcome Candidate! The following problem will test your backend skill and help
us assessing you as a future employee.

## Overview
Your goal is to create a service for posting and getting data from a database.
Every insertion to the database should be performed only after the data has been
validated. If the data isn't valid then the service should return an error message.

You are allowed to use any languages/tools you would like however you must explain
your choices. For example why have you picked one language over another and how
did you make the decision to use a specific library out of vast selection out there.

## Data
The database should contain a list of sites and their metadata. Each site should
contain a configuration data and historical data. Below you will find a list of
all the fields that should be present in the database. The scheme provided is only
for example so if you would like to change it, please do.

### Sites and Metadata
This data basically never changes, once a site is created it is extremely unlikely
that any of these properties will change.
```json
{
    "sites": [
        {
            "name": "Willo Woods",
            "location": "north",
            "id": 1
        }
    ]
}
```

Validation:
* `vendor` - can either be `Tesla` or `KATL`
* `capacity_kwh`, `max_power_kw` - cannot be negative
* `units` - cannot be negative


### Configuration
The configuration can change however not often. The interval of the changes is
somewhere between half and five years.
```json
{
    "id": 1,
    "battery": {
        "vendor": "Tesla",
        "capacity_kwh": 3100,
        "max_power_kw": 400,
    },
    "production": {
        "pv": {
            "units": 1,
            "kwp": 500,
        },
        "bio": {
            "units": 0,
        },
        "cro": {
            "units": 2,
            "kwp": 800,
        },
    }
}
```

Validation:
* `vendor` - can either be `Tesla` or `KATL`
* `capacity_kwh`, `max_power_kw` - cannot be negative
* `units` - cannot be negative

### Live Data
This data is updated every ten minutes.
```json
    "dt-stamp": [
        "2023-01-01 00:00:00",
        "2023-01-01 00:10:00",
        "2023-01-01 00:20:00"
    ],
    "soc": [
        0,
        10,
        20
    ],
    "load_kwh": [
        350,
        600,
        500
    ],
    "net_load_kwh": [
        400,
        700,
        600
    ],
    "pv_notification": [
        true,
        true,
        true
    ],
    "bio_notification": [
        false,
        false,
        false
    ],
    "cro_notification": [
        false,
        false,
        false
    ],
```
Validation:
* `soc` - A number between 0 and 100
* `notification` - boolean
* `*_kwh` - cannot be negative

## Endpoints
Please provide appropriate get and post endpoints for creating new sites, pushing
configuration and live changes, and getting information.
For the get requests create an endpoint for the configuration data, and another
one for the latest live data entry.

## Cloud Architecture
Imagine that one day this service will have to be scaled to handle millions of interrupts
per day. Please explain how you would expand this system and how you would create it
in a cloud architecture. Additionally provide a diagram visualizing your architecture.

This section is theoretical only and does not require code.

## Submitting
Please clone this repository, and submit your changes through a pull request.

Good luck!

