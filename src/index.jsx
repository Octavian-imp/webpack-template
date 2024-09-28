import "@/index.scss";

import React from "react";
import { render } from "react-dom";

const App = () => {
  const [index, setIndex] = React.useState(0);

  return <div>index {index}</div>;
};

render(<App />, document.getElementById("root"));
