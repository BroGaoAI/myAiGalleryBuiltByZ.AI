'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Sparkles, Heart, MessageSquare, Star, Filter, Plus, User, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Artwork = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  prompt: string | null;
  category: string;
  style: string | null;
  author: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  avgRating: number;
  commentCount: number;
  likeCount: number;
  createdAt: Date;
};

type Comment = {
  id: string;
  content: string;
  user: {
    name: string | null;
    avatar: string | null;
  };
  createdAt: Date;
};

export default function AIArtGallery() {
  console.log('AIArtGallery component rendered');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('abstract');
  const [style, setStyle] = useState('realistic');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'generate'>('gallery');

  const handleAddToGallery = () => {
    console.log('添加到画廊按钮被点击');
    setIsDialogOpen(false);
    setActiveTab('gallery');
    // 刷新作品列表
    fetchArtworks();
    console.log('已切换到画廊标签页并刷新作品列表');
  };

  const categories = ['all', 'abstract', 'portrait', 'landscape', 'fantasy', 'sci-fi', 'anime', 'photography'];
  const styles = ['realistic', 'artistic', 'abstract', 'minimalist', 'detailed'];

  useEffect(() => {
    fetchArtworks();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const session = await response.json();
        if (session.user) {
          setIsLoggedIn(true);
          setCurrentUser(session.user);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const fetchArtworks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/artworks');
      if (response.ok) {
        const data = await response.json();
        setArtworks(data);
      }
    } catch (error) {
      console.error('Failed to fetch artworks:', error);
      setArtworks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async (artworkId: string) => {
    try {
      const response = await fetch(`/api/artworks/${artworkId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleLike = async (artworkId: string) => {
    if (!isLoggedIn) {
      alert('请先登录');
      return;
    }
    try {
      const response = await fetch(`/api/artworks/${artworkId}/like`, {
        method: 'POST',
      });
      if (response.ok) {
        setArtworks(artworks.map(art =>
          art.id === artworkId
            ? { ...art, likeCount: art.likeCount + 1 }
            : art
        ));
      }
    } catch (error) {
      console.error('Failed to like artwork:', error);
    }
  };

  const handleComment = async () => {
    if (!isLoggedIn) {
      alert('请先登录');
      return;
    }
    if (!selectedArtwork || !newComment.trim()) return;

    try {
      const response = await fetch(`/api/artworks/${selectedArtwork.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      if (response.ok) {
        const comment = await response.json();
        setComments([...comments, comment]);
        setNewComment('');
        setArtworks(artworks.map(art =>
          art.id === selectedArtwork.id
            ? { ...art, commentCount: art.commentCount + 1 }
            : art
        ));
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleRating = async (rating: number) => {
    if (!isLoggedIn) {
      alert('请先登录');
      return;
    }
    if (!selectedArtwork) return;

    try {
      const response = await fetch(`/api/artworks/${selectedArtwork.id}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: rating }),
      });
      if (response.ok) {
        setUserRating(rating);
        setArtworks(artworks.map(art =>
          art.id === selectedArtwork.id
            ? { ...art, avgRating: rating }
            : art
        ));
      }
    } catch (error) {
      console.error('Failed to rate artwork:', error);
    }
  };

  const generateImage = async () => {
    console.log('generateImage function called');
    if (!prompt.trim()) {
      alert('请输入提示词');
      return;
    }

    console.log('Starting image generation with prompt:', prompt);
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const response = await fetch('/api/generate-volcengine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          category,
          style,
          width: 1024,
          height: 1024
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('生成的作品数据:', data);
        setGeneratedImage(data.data.imageUrl);
        // 不再调用fetchArtworks，因为API已经返回并保存了
        setPrompt('');
        console.log('🎨 图像生成成功！准备添加到画廊');
      } else {
        const error = await response.json();
        alert(`生成失败: ${error.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setUserRating(0);
    fetchComments(artwork.id);
  };

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || artwork.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI 艺术画廊
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback>{currentUser?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">{currentUser?.name}</span>
              </div>
            ) : (
              <Button type="button" variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                登录
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-xl w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索艺术作品..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? '全部' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI 创作生成
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>AI 艺术创作 - 火山引擎 doubao</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">描述你想要创作的艺术作品</label>
                          <Textarea
                            placeholder="例如：星际穿越，黑洞，电影大片，动感，对比色..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            className="resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">类别</label>
                            <Select value={category} onValueChange={setCategory}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.filter(c => c !== 'all').map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">风格</label>
                            <Select value={style} onValueChange={setStyle}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {styles.map(s => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Button
                          type="button"
                          onClick={generateImage}
                          disabled={isGenerating}
                          className="w-full"
                          size="lg"
                        >
                          {isGenerating ? (
                            <>
                              <span className="mr-2">生成中...</span>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              开始创作
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">生成的图像</label>
                        <div className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50 overflow-hidden">
                          {isGenerating ? (
                            <div className="text-center p-6">
                              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                              <p className="text-sm text-muted-foreground">火山引擎 doubao 正在创作中...</p>
                            </div>
                          ) : generatedImage ? (
                            <img
                              src={generatedImage}
                              alt="AI生成的图像"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-6">
                              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                              <p className="text-sm text-muted-foreground">
                                生成的图像将显示在这里
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 添加到画廊按钮 */}
                  {generatedImage && !isGenerating && (
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        type="button"
                        onClick={handleAddToGallery}
                        className="w-full"
                        size="lg"
                        variant="default"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        添加到我的画廊
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'gallery' | 'generate')} className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="gallery">艺术画廊</TabsTrigger>
              <TabsTrigger value="generate">AI 创作</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="space-y-6">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="aspect-square w-full" />
                      <CardHeader>
                        <Skeleton className="h-4 w-3/4" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-3 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredArtworks.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">暂无艺术作品</h3>
                  <p className="text-muted-foreground">开始创建你的第一个AI艺术作品吧！</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredArtworks.map((artwork) => (
                    <Dialog key={artwork.id}>
                      <DialogTrigger asChild>
                        <Card className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                          <div className="relative aspect-square overflow-hidden">
                            <img
                              src={artwork.imageUrl}
                              alt={artwork.title}
                              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-current" />
                                  {artwork.avgRating.toFixed(1)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  {artwork.likeCount}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  {artwork.commentCount}
                                </span>
                              </div>
                            </div>
                          </div>
                          <CardHeader>
                            <h3 className="font-semibold text-lg truncate">{artwork.title}</h3>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={artwork.author.avatar} />
                                <AvatarFallback>{artwork.author.name?.[0] || 'A'}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground truncate">
                                {artwork.author.name}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Badge variant="secondary" className="text-xs">
                              {artwork.category}
                            </Badge>
                            {artwork.style && (
                              <Badge variant="outline" className="text-xs ml-2">
                                {artwork.style}
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="relative aspect-square rounded-lg overflow-hidden">
                            <img
                              src={artwork.imageUrl}
                              alt={artwork.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="space-y-6">
                            <div>
                              <h2 className="text-3xl font-bold mb-2">{artwork.title}</h2>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={artwork.author.avatar} />
                                  <AvatarFallback>{artwork.author.name?.[0] || 'A'}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{artwork.author.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(artwork.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Badge>{artwork.category}</Badge>
                              {artwork.style && <Badge variant="outline">{artwork.style}</Badge>}
                            </div>

                            {artwork.description && (
                              <p className="text-muted-foreground">{artwork.description}</p>
                            )}

                            {artwork.prompt && (
                              <div className="p-4 bg-secondary/50 rounded-lg">
                                <p className="text-sm font-medium mb-1">创作提示词：</p>
                                <p className="text-sm text-muted-foreground italic">"{artwork.prompt}"</p>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleLike(artwork.id)}
                                className="flex-1"
                              >
                                <Heart className="h-4 w-4 mr-2" />
                                喜欢 ({artwork.likeCount})
                              </Button>
                              <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    type="button"
                                    key={star}
                                    onClick={() => handleRating(star)}
                                    className="transition-colors hover:scale-110"
                                  >
                                    <Star
                                      className={`h-6 w-6 ${
                                        star <= userRating ? 'fill-primary text-primary' : 'text-muted-foreground'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg">评论 ({comments.length})</h3>
                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="写下你的评论..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                                  />
                                  <Button type="button" onClick={handleComment} disabled={!newComment.trim()}>
                                    发送
                                  </Button>
                                </div>
                                <ScrollArea className="h-48 pr-4">
                                  <div className="space-y-3">
                                    {comments.length === 0 ? (
                                      <p className="text-center text-muted-foreground text-sm py-4">
                                        还没有评论，来说点什么吧
                                      </p>
                                    ) : (
                                      comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
                                          <Avatar className="h-8 w-8">
                                            <AvatarImage src={comment.user.avatar} />
                                            <AvatarFallback>{comment.user.name?.[0] || 'U'}</AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="font-medium text-sm">{comment.user.name}</span>
                                              <span className="text-xs text-muted-foreground">
                                                {new Date(comment.createdAt).toLocaleString()}
                                              </span>
                                            </div>
                                            <p className="text-sm">{comment.content}</p>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </ScrollArea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="generate" className="space-y-6">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>创建 AI 艺术作品 - 火山引擎 doubao</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">描述你想要创作的艺术作品</label>
                    <Textarea
                      placeholder="例如：星际穿越，黑洞，电影大片，动感，对比色，电影大片，末日既视感..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">类别</label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(c => c !== 'all').map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">风格</label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {styles.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">图像尺寸: 1024 x 1024 (2K高清)</label>
                    <Slider
                      defaultValue={[1024]}
                      max={1024}
                      step={128}
                      disabled
                      className="opacity-50"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={generateImage}
                    disabled={isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <span className="mr-2">生成中...</span>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        开始创作
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">AI 艺术画廊</span>
            </div>
            <p className="text-sm text-muted-foreground">
              用火山引擎 doubao 创意创造无限可能
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
