/**
 * Sets `state.valid = false` if `step()` returns wrong value
 */
const behavior = (state, context) => {
  state.step += 1;

  if (state.step !== context.step()) {
    state.valid = false;
  }
};
