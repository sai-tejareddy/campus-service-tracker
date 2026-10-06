import { describe, expect, it } from "vitest";
import { validateRequestForm } from "./requestRules";

describe("validateRequestForm", () => {
  it("requires useful request details", () => {
    expect(validateRequestForm({ title: "", description: "", category: "" })).toBe("A title is required");
  });

  it("accepts a complete request", () => {
    expect(validateRequestForm({
      title: "Library access",
      description: "Please activate access for my new student card.",
      category: "Library",
    })).toBe("");
  });
});
