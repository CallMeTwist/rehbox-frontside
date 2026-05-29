import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hero from "@/features/auth/components/public/Hero";

const renderHero = () => render(<Hero />, { wrapper: MemoryRouter });

describe("Hero", () => {
  it("renders the headline including the gradient phrase", () => {
    renderHero();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Recover with/i);
    expect(screen.getByText(/at home\./i)).toBeInTheDocument();
  });

  it("renders both CTAs pointing to the correct routes", () => {
    renderHero();
    expect(screen.getByRole("link", { name: /I'm a Patient/i })).toHaveAttribute("href", "/register/client");
    expect(screen.getByRole("link", { name: /I'm a Physiotherapist/i })).toHaveAttribute("href", "/register/physio");
  });

  it("renders the three capability pills (replacing the old stat row)", () => {
    renderHero();
    // Scope to the <li> pills so the matcher isn't ambiguous with the subhead copy.
    expect(screen.getByText(/Real-time AI tracking/i, { selector: "li" })).toBeInTheDocument();
    expect(screen.getByText(/Certified physiotherapists/i, { selector: "li" })).toBeInTheDocument();
    expect(screen.getByText(/Recover from home/i, { selector: "li" })).toBeInTheDocument();
    expect(screen.queryByText(/Recovery Rate/i)).not.toBeInTheDocument();
  });

  it("renders the athlete image with a meaningful alt", () => {
    renderHero();
    expect(screen.getByAltText(/pose-?tracking|athlete/i)).toBeInTheDocument();
  });
});
