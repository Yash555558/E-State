'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { propertyService } from '../../../services/propertyService';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertyService.getById(id);
        setProperty(data.data);
      } catch (error) {
        toast.error('Property not found');
        router.push('/properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await propertyService.delete(id);
      toast.success('Property deleted successfully');
      router.push('/properties');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const isOwner = user && property.createdBy && user.id === property.createdBy._id;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image */}
        <div className="relative h-96 bg-gray-200">
          {property.image ? (
            <Image
              src={property.image}
              alt={property.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-6">
            <svg
              className="w-5 h-5 mr-2"
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
            <span className="text-lg">{property.location}</span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {property.createdBy && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Listed by</h3>
              <p className="text-gray-700">{property.createdBy.name}</p>
              <p className="text-gray-600">{property.createdBy.email}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => window.location.href = `mailto:${property.createdBy?.email}`}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Contact Owner
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => router.push(`/properties/${id}/edit`)}
                  className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
