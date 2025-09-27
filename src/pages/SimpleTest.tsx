import { Link } from 'react-router-dom';

const SimpleTest = () => {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-2xl font-bold mb-6">Test Simple de Navigation</h1>
      
      <div className="space-y-4">
        <p>Testez ces liens :</p>
        
        <div className="space-y-2">
          <Link 
            to="/produits/interface-signalisation-wifi"
            className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Interface Signalisation Wi-Fi
          </Link>
          
          <Link 
            to="/produits/transformateur-courant-400a"
            className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Transformateur Courant 400A
          </Link>
          
          <Link 
            to="/produits/hub-central-spiderhome"
            className="block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Hub Central SpiderHome
          </Link>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-gray-600">
            Si ces liens ne fonctionnent pas, le problème vient du routage React Router.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;
