import React, { useState } from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import NewEventForm from "@/app/components/events/NewEventForm";

// Mocks
vi.mock("@/app/events/new/server_actions/upload_photo", () => ({
  uploadPhoto: vi.fn(() => Promise.resolve("https://mocked-photo.url/photo.jpg")),
}));

vi.mock("@/app/events/new/server_actions/create_new_event", () => ({
  createEvent: vi.fn(() => Promise.resolve({ id: 42 })),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/app/components/loading_overlay", () => ({
  default: () => <div data-testid="mock-loading">Loading...</div>,
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@heroui/select", () => {
  return {
    Select: ({ children, onSelectionChange, selectedKeys }) => {
      const [selected, setSelected] = useState(new Set(selectedKeys));

      const toggle = (value) => {
        const newSelected = new Set(selected);
        if (newSelected.has(value)) {
          newSelected.delete(value);
        } else {
          newSelected.add(value);
        }
        setSelected(newSelected);
        if (onSelectionChange) {
          onSelectionChange(newSelected);
        }
      };

      return (
        <div data-testid="mock-hero-select">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: () => toggle(child.key),
              "aria-selected": selected.has(child.key),
            })
          )}
        </div>
      );
    },
    SelectItem: ({ children, ...props }) => (
      <div {...props} role="option">
        {children}
      </div>
    ),
  };
});

const eventTypes = [
  { id: 1, type: "Concert" },
  { id: 2, type: "Sport" },
];

const user = {
  id: 1,
  first_name: "Jean",
  last_name: "Dupont",
  photo: "",
  nb_like: 0,
  created_at: new Date(),
  updated_at: new Date(),
  user: {
    id: 1,
    email: "jean@mail.com",
    is_planner: true,
    account_id: "acc_123",
  },
};

it("soumet un événement avec succès", async () => {
  render(<NewEventForm eventTypes={eventTypes} user={user} />);

  fireEvent.change(screen.getByLabelText(/titre/i), { target: { value: "Super concert" } });
  fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "Description test" } });
  fireEvent.change(screen.getByLabelText(/places/i), { target: { value: 100 } });
  fireEvent.change(screen.getByLabelText(/prix/i), { target: { value: 50 } });
  fireEvent.change(screen.getByLabelText(/date de l'événement/i), { target: { value: "2025-12-25" } });
  fireEvent.change(screen.getByLabelText(/clôture des billets/i), { target: { value: "2025-12-20" } });
  fireEvent.change(screen.getByPlaceholderText(/numéro/i), { target: { value: "123" } });
  fireEvent.change(screen.getByPlaceholderText(/rue/i), { target: { value: "Rue de la Paix" } });
  fireEvent.change(screen.getByPlaceholderText(/ville/i), { target: { value: "Paris" } });
  fireEvent.change(screen.getByPlaceholderText(/code postal/i), { target: { value: "75001" } });
  fireEvent.change(screen.getByPlaceholderText(/pays/i), { target: { value: "France" } });

  fireEvent.click(screen.getByText("Concert"));

  fireEvent.click(screen.getByRole("button", { name: /ajouter/i }));

  await waitFor(() => {
    expect(screen.queryByText(/erreur/i)).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith("/events/42");
  });
});
