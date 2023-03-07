// App.js contains the startup component of the application.

import React, {useState} from 'react';

// Import our components. See the components directory
import Login from "./login";
import Welcome from "./welcome";

const App = () => {
    const [user, setUser] = useState(null);

    // Conditionally show either the welcome component or the login component.
    if (!user) {
        // Pass the setUser function as a prop to the child component, so it can set the logged-in user state.
        return <Login setUser={setUser}/>
    }
    else {
        // Pass the currently logged-in user information to the Welcome component
        return <Welcome user={user}/>
    }
};

export default App;