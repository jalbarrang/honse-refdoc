import { describe, expect, it } from "vitest";
import { isEditableTarget, isSearchShortcut } from "./search-shortcuts";

const keyboardEvent = (overrides: Partial<KeyboardEvent> = {}): KeyboardEvent =>
  ({
    key: "x",
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    ...overrides,
  }) as KeyboardEvent;

describe("search shortcuts", () => {
  it("recognizes slash, Control+K, and Command+K", () => {
    expect(isSearchShortcut(keyboardEvent({ key: "/" }))).toBe(true);
    expect(isSearchShortcut(keyboardEvent({ key: "k", ctrlKey: true }))).toBe(true);
    expect(isSearchShortcut(keyboardEvent({ key: "K", metaKey: true }))).toBe(true);
  });

  it("rejects unrelated or modified shortcuts", () => {
    expect(isSearchShortcut(keyboardEvent())).toBe(false);
    expect(isSearchShortcut(keyboardEvent({ key: "/", altKey: true }))).toBe(false);
    expect(isSearchShortcut(keyboardEvent({ key: "k", ctrlKey: true, shiftKey: true }))).toBe(
      false,
    );
  });

  it("identifies form controls and editable content", () => {
    expect(isEditableTarget({ tagName: "INPUT" } as unknown as EventTarget)).toBe(true);
    expect(isEditableTarget({ tagName: "TEXTAREA" } as unknown as EventTarget)).toBe(true);
    expect(isEditableTarget({ isContentEditable: true } as unknown as EventTarget)).toBe(true);
    expect(isEditableTarget({ tagName: "BUTTON" } as unknown as EventTarget)).toBe(false);
  });
});
