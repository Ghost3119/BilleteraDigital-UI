import { RouterProvider } from 'react-router-dom';
import router from './router';

/**
 * App is a pure router shell.
 * All layout, state, and UI lives inside the route tree.
 */
export default function App() {
  return <RouterProvider router={router} />;
}
