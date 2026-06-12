"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState<any[]>([]);
  const [pinterestConnected, setPinterestConnected] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/auth");

    // 检查Pinterest连接状态
    checkPinterestStatus(token);

    // 显示消息
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success) setMessage(success);
    if (error) setMessage(error);
  }, [router, searchParams]);

  const checkPinterestStatus = async (token: string | null) => {
    if (!token) return;
    try {
      const res = await fetch("/api/pinterest/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPinterestConnected(data.connected);
    } catch (error) {
      console.error("Failed to check Pinterest status:", error);
    }
  };

  const handleConnectPinterest = () => {
    window.location.href = "/api/pinterest/authorize";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pinterestConnected) {
      alert("请先连接Pinterest账户");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/pins/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, imageUrl }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Pin发布成功!");
        setPins([data.pin, ...pins]);
        setTitle("");
        setDescription("");
        setImageUrl("");
      } else {
        alert(data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pinterest自动化</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            退出登录
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {message && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 发布表单 */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">发布新Pin</h2>

              {!pinterestConnected ? (
                <button
                  onClick={handleConnectPinterest}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-bold"
                >
                  🔗 连接Pinterest账户
                </button>
              ) : (
                <>
                  <p className="text-green-600 mb-4 font-bold">✓ Pinterest已连接</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="标题"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                    <textarea
                      placeholder="描述"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg h-24"
                    />
                    <input
                      type="url"
                      placeholder="图片URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    >
                      {loading ? "发布中..." : "发布Pin"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Pins列表 */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">我的Pins</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pins.length === 0 ? (
                  <p className="text-gray-500">暂无Pins</p>
                ) : (
                  pins.map((pin) => (
                    <div key={pin.id} className="border rounded-lg p-4">
                      <img
                        src={pin.imageUrl}
                        alt={pin.title}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                      <h3 className="font-bold">{pin.title}</h3>
                      <p className="text-sm text-gray-600">{pin.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
