import React from 'react';
import { useHistory } from 'react-router-dom';

import styles from './styles.module.scss';

const Room = () => {
  const history = useHistory();

  const handleLeave = () => {
    history.push('/');
  };

  return (
    <div className={styles.container}>
      <h1>Chat Room</h1>

      <div className={styles.guest}>
        <h2>Room Members</h2>
        {/* TODO: Members Videos */}
      </div>

      <div className={styles.me}>
        <h2>My Video</h2>
        {/* TODO: My Video */}
      </div>

      <div className={styles.buttons}>
        {/* TODO: <button>Mute</button> */}
        <button onClick={handleLeave}>Leave Room</button>
      </div>
    </div>
  );
};

export default Room;
