'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { propertyService } from '../../../../services/propertyService';
import { useAuth } from '../../../../context/AuthContext';
import PropertyForm from '../../../../components/PropertyForm';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchProperty = async () => {
      try {
        const data = await propertyService.getById(id);
        const fetchedProperty = data.data;

        // Check ownership
        if (user && fetchedProperty.createdBy._id !== user.id) {
          toast.error('You are not authorized to edit this property');
          router.push('/properties');
          return;
        }

        setProperty(fetchedProperty);
      } catch (error) {
        toast.error('Property not found');
        router.push('/properties');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProperty();
    }
  }, [id, user, isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!property || !isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <PropertyForm initialData={property} isEdit={true} />
    </div>
  );
}
