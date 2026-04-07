import Link from 'next/link';
import Image from 'next/image';

export default function PropertyCard({ property }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Link href={`/properties/${property._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <div className="relative h-48 bg-gray-200">
          {property.image ? (
            <Image
              src={property.image}
              alt={property.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {property.title}
          </h3>

          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {property.description}
          </p>

          <div className="flex justify-between items-center mt-3">
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </span>
            <span className="text-sm text-gray-500 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {property.location}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
