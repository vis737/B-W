import { Link } from 'react-router-dom';

export const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="px-6 py-3 bg-black text-white rounded">
        Return to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
