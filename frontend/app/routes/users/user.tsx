import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export function meta() {
  return [
    { title: "User profile | Sample App" },
    { name: "description", content: "User profile on the Sample App" },
  ];
}

interface User {
  id: number;
  name: string;
  email: string;
  microposts_count: number;
  following_count: number;
  followers_count: number;
}

interface Micropost {
  id: number;
  content: string;
  user_id: number;
  created_at: string;
  user: {
    name: string;
  };
  image_url?: string;
}

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [microposts, setMicroposts] = useState<Micropost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        
        const data = await response.json();
        setUser(data);
        setFollowing(data.following); // ログインユーザーがこのユーザーをフォローしているか
      } catch (err) {
        setError("ユーザー情報の取得に失敗しました");
        console.error(err);
      }
    };

    const fetchMicroposts = async () => {
      try {
        const response = await fetch(`/api/users/${id}/microposts?page=${page}`);
        if (!response.ok) {
          throw new Error("Failed to fetch microposts");
        }
        
        const data = await response.json();
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setMicroposts(prev => (page === 1 ? data : [...prev, ...data]));
        }
      } catch (err) {
        setError("投稿の取得に失敗しました");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchMicroposts();
  }, [id, page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleFollow = async () => {
    try {
      const method = following ? "DELETE" : "POST";
      const response = await fetch(`/api/relationships`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followed_id: id
        }),
      });
      
      if (response.ok) {
        setFollowing(!following);
        // ユーザー情報を更新してフォロワー数を反映
        const userResponse = await fetch(`/api/users/${id}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
      } else {
        throw new Error("Failed to update follow status");
      }
    } catch (error) {
      console.error("フォロー更新エラー:", error);
    }
  };

  if (loading && !user) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!user) {
    return <div className="alert alert-warning">User not found</div>;
  }

  return (
    <div>
      <div className="row">
        <aside className="col-md-4">
          <section className="user_info">
            <h1>{user.name}</h1>
          </section>
          <section className="stats">
            <div className="stat">
              <a href={`/users/${id}/following`}>
                <strong className="stat-count">{user.following_count}</strong>
                <span>following</span>
              </a>
            </div>
            <div className="stat">
              <a href={`/users/${id}/followers`}>
                <strong className="stat-count">{user.followers_count}</strong>
                <span>followers</span>
              </a>
            </div>
          </section>
          <div className="follow-form">
            <button 
              className={`btn ${following ? "btn-danger" : "btn-primary"}`}
              onClick={handleFollow}
            >
              {following ? "Unfollow" : "Follow"}
            </button>
          </div>
        </aside>
        <div className="col-md-8">
          <h3>Microposts ({user.microposts_count})</h3>
          {microposts.length > 0 ? (
            <ol className="microposts">
              {microposts.map(micropost => (
                <li key={micropost.id} className="micropost">
                  <span className="user">
                    <a href={`/users/${micropost.user_id}`}>
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
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p>No microposts yet.</p>
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
      </div>
    </div>
  );
} 