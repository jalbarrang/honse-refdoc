interface SearchShortcutEvent {
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || typeof target !== "object") return false;
  if (typeof Element !== "undefined" && target instanceof Element) {
    if (target.closest("dialog:not([open])")) return false;
  }

  const element = target as EventTarget & {
    isContentEditable?: boolean;
    tagName?: string;
  };

  return (
    element.isContentEditable === true ||
    element.tagName === "INPUT" ||
    element.tagName === "SELECT" ||
    element.tagName === "TEXTAREA"
  );
}

export function isSearchShortcut(event: SearchShortcutEvent): boolean {
  if (event.altKey) return false;

  const commandK =
    (event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === "k";
  const slash = !event.ctrlKey && !event.metaKey && event.key === "/";
  return commandK || slash;
}
