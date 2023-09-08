import { Routes, Route } from 'react-router-dom';
import { Home, Error404 } from './pages';

const AppRouter = () => (
    <Routes>
        <Route path="*" element={<Error404 />} />
        <Route path='/' element={<Home />} />
    </Routes>
);

export default AppRouter;