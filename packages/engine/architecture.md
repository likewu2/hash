# The Engine

## The CLI

Parses the simulation files and starts the engine process

## The Engine Process(es)

Runs a single Experiment
An Experiment has one or more Simulation runs

### Simulation

Agent based model doing things

## Components

### Experiment Controller

### Experiment Package

### Worker Pool

#### Worker

##### Language Runner

//! The `worker` module defines the three different language runners for JavaScript, Python, and
//! Rust and the accompanying API for their tasks and communication.
//!
//! The [`runner`] module contains the implementations for the languages and the
//! [communication module](runner::comms). The [`task`] module defines tasks executed in the
//! runners.
