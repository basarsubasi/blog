export const translations = {
  en: {
    // Header
    blog: 'blog',
    create: 'create',
    theme: 'theme',
    language: 'language',
    
    // Footer
    sourceCode: 'source code',
    
    // Auth
    enterApiKey: 'Enter API Key',
    apiKey: 'API Key',
    authenticate: 'Authenticate',
    authenticationFailed: 'Authentication failed',
    
    // Blog list
    readMore: 'Read more',
    noPosts: 'No posts yet',
    
    // Single post
    writtenBy: 'written by',
    edit: 'Edit',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this post?',
    
    // Create/Edit post
    createPost: 'Create Blog Post',
    editPost: 'Edit Blog Post',
    title: 'Title',
    author: 'Author',
    category: 'Category',
    tags: 'Tags',
    selectTags: 'Select tags...',
    datePosted: 'Date Posted',
    content: 'Content',
    save: 'Save',
    cancel: 'Cancel',
    creating: 'Creating...',
    saving: 'Saving...',
    
    // Messages
    postCreated: 'Post created successfully!',
    postUpdated: 'Post updated successfully!',
    postDeleted: 'Post deleted successfully!',
    error: 'An error occurred',
  },
  tr: {
    // Header
    blog: 'blog',
    create: 'oluştur',
    theme: 'tema',
    language: 'dil',
    
    // Footer
    sourceCode: 'kaynak kodu',
    
    // Auth
    enterApiKey: 'API Anahtarını Girin',
    apiKey: 'API Anahtarı',
    authenticate: 'Kimlik Doğrula',
    authenticationFailed: 'Kimlik doğrulama başarısız',
    
    // Blog list
    readMore: 'Devamını oku',
    noPosts: 'Henüz yazı yok',
    
    // Single post
    writtenBy: 'yazan',
    edit: 'Düzenle',
    delete: 'Sil',
    confirmDelete: 'Bu yazıyı silmek istediğinizden emin misiniz?',
    
    // Create/Edit post
    createPost: 'Blog Yazısı Oluştur',
    editPost: 'Blog Yazısını Düzenle',
    title: 'Başlık',
    author: 'Yazar',
    category: 'Kategori',
    tags: 'Etiketler',
    selectTags: 'Etiket seçin...',
    datePosted: 'Yayın Tarihi',
    content: 'İçerik',
    save: 'Kaydet',
    cancel: 'İptal',
    creating: 'Oluşturuluyor...',
    saving: 'Kaydediliyor...',
    
    // Messages
    postCreated: 'Yazı başarıyla oluşturuldu!',
    postUpdated: 'Yazı başarıyla güncellendi!',
    postDeleted: 'Yazı başarıyla silindi!',
    error: 'Bir hata oluştu',
  },
};

export type Language = 'en' | 'tr';

export function getBrowserLanguage(): Language {
  const lang = navigator.language.toLowerCase();
  return lang.startsWith('tr') ? 'tr' : 'en';
}
