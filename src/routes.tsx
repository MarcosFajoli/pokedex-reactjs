import { Routes, Route } from 'react-router-dom';
import { Home, Error404 } from './pages';

const AppRouter = () => (
    <Routes>
        <Route path="/pokedex-reactjs/*" element={<Error404 />} />
        <Route path='/pokedex-reactjs' element={<Home />} />
    </Routes>
);

export default AppRouter;