import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../../utils/supabase/info';
import { LoadingOverlay } from '../ui/LoadingOverlay';
import { getSupabaseClient } from '../../utils/supabase/client';

interface AddBlogPostFormProps {
  post?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const BLOG_CATEGORIES = [
  'Buying Guides',
  'Design Inspiration',
  'Care & Maintenance',
  'Interior Trends',
  'Room Styling',
  'Product Spotlight',
];

export default function AddBlogPostForm({ post, onSuccess, onCancel }: AddBlogPostFormProps) {
  const isEditMode = !!post;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAccessToken = async () => {
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    readTime: '',
    date: new Date().toISOString().split('T')[0],
    author: 'Vivere In Style',
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        image: post.image || '',
        category: post.category || '',
        readTime: post.readTime || '',
        date: post.date || new Date().toISOString().split('T')[0],
        author: post.author || 'Vivere In Style',
      });
    }
  }, [post]);

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData({ ...formData, title, slug });
  };

  const estimateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      toast.error('Please fill in title, content, and category');
      return;
    }

    try {
      setIsSubmitting(true);

      const postData = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        readTime: formData.readTime || estimateReadTime(formData.content),
      };

      const url = isEditMode
        ? `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/blogs/${post.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/blogs`;

      const token = await getAccessToken();
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        toast.success(isEditMode ? 'Blog post updated!' : 'Blog post published!');
        onSuccess();
      } else {
        toast.error(`Failed to ${isEditMode ? 'update' : 'publish'} blog post`);
      }
    } catch (error) {
      toast.error(`An error occurred while ${isEditMode ? 'updating' : 'publishing'} the post`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && (
        <LoadingOverlay message={isEditMode ? 'Updating post...' : 'Publishing post...'} />
      )}

      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl mb-2">{isEditMode ? 'Edit Blog Post' : 'New Blog Post'}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isEditMode ? 'Update your blog post' : 'Write and publish a new article'}
              </p>
            </div>
            <Button variant="ghost" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Slug */}
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
              <h2 className="text-xl mb-6 text-gray-900 dark:text-gray-100">Post Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 mb-2 block">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., How to Choose the Perfect Sofa"
                    className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug" className="text-gray-700 dark:text-gray-300 mb-2 block">
                    URL Slug
                    <span className="text-xs text-gray-500 ml-2 font-normal">(auto-generated)</span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="how-to-choose-the-perfect-sofa"
                    className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-gray-700 dark:text-gray-300 mb-2 block">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select category</option>
                      {BLOG_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="date" className="text-gray-700 dark:text-gray-300 mb-2 block">
                      Publish Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image" className="text-gray-700 dark:text-gray-300 mb-2 block">
                    Cover Image URL
                  </Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                  {formData.image && (
                    <div className="mt-3 aspect-[16/9] max-w-sm rounded-lg overflow-hidden">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
              <h2 className="text-xl mb-4 text-gray-900 dark:text-gray-100">Excerpt</h2>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A brief summary that appears on the blog listing page..."
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white"
              />
            </div>

            {/* Content */}
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-gray-900 dark:text-gray-100">
                  Content <span className="text-red-500">*</span>
                </h2>
                <span className="text-sm text-gray-500">
                  Use **bold** for headings, - for bullet lists
                </span>
              </div>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog post content here...&#10;&#10;Use **bold text** for section headings.&#10;Use - for bullet list items.&#10;Separate paragraphs with blank lines."
                rows={16}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white font-mono text-sm leading-relaxed"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Estimated read time: {estimateReadTime(formData.content)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="border-gray-300 dark:border-zinc-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 min-w-[150px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                    <span>{isEditMode ? 'Updating...' : 'Publishing...'}</span>
                  </div>
                ) : (
                  isEditMode ? 'Update Post' : 'Publish Post'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
