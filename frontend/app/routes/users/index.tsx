import { useState, useEffect } from "react";

export function meta() {
  return [
    { title: "All users | Sample App" },
    { name: "description", content: "All users of the Sample App" },
  ];
}

interface User {
  id: number;
  name: string;
  email: string;
  admin: boolean;
  created_at: string;
  updated_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/users.json?page=${page}`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        
        const data = await response.json();
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setUsers(prev => (page === 1 ? data : [...prev, ...data]));
        }
      } catch (err) {
        setError("ユーザー一覧の取得に失敗しました");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && page === 1) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h1>All users</h1>
      
      <ul className="users">
        {users.map(user => (
          <li key={user.id}>
            <a href={`/users/${user.id}`}>
              {/* ここではユーザーアイコンの代わりに名前を表示 */}
              {user.name}
            </a>
            {user.admin && <span className="badge">admin</span>}
          </li>
        ))}
      </ul>
      
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
  );
} 