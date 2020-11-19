import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setRoomInfo } from '../room/roomSlice';

import styles from './styles.module.scss';

const Landing = () => {
  const [channel, setChannel] = useState('');
  const [appId, setAppId] = useState('');
  const [token, setToken] = useState('');
  const [showHint, setShowHint] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();

    if (!channel || !appId || !token) {
      setShowHint(true);
    }

    console.log(`Channel: ${channel}, AppId: ${appId}, Token: ${token}`);
    dispatch(
      setRoomInfo({
        appId,
        token,
        channel,
      })
    );
    // TODO: Redirect to Room
  };

  return (
    <div className={styles.container}>
      <h1>Join a channel</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>App Id:</span>
          <input
            type="text"
            value={appId}
            onChange={e => setAppId(e.target.value)}
          />
        </label>

        <label>
          <span>Token:</span>
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
          />
        </label>

        <label>
          <span>Channel:</span>
          <input
            type="text"
            value={channel}
            onChange={e => setChannel(e.target.value)}
          />
        </label>

        {showHint && <p className={styles.hint}>Please enter all inputs</p>}

        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};

export default Landing;
