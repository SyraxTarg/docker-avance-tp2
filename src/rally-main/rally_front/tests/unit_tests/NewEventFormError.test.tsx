import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { vi } from 'vitest';
import NewEventForm from '@/app/components/events/NewEventForm';
import { createEvent } from '@/app/events/new/server_actions/create_new_event';

// Arrange
// mocks des imports (server actions, dependances, ...)
vi.mock('@/app/events/new/server_actions/upload_photo', () => ({
  uploadPhoto: vi.fn(() => Promise.resolve('https://mocked-photo.url/photo.jpg'))
}));

vi.mock('@/app/events/new/server_actions/create_new_event', () => ({
  createEvent: vi.fn(), // ici on mocke, mais on override dans le test
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

vi.mock('@/app/components/loading_overlay', () => ({
  default: () => <div data-testid="mock-loading">Loading...</div>
}));


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
    account_id: "acc_123"
  }
};

describe('<NewEventForm />', () => {
  it('affiche une erreur de validation', async () => {
    render(<NewEventForm eventTypes={eventTypes} user={user} />);

    fireEvent.change(screen.getByLabelText(/titre/i), { target: { value: 'Super concert' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Description test' } });

    fireEvent.change(screen.getByLabelText(/places/i), { target: { value: -1 } });

    fireEvent.change(screen.getByLabelText(/prix/i), { target: { value: 50 } });
    fireEvent.change(screen.getByLabelText(/date de l'événement/i), { target: { value: '2025-12-25' } });
    fireEvent.change(screen.getByLabelText(/clôture des billets/i), { target: { value: '2025-12-20' } });

    fireEvent.click(screen.getByRole('button', { name: /Ajouter/i }));

    await waitFor(() => {
      expect(screen.getByText(/Erreur/i)).toBeInTheDocument();
    });
  });
});
