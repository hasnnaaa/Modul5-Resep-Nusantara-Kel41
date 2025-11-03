// src/components/common/FavoriteButton.jsx
import { Heart, Loader } from 'lucide-react';
import { useIsFavorited } from '../../hooks/useFavorites';

/**
 * FavoriteButton Component
 * Versi ini sudah di-update untuk menggunakan API hooks (useIsFavorited)
 * bukan localStorage.
 */
export default function FavoriteButton({ recipeId, size = 'md' }) {
  // Gunakan hook yang benar, yang terhubung ke API
  const { isFavorited, loading, toggleFavorite } = useIsFavorited(recipeId);

  // Size variants
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleToggle = async (e) => {
    e.stopPropagation(); // Mencegah card di-klik
    if (loading) return; // Jangan lakukan apa-apa jika sedang loading
    
    // Panggil fungsi toggleFavorite dari hook,
    // ini akan otomatis mengirim request ke API
    await toggleFavorite();
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading} // Matikan tombol saat API request berjalan
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center gap-1.5
        transition-all duration-200 
        ${isFavorited 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-white/90 hover:bg-white text-slate-700 hover:text-red-500'
        }
        backdrop-blur-sm shadow-md hover:shadow-lg
        disabled:opacity-70 disabled:cursor-wait
        group
      `}
      title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
    >
      {/* Tampilkan loader saat API request berjalan */}
      {loading ? (
        <Loader className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <Heart 
          className={`
            ${iconSizes[size]} 
            transition-all duration-200
            ${isFavorited ? 'fill-current' : ''}
          `} 
        />
      )}
    </button>
  );
}