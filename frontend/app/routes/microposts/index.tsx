import { useState, useEffect } from "react";

export function meta() {
  return [
    { title: "Feed | Sample App" },
    { name: "description", content: "Your feed on the Sample App" },
  ];
}

interface Micropost {
  id: number;
  content: string;
  user_id: number;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
  image_url?: string;
}

export default function MicropostIndex() {
  const [microposts, setMicroposts] = useState<Micropost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("/logged_in_status.json");
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.logged_in);
        }
      } catch (err) {
        console.error("ログイン状態の確認に失敗しました", err);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchMicroposts = async () => {
      try {
        const response = await fetch(`/feed.json?page=${page}`);
        if (!response.ok) {
          throw new Error("Failed to fetch feed");
        }
        
        const data = await response.json();
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setMicroposts(prev => (page === 1 ? data : [...prev, ...data]));
        }
      } catch (err) {
        setError("フィードの取得に失敗しました");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMicroposts();
  }, [page, isLoggedIn]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/microposts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        setMicroposts(prev => prev.filter(post => post.id !== id));
      } else {
        throw new Error("Failed to delete micropost");
      }
    } catch (error) {
      console.error("削除エラー:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="jumbotron">
        <h1>Welcome to the Sample App</h1>
        <p>
          This is the home page for the
          <a href="https://railstutorial.jp/">Ruby on Rails Tutorial</a>
          sample application.
        </p>
        <a href="/signup" className="btn btn-lg btn-primary">Sign up now!</a>
      </div>
    );
  }

  if (loading && microposts.length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="row">
      <div className="col-md-8">
        <h3>Micropost Feed</h3>
        {microposts.length > 0 ? (
          <ol className="microposts">
            {microposts.map(micropost => (
              <li key={micropost.id} className="micropost">
                <span className="user">
                  <a href={`/users/${micropost.user.id}`}>
                    {micropost.user.name}
                  </a>
                </span>
                <span className="content">
                  {micropost.content}
                  {micropost.image_url && (
                    <img src={micropost.image_url} alt="Micropost image" />
                  )}
                </span>
                <span className="timestamp">
                  Posted {new Date(micropost.created_at).toLocaleString()}
                  {/* 現在のユーザーの投稿のみ削除ボタンを表示 */}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(micropost.id);
                    }}
                    className="delete-link"
                  >
                    delete
                  </a>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p>No microposts in your feed.</p>
        )}
        
        {hasMore && (
          <div className="text-center">
            <button 
              className="btn btn-primary" 
              onClick={loadMore} 
              disabled={loading}
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
      <div className="col-md-4">
        <a href="/microposts/new" className="btn btn-lg btn-primary">New Micropost</a>
      </div>
    </div>
  );
} 