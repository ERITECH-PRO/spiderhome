import { Link } from 'react-router-dom';
import { products } from '../data/products';

const TestNavigation = () => {
  return (
    <div className="pt-20 p-8">
      <h1 className="text-2xl font-bold mb-6">Test de Navigation</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Produits disponibles :</h2>
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-gray-600">Slug: {product.slug}</p>
            <p className="text-sm text-gray-600">ID: {product.id}</p>
            <Link 
              to={`/produits/${product.slug}`}
              className="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Aller à {product.slug}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestNavigation;
