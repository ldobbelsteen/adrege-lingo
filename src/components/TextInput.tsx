import { Button } from "./Button";
import { innerShadow } from "./Lingo";

export function TextInput(props: {
  input: string;
  setInput: (input: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={props.input}
      placeholder={props.placeholder}
      onChange={(ev) => {
        props.setInput(ev.target.value);
      }}
      className="shadow text-donkerderrood rounded p-2 m-2"
      style={{ boxShadow: innerShadow }}
    />
  );
}

export function TextInputWithSubmitButton(props: {
  input: string;
  setInput: (input: string) => void;
  placeholder?: string;
  submitButtonText: string;
  onSubmit: () => void;
}) {
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        props.onSubmit();
      }}
    >
      <TextInput
        input={props.input}
        setInput={props.setInput}
        placeholder={props.placeholder}
      />
      <Button onClick={props.onSubmit}>{props.submitButtonText}</Button>
    </form>
  );
}
