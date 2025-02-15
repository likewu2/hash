use crate::{
    hash_types::worker::RunnerError,
    proto::SimulationShortId,
    simulation::{agent_control::AgentControl, step_output::SimulationStepOutput},
};

pub struct SimulationStepResult {
    // TODO: UNUSED: Needs triage
    pub sim_id: SimulationShortId,
    pub output: SimulationStepOutput,
    // TODO: UNUSED: Needs triage
    pub errors: Vec<RunnerError>,
    // TODO: UNUSED: Needs triage
    pub warnings: Vec<RunnerError>,
    pub agent_control: AgentControl,
}
