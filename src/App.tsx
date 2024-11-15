import React, { useState } from "react";
import styles from "./App.module.scss";

const App = () => {
  const [counter, setCounter] = useState(0);
  return (
    <div className={styles.app}>
      {counter}

      <button onClick={() => setCounter((prev) => prev + 1)}>+</button>
    </div>
  );
};

export default App;
