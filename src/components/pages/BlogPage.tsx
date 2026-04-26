import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Helmet } from 'react-helmet';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { DEFAULT_BLOG_POSTS, type BlogPost } from '../../data/defaultBlogPosts';

interface BlogPageProps {
  onNavigate?: (page: string) => void;
}

export function BlogPage({ onNavigate }: BlogPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>(DEFAULT_BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/blogs`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.posts && data.posts.length > 0) {
            setPosts(data.posts);
          }
        }
      } catch (error) {
        // Fallback to default posts
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const allCategories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  const handleBack = () => {
    if (selectedPost) {
      setSelectedPost(null);
    } else {
      onNavigate?.('home');
    }
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Helmet>
          <title>{selectedPost.title} - Vivere In Style Blog</title>
          <meta name="description" content={selectedPost.excerpt} />
          <meta property="og:title" content={selectedPost.title} />
          <meta property="og:description" content={selectedPost.excerpt} />
          <meta property="og:image" content={selectedPost.image} />
          <meta property="og:type" content="article" />
          <link rel="canonical" href={`https://www.vivereinstyle.com/blogs/${selectedPost.slug}`} />
        </Helmet>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          <div className="mb-8">
            <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full mb-4">
              {selectedPost.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 dark:text-white mb-4 leading-tight">
              {selectedPost.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(selectedPost.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selectedPost.readTime}
              </span>
            </div>
          </div>

          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10">
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {selectedPost.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <h2 key={i} className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">{paragraph.replace(/\*\*/g, '')}</h2>;
              }
              if (paragraph.startsWith('**')) {
                const parts = paragraph.split('**');
                return (
                  <div key={i} className="mb-4">
                    {parts.map((part, j) =>
                      j % 2 === 1
                        ? <strong key={j} className="text-gray-900 dark:text-white">{part}</strong>
                        : <span key={j} className="text-gray-700 dark:text-gray-300">{part}</span>
                    )}
                  </div>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={i} className="list-disc list-inside space-y-1 mb-4 text-gray-700 dark:text-gray-300">
                    {paragraph.split('\n').map((item, j) => (
                      <li key={j}>{item.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{paragraph}</p>;
            })}
          </div>

          {/* More Posts */}
          <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">More Articles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {posts.filter(p => p.id !== selectedPost.id).slice(0, 2).map(post => (
                <button
                  key={post.id}
                  onClick={() => { setSelectedPost(post); window.scrollTo(0, 0); }}
                  className="group text-left"
                >
                  <div className="aspect-[16/9] rounded-xl overflow-hidden mb-3">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{post.category}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:underline mt-1 line-clamp-2">{post.title}</h3>
                </button>
              ))}
            </div>
          </div>
        </article>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Helmet>
        <title>Blog - Vivere In Style | Furniture & Interior Design Tips</title>
        <meta name="description" content="Explore furniture buying guides, interior design inspiration, and home styling tips from Vivere In Style. Expert advice for creating your dream Australian home." />
        <link rel="canonical" href="https://www.vivereinstyle.com/blogs" />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-700 text-white py-16 sm:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate?.('home')}
            className="text-white hover:text-white hover:bg-white/20 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4">
              Style & Living Blog
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Design inspiration, buying guides, and expert tips to help you create the home you love.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allCategories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => { setSelectedPost(filteredPosts[0]); window.scrollTo(0, 0); }}
              className="group w-full grid md:grid-cols-2 gap-6 md:gap-10 text-left"
            >
              <div className="aspect-[16/9] md:aspect-auto md:h-full rounded-2xl overflow-hidden">
                <img
                  src={filteredPosts[0].image}
                  alt={filteredPosts[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full mb-4 w-fit">
                  {filteredPosts[0].category}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 dark:text-white mb-4 group-hover:underline leading-tight">
                  {filteredPosts[0].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(filteredPosts[0].date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {filteredPosts[0].readTime}
                  </span>
                </div>
              </div>
            </motion.button>
          </div>
        </section>
      )}

      {/* Post Grid */}
      {filteredPosts.length > 1 && (
        <section className="pb-16 sm:pb-20">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
            >
              {filteredPosts.slice(1).map(post => (
                <motion.button
                  key={post.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  onClick={() => { setSelectedPost(post); window.scrollTo(0, 0); }}
                  className="group text-left"
                >
                  <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <span className="inline-block px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full mb-2">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:underline line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                    <span>{new Date(post.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>{post.readTime}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {filteredPosts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No articles found in this category.</p>
        </div>
      )}

    </div>
  );
}
