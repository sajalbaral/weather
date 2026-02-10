import { getForecast } from "./api.js";
import { render } from "./ui.js";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

const state = {
  status: "idle",
  data: null,
  error: null,
  requestId: 0,
};

function setState(obj) {
  if (obj.status !== undefined) state.status = obj.status;
  if (obj.data !== undefined) state.data = obj.data;
  if (obj.error !== undefined) state.error = obj.error;
  if (obj.requestId !== undefined) state.requestId = obj.requestId;

  render(state);
}

async function search() {
  const nextId = state.requestId + 1;

  setState({ status: "loading", data: null, error: null, requestId: nextId });

  const myId = nextId;

  try {
    const result = await getForecast(searchInput.value);
    if (state.requestId !== myId) return;
    setState({
      status: "success",
      data: result,
      error: null,
    });
  } catch (err) {
    if (state.requestId !== myId) return;
    setState({ status: "error", data: null, error: err });
  }
}

searchBtn.addEventListener("click", search);
render(state);
