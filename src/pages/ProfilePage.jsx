// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { User, Edit, Save, Loader, Camera, X, Clock, ChefHat, Star } from 'lucide-react';
import userService from '../services/userService';
import { useFavorites } from '../hooks/useFavorites';

export default function ProfilePage({ onRecipeClick }) {
  // State untuk Profile
  const [profile, setProfile] = useState({
    username: 'Pengguna',
    bio: '',
    avatar: null,
    userId: '',
  });
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [loading, setLoading] = useState(false);

  // State untuk Favorit
  const { favorites, loading: favLoading, error: favError, refetch: refetchFavorites } = useFavorites();

  // Load profile from localStorage on mount
  useEffect(() => {
    const userProfile = userService.getUserProfile();
    setProfile(userProfile);
  }, []);

  const handleUpdateUsername = () => {
    if (!profile.username.trim()) {
      alert('Username tidak boleh kosong');
      return;
    }
    setLoading(true);
    const result = userService.updateUsername(profile.username);
    if (result.success) {
      setProfile(result.data);
      setIsEditingUsername(false);
    } else {
      alert('Gagal menyimpan username');
    }
    setLoading(false);
  };

  const handleUpdateBio = () => {
    setLoading(true);
    const result = userService.updateBio(profile.bio);
    if (result.success) {
      setProfile(result.data);
      setIsEditingBio(false);
    } else {
      alert('Gagal menyimpan bio');
    }
    setLoading(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const result = userService.updateAvatar(base64String);
        if (result.success) {
          setProfile(result.data);
          alert('Avatar berhasil diupdate!');
        } else {
          alert('Gagal mengupload avatar');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveAvatar = () => {
    const result = userService.updateAvatar(null);
    if (result.success) {
      setProfile(result.data);
      alert('Avatar berhasil dihapus');
    }
  };

  // Fungsi untuk menangani klik pada resep favorit
  const handleRecipeClick = (recipeId, category) => {
    if (onRecipeClick) {
      onRecipeClick(recipeId, category);
      setTimeout(() => refetchFavorites(), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 text-center mb-10">
          Profile Pengguna
        </h1>
        
        {/* --- KARTU PROFILE --- */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40">
          
          {/* Flex container for Avatar + Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            
            {/* Left: Avatar Section */}
            <div className="flex-shrink-0">
              <div className="relative group w-32 h-32 md:w-40 md:h-40 rounded-full">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center shadow-lg">
                    <User className="w-16 h-16 md:w-20 md:h-20 text-blue-500" />
                  </div>
                )}
                
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute inset-0 w-full h-full rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-8 h-8" />
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/png, image/jpeg"
                  onChange={handleAvatarChange}
                />
                
                {profile.avatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                    title="Hapus avatar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Right: Info Section (Username + Bio) */}
            <div className="flex-1 w-full">
              {/* Username Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                {isEditingUsername ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      maxLength={50}
                    />
                    <button
                      onClick={handleUpdateUsername}
                      disabled={loading}
                      className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingUsername(false);
                        setProfile(userService.getUserProfile()); // Revert changes
                      }}
                      className="p-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <p className="text-lg text-slate-800 font-medium">{profile.username}</p>
                    <button
                      onClick={() => setIsEditingUsername(true)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Bio Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bio
                </label>
                {isEditingBio ? (
                  <div className="space-y-2">
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                      maxLength={150}
                      placeholder="Ceritakan sedikit tentang dirimu..."
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">
                        {profile.bio.length} / 150
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateBio}
                          disabled={loading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                          Simpan Bio
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingBio(false);
                            setProfile(userService.getUserProfile()); // Revert changes
                          }}
                          className="p-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between p-4 bg-slate-50 rounded-xl min-h-[100px]">
                    <p className="text-slate-700 italic whitespace-pre-wrap">
                      {profile.bio || 'Belum ada bio.'}
                    </p>
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full flex-shrink-0"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
        {/* --- AKHIR KARTU PROFILE --- */}


        {/* --- BAGIAN RESEP FAVORIT --- */}
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-8">
            Resep Favoritku
          </h2>

          {/* Loading State */}
          {favLoading && (
            <div className="text-center py-12">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Memuat resep favorit...</p>
            </div>
          )}

          {/* Error State */}
          {favError && (
            <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-semibold mb-2">Terjadi Kesalahan</p>
              <p className="text-red-500">{favError}</p>
            </div>
          )}

          {/* Empty State */}
          {!favLoading && !favError && favorites.length === 0 && (
            <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40">
              <p className="text-gray-600 text-lg">
                Kamu belum punya resep favorit
              </p>
              <p className="text-gray-500 mt-2">
                Coba tambahkan beberapa resep!
              </p>
            </div>
          )}

          {/* Favorites Grid */}
          {!favLoading && !favError && favorites.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {favorites.map((recipe) => (
                <div 
                  key={recipe.id}
                  onClick={() => handleRecipeClick(recipe.id, recipe.category)}
                  className="group relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg shadow-blue-500/5 hover:shadow-blue-500/15 transition-all duration-500 cursor-pointer group-hover:scale-105 group-hover:bg-white/20"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={recipe.image_url} 
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                  <div className="relative z-10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${
                        recipe.category === 'minuman' 
                        ? 'text-green-700 bg-green-100/90' 
                        : 'text-blue-700 bg-blue-100/90'
                      }`}>
                        {recipe.category}
                      </span>
                      {recipe.average_rating > 0 && (
                        <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold text-slate-700">{recipe.average_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 mb-3 text-lg group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <div className="flex items-center space-x-2 bg-white/70 px-3 py-2 rounded-full">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{recipe.prep_time} menit</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/70 px-3 py-2 rounded-full">
                        <ChefHat className="w-4 h-4" />
                        <span className="font-medium capitalize">{recipe.difficulty}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* --- AKHIR BAGIAN RESEP FAVORIT --- */}

      </main>
    </div>
  );
}