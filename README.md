[![Build Status](https://jenkins.paz.ienza.tech/buildStatus/icon?job=Blog+Server%2Fmain)](https://jenkins.paz.ienza.tech/job/Blog%20Server/job/main/)

# Blog Server

This project was generated with Cargo and developed in rust.

Looks for local mongodb instance running under the mongo dns name. Will connect to this database and create / retrieve entries in the blog table as well as handle the upload of up to 5 images, saving the local images to the directory specified in args[1].

## Development server

Running ```cargo run``` will set up a development version of the system based off of the configurations in [Rocket.toml](Rocket.toml)

## Running unit tests

Running ```cargo test``` will run any tests in the test dir
