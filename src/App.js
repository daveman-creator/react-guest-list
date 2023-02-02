import './App.css';
import React, { useEffect, useState } from 'react';
import logo from './logo.svg';

export default function App() {
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [refetch, setRefetch] = useState(true);
  // const [isLoading, setIsLoading] = useState(true);
  // const [loader, showLoader, hideLoader] = useLoader();
  // const [isAttending, setIsAttending] = useState(false);
  const baseUrl = 'http://localhost:4000';

  useEffect(() => {
    const getGuests = async () => {
      // showLoader();

      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      // console.log(allGuests);
      setGuests(allGuests);

      // setDisabled(false);
    };

    getGuests().catch((error) => console.log(error));

    // hideLoader();
  }, [refetch]);

  useEffect(() => {
    const getGuestsId = async () => {
      const response = await fetch(`${baseUrl}/guests/:id`);
      const guest = await response.json();

      setGuests(guest);
    };
    // getGuestsId().catch((error) => console.log(error));
  }, []);

  async function postGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: firstName, lastName: lastName }),
    });
    const createdGuest = await response.json();
    return createdGuest;
  }

  async function putGuestId(id, attend) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: attend }),
    });
    const updatedGuest = await response.json();
    return updatedGuest;
  }

  async function removeGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
  }
  // if (isLoading) {
  //   return 'is Loading...';
  // }

  const handleChangeFirstName = (event) => {
    setFirstName(event.currentTarget.value);
  };

  const handleChangeLastName = (event) => {
    setLastName(event.currentTarget.value);
  };

  // const handleChangeIsAttending = (event) => {
  //   setIsAttending(event.currentTarget.checked);
  // };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // const newList = [...guests];
      // newList.push({
      //   firstName: firstName,
      //   lastName: lastName,
      // });
      // setGuests(newList);
      await postGuest();
      setFirstName('');
      setLastName('');
      setRefetch(!refetch);
    }
  };
  console.log(guests);

  return (
    <div>
      <h1>Guest List</h1>
      <br />
      <br />
      <label>
        First name &nbsp;
        <input onChange={handleChangeFirstName} value={firstName} />
      </label>
      <br />
      <label>
        Last name &nbsp;
        <input
          onChange={handleChangeLastName}
          onKeyDown={handleKeyDown}
          value={lastName}
        />
      </label>
      <div data-test-id="guest">
        <button
          className="RemoveButton"
          type="button"
          onClick={() => {
            const newState = [...guests];
            newState.pop();
            setGuests(newState);
          }}
        >
          Remove
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            setGuests([]);
          }}
        >
          Delete &nbsp;
        </button>
      </div>
      <br />
      <h2>Invited Guests</h2>
      <div>
        {guests.map((guest) => {
          return (
            // using prefixes for your ids is good practice
            <div key={`guest-name-${guest.firstName}`}>
              <label>
                <input
                  type="checkbox"
                  checked={guest.attending}
                  // onChange={handleChangeIsAttending}
                  onChange={(event) => {
                    const checked = [...guests];

                    // checked[].guest.first.last = '';
                    guest.attending = event.currentTarget.checked;
                    // update the copy
                    setGuests(checked);
                    putGuestId(guest.id, guest.attending).catch((error) =>
                      console.log(error),
                    );
                  }}
                  // value={isAttending}
                />
              </label>
              {guest.firstName} {guest.lastName}
              {guest.attending === true ? ' is attending' : ' is not attending'}
              <button
                className="RemoveButton"
                type="button"
                onClick={() => {
                  removeGuest(guest.id).catch((error) => console.log(error));
                  setRefetch(!refetch);
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
