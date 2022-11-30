export const Dropdown = ({ label, options, onChange }) => {
  return (
    <div class="m-2">
      <label class="m-3">{label}</label>
      <select onChange={onChange} class="rounded-md text-sky-400 p-1">
        {options.map((opt) => (
          <option value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
