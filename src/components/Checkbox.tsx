export function Checkbox(props: {
  checked: boolean;
  setChecked: (checked: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      checked={props.checked}
      onChange={() => {
        props.setChecked(!props.checked);
      }}
      className="w-6 h-6 p-2 m-2"
    />
  );
}
