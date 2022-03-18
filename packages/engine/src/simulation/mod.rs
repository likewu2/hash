//! TODO: DOC - Module level description, should point to the Sim controller and Package

pub mod agent_control;
pub mod command;
pub mod comms;
pub mod controller;
pub mod engine;
pub mod enum_dispatch;
mod error;
pub mod package;
pub mod status;
pub mod step_output;
pub mod step_result;
pub mod task;

pub use self::error::{Error, Result};

// TODO: UNUSED: Needs triage
pub struct SimulationRunState {}
