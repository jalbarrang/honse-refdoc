export interface SearchTriggerProps {
  label?: string;
  shortcut?: string;
  onOpen?: () => void;
}

export function SearchTrigger(props: SearchTriggerProps) {
  const label = () => props.label ?? "Search field guide";

  return (
    <button
      class="search-trigger"
      type="button"
      aria-label={label()}
      onClick={() => props.onOpen?.()}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
      <span>{label()}</span>
      <kbd>{props.shortcut ?? "/"}</kbd>
    </button>
  );
}
