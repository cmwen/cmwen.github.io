import { createSignal } from "solid-js";

function Counter() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount(count() + 1);

  return (
    <button type="button" onClick={increment} class="rounded-md border border-sky-500 w-24 hover:border-sky-600 shadow-md">
      {count()}
    </button>
  );
}

export default Counter;