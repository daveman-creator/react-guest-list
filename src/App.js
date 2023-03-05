import './App.css';
import { useEffect, useState } from 'react';

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestAPI, setGuestAPI] = useState([]);
  const [refetch, setRefetch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const baseUrl =
    'https://express-guest-list-api-memory-data-store.daveman-creator';

  // Enter a new guest

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: firstName, lastName: lastName }),
    });
    const createdGuest = await response.json();
    setRefetch(!refetch);
    setFirstName('');
    setLastName('');

    console.log(createdGuest);
  }

  // Update a guest

  async function updateGuest(value, guestId) {
    console.log(value, guestId);
    await fetch(`${baseUrl}/guests/${guestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attending: value }),
    });
    setRefetch(!refetch);
  }

  // Delete a guest

  async function deleteGuest(id) {
    await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuestAPI(allGuests);
  }

  // Delete all guests

  async function deleteAllGuests() {
    for (const guest of guestAPI) {
      await fetch(`${baseUrl}/guests/${guest.id}`, {
        method: 'DELETE',
      });
    }
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuestAPI(allGuests);
  }

  // Show the Guests

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setGuestAPI(allGuests);
      console.log(allGuests);
      setIsLoading(false);
      setIsDisabled(false);
    }

    fetchUsers().catch((error) => console.log(error));
  }, [refetch]);

  // Loading Message

  if (isLoading) {
    return 'Loading...';
  }

  return (
    <div>
      <h1> Guest List</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          name="firstName"
          value={firstName}
          disabled={isDisabled}
          placeholder="Enter first name here"
          onChange={(event) => setFirstName(event.target.value)}
        />
        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          name="lastName"
          value={lastName}
          disabled={isDisabled}
          placeholder="Enter last name here"
          onChange={(event) => setLastName(event.target.value)}
        />
        <p>Press Enter to submit!</p>
        <div>
          <button>Submit</button>
          <button onClick={deleteAllGuests}>Delete all guests</button>
        </div>
      </form>
      <div>
        <h2>Guests</h2>
        {guestAPI.map((guest) => {
          return (
            <div key={`guest-${guest.id}`}>
              <div data-test-id="guest">
                <h3>
                  {guest.firstName} {guest.lastName}
                </h3>
                <input
                  type="checkbox"
                  aria-label="attending"
                  checked={guest.attending}
                  onChange={(event) =>
                    updateGuest(event.currentTarget.checked, guest.id)
                  }
                />
                <button
                  aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                  onClick={() => deleteGuest(guest.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
