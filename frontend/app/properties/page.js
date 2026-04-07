'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../../components/PropertyCard';
import SearchFilters from '../../components/SearchFilters';
import LoadingSpinner from '../../components/LoadingSpinner';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {
        page: searchParams.get('page') || 1,
        limit: 10
      };

      if (searchParams.get('minPrice')) {
        params.minPrice = searchParams.get('minPrice');
      }
      if (searchParams.get('maxPrice')) {
        params.maxPrice = searchParams.get('maxPrice');
      }
      if (searchParams.get('location')) {
        params.location = searchParams.get('location');
      }

      const data = await propertyService.getAll(params);
      setProperties(data.data);
      setPagination({
        page: data.page,
        pages: data.pages,
        total: data.total
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Property Listings</h1>

      <SearchFilters />

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No properties found</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('page', pageNum);
                      window.location.href = `/properties?${params.toString()}`;
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      pagination.page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="large" />}>
      <PropertiesContent />
    </Suspense>
  );
}
