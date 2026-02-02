const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const city = document.getElementById("city");
const region = document.getElementById("region");
const coord = document.getElementById("coords");
const card = document.getElementById("card");

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

  render();
}

function render() {
  if (state.status === "idle") {
    city.textContent = "Enter a City";
    region.textContent = "";
    coord.textContent = "";
  }

  if (state.status === "loading") {
    city.textContent = "Loading";
    region.textContent = "";
    coord.textContent = "";
  }

  if (state.status === "success") {
    city.textContent = "" + state.data;
    region.textContent = "";
    coord.textContent = "";
  }

  if (state.status === "error") {
    city.textContent = state.error;
    region.textContent = "";
    coord.textContent = "";
  }
}

function fakeRequest(value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value.trim() === "") reject("City Cannot Be Empty");
      else resolve(value);
    }, 800);
  });
}

async function search() {
  const nextId = state.requestId + 1;

  setState({ status: "loading", data: null, error: null, requestId: nextId });
  const myId = nextId;

  try {
    const result = await fakeRequest(searchInput.value);

    if (state.requestId !== myId) return;

    setState({ status: "success", data: result, error: null });
  } catch (err) {
    if (state.requestId !== myId) return;

    setState({ status: "error", data: null, error: err });
  }
}

searchBtn.addEventListener("click", search);
render();
